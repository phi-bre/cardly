import type { PageServerLoad } from './$types';
import { NotionToMarkdown } from 'notion-to-md';
import { Client } from '@notionhq/client';
// import {dev} from '$app/environment';

import { NOTION_API_KEY } from '$env/static/private';
import { Collection, Topic } from '../../interfaces';

const notion = new Client({
  auth: NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({
  notionClient: notion,
  config: {
    separateChildPage: true,
  },
});

// const devCache = new Map<string, Collection>();

export const load = (async ({ params }) => {
  return {
    streamed: {
      notion:
        params.collection.length === 32
          ? (async () => {
              // if (dev && devCache.has(params.collection)) {
              //   return devCache.get(params.collection);
              // }

              const mdBlocks = await n2m.pageToMarkdown(params.collection);
              const { parent, ...children } = n2m.toMarkdownString(mdBlocks);
              const topics: Topic[] = Object.entries(children).map(([title, description]) => ({
                id: `${params.collection}-${title}`,
                title,
                description,
              }));
              const collection: Collection = {
                title: 'Test',
                topics,
                cards: [],
                description: parent,
              };

              // if (dev) {
              //   devCache.set(params.collection, collection);
              // }

              return collection;
            })()
          : undefined,
    },
  };
}) satisfies PageServerLoad;

export const config = {
  isr: {
    expiration: 60 * 15, // 15 minutes
  },
};
