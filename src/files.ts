import Tesseract from 'tesseract.js';
import { Document } from 'langchain/document';
import { get_encoding } from '@dqbd/tiktoken';

let PDF = null;
const encoding = get_encoding('cl100k_base');

export function getTokenCount(text: string) {
  return encoding.encode(text).length;
}

export async function captionImage(imageUrl: string) {
  const { data } = await Tesseract.recognize(imageUrl, 'eng+deu', {
    // logger: (m) => console.log(m),
  });
  console.log(data);
  return data.text;
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

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const pdf = await PDF.getDocument(await file.arrayBuffer()).promise;
  const documents = [];

  for (let index = 0; index < pdf.numPages; index++) {
    const page = await pdf.getPage(index + 1); // TODO: Why is the first page 1 and not 0?

    // const viewport = page.getViewport({scale: 1.5});
    // canvas.width = viewport.width;
    // canvas.height = viewport.height;
    //
    // await page.render({
    //   canvasContext: context,
    //   viewport,
    // }).promise;

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

    const operatorList = await page.getOperatorList();
    for (let i = 0; i < operatorList.fnArray.length; i++) {
      if (operatorList.fnArray[i] == PDF.OPS.paintImageXObject) {
        const obj = await page.objs.get(operatorList.argsArray[i][0]);
        console.log(obj);
        // const jpegImage = new PDF.pdfjsImageDecoders.JpegImage();
        // jpegImage.parse(typedArrayImage);

        if (obj?.bitmap) {
          canvas.width = obj.width;
          canvas.height = obj.height;
          context.drawImage(obj.bitmap, 0, 0);
          const dataUrl = canvas.toDataURL();
          const caption = await captionImage(dataUrl);
          if (caption) {
            console.log(caption);
            documents.push(
              new Document({
                pageContent: caption,
                metadata: {
                  type: 'image/jpeg',
                  page: index,
                  // TODO: Add or reference image to correct place in document
                },
              }),
            );
          }
        }

        // if (obj?.image) {
        //   const imgData = obj.image.getData();
        //   console.log(imgData);
        //   debugger;
        //
        //   // // Do something with the image data, e.g. create an img element
        //   // const img = document.createElement('img');
        //   // img.src = 'data:image/png;base64,' + btoa(imgData);
        //   // document.body.appendChild(img);
        // }

        // const width = jpegImage.width,
        //   height = jpegImage.height;
        // const jpegData = jpegImage.getData({
        //   width,
        //   height,
        //   forceRGB: true,
        // });
        // const text = await captionImage()
        // debugger;
      }
    }
  }

  return documents;
}

export async function convertFilesToString(files: FileList): Promise<string> {
  const documents: Document[] = [];

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

  return documents.map((document) => document.pageContent).join('\n');
}

export async function createChunks(text: string, maxTokens = 4096) {
  // TEMPORARY, THIS CODE IS HORRIBLE
  const chunks: string[] = [];
  const tokensPerSeekingStep = 100;
  let textChunk = '';
  let startIndexInDocument = 0;
  let endIndexInDocument = Math.min(tokensPerSeekingStep, text.length);

  while (true) {
    let tokenCount = getTokenCount(textChunk);
    if (tokenCount > maxTokens) {
      chunks.push(textChunk);
      textChunk = '';
      startIndexInDocument = endIndexInDocument;
    }

    if (endIndexInDocument >= text.length) {
      chunks.push(textChunk);
      break;
    }

    textChunk = text.slice(startIndexInDocument, endIndexInDocument);
    endIndexInDocument = Math.min(endIndexInDocument + tokensPerSeekingStep, text.length);
  }

  return chunks;
}
