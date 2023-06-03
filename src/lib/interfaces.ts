import { nanoid } from 'nanoid';
import { z } from 'zod';

export interface CardAnswer {
  card: string;
  answer: string;
  accuracy: number;
  time: number;
}

export type Deck = z.infer<typeof DeckSchema>;
export type Topic = z.infer<typeof TopicSchema>;
export type Card = z.infer<typeof CardSchema>;
export type Answer = z.infer<typeof AnswerSchema>;

export const IdSchema = z
  .string()
  .regex(/^[\w\-]{21}$/)
  .default(() => nanoid());

export const TopicSchema = z
  .object({
    id: IdSchema,
    title: z.string().nonempty().describe('The title of the topic.'),
    description: z
      .string()
      .describe(
        'A short description about the topic. (Supports markdown, including code snippets and math equations)',
      ),
    // keywords: z.array(z.string()).describe('A list of keywords that are related to the topic.'),
    // source: z.string().describe('File names and pages of where this topic is mentioned'),
  })
  .describe('Describes a topic that can be used to group cards.');

export const AnswerSchema = z
  .object({
    id: IdSchema,
    text: z
      .string()
      .nonempty()
      .describe(
        'The text of the answer. (Supports markdown, including code snippets and math equations)',
      ),
    correct: z.boolean().describe('Whether the answer is correct or not.'),
  })
  .describe('Describes an answer to a question.');

export const CardSchema = z
  .object({
    id: IdSchema,
    question: z
      .string()
      .nonempty()
      .describe(
        'The question that should be answered. Write it in a way so that it can either be answered in plain text or with the single-choice answers. (Supports markdown, including code snippets and math equations)',
      ),
    topics: z.array(IdSchema).describe('The topics that the question is related to.'),
    answers: z.array(AnswerSchema).describe(
      // TODO: Enable once other types are supported.
      // 'The answers to the question. Depending on the content of the array, the question is either (empty => open), (one element => true or false), (multiple elements with only one correct => single choice [usually 4 answers total]) or (multiple elements with multiple correct => multiple choice [usually 6 answers total]). Choose the type that fits best for the question.',
      'The answers to the question. Only one of them should be correct. There should be 4 in total.',
    ),
    hidden: z
      .boolean()
      .optional()
      .default(false)
      .describe('Whether the card should be hidden from the user or not.'),
    approved: z
      .boolean()
      .optional()
      .default(false)
      .describe('Whether the generated card has been approved by the user or not.'),
  })
  .describe('Represent a specific question and answer combination related to the selected topics.');

export const DeckSchema = z
  .object({
    id: IdSchema,
    title: z.string().nonempty().describe('The title of the deck.'),
    description: z.string(),
    topics: z.array(TopicSchema),
    cards: z.array(CardSchema),
  })
  .describe('Represents a deck of topics and cards.');
