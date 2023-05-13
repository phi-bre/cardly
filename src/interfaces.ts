import { nanoid } from 'nanoid';
import { z } from 'zod';

export interface CardAnswer {
  question: Card;
  answer: string;
  accuracy: number;
}

export type Subject = z.infer<typeof SubjectSchema>;
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
        'The question that should be answered. (Supports markdown, including code snippets and math equations)',
      ),
    topics: z.array(IdSchema).describe('The topics that the question is related to.'),
    answers: z
      .array(AnswerSchema)
      .describe(
        'The answers to the question. Depending on the content of the array, the question is either (empty => open), (one element => true or false), (multiple elements with only one correct => single choice [usually 4 answers total]) or (multiple elements with multiple correct => multiple choice [usually 6 answers total]). Choose the type that fits best for the question.',
      ),
  })
  .describe('Represent a specific question and answer combination related to the selected topics.');

export const SubjectSchema = z
  .object({
    title: z.string().nonempty().describe('The title of the subject.'),
    description: z.string().optional(),
    topics: z.array(TopicSchema),
    cards: z.array(CardSchema),
  })
  .describe('Represents a subject of topics and cards that can be shared with other people.');
