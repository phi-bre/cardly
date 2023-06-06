// import type { PageServerLoad } from './$types';
// import { NotionToMarkdown } from 'notion-to-md';
// import { Client } from '@notionhq/client';
// // import {dev} from '$app/environment';
// import { NOTION_API_KEY } from '$env/static/private';
// import { Deck, Topic } from '$lib/interfaces';
// import { nanoid } from 'nanoid';
//
// const notion = new Client({
//   auth: NOTION_API_KEY,
// });
//
// const n2m = new NotionToMarkdown({
//   notionClient: notion,
//   config: {
//     separateChildPage: true,
//   },
// });
//
// function splitMarkdownToTopics(markdown: string): Topic[] {
//   const lines = markdown.split('\n');
//   let currentTopic: Topic | null = null;
//   let topics: Topic[] = [];
//
//   for (const line of lines) {
//     if (line.startsWith('# ')) {
//       if (currentTopic !== null) {
//         topics.push(currentTopic);
//       }
//
//       currentTopic = {
//         id: nanoid(),
//         title: line.substring(2).trim(),
//         description: '',
//       };
//     } else if (currentTopic !== null) {
//       currentTopic.description += line + '\n';
//     }
//   }
//
//   if (currentTopic !== null) {
//     topics.push(currentTopic);
//   }
//
//   return topics;
// }
//
// // const devCache = new Map<string, Collection>();
//
// export const load = (async ({ params, fetch }) => {
//   return {
//     streamed: {
//       topics: fetch('/summaries/' + params.collection + '/summary.md')
//         .then((res) => res.text())
//         .then((text) => splitMarkdownToTopics(text)),
//       // notion:
//       //   params.collection.length === 32
//       //     ? (async () => {
//       //       // if (dev && devCache.has(params.collection)) {
//       //       //   return devCache.get(params.collection);
//       //       // }
//       //
//       //       const mdBlocks = await n2m.pageToMarkdown(params.collection);
//       //       const { parent, ...children } = n2m.toMarkdownString(mdBlocks);
//       //       const topics: Topic[] = Object.entries(children).map(([title, description]) => ({
//       //         id: `${params.collection}-${title}`,
//       //         title,
//       //         description,
//       //       }));
//       //       const collection: Collection = {
//       //         title: 'Test',
//       //         topics,
//       //         cards: [],
//       //         description: parent,
//       //       };
//       //
//       //       // if (dev) {
//       //       //   devCache.set(params.collection, collection);
//       //       // }
//       //
//       //       return collection;
//       //     })()
//       //     : undefined,
//     },
//   };
// }) satisfies PageServerLoad;
//
// export const config = {
//   isr: {
//     expiration: 60 * 15, // 15 minutes
//   },
// };
