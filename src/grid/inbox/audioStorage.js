import { GRID_KEYS } from '../settings/storageKeys.js';

export const AUDIO_DB_NAME = 'the-grid';
export const AUDIO_STORE_NAME = 'audio';
export const AUDIO_DB_VERSION = 1;

export function defaultInbox() {
  return [];
}

export function loadInbox() {
  try {
    const raw = localStorage.getItem(GRID_KEYS.inbox);
    return raw ? JSON.parse(raw) : defaultInbox();
  } catch {
    return defaultInbox();
  }
}

export function persistInbox(items) {
  localStorage.setItem(GRID_KEYS.inbox, JSON.stringify(items));
}

export function openAudioDb() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is unavailable'));
      return;
    }

    const request = indexedDB.open(AUDIO_DB_NAME, AUDIO_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(AUDIO_STORE_NAME)) db.createObjectStore(AUDIO_STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Unable to open audio database'));
  });
}

async function withAudioStore(mode, action) {
  const db = await openAudioDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(AUDIO_STORE_NAME, mode);
    const store = transaction.objectStore(AUDIO_STORE_NAME);
    let request;

    try {
      request = action(store);
    } catch (error) {
      db.close();
      reject(error);
      return;
    }

    transaction.oncomplete = () => {
      db.close();
      resolve(request?.result);
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error || new Error('Audio database transaction failed'));
    };
    transaction.onabort = () => {
      db.close();
      reject(transaction.error || new Error('Audio database transaction aborted'));
    };
  });
}

export function putAudioBlob(id, blob) {
  return withAudioStore('readwrite', (store) => store.put(blob, id));
}

export function getAudioBlob(id) {
  return withAudioStore('readonly', (store) => store.get(id));
}

export function deleteAudioBlob(id) {
  return withAudioStore('readwrite', (store) => store.delete(id));
}

export function clearAudioStore() {
  return withAudioStore('readwrite', (store) => store.clear());
}
