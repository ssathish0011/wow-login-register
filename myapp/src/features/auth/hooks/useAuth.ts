import { useCallback } from "react";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectAuth,
  clearCredentials,
} from "../slices/authSlice";
import { clearSession, getToken, getUser, saveSession } from "../../../utils/auth";
import type { AuthUser } from "../../../utils/auth";

export interface UseAuthReturn {
  user: { name: string; email: string } | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  logout: () => Promise<void>;
  getStoredToken: () => Promise<string | null>;
  getStoredUser: () => Promise<AuthUser | null>;
  saveStoredSession: (token: string, user: AuthUser) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { token, user, status } = useAppSelector(selectAuth);

  const logout = useCallback(async () => {
    await clearSession();
    dispatch(clearCredentials());
    router.replace("/login");
  }, [dispatch, router]);

  return {
    user,
    token,
    status,
    logout,
    getStoredToken: getToken,
    getStoredUser: getUser,
    saveStoredSession: saveSession,
  };
}

