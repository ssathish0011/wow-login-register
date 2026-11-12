import axios from "axios";
import { getToken, handleUnauthorized } from "./session";
import Constants from "expo-constants";
import { Platform } from "react-native";

const API_URL = (() => {
  let raw = process.env.EXPO_PUBLIC_API_URL?.trim() || "http://localhost:5000/api";
  raw = raw.replace(/\/+$/, "");

  if (Platform.OS !== "web" && (raw.includes("localhost") || raw.includes("127.0.0.1"))) {
    const hostUri = Constants.expoConfig?.hostUri;
    const hostIp = hostUri ? hostUri.split(":")[0] : null;

    if (hostIp && hostIp !== "localhost" && hostIp !== "127.0.0.1") {
      return raw.replace(/localhost|127\.0\.0\.1/, hostIp);
    }

    if (Platform.OS === "android") {
      return raw.replace(/localhost|127\.0\.0\.1/, "10.0.2.2");
    }
  }

  return raw;
})();

const http = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor – attach Bearer token
http.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – handle 401 globally
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url as string | undefined;

    if (status === 401 && url && !url.includes("/users/login") && !url.includes("/users/register")) {
      await import("./session").then((m) => m.clear());
      handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default http;