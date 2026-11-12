// Shared generic button component.
// Used by: auth forms, profile, and any feature needing a CTA.

import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { COLORS } from "@/common/constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "outline";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const getButtonStyle = (pressed: boolean) => {
    switch (variant) {
      case "danger":
        return [styles.dangerButton, pressed && styles.dangerButtonPressed];
      case "secondary":
        return [styles.secondaryButton, pressed && styles.secondaryButtonPressed];
      case "outline":
        return [styles.outlineButton, pressed && styles.outlineButtonPressed];
      default:
        return [styles.primaryButton, pressed && styles.primaryButtonPressed];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
        return styles.outlineButtonText;
      case "secondary":
        return styles.secondaryButtonText;
      default:
        return styles.buttonText;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.baseButton,
        getButtonStyle(pressed),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? COLORS.brand : COLORS.white} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.brand,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryButtonPressed: { backgroundColor: COLORS.brandDark },
  secondaryButton: { backgroundColor: COLORS.brandLight },
  secondaryButtonPressed: { backgroundColor: COLORS.brandBlush },
  dangerButton: { backgroundColor: COLORS.danger },
  dangerButtonPressed: { backgroundColor: COLORS.dangerDark },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.brand,
  },
  outlineButtonPressed: { backgroundColor: COLORS.brandLight },
  buttonText: { color: COLORS.white, fontSize: 15, fontWeight: "700" },
  secondaryButtonText: { color: COLORS.brand, fontSize: 15, fontWeight: "700" },
  outlineButtonText: { color: COLORS.brand, fontSize: 15, fontWeight: "700" },
  disabled: { opacity: 0.6 },
});

