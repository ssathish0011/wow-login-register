import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { ONBOARDING_THEME } from "../../theme/onboardingTheme";

interface SummaryRowProps {
  label: string;
  value?: string | React.ReactNode;
  containerStyle?: ViewStyle;
}

export const SummaryRow = React.memo(function SummaryRow({
  label,
  value,
  containerStyle,
}: SummaryRowProps) {
  if (!value) return null;

  return (
    <View style={[styles.row, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      {typeof value === "string" ? (
        <Text style={styles.value}>{value}</Text>
      ) : (
        <View style={styles.valueContainer}>{value}</View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    paddingVertical: ONBOARDING_THEME.spacing.xs + 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  label: {
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.textMuted,
    width: "36%",
  },
  value: {
    ...ONBOARDING_THEME.typography.bodyMedium,
    color: ONBOARDING_THEME.colors.textPrimary,
    flex: 1,
    textAlign: "right",
  },
  valueContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
});

