import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../store/store";

type Stats = {
  // define any dashboard stats you need in the future
};

interface DashboardState {
  stats: Stats | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  status: "idle",
  error: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<Stats>) => {
      state.stats = action.payload;
      state.status = "succeeded";
    },
    clearStats: (state) => {
      state.stats = null;
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

export const { setStats, clearStats, setError, clearError } = dashboardSlice.actions;
export const selectDashboard = (state: RootState) => state.dashboard;
export default dashboardSlice.reducer;

