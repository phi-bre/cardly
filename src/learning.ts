export interface CardLevel {
  title: string;
  time: number;
}

export const levels: CardLevel[] = [
  { title: 'New', time: 0 },
  { title: 'Learning', time: 5 * 60 * 1000 },
  { title: 'Reviewing', time: 15 * 60 * 1000 },
  { title: 'Mastered', time: 60 * 60 * 1000 },
];
