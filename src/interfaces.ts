/**
 * Collections represent a collection of topics and cards that can be shared with other people.
 * 
 * The id is the yjs document id.
 * The password is used to access the collection but can be empty if the collection is public.
 */
export interface Collection {
  id: string;
  password: string;
  title: string;
  description: string;
  topics: Topic[];
  cards: Card[];
}

/**
 * A topic contains the information the AI uses to create cards for a specific topic.
 * 
 * The description should be a short summary, not a full text.
 * The text should be the full text with all the context the AI needs to create cards.
 */
export interface Topic {
  id: string;
  title: string;
  description: string;
  text: string;
}

/**
 * Cards represent a specific question and answer combination related to the selected topics.
 * 
 * The idea behind having two arrays for correct and incorrect answers is that mutliple types of question styles can be supported.
 * 1. Single choice questions: One correct answer, multiple incorrect answers.
 * 2. Multiple choice questions: Multiple correct answers, multiple incorrect answers.
 * 3. Open questions: No correct answers, no incorrect answers.
 * 4. True or false questions: One correct answer, one incorrect answer.
 */
export interface Card {
  id: string;
  question: string;
  correct: string[];
  incorrect: string[];
  tags: string[];
}

export interface AnsweredQuestion {
  question: Card;
  answer: string;
  accuracy: number;
}
