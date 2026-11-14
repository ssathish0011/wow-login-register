import { COLORS } from "@/shared/theme/colors";

export const ONBOARDING_THEME = {
  colors: {
    primary: COLORS.brand || "#E91166",
    primaryDark: COLORS.brandDark || "#C20D54",
    primaryLight: "#FFF1F5",
    primaryBorder: "#FCE7EF",
    bg: "#F8F9FB",
    surface: "#FFFFFF",
    surfaceSecondary: "#F3F4F6",
    border: "#E5E7EB",
    borderActive: COLORS.brand || "#E91166",
    textPrimary: "#111827",
    textSecondary: "#4B5563",
    textMuted: "#6B7280",
    textPlaceholder: "#9CA3AF",
    success: "#16A34A",
    successLight: "#DCFCE7",
    error: "#DC2626",
    errorLight: "#FEE2E2",
    warning: "#D97706",
    warningLight: "#FEF3C7",
    info: "#0284C7",
    infoLight: "#E0F2FE",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    screen: 20,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
  sizes: {
    buttonHeight: 52,
    inputHeight: 52,
    touchTargetMin: 44,
  },
  typography: {
    title: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: "700" as const,
    },
    section: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: "600" as const,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "400" as const,
    },
    bodyMedium: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "500" as const,
    },
    caption: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "400" as const,
    },
    captionBold: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "600" as const,
    },
    tag: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: "700" as const,
      letterSpacing: 0.5,
    },
  },
} as const;

export type OnboardingTheme = typeof ONBOARDING_THEME;

