import { Platform } from "react-native";
import Constants from "expo-constants";

export const API_URL = (() => {
  let raw = process.env.EXPO_PUBLIC_API_URL?.trim() || "http://localhost:5000/api";
  raw = raw.replace(/\/+$/, "");

  // If running on a native device/emulator and configured with localhost, resolve to the host machine IP
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
