import type { Card, Collection, Topic } from './interfaces';
import { syncedStore, getYjsDoc } from '@syncedstore/core';
import { svelteSyncedStore } from '@syncedstore/svelte';
import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';
import { derived, type Writable, writable } from 'svelte/store';

export interface LocalCollection {
  id: string;
  password?: string;
}

export interface LocalStore {
  url: string;
  apiKey: string;
  organization: string;
  selectedTopics: string[];
  collections: { id: string; password?: string }[];
}

// const cardlyStore = syncedStore({
//   collection: {} as Collection, // TODO RENAME
// });

// TODO: Make id and password configurable via local storage
// const id = 'tmp-242787c6-ebba-4528-9a74-a407133f65e0';
// const password = '242787c6-ebba-4528-9a74-a407133f65e0';
// const doc = getYjsDoc(cardlyStore);
// const indexeddbPersistence = new IndexeddbPersistence(id, doc);
// const webrtcProvider = new WebrtcProvider(id, doc, {
//   password,
//   signaling: ['wss://signaling.phibre.dev'],
// });
//
// export const remote = svelteSyncedStore(cardlyStore);

const defaultLocalStore: LocalStore = {
  url: '',
  apiKey: '',
  organization: '',
  selectedTopics: [],
  collections: [],
};

export const local = writable<LocalStore>(defaultLocalStore, (set) => {
  if (!('localStorage' in window)) return;

  const localStore = localStorage.getItem('store');
  if (localStore) {
    set(Object.assign(defaultLocalStore, JSON.parse(localStore)));
  }

  const unsubscribe = local.subscribe((value) => {
    localStorage.setItem('store', JSON.stringify(value));
  });

  return () => {
    unsubscribe();
  };
});

const collections: Record<string, Writable<Partial<Collection>>> = {};

// TODO: Support password
export function getCollectionStore(id: string) {
  if (collections[id]) return collections[id];

  const store = syncedStore({
    title: 'text',
    description: 'text',
    cards: [] as Card[],
    topics: [] as Topic[],
  });
  const doc = getYjsDoc(store);
  const indexeddbPersistence = new IndexeddbPersistence(id, doc);
  const webrtcProvider = new WebrtcProvider(id, doc, {
    signaling: ['wss://signaling.phibre.dev'],
  });

  const collectionStore = svelteSyncedStore(store);
  collections[id] = collectionStore;
  return collectionStore;
}
