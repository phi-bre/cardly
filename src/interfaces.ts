export interface Question {
  id: string;
  topics: string[];
  q: string;
  a: string[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface AnsweredQuestion {
  question: Question;
  answer: string;
}
