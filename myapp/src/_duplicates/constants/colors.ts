export const COLORS = {
  // Brand Primary
  brand: "#D1006C",
  brandDark: "#A80056",
  brandLight: "#FFF1F5",
  brandBlush: "#FFE4EE",
  brandPastel: "#FCE7F3",
  brandBorder: "#FBCFE8",

  // Neutrals / Typography
  white: "#FFFFFF",
  ink: "#111827",
  textPrimary: "#1F2937",
  textSecondary: "#4B5563",
  textMuted: "#6B7280",
  placeholder: "#9CA3AF",

  // Backgrounds & Borders
  bgLight: "#F9FAFB",
  borderLight: "#F3F4F6",
  borderMedium: "#E5E7EB",

  // Status & Feedback
  success: "#10B981",
  danger: "#EF4444",
  dangerDark: "#DC2626",
  warning: "#F59E0B",
} as const;

export type ColorName = keyof typeof COLORS;

