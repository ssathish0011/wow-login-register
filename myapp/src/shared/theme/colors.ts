// Design token: brand colors, neutrals, status.
// Used by: all features, common/components, common/navigation.

export const COLORS = {
  // Brand Primary (WOW Pink)
  brand: "#E91166",
  brandDark: "#C20D54",
  brandLight: "#FFF7FA",
  brandBlush: "#FCE7EF",
  brandPastel: "#FCE7F3",
  brandBorder: "#F0DDE5",

  // WOW Brand Spec Colors
  primaryPink: "#E91166",
  softPink: "#FCE7EF",
  bgPage: "#FFF7FA",
  white: "#FFFFFF",
  primaryText: "#171717",
  secondaryText: "#6B6B6B",
  borderPink: "#F0DDE5",

  // Neutrals / Typography
  ink: "#171717",
  text: "#171717",
  textPrimary: "#171717",
  textSecondary: "#6B6B6B",
  textMuted: "#9CA3AF",
  placeholder: "#9CA3AF",
  brandMuted: "#FCE7EF",

  // Backgrounds & Borders
  background: "#FFF7FA",
  bgLight: "#FFF7FA",
  borderLight: "#F0DDE5",
  borderMedium: "#E5E7EB",

  // Status & Feedback
  success: "#10B981",
  danger: "#EF4444",
  dangerDark: "#DC2626",
  warning: "#F59E0B",
  gold: "#F59E0B",
} as const;

export const WOW_COLORS = {
  primaryPink: "#E91166",
  softPink: "#FCE7EF",
  background: "#FFF7FA",
  white: "#FFFFFF",
  primaryText: "#171717",
  secondaryText: "#6B6B6B",
  border: "#F0DDE5",
  gold: "#FBBF24",
  green: "#16A34A",
  blue: "#2563EB",
} as const;

export type ColorName = keyof typeof COLORS;


