import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../store/store";
import { storage } from "../../../services/storage/storageHelper";

type User = {
  name: string;
  email: string;
};

interface AuthState {
  token: string | null;
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  status: "idle",
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = "succeeded";
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      state.status = "idle";
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = "failed";
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setCredentials, clearCredentials, setError, clearError } =
  authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;

