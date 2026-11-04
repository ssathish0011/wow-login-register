import axios from "axios";
import { API_URL } from "../../config/config";
import { storage } from "../storage/storageHelper";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor – attach Bearer token
api.interceptors.request.use(async (config) => {
  const token = await storage.get("token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – handle 401 globally (except login/register)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url as string | undefined;
    if (status === 401 && url && !url.includes("/users/login") && !url.includes("/users/register")) {
      // clear session
      await storage.remove("token");
      await storage.remove("user");
      // redirect to login – router only works in a component, so we use a fallback navigation event
      const router = useRouter();
      router.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default api;

