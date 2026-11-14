// Shared types used by multiple features.
// Feature-specific types live in features/<name>/types/.

export interface User {
  id?: string;
  name: string;
  email: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export type TabType = "home" | "categories" | "add" | "saved" | "profile";

