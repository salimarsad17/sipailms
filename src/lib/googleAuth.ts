/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// Configure Google OAuth Provider with Workspace & Google Sheets Scopes
const provider = new GoogleAuthProvider();

export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/spreadsheets.readonly"
];

GOOGLE_SCOPES.forEach((scope) => {
  provider.addScope(scope);
});

// Prompt consent to ensure refresh/access permissions
provider.setCustomParameters({
  prompt: "consent",
  access_type: "online"
});

// In-memory token storage (MANDATORY: Never store access token in localStorage/sessionStorage)
let isSigningIn = false;
let activeSignInPromise: Promise<{ user: User; accessToken: string }> | null = null;
let cachedAccessToken: string | null = null;
let currentUser: User | null = null;

// Subscribers for auth state updates
type AuthSubscriber = (user: User | null, token: string | null) => void;
const subscribers: Set<AuthSubscriber> = new Set();

const notifySubscribers = () => {
  subscribers.forEach((callback) => {
    try {
      callback(currentUser, cachedAccessToken);
    } catch (err) {
      console.error("Auth subscriber error:", err);
    }
  });
};

// Initialize auth listener
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  if (!user) {
    cachedAccessToken = null;
  }
  notifySubscribers();
});

export const subscribeAuth = (callback: AuthSubscriber): (() => void) => {
  subscribers.add(callback);
  callback(currentUser, cachedAccessToken);
  return () => {
    subscribers.delete(callback);
  };
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    currentUser = user;
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
    notifySubscribers();
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  // If a sign-in popup is already open, reuse the active promise to prevent duplicate popups or cancellations
  if (activeSignInPromise) {
    return activeSignInPromise;
  }

  const executeSignIn = async (): Promise<{ user: User; accessToken: string }> => {
    try {
      isSigningIn = true;
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error("Gagal memperoleh token akses Google dari Firebase Authentication.");
      }
      cachedAccessToken = credential.accessToken;
      currentUser = result.user;
      notifySubscribers();
      return { user: result.user, accessToken: cachedAccessToken };
    } catch (error: any) {
      const code = error?.code || "";
      const message = error?.message || "";

      // Handle user or browser closing the popup
      if (
        code === "auth/popup-closed-by-user" ||
        message.includes("popup-closed-by-user") ||
        message.includes("popup closed by user")
      ) {
        console.warn("Jendela pop-up Google Sign-In ditutup sebelum proses otentikasi selesai.");
        const friendlyError = new Error(
          "Jendela login ditutup sebelum otentikasi Google selesai. Jika jendela tertutup otomatis, peramban Anda mungkin membatasi pop-up di dalam mode pratinjau (iframe). Buka aplikasi di Tab Baru atau coba lagi."
        );
        (friendlyError as any).code = "auth/popup-closed-by-user";
        (friendlyError as any).isPopupClosed = true;
        throw friendlyError;
      }

      // Handle popup blocked by browser or iframe sandbox
      if (
        code === "auth/popup-blocked" ||
        message.includes("popup-blocked") ||
        message.includes("popup_blocked")
      ) {
        console.warn("Pop-up Google Sign-In diblokir oleh peramban atau pembatasan iframe.");
        const friendlyError = new Error(
          "Jendela pop-up login Google diblokir oleh peramban. Silakan klik 'Buka di Tab Baru' atau izinkan pop-up pada peramban Anda."
        );
        (friendlyError as any).code = "auth/popup-blocked";
        (friendlyError as any).isPopupBlocked = true;
        throw friendlyError;
      }

      // Handle concurrent popup request
      if (
        code === "auth/cancelled-popup-request" ||
        message.includes("cancelled-popup-request")
      ) {
        console.warn("Permintaan login dibatalkan karena ada permintaan baru.");
        const friendlyError = new Error(
          "Permintaan login Google sebelumnya dibatalkan. Silakan coba lagi."
        );
        (friendlyError as any).code = "auth/cancelled-popup-request";
        throw friendlyError;
      }

      // Handle unauthorized domain
      if (
        code === "auth/unauthorized-domain" ||
        message.includes("unauthorized-domain")
      ) {
        console.error("Domain belum diotorisasi di Firebase Authentication Console.");
        const friendlyError = new Error(
          "Domain aplikasi ini belum didaftarkan di Firebase Authentication Authorized Domains. Tambahkan domain aplikasi di Firebase Console."
        );
        (friendlyError as any).code = "auth/unauthorized-domain";
        throw friendlyError;
      }

      console.error("Google Sign-In Error:", message || error);
      throw error;
    } finally {
      isSigningIn = false;
      activeSignInPromise = null;
    }
  };

  activeSignInPromise = executeSignIn();
  return activeSignInPromise;
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const logoutGoogle = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
  currentUser = null;
  notifySubscribers();
};
