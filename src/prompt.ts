import { z } from 'zod';
import { type Answer, type Card, CardSchema } from './interfaces';
import { nanoid } from 'nanoid';
import { createChunks } from './files';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from 'langchain';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { SystemChatMessage } from 'langchain/schema';

const cardParser = StructuredOutputParser.fromZodSchema(
  z.array(
    z.object({
      question: z.string(),
      answers: z.array(
        z.object({
          text: z.string(),
          correct: z.boolean(),
        }),
      ),
    }),
  ),
);
const cardPrompt = new PromptTemplate({
  inputVariables: ['help', 'text'],
  partialVariables: { json_format: cardParser.getFormatInstructions() },
  template: `
    Write about 10 exam questions for students about this topic using the provided text.
    You may use incorrect, incomplete, or misleading information in your WRONG ANSWERS ONLY but they
    should sound similar to the correct answer to not make it too obvious. 
    Refer to the schema on what types of questions can be generated:
    {json_format}
    
    The user provided the following help to guide you on what kind of questions to generate:
    HELP: """"{help}""""
    DOCUMENT: """"{text}""""
  `,
});

// export async function enhanceTopics(
//   files: FileList,
//   apiKey: string,
//   title: string,
//   help: string,
// ): Promise<string> {
//   const chunks = await createChunks(await convertFilesToString(files), 2000);
//   if (!chunks.length) {
//     console.warn('No documents found');
//     return '';
//   }
//
//   const openai = new OpenAIApi(
//     new Configuration({
//       apiKey,
//     }),
//   );
//
//   const markdownChunks: AxiosResponse<CreateChatCompletionResponse>[] = await Promise.all(
//     chunks.map((chunk, index) => {
//       const messages: ChatCompletionRequestMessage[] = [
//         {
//           role: 'system',
//           content: `
//             Convert the document to a structured markdown string with proper latex math equations or code snippets if applicable.
//             Replace symbols and special characters: use the latex equivalent if you are sure it's part of a math equation.
//             You can ignore everything that looks like noise or is completely irrelevant to the subject.
//             Try to fix any mistakes in the document that might have been caused by the PDF to input text conversion.
//             Also fix any grammar or spelling mistakes, but keep the language and the wording of the document the same.
//             Consider the help provided by the user to generate the markdown string:
//           `,
//         },
//         {
//           role: 'user',
//           content: `
//             SUBJECT TITLE: "${JSON.stringify(title)}"
//             HELP: "${JSON.stringify(help) || 'No help'}"
//             DOCUMENT (part ${index + 1} of ${chunks.length}):
//             ------------
//             ${chunk}
//           `,
//         },
//       ];
//
//       console.log(chunks);
//
//       const totalTokens = getTokenCount(messages.map(({ content }) => content).join());
//       console.log(messages);
//       console.log(totalTokens);
//
//       return openai.createChatCompletion({
//         temperature: 0,
//         model: 'gpt-3.5-turbo', // 'gpt-4',
//         max_tokens: 4000 - totalTokens - 100,
//         messages,
//       });
//     }),
//   );
//
//   console.log(markdownChunks);
//
//   const markdown = markdownChunks.map(({ data }) => data.choices[0].message.content).join('\n\n');
//   console.log(markdown);
//
//   console.log('reduced tokens: ' + getTokenCount(markdown));
//
//   return markdown;
// }

export const models = {
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5',
    tokens: 4000,
  },
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    tokens: 8000,
  },
};

export async function generateCards(
  text: string,
  help: string,
  apiKey: string,
  chosenModel = models['gpt-3.5-turbo'],
): Promise<Card[]> {
  const chunks = await createChunks(text, chosenModel.tokens / 2);

  if (!chunks.length) {
    console.warn('No documents found');
    return [];
  }

  const model = new ChatOpenAI({
    temperature: 0.5, // higher temperature so that the answers are not too similar
    openAIApiKey: apiKey,
    verbose: true,
    modelName: chosenModel.id,
    // modelKwargs: {
    //   max_tokens: chosenModel.tokens / 2 - 256,
    // },
  });

  const completions = await Promise.all(
    chunks.map(async (chunk) => {
      return model.call([new SystemChatMessage(await cardPrompt.format({ help, text: chunk }))]);
    }),
  );

  const cardResult = (
    await Promise.all(completions.map((completion) => cardParser.parse(completion.text)))
  ).flat();
  console.log(cardResult);

  return cardResult.map(
    (card): Card => ({
      id: nanoid(),
      question: card.question,
      topics: [],
      answers: card.answers.map(
        (answer): Answer => ({
          ...answer,
          id: nanoid(),
        }),
      ),
    }),
  );
}
