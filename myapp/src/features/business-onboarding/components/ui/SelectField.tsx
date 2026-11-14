import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ONBOARDING_THEME } from "../../theme/onboardingTheme";

interface SelectFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  onPress: () => void;
  leftAccessory?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const SelectField = React.memo(function SelectField({
  label,
  value,
  placeholder = "Select an option",
  error,
  required,
  onPress,
  leftAccessory,
  containerStyle,
}: SelectFieldProps) {
  const hasError = Boolean(error);
  const isSelected = Boolean(value && value.trim().length > 0);

  const borderColor = hasError
    ? ONBOARDING_THEME.colors.error
    : isSelected
    ? ONBOARDING_THEME.colors.border
    : ONBOARDING_THEME.colors.border;

  return (
    <View style={[styles.root, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.requiredMark}> *</Text>}
        </Text>
        {!required && <Text style={styles.optionalMark}>Optional</Text>}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.container,
          { borderColor },
          pressed && styles.pressed,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value || placeholder}`}
      >
        {leftAccessory && <View style={styles.leftAccessory}>{leftAccessory}</View>}

        <Text
          style={[
            styles.valueText,
            !isSelected && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {isSelected ? value : placeholder}
        </Text>

        <Ionicons
          name="chevron-down"
          size={18}
          color={ONBOARDING_THEME.colors.textMuted}
        />
      </Pressable>

      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    marginBottom: ONBOARDING_THEME.spacing.base,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ONBOARDING_THEME.spacing.xs + 2,
  },
  label: {
    ...ONBOARDING_THEME.typography.captionBold,
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  requiredMark: {
    color: ONBOARDING_THEME.colors.primary,
    fontWeight: "700",
  },
  optionalMark: {
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.textMuted,
  },
  container: {
    height: ONBOARDING_THEME.sizes.inputHeight,
    borderRadius: ONBOARDING_THEME.radius.md,
    borderWidth: 1.5,
    backgroundColor: ONBOARDING_THEME.colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ONBOARDING_THEME.spacing.md,
  },
  pressed: {
    backgroundColor: ONBOARDING_THEME.colors.surfaceSecondary,
  },
  leftAccessory: {
    marginRight: ONBOARDING_THEME.spacing.sm,
  },
  valueText: {
    flex: 1,
    ...ONBOARDING_THEME.typography.body,
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  placeholderText: {
    color: ONBOARDING_THEME.colors.textPlaceholder,
  },
  errorText: {
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.error,
    marginTop: ONBOARDING_THEME.spacing.xs,
  },
});

