import { DownloadedSurah, Qari, Surah } from '../types/quran';

const DB_NAME = 'NooraniQuranDB';
const DB_VERSION = 1;
const STORE_NAME = 'surahs_audio';

interface AudioRecord {
  key: string; // `${qariId}_${surahId}`
  qariId: string;
  surahId: number;
  surahNameBangla: string;
  qariNameBangla: string;
  blob: Blob;
  sizeBytes: number;
  downloadedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('qariId', 'qariId', { unique: false });
        store.createIndex('surahId', 'surahId', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function isSurahOffline(qariId: string, surahId: number): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(`${qariId}_${surahId}`);
      req.onsuccess = () => {
        resolve(!!req.result);
      };
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

export async function getOfflineAudioBlob(qariId: string, surahId: number): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(`${qariId}_${surahId}`);
      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          resolve(req.result.blob);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function downloadAndSaveSurah(
  qari: Qari,
  surah: Surah,
  audioUrl: string,
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const response = await fetch(audioUrl, {
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(`তিলাওয়াত ডাউনলোড করা সম্ভব হয়নি (${response.status})`);
  }

  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;

  let loaded = 0;
  let blob: Blob;

  if (response.body && total > 0) {
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        loaded += value.length;
        if (onProgress) {
          const percent = Math.min(100, Math.round((loaded / total) * 100));
          onProgress(percent);
        }
      }
    }

    blob = new Blob(chunks as unknown as BlobPart[], { type: 'audio/mpeg' });
  } else {
    // Fallback if content-length or body stream is not available
    blob = await response.blob();
    if (onProgress) onProgress(100);
  }

  const db = await openDB();
  const record: AudioRecord = {
    key: `${qari.id}_${surah.id}`,
    qariId: qari.id,
    surahId: surah.id,
    surahNameBangla: surah.nameBangla,
    qariNameBangla: qari.nameBangla,
    blob,
    sizeBytes: blob.size,
    downloadedAt: Date.now()
  };

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

  return blob;
}

export async function deleteOfflineSurah(qariId: string, surahId: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(`${qariId}_${surahId}`);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getAllOfflineSurahs(): Promise<DownloadedSurah[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const records: AudioRecord[] = req.result || [];
        const items: DownloadedSurah[] = records.map((r) => ({
          key: r.key,
          qariId: r.qariId,
          surahId: r.surahId,
          surahNameBangla: r.surahNameBangla,
          qariNameBangla: r.qariNameBangla,
          sizeBytes: r.sizeBytes,
          downloadedAt: r.downloadedAt
        }));
        resolve(items);
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function clearAllOfflineData(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export function saveBlobToFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}
