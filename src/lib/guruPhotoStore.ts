/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const STORAGE_KEY = "pai_lms_guru_custom_foto";
const EVENT_NAME = "pai_lms_guru_photo_change";

export function getCustomGuruPhoto(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export async function saveCustomGuruPhoto(dataUrl: string): Promise<boolean> {
  try {
    localStorage.setItem(STORAGE_KEY, dataUrl);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: dataUrl }));

    // Also persist to server public folder so static links work
    try {
      await fetch("/api/upload-guru-foto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: dataUrl })
      });
    } catch (e) {
      console.warn("Could not persist photo to backend server:", e);
    }

    return true;
  } catch (err) {
    console.error("Failed to save guru photo:", err);
    return false;
  }
}

export function removeCustomGuruPhoto(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }));
  } catch {
    // ignore
  }
}

export function subscribeGuruPhoto(callback: (photo: string | null) => void): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<string | null>;
    callback(customEvent.detail ?? getCustomGuruPhoto());
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(e.newValue);
    }
  };

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", storageHandler);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
