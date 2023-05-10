import { z } from 'zod';

export interface AnsweredQuestion {
  question: Card;
  answer: string;
  accuracy: number;
}

export type Collection = z.infer<typeof CollectionSchema>;
export type Topic = z.infer<typeof TopicSchema>;
export type Card = z.infer<typeof CardSchema>;

export const TopicSchema = z
  .object({
    id: z.string(),
    title: z.string().nonempty().describe('The title of the topic.'),
    description: z.string().optional().describe('A short description about the topic.'),
  })
  .describe('Describes a topic that can be used to group cards.');

export const AnswerSchema = z
  .object({
    id: z.string(),
    text: z.string().nonempty().describe('The text of the answer.'),
    correct: z.boolean().describe('Whether the answer is correct or not.'),
  })
  .describe('Describes an answer to a question.');

export const CardSchema = z
  .object({
    id: z.string(),
    question: z.string().nonempty().describe('The question that should be answered.'),
    tags: z.array(z.string()),
    answers: z
      .array(AnswerSchema)
      .describe(
        'The answers to the question. Depending on the content of the array, the question is either (empty => open), (one element => true or false), (multiple elements with only one correct => single choice) or (multiple elements with multiple correct => multiple choice)',
      ),
  })
  .describe('Represent a specific question and answer combination related to the selected topics.');

export const CollectionSchema = z
  .object({
    id: z.string().describe('The id of the collection used to access it in yjs.'),
    password: z
      .string()
      .optional()
      .describe('The password that can be empty to make the collection public.'),
    title: z.string().nonempty().describe('The title of the collection.'),
    description: z.string().optional(),
    topics: z.array(TopicSchema),
    cards: z.array(CardSchema),
  })
  .describe('Represents a collection of topics and cards that can be shared with other people.');
