import { z } from 'zod';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { type Card, CardSchema, type Topic } from './interfaces';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { nanoid } from 'nanoid';
import { convertFilesToString, createChunks, getTokenCount } from './files';
import { SystemChatMessage } from 'langchain/schema';
import type { AxiosResponse } from 'axios';
import { ConsoleCallbackHandler } from 'langchain/callbacks';
import {
  ChatCompletionRequestMessage,
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi,
} from 'openai';

// Flow:
// 1. User writes subject and description of the contents
// 2. Upload all documents that are relevant to the subject
// 3. AI generates topics title and description from the documents with respect to the subject
// 3.1 AI generates a summary for each topic of the documents
// 3.2 User reviews the topics and corrects them if necessary
// 4. User selects the topics to generate questions for
// 5. AI generates questions for the selected topics
// 6. User reviews the questions and corrects them if necessary

const collectionParser = StructuredOutputParser.fromZodSchema(
  z.array(
    z
      .object({
        title: z.string().nonempty().describe('The title of the topic.'),
        description: z
          .string()
          .nonempty()
          .describe('The description of the topic as a markdown string.'),
      })
      .describe('A topic of a subject.'),
  ),
);
const collectionPrompt = new PromptTemplate({
  inputVariables: ['title', 'description'],
  partialVariables: { json_format: collectionParser.getFormatInstructions() },
  template: `
    SUBJECT TITLE: """{title}"""
    SUBJECT DESCRIPTION: """{description}"""
    
    Extract all mentioned topics from the documents that are relevant to the subject.
    The subject description might include a list of topics that you can use as a starting point.
    You can ignore everything that looks like noise or is completely irrelevant to the subject.
    But take care to not ignore information that is somewhat relevant to the subject.
    Keep the language and the wording of the document the same.
    Output the extracted sentences as a markdown string with latex math equations and code snippets.
    {json_format}
  `,
});

const cardParser = StructuredOutputParser.fromZodSchema(z.array(CardSchema.omit({ id: true })));
const cardPrompt = new PromptTemplate({
  inputVariables: ['topic'],
  partialVariables: { json_format: cardParser.getFormatInstructions() },
  template: `
    TOPIC: {topic}
    Write about 12 to 24 exam questions for students about this topic using the provided documents.
    You may use incorrect, incomplete, or misleading information in your WRONG ANSWERS ONLY but they
    should sound similar to the correct answer to not make it too obvious. 
    Refer to the schema on what types of questions can be generated:
    {json_format}
  `,
});

export async function enhanceTopics(
  files: FileList,
  apiKey: string,
  title: string,
  help: string,
): Promise<string> {
  const chunks = await createChunks(await convertFilesToString(files), 2000);
  if (!chunks.length) {
    console.warn('No documents found');
    return '';
  }

  // const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 100 });
  // const splitDocuments = await splitter.splitDocuments(documents);

  // const embeddings = new OpenAIEmbeddings({ openAIApiKey: apiKey });
  // const vectorStore = await MemoryVectorStore.fromDocuments(splitDocuments, embeddings);
  //
  // console.log(vectorStore.embeddings);
  // console.log(vectorStore.memoryVectors);

  // const model = new ChatOpenAI({
  //   temperature: 0,
  //   openAIApiKey: apiKey,
  //   verbose: true,
  //   modelName: 'gpt-4',
  //   modelKwargs: {
  //     max_tokens: 4096, // 2048
  //   },
  // });
  // const chain = new RetrievalQAChain({
  //   combineDocumentsChain: loadQAMapReduceChain(model),
  //   retriever: vectorStore.asRetriever(),
  //   verbose: true,
  // });

  // const chain = loadSummarizationChain(model, { type: "map_reduce" });

  // const store = new InMemoryFileStore();
  // const autogpt = AutoGPT.fromLLMAndTools(
  //   new ChatOpenAI({ temperature: 0,openAIApiKey: get(local).apiKey }),
  //   [
  //     new ReadFileTool({ store }),
  //     new WriteFileTool({ store }),
  //   ],
  //   {
  //     memory: vectorStore.asRetriever(),
  //     aiName: 'Cardly',
  //     aiRole: 'teacher',
  //   }
  // );

  const openai = new OpenAIApi(
    new Configuration({
      apiKey,
    }),
  );

  const markdownChunks: AxiosResponse<CreateChatCompletionResponse>[] = await Promise.all(
    chunks.map((chunk, index) => {
      const messages: ChatCompletionRequestMessage[] = [
        // {
        //   role: 'system',
        //   content: `
        //     Extract information relevant for the mentioned TOPIC TITLE inside the DOCUMENTS and
        //     combine it with the TOPIC DESCRIPTION. The documents are related to the overall subject
        //     but not necessarily to the topic. If it doesn't make sense to change the topic description
        //     then leave it as it is.
        //     You can ignore everything that looks like noise or is completely irrelevant to the topic.
        //     The goal is to write a markdown string with latex math equations and code snippets to aid
        //     students in learning about the topic. Make it a well structured and easy to understand
        //     with all relevant information that could come up in an exam. It's really important to not
        //     leave out information that is somewhat relevant to the topic.
        //     Keep the language and the wording of the topic description.
        // `,
        // },
        // {
        //   role: 'user',
        //   content: `
        //     TOPIC TITLE:
        //     ------------
        //     ${topic.title}
        //     ------------
        //     TOPIC DESCRIPTION:
        //     ------------
        //     ${topic.description}
        //     ------------
        //     DOCUMENTS:
        //     ------------
        //     ${chunk}
        // `,
        // },
        {
          role: 'system',
          content: `
            Convert the document to a structured markdown string with proper latex math equations or code snippets if applicable.
            Replace symbols and special characters: use the latex equivalent if you are sure it's part of a math equation.
            You can ignore everything that looks like noise or is completely irrelevant to the subject.
            Try to fix any mistakes in the document that might have been caused by the PDF to input text conversion.
            Also fix any grammar or spelling mistakes, but keep the language and the wording of the document the same.
            Consider the help provided by the user to generate the markdown string:
          `,
        },
        {
          role: 'user',
          content: `
            SUBJECT TITLE: "${JSON.stringify(title)}"
            HELP: "${JSON.stringify(help)}"
            DOCUMENT (part ${index + 1} of ${chunks.length}):
            ------------
            ${chunk}
        `,
        },
      ];

      console.log(chunks);

      const totalTokens = getTokenCount(messages.map(({ content }) => content).join());
      console.log(messages);
      console.log(totalTokens);

      return openai.createChatCompletion({
        temperature: 0,
        model: 'gpt-3.5-turbo', // 'gpt-4',
        max_tokens: 4000 - totalTokens - 100,
        messages,
      });
    }),
  );

  console.log(markdownChunks);

  const markdown = markdownChunks.map(({ data }) => data.choices[0].message.content).join('\n\n');
  console.log(markdown);

  console.log('reduced tokens: ' + getTokenCount(markdown));

  return markdown;

  // const prompt = await enhanceTopicPrompt.format({ title: topic.title, description: topic.description });
  // console.log(prompt);
  // const answer = await model.call([new SystemChatMessage('Hello')], undefined, [new ConsoleCallbackHandler()]);
  // console.log(answer.text);

  // const collectionPromptText = await collectionPrompt.format({ title, description });
  // console.log(collectionPromptText);
  //
  // const collectionResponse = await model.call(
  //   [new SystemChatMessage(collectionPromptText)],
  //   undefined,
  //   [new ConsoleCallbackHandler()],
  // );
  // console.log(collectionResponse);
  //
  // const collectionResult = await collectionParser.parse(collectionResponse.text);
  //
  // console.log(collectionResult);
  //
  // return collectionResult;
}

export async function generateCards(topic: Topic, apiKey: string): Promise<Card[]> {
  const model = new ChatOpenAI({
    temperature: 0.5, // higher temperature so that the answers are not too similar
    openAIApiKey: apiKey,
    verbose: true,
    modelName: 'gpt-4',
    modelKwargs: {
      max_tokens: 4096, // 2048
    },
  });

  const cardPromptText = await cardPrompt.format({ topic: JSON.stringify(topic) });
  console.log(cardPromptText);

  const cardResponse = await model.call([new SystemChatMessage(cardPromptText)]);
  console.log(cardResponse);

  const cardResult = await cardParser.parse(cardResponse.text);
  console.log(cardResult);

  return cardResult.map((card) => ({ ...card, id: nanoid(), topics: [topic.id] }));
}
