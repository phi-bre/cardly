import { z } from 'zod';
import type { Answer, Card, CardAnswer } from './interfaces';
import { nanoid } from 'nanoid';
import { OutputFixingParser, StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from 'langchain/prompts';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { SystemChatMessage } from 'langchain/schema';
import { CallbackManager } from 'langchain/callbacks';
import { credentials } from './storage';
import { get } from 'svelte/store';

const { apiKey } = get(credentials);

export const cardParser = StructuredOutputParser.fromZodSchema(
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
export const cardPrompt = new PromptTemplate({
  inputVariables: ['help', 'text'],
  partialVariables: { json_format: cardParser.getFormatInstructions() },
  template: `
    Write exam questions for students about this topic using the provided document.
    Enforce the following rules:
    1. The question has to be written in a style so that the user could write an answer in plain text. 
      No referencing of the answers like "Which of the following terms describes ...".
    2. There should be EXACTLY 1 correct and 3 incorrect answers per question.
    3. You may use incorrect, incomplete, or misleading information in your WRONG ANSWERS ONLY.
    4. The incorrect answers should sound very similar to the correct answer to not make it too obvious.
    5. Really utilize the markdown features but give particular care to latex escaping in JSON strings!
    
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
  chosenModel = models['gpt-4'],
): Promise<Card[]> {
  // const tokens = getTokenCount(help);
  // console.log('help tokens: ' + tokens);
  // const chunks = await createChunks(text, chosenModel.tokens / 3);

  // if (!chunks.length) {
  //   console.warn('No documents found');
  //   return [];
  // }

  const model = new ChatOpenAI({
    temperature: 0.5, // higher temperature so that the answers are not too similar
    openAIApiKey: apiKey,
    verbose: true,
    modelName: chosenModel.id,
  });

  const completion = await model.call([
    new SystemChatMessage(await cardPrompt.format({ help, text })),
  ]);
  console.log(completion);

  let parsed;
  try {
    parsed = await cardParser.parse(completion.text);
    console.log(parsed);
  } catch (e) {
    console.error('Failed to parse bad output: ', e);
    const fixParser = OutputFixingParser.fromLLM(
      new ChatOpenAI({
        temperature: 0,
        openAIApiKey: apiKey,
        modelName: 'gpt-3.5-turbo',
        verbose: true,
      }),
      cardParser,
    );

    parsed = await fixParser.parse(parsed);
    console.log(parsed);
  }

  return parsed.map(
    (card): Card => ({
      id: nanoid(),
      approved: false,
      hidden: false,
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

export async function generateCardsStreamed(
  text: string,
  help: string,
  abortController: AbortController,
  { createEmptyCard, setQuestion, setAnswer },
) {
  let output = '';
  let index = 0;

  // TODO: Make cleaner, this is just a prototype
  // TODO: Add error handling

  const model = new ChatOpenAI({
    temperature: 0.4, // higher temperature so that the answers are not too similar
    openAIApiKey: apiKey,
    verbose: true,
    modelName: 'gpt-4',
    streaming: true,
    callbacks: CallbackManager.fromHandlers({
      handleLLMNewToken(token: string) {
        output += token;

        const match = output.match(/"((?:[^"\\]|\\.)*?)"/);
        if (match) {
          let [chunk] = match;
          output = output.replace(chunk, '');

          try {
            chunk = JSON.parse(chunk);
          } catch (e) {
            // TODO: Is this enough?
            chunk = chunk.substring(1, chunk.length - 1);
          }

          console.log(chunk);

          if (index % 5 === 0) {
            createEmptyCard();
            setQuestion(chunk);
          } else {
            setAnswer((index % 5) - 1, chunk);
          }

          index++;
        }
      },
    }),
  });

  const response = await model.call(
    [
      new SystemChatMessage(`
        Write exam questions for students about this topic using the provided document.
        Enforce the following rules:
        1. The question has to be written in a style so that the user could write an answer in plain text. 
          No referencing of the answers like "Which of the following terms describes ...".
        2. There should be EXACTLY 1 correct and 3 incorrect answers per question.
        3. You may use incorrect, incomplete, or misleading information in your WRONG ANSWERS ONLY.
        4. The incorrect answers should sound very similar to the correct answer to not make it too obvious.
        5. Really utilize the markdown features but give particular care to latex escaping in JSON strings!
        
        The output should be a list of JSON strings (correctly encoded with escaping of special characters)
        separated by a single newline e.g.:
        "What are the benefits of regular exercise?"
        "Improved cardiovascular health"
        "Enhanced cognitive function"
        "Increased risk of injury"
        "Reduced muscle flexibility"
        "Another question."
        "Another answer"
        and so on.
        
        No other output!
        
        The user provided the following help to guide you on what kind of questions to generate:
        HELP: """"${help}""""
        DOCUMENT: """"${text}""""
      `),
    ],
    {
      signal: abortController.signal,
    },
  );
  console.log(response);
}

const answerParser = StructuredOutputParser.fromZodSchema(
  z.object({
    accuracy: z.number().describe('A number between 0 and 1 in steps of 0.1'), // TODO: Add validation
    hint: z.string().describe('A hint on why the answer is wrong'),
  }),
);

const answerPrompt = new PromptTemplate({
  inputVariables: ['question', 'answer', 'user_answer'],
  partialVariables: { json_format: answerParser.getFormatInstructions() },
  template: `
    QUESTION: """{question}"""
    CORRECT ANSWER: """{answer}"""
    USER ANSWER: """{user_answer}"""

    1. Provide the "accuracy" of the user answer compared to the actual answer on a scale from 0 to 1 in steps of 0.1.
      Anything above 0.8 is supposed to be considered correct. Anything below 0.4 is considered wrong.
    2. Provide a detailed "hint" on why the answer is wrong and how it can be improved but keep it short.
    3. If the answer is correct, you can reply with a friendly message like "Correct!".
    4. Reply to the user in the same language as their answer. 
    5. You can include valid commonmark syntax in the hint with code blocks and latex expressions.
      Use inline \`code\` blocks to highlight specific words or phrases in the answer that are important.

    {json_format}
  `,
});

export async function judgeOpenStyleAnswer(
  card: Card,
  userAnswer: string,
  chosenModel = models['gpt-3.5-turbo'],
): Promise<CardAnswer & { hint: string }> {
  const correctAnswer = card.answers.find((answer) => answer.correct);

  const model = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: apiKey,
    verbose: true,
    modelName: chosenModel.id,
  });

  // TODO: Provide context from the topics / summaries

  const prompt = await answerPrompt.format({
    question: card.question,
    answer: correctAnswer?.text || '',
    user_answer: userAnswer,
  });
  console.log(prompt);

  const completion = await model.call([new SystemChatMessage(prompt)]);
  console.log(completion);

  let parsed = await answerParser.parse(completion.text);
  console.log(parsed);

  return {
    accuracy: parsed.accuracy,
    hint: parsed.hint,
    answer: userAnswer,
    card: card.id,
    time: Date.now(),
  };
}
