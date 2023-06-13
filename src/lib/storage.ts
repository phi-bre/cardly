import type { CardAnswer, Deck } from './interfaces';
import { syncedStore, getYjsDoc } from '@syncedstore/core';
import { svelteSyncedStore } from '@syncedstore/svelte';
import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';
import { get, readable, type Writable, writable } from 'svelte/store';
import { nanoid } from 'nanoid';
import { browser } from '$app/environment';
import { applyUpdateV2, encodeStateAsUpdateV2 } from 'yjs';

export function storable<T extends object>(value: T, key: string): Writable<T> {
  const store = writable(value);
  const { subscribe, set } = store;

  if (browser && localStorage[key]) {
    set(JSON.parse(localStorage[key]));
  } else {
    localStorage[key] = JSON.stringify(value);
  }

  return {
    subscribe,
    set: (value) => {
      if (browser) {
        localStorage[key] = JSON.stringify(value);
      }
      set(value);
    },
    update: (updater) => {
      const updatedStore = updater(get(store));

      if (browser) {
        localStorage[key] = JSON.stringify(updatedStore);
      }
      set(updatedStore);
    },
  };
}

export const selectedTopics = writable<string[]>([]); // TODO: Remove, just temporary.

export const timings = storable(
  {
    new: 0,
    learning: 60 * 60 * 1000, // 1 hour
    reviewing: 24 * 60 * 60 * 1000, // 24 hours
    mastered: 72 * 60 * 60 * 1000, // 72 hours
  },
  'timings',
);

export const credentials = storable(
  {
    username: nanoid(), // TODO: Change to workspace after exams.
    password: nanoid(),
    profile: nanoid(),
    apiKey: '',
  },
  'credentials',
);

const { username, password, profile } = get(credentials);

const cardlyStore = syncedStore({
  decks: {} as Record<string, Deck>,
  profiles: {} as Record<
    string,
    {
      answers: CardAnswer[];
    }
  >,
});
export const doc = getYjsDoc(cardlyStore);
export const indexeddb = new IndexeddbPersistence(username, doc);
export const webrtc = new WebrtcProvider(username, doc, {
  password,
  signaling: ['wss://signaling.phibre.dev'],
});

doc.on('update', () => {
  console.log(doc.toJSON());
});

webrtc.awareness.setLocalStateField('profile', profile);

export const users = readable<string[]>([], (set) => {
  webrtc.awareness.on('change', () => {
    set([...webrtc.awareness.getStates().values()].map((state: any) => state.profile));
  });
});

export const synced = svelteSyncedStore(cardlyStore);

export function exportDoc() {
  return encodeStateAsUpdateV2(doc);
}

export function importDoc(update: Uint8Array) {
  applyUpdateV2(doc, update, 'upstream');
}
