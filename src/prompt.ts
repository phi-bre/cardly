import { z } from 'zod';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { type Card, CardSchema, type Topic } from './interfaces';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { nanoid } from 'nanoid';
import { convertFilesToDocuments } from './files';
import { SystemChatMessage } from 'langchain/schema';
import { get_encoding } from '@dqbd/tiktoken';

const encoding = get_encoding('cl100k_base');

export function getTokenCount(text: string) {
  return encoding.encode(text).length;
}

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
        description: z.string().nonempty().describe('The description of the topic.'),
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

const topicPrompt = new PromptTemplate({
  inputVariables: ['title', 'description'],
  template: `
    TOPIC TITLE: """{title}"""
    TOPIC DESCRIPTION: """{description}"""
    
    Write a summary for the topic using the provided documents.
    The summary should be a markdown string with latex math equations and code snippets.
    Keep the wording and the language it is written in.
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

export async function extractTopics(
  files: FileList,
  apiKey: string,
  title: string,
  description: string,
): Promise<Topic[]> {
  const documents = await convertFilesToDocuments(files);
  if (!documents.length) {
    console.warn('No documents found');
    return [];
  }

  // const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 100 });
  // const splitDocuments = await splitter.splitDocuments(documents);

  // const embeddings = new OpenAIEmbeddings({ openAIApiKey: apiKey });
  // const vectorStore = await MemoryVectorStore.fromDocuments(splitDocuments, embeddings);
  //
  // console.log(vectorStore.embeddings);
  // console.log(vectorStore.memoryVectors);

  const model = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: apiKey,
    verbose: true,
    modelName: 'gpt-4',
    modelKwargs: {
      max_tokens: 4096, // 2048
    },
  });
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

  const collectionPromptText = await collectionPrompt.format({ title, description });
  console.log(collectionPromptText);

  const collectionResponse = await chain.call({
    query: collectionPromptText,
  });

  console.log(collectionResponse);

  const collectionResult = await collectionParser.parse(collectionResponse.text);

  console.log(collectionResult);

  return collectionResult;
}

export async function generateCardsForTopic(topic: Topic, apiKey: string): Promise<Card[]> {
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
