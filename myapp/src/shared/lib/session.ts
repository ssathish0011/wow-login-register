import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const isWeb = Platform.OS === "web";

const storage = {
  async set(key: string, value: string): Promise<void> {
    if (isWeb) {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async get(key: string): Promise<string | null> {
    if (isWeb) {
      return typeof localStorage !== "undefined"
        ? localStorage.getItem(key)
        : null;
    }
    return await SecureStore.getItemAsync(key);
  },

  async remove(key: string): Promise<void> {
    if (isWeb) {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await storage.get(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = async (token: string): Promise<void> => {
  try {
    await storage.set(TOKEN_KEY, token);
  } catch {
    // do nothing on failure
  }
};

export const clear = async (): Promise<void> => {
  try {
    await storage.remove(TOKEN_KEY);
    await storage.remove(USER_KEY);
  } catch {
    // do nothing on failure
  }
};

export const getUser = async (): Promise<any | null> => {
  try {
    const raw = await storage.get(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setUser = async (user: any): Promise<void> => {
  try {
    await storage.set(USER_KEY, JSON.stringify(user));
  } catch {
    // do nothing on failure
  }
};

export interface AuthUser {
  name: string;
  email: string;
  id?: string;
  phone?: string;
  role?: "user" | "owner" | "admin" | string;
}

export const saveSession = async (
  token: string,
  user: AuthUser
): Promise<void> => {
  await setToken(token);
  await setUser(user);
};

export const clearSession = async (): Promise<void> => {
  await clear();
};

// Unauthorized handler callback
let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

export function handleUnauthorized() {
  if (unauthorizedHandler) {
    unauthorizedHandler();
  }
}