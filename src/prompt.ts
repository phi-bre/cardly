import { z } from 'zod';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { type Card, CardSchema } from './interfaces';
import { nanoid } from 'nanoid';
import { convertFilesToString, createChunks, getTokenCount } from './files';
import type { AxiosResponse } from 'axios';
import {
  ChatCompletionRequestMessage,
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi,
} from 'openai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { SystemChatMessage } from 'langchain/schema';

const cardParser = StructuredOutputParser.fromZodSchema(z.array(CardSchema.omit({ id: true })));
const cardPrompt = new PromptTemplate({
  inputVariables: ['help', 'text'],
  partialVariables: { json_format: cardParser.getFormatInstructions() },
  template: `
    Write about 12 to 24 exam questions for students about this topic using the provided text.
    You may use incorrect, incomplete, or misleading information in your WRONG ANSWERS ONLY but they
    should sound similar to the correct answer to not make it too obvious. 
    Refer to the schema on what types of questions can be generated:
    {json_format}
    
    The user provided the following help to guide you on what kind of questions to generate:
    ------------
    HELP: {help}
    ------------
    {text}
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

  const openai = new OpenAIApi(
    new Configuration({
      apiKey,
    }),
  );

  const markdownChunks: AxiosResponse<CreateChatCompletionResponse>[] = await Promise.all(
    chunks.map((chunk, index) => {
      const messages: ChatCompletionRequestMessage[] = [
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
            HELP: "${JSON.stringify(help) || 'No help'}"
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
}

export async function generateCards(text: string, help: string, apiKey: string): Promise<Card[]> {
  const model = new ChatOpenAI({
    temperature: 0.5, // higher temperature so that the answers are not too similar
    openAIApiKey: apiKey,
    verbose: true,
    modelName: 'gpt-4',
    modelKwargs: {
      max_tokens: 4096, // 2048
    },
  });

  const cardPromptText = await cardPrompt.format({ text, help: JSON.stringify(help) });
  console.log(cardPromptText);

  const cardResponse = await model.call([new SystemChatMessage(cardPromptText)]);
  console.log(cardResponse);

  const cardResult = await cardParser.parse(cardResponse.text);
  console.log(cardResult);

  return cardResult.map((card) => ({ ...card, id: nanoid() }));
}
