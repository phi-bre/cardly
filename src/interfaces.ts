/**
 * Collections include multiple decks of cards and represent an 
 */
export interface Collection {
  id: string;
  password: string;
  title: string;
  decks: Deck[];
}

/**
 * Decks include multiple cards and represent a specific topic.
 */
export interface Deck {
  id: string;
  title: string;
  description: string;
  cards: Card[];
  tags: string[];
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
  correct: Answer[];
  incorrect: Answer[];
}

export interface Answer {
  id: string;
  answer: string;
}

export interface AnsweredQuestion {
  question: Card;
  answer: Answer;
}
