import Tesseract from 'tesseract.js';
import { z } from 'zod';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { Document } from 'langchain/document';
import { CardSchema, type Card, TopicSchema, type Topic } from './interfaces';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { AutoGPT } from 'langchain/experimental/autogpt';
import { ReadFileTool, WriteFileTool } from 'langchain/tools';
import { InMemoryFileStore } from 'langchain/stores/file/in_memory';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { local, remote } from './storage';
import { get } from 'svelte/store';
import {
  RetrievalQAChain,
  VectorDBQAChain,
  loadQARefineChain,
  loadQAMapReduceChain,
} from 'langchain/chains';
import { nanoid } from 'nanoid';
import { loadSummarizationChain } from "langchain/chains";

const topicParser = StructuredOutputParser.fromZodSchema(z.array(TopicSchema.omit({ id: true })));
const topicPrompt = new PromptTemplate({
  template: `Create an outline of the topics (about 10 to 20 topics) in the provided documents that are part of this subject and ensure all information about what is part of each topic is captured in the keywords. Use the same language as the source documents.\n{json_format}`,
  inputVariables: ['topics'],
  partialVariables: { json_format: topicParser.getFormatInstructions() },
});

const cardParser = StructuredOutputParser.fromZodSchema(z.array(CardSchema.omit({ id: true })));
const cardPrompt = new PromptTemplate({
  template: `The following topics are selected: \n{topics}\nWrite 12 exam questions for students about this topic using the provided documents. You may use incorrect, incomplete, or misleading information in your WRONG ANSWERS ONLY but they should sound similar to the correct answer to not make it too obvious. Refer to the schema on what types of questions can be generated:\n{json_format}`,
  inputVariables: ['topics'],
  partialVariables: { json_format: cardParser.getFormatInstructions() },
});

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

export async function generateTopics(files: FileList) {
  const PDF = await import('pdfjs-dist/build/pdf');
  PDF.GlobalWorkerOptions.workerSrc = await import('pdfjs-dist/build/pdf.worker.entry');

  // let text = await fetch(url).then((response) => response.text());
  // text = await replaceImages(text, url, captionImage);
  // console.log(text);
  const documents = [];

  for (const file of files) {
    if (file.type === 'application/pdf') {
      const pdf = await PDF.getDocument(await file.arrayBuffer()).promise;

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
    } else if (file.type.startsWith('text/') || !file.type) {
      const text = await file.text();
      documents.push(
        new Document({ pageContent: text, metadata: { filename: file.name, type: file.type } }),
      );
    } else {
      console.warn(`Unsupported file type: ${file.type}`);
    }
  }

  if (!documents.length) {
    console.warn('No documents found');
    return;
  }

  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocuments = await splitter.splitDocuments(documents);

  console.log(splitDocuments);

  const embeddings = new OpenAIEmbeddings({ openAIApiKey: get(local).apiKey });
  const vectorStore = await MemoryVectorStore.fromDocuments(splitDocuments, embeddings);

  console.log(vectorStore.embeddings);
  console.log(vectorStore.memoryVectors);

  const model = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: get(local).apiKey,
    verbose: true,
    modelName: 'gpt-4',
  });
  const chain = new RetrievalQAChain({
    combineDocumentsChain: loadQAMapReduceChain(model),
    retriever: vectorStore.asRetriever(),
    verbose: true,
  });

  // const chain = loadSummarizationChain(model, { type: "map_reduce" });

  console.log(model.modelName);

  // const store = new InMemoryFileStore();
  // const autogpt = AutoGPT.fromLLMAndTools(
  //   new ChatOpenAI({ temperature: 0,openAIApiKey: get(local).apiKey }),
  //   [
  //     new ReadFileTool({ store }),
  //     new WriteFileTool({ store }),
  //   ],
  //   {
  //     memory: vectorStore.asRetriever(),
  //     aiName: 'Cardly',
  //     aiRole: 'teacher',
  //   }
  // );

  // store.readFile

  // // console.log(chain.serialize());

  const topicsPromptText = await topicPrompt.format({});
  console.log(topicsPromptText);

  // // const response = await chain.run(promptText);
  const topicsResponse = await chain.call({
    query: topicsPromptText,
  });

  console.log(topicsResponse);

  const topicResult = await topicParser.parse(topicsResponse.text);

  console.log(topicResult);

  const topics = topicResult.map((topic) => {
    topic.id = nanoid();
    return topic as Topic;
  });

  remote.set({ ...get(remote), topics });
}

export async function generateCards(topics: Topic[]) {}
