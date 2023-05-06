import Tesseract from 'tesseract.js';

async function captionImage(imageUrl: string) {
  const { data } = await Tesseract.recognize(imageUrl, 'eng+deu', {
    logger: (m) => console.log(m),
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
  text = await replaceImages(text, url, captionImage);
  text = `
----------------------------------------
${text}
----------------------------------------
You are a teacher. You are in the process of writing {question_count} exam questions for your students.
These questions should each be generated in the following JSON schema in the same language as the topic:
{{ "title": "Title suiting the topic", "questions": [{{ "q": "Question?", "a": ["Correct answer", "Wrong answer", "Wrong answer", "Wrong answer"] }}] }}
You may use incorrect, incomplete, or misleading information in your WRONG ANSWERS ONLY but they should sound similar to the correct answer to not make it too obvious.
Please only answer with the JSON file format specified above without any other text.
  `;
  return text;
}
