export const API_URL = (() => {
  const raw = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!raw) {
    throw new Error("EXPO_PUBLIC_API_URL is not set. Add it to your .env file.");
  }
  // Remove trailing slash
  return raw.replace(/\/+$/,"");
})();

