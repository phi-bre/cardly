import type { Quiz } from './interfaces';
import { syncedStore, getYjsDoc } from '@syncedstore/core';
import { svelteSyncedStore } from '@syncedstore/svelte';
import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';
import { writable } from 'svelte/store';

// FIXME: syncedStore doesn't accept RemoteStore as a type
export interface RemoteStore {
  quizzes: Quiz[];
}

export interface LocalStore {
  url: string;
  apiKey: string;
  organization: string;
  selectedQuizzes: string[];
}

const cardlyStore = syncedStore({
  quizzes: [] as Quiz[],
});

// TODO: Make id and password configurable via local storage
const id = 'tmp-242787c6-ebba-4528-9a74-a407133f65e0';
const password = '242787c6-ebba-4528-9a74-a407133f65e0';
const doc = getYjsDoc(cardlyStore);
const indexeddbPersistence = new IndexeddbPersistence(id, doc);
const webrtcProvider = new WebrtcProvider(id, doc, {
  password,
  signaling: ['wss://signaling.phibre.dev'],
});

export const remote = svelteSyncedStore(cardlyStore);

const defaultLocalStore: LocalStore = {
  url: '',
  apiKey: '',
  organization: '',
  selectedQuizzes: [],
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
