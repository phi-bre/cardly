import Tesseract from 'tesseract.js';
import { nanoid } from 'nanoid';
import type { Question, Quiz } from './interfaces';

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export function patchQuizAndQuestionIds(
  quiz: Optional<Quiz, 'id'> & { questions: Optional<Question, 'id'>[] },
): Quiz {
  quiz.id ||= nanoid();
  quiz.questions.forEach((question) => {
    question.id ||= nanoid();
  });
  return quiz as Quiz;
}

const QUESTION_COUNT = 12;

async function captionImage(imageUrl: string) {
  const { data } = await Tesseract.recognize(imageUrl, 'eng+deu', {
    // logger: (m) => console.log(m),
  });
  return `(image: {${data.text}})`;
}

async function replaceImages(
  text: string,
  baseUrl: string,
  captionImage: (imageUrl: string) => Promise<string>,
) {
  const imagePattern = /(!\[[^\]]*\]\((.*?)\))|(<img\s+[^>]*src="([^"]+)"[^>]*>)/g;
  const substrings = [];

  let lastIndex = 0;
  let match = imagePattern.exec(text);

  while (match !== null) {
    const imageSrc = match[2] || match[4];
    const imageUrl = new URL(imageSrc, baseUrl).toString();
    const captionPromise = captionImage(imageUrl);

    substrings.push(text.slice(lastIndex, match.index));
    substrings.push(captionPromise);

    lastIndex = imagePattern.lastIndex;
    match = imagePattern.exec(text);
  }
  substrings.push(text.slice(lastIndex));

  return (await Promise.all(substrings)).join('');
}

export async function generatePrompt(url: string): Promise<string> {
  let text = await fetch(url).then((response) => response.text());
  // text = await replaceImages(text, url, captionImage);
  text = `
TOPIC:
----------------------------------------
${text}
----------------------------------------
TASK:
Create ${QUESTION_COUNT} exam questions for students to answer about the TOPIC in the same language as the TOPIC in the following JSON format:

{{ "title": "Title suiting the topic", "questions": [{{ "q": "Question?", "a": ["Correct answer", "Wrong answer", "Wrong answer", "Wrong answer"] }}] }}

You may use incorrect, incomplete, or misleading information in your WRONG ANSWERS ONLY but they should sound similar to the correct answer to not make it too obvious.
The questions and answer strings can use markdown syntax, but the entire output must be valid JSON so it can be parsed by an API.
  `;

  console.log(text);

  return text;
}
