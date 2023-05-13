import Tesseract from 'tesseract.js';
import { Document } from 'langchain/document';

let PDF = null;

export async function captionImage(imageUrl: string) {
  const { data } = await Tesseract.recognize(imageUrl, 'eng+deu', {
    // logger: (m) => console.log(m),
  });
  return `(image: {${data.text}})`;
}

export async function replaceImages(
  text: string,
  baseUrl: string,
  captionImage: (imageUrl: string) => Promise<string>,
) {
  const imagePattern = /(!\[[^\]]*\]\((.*?)\))|(<img\s+[^>]*src="([^"]+)"[^>]*>)/g;
  const substrings: (string | Promise<string>)[] = [];

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

export async function convertPDFToDocuments(file: File): Promise<Document[]> {
  if (!PDF) {
    PDF = await import('pdfjs-dist/build/pdf');
    PDF.GlobalWorkerOptions.workerSrc = await import('pdfjs-dist/build/pdf.worker.entry');
  }

  const pdf = await PDF.getDocument(await file.arrayBuffer()).promise;
  const documents = [];

  for (let index = 0; index < pdf.numPages; index++) {
    const page = await pdf.getPage(index + 1); // TODO: Why is the first page 1 and not 0?
    const pageContent = await page.getTextContent();
    const text = pageContent.items.map((item: any) => item.str).join(' ');
    documents.push(
      new Document({
        pageContent: text,
        metadata: {
          dir: file.webkitRelativePath,
          name: file.name,
          type: file.type,
          page: index,
        },
      }),
    );

    // const images = [];
    // page.getOperatorList().then((ops) => {
    //   for (var i = 0; i < ops.fnArray.length; i++) {
    //     if (ops.fnArray[i] == PDF.OPS.paintImageXObject) {
    //       console.log(ops.argsArray[i][0]);
    //     }
    //   }
    // });
  }
}

export async function convertFilesToDocuments(files: FileList): Promise<Document[]> {
  const documents = [];

  for (const file of files) {
    if (file.type === 'application/pdf') {
      documents.push(...(await convertPDFToDocuments(file)));
    } else if (file.type.startsWith('text/') || !file.type) {
      const text = await file.text();
      documents.push(
        new Document({ pageContent: text, metadata: { filename: file.name, type: file.type } }),
      );
    } else {
      console.warn(`Unsupported file type: ${file.type}`);
    }
  }

  return documents;
}