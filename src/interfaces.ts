export interface Question {
  q: string;
  a: string[];
}

export interface Quiz {
  title: string;
  questions: Question[];
}
