/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const DB_NAME = "pai_smart_video_blobs_v1";
const STORE_NAME = "videos";
const IDB_PREFIX = "idb://";

const objectUrlCache = new Map<string, string>();

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB tidak tersedia di browser ini."));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Gagal membuka database video lokal."));
  });
}

export function isIndexedDbVideoUrl(url?: string): boolean {
  return Boolean(url && url.startsWith(IDB_PREFIX));
}

export async function saveVideoBlob(file: File | Blob): Promise<string> {
  const key = `vid-blob-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const idbUrl = `${IDB_PREFIX}${key}`;

  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(file, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error || new Error("Gagal menyimpan berkas video."));
    });
    const objUrl = URL.createObjectURL(file);
    objectUrlCache.set(idbUrl, objUrl);
    return idbUrl;
  } catch (err) {
    console.warn("IndexedDB simpan video gagal, fallback ke ObjectURL sesi aktif:", err);
    const objUrl = URL.createObjectURL(file);
    objectUrlCache.set(objUrl, objUrl);
    return objUrl;
  }
}

export async function resolveVideoBlobUrl(url?: string): Promise<string> {
  if (!url) return "";
  if (!isIndexedDbVideoUrl(url)) return url;

  const cached = objectUrlCache.get(url);
  if (cached) return cached;

  const key = url.slice(IDB_PREFIX.length);
  try {
    const db = await openDb();
    const blob = await new Promise<Blob | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result as Blob | undefined);
      req.onerror = () => reject(req.error);
    });
    if (blob) {
      const objUrl = URL.createObjectURL(blob);
      objectUrlCache.set(url, objUrl);
      return objUrl;
    }
  } catch (err) {
    console.warn("Gagal membaca blob video dari IndexedDB:", err);
  }
  return "";
}

export function extractVideoDuration(file: File): Promise<string> {
  return new Promise((resolve) => {
    try {
      const tempUrl = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      const cleanup = () => {
        URL.revokeObjectURL(tempUrl);
        video.remove();
      };
      video.onloadedmetadata = () => {
        const secs = Math.round(video.duration || 0);
        cleanup();
        if (secs > 0 && Number.isFinite(secs)) {
          const m = Math.floor(secs / 60);
          const s = secs % 60;
          resolve(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
        } else {
          resolve("05:00");
        }
      };
      video.onerror = () => {
        cleanup();
        resolve("05:00");
      };
      video.src = tempUrl;
    } catch {
      resolve("05:00");
    }
  });
}
