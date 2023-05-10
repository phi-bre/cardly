export interface Collection {
  id: string;
  password: string;
  title: string;
  description: string;
  topics: Topic[];
  cards: Card[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
}

/**
 * Cards represent a specific question and answer combination.
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
