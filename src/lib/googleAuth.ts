/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Custom GoogleUser interface replacing Firebase Auth User completely
export interface GoogleUser {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  uid?: string;
}

// In-memory token storage (Never store sensitive access tokens in persistent localStorage)
let isSigningIn = false;
let activeSignInPromise: Promise<{ user: GoogleUser; accessToken: string }> | null = null;
let cachedAccessToken: string | null = null;
let currentUser: GoogleUser | null = {
  displayName: "Sadiqul Alim, S.Pd.I., M.Pd.",
  email: "salimarsad17@gmail.com",
  uid: "guru-aktif-local"
};

export const isLiveGoogleToken = (token?: string | null): boolean => {
  if (!token) return false;
  const clean = token.replace(/^Bearer\s+/i, "").trim();
  return clean.startsWith("ya29.");
};

// Subscribers for auth state updates
export type AuthSubscriber = (user: GoogleUser | null, token: string | null) => void;
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

export const subscribeAuth = (callback: AuthSubscriber): (() => void) => {
  subscribers.add(callback);
  callback(currentUser, cachedAccessToken);
  return () => {
    subscribers.delete(callback);
  };
};

export const initAuth = (
  onAuthSuccess?: (user: GoogleUser, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (currentUser && cachedAccessToken) {
    if (onAuthSuccess) onAuthSuccess(currentUser, cachedAccessToken);
  } else {
    if (onAuthFailure) onAuthFailure();
  }
  notifySubscribers();
  return () => {};
};

/**
 * Connect Google Account cleanly without Firebase Authentication.
 * Supports Google Identity Services (GSI), direct tokens, or local workspace session.
 */
export const googleSignIn = async (
  customToken?: string
): Promise<{ user: GoogleUser; accessToken: string }> => {
  if (activeSignInPromise) {
    return activeSignInPromise;
  }

  const executeSignIn = async (): Promise<{ user: GoogleUser; accessToken: string }> => {
    try {
      isSigningIn = true;

      // 1. If a custom token was provided directly
      if (customToken?.trim()) {
        const cleanToken = customToken.trim();
        cachedAccessToken = cleanToken;
        currentUser = {
          displayName: "Pengguna Google Workspace",
          email: "salimarsad17@gmail.com",
          uid: "google-ws-" + Date.now()
        };
        notifySubscribers();
        return { user: currentUser, accessToken: cachedAccessToken };
      }

      // 2. Check if client-side Google Identity Services (GSI) is loaded
      if (typeof window !== "undefined" && (window as any).google?.accounts?.oauth2) {
        return await new Promise((resolve, reject) => {
          try {
            const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
              client_id: (window as any).__GOOGLE_CLIENT_ID__ || "",
              scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets",
              callback: (tokenResponse: any) => {
                if (tokenResponse.error) {
                  reject(new Error(tokenResponse.error_description || tokenResponse.error));
                  return;
                }
                if (tokenResponse.access_token) {
                  cachedAccessToken = tokenResponse.access_token;
                  currentUser = {
                    displayName: "Akun Google Terhubung",
                    email: "salimarsad17@gmail.com",
                    uid: "gsi-" + Date.now()
                  };
                  notifySubscribers();
                  resolve({ user: currentUser, accessToken: cachedAccessToken });
                } else {
                  reject(new Error("Token akses tidak ditemukan dalam respons Google."));
                }
              }
            });
            tokenClient.requestAccessToken();
          } catch (gsiErr) {
            reject(gsiErr);
          }
        });
      }

      // 3. Direct local workspace session (Standalone mode without Firebase)
      cachedAccessToken = null;
      currentUser = {
        displayName: "Sadiqul Alim, S.Pd.I., M.Pd.",
        email: "salimarsad17@gmail.com",
        uid: "local-google-session"
      };
      notifySubscribers();
      return { user: currentUser, accessToken: "" };
    } finally {
      isSigningIn = false;
      activeSignInPromise = null;
    }
  };

  activeSignInPromise = executeSignIn();
  return activeSignInPromise;
};

export const setManualAccessToken = (token: string, email?: string) => {
  cachedAccessToken = token;
  currentUser = {
    displayName: "Pengguna Google Workspace",
    email: email || "salimarsad17@gmail.com",
    uid: "manual-" + Date.now()
  };
  notifySubscribers();
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const getCurrentUser = (): GoogleUser | null => {
  return currentUser;
};

export const logoutGoogle = async (): Promise<void> => {
  cachedAccessToken = null;
  currentUser = null;
  notifySubscribers();
};
