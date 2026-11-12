import axios from "axios";
import { API_URL } from "../../config/config";
import { storage } from "../storage/storageHelper";

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
let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url as string | undefined;
    if (status === 401 && url && !url.includes("/users/login") && !url.includes("/users/register")) {
      // clear session
      await storage.remove("token");
      await storage.remove("user");
      // trigger logout callback registered from root layout
      if (unauthorizedHandler) {
        unauthorizedHandler();
      }
    }
    return Promise.reject(error);
  }
);

export default api;

