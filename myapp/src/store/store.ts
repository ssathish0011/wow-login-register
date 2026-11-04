import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/services/authApi";
import authReducer from "../features/auth/slices/authSlice";
import dashboardReducer from "../features/dashboard/slices/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

