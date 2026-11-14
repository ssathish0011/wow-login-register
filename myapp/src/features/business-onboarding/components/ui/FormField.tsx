import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ONBOARDING_THEME } from "../../theme/onboardingTheme";

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  isValid?: boolean;
  helperText?: string;
  leftAccessory?: React.ReactNode;
  rightAccessory?: React.ReactNode;
  containerStyle?: ViewStyle;
  showCharCount?: boolean;
}

export const FormField = React.memo(function FormField({
  label,
  error,
  required,
  isValid,
  helperText,
  leftAccessory,
  rightAccessory,
  containerStyle,
  showCharCount,
  maxLength,
  value = "",
  onFocus,
  onBlur,
  multiline,
  style,
  ...rest
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);
  const showValidTick = !hasError && isValid && Boolean(value && value.length > 0);

  const borderColor = hasError
    ? ONBOARDING_THEME.colors.error
    : isFocused
    ? ONBOARDING_THEME.colors.borderActive
    : ONBOARDING_THEME.colors.border;

  const backgroundColor = hasError
    ? ONBOARDING_THEME.colors.errorLight + "20"
    : ONBOARDING_THEME.colors.surface;

  return (
    <View style={[styles.root, containerStyle]}>
      {/* Label & Optional Tag */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.requiredMark}> *</Text>}
        </Text>
        {!required && <Text style={styles.optionalMark}>Optional</Text>}
      </View>

      {/* Input Box */}
      <View
        style={[
          styles.inputContainer,
          { borderColor, backgroundColor },
          multiline && styles.multilineContainer,
        ]}
      >
        {leftAccessory && <View style={styles.leftAccessory}>{leftAccessory}</View>}

        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            style,
          ]}
          value={value}
          maxLength={maxLength}
          multiline={multiline}
          placeholderTextColor={ONBOARDING_THEME.colors.textPlaceholder}
          accessibilityLabel={label}
          accessibilityRole="none"
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />

        {showValidTick && !rightAccessory && (
          <View style={styles.rightAccessory}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={ONBOARDING_THEME.colors.success}
            />
          </View>
        )}

        {hasError && !rightAccessory && (
          <View style={styles.rightAccessory}>
            <Ionicons
              name="alert-circle"
              size={18}
              color={ONBOARDING_THEME.colors.error}
            />
          </View>
        )}

        {rightAccessory && (
          <View style={styles.rightAccessory}>{rightAccessory}</View>
        )}
      </View>

      {/* Footer: Error message or helper text and live character count */}
      <View style={styles.footerRow}>
        {hasError ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : helperText ? (
          <Text style={styles.helperText}>{helperText}</Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {showCharCount && maxLength && (
          <Text style={styles.charCountText}>
            {value ? value.length : 0}/{maxLength}
          </Text>
        )}
      </View>
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
  inputContainer: {
    minHeight: ONBOARDING_THEME.sizes.inputHeight,
    borderRadius: ONBOARDING_THEME.radius.md,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ONBOARDING_THEME.spacing.md,
  },
  multilineContainer: {
    minHeight: 110,
    alignItems: "flex-start",
    paddingVertical: ONBOARDING_THEME.spacing.sm,
  },
  input: {
    flex: 1,
    ...ONBOARDING_THEME.typography.body,
    color: ONBOARDING_THEME.colors.textPrimary,
    minHeight: ONBOARDING_THEME.sizes.inputHeight - 4,
    paddingVertical: 0,
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  leftAccessory: {
    marginRight: ONBOARDING_THEME.spacing.sm,
  },
  rightAccessory: {
    marginLeft: ONBOARDING_THEME.spacing.sm,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: ONBOARDING_THEME.spacing.xs,
    minHeight: 18,
  },
  errorText: {
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.error,
    fontWeight: "500",
    flex: 1,
  },
  helperText: {
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.textMuted,
    flex: 1,
  },
  charCountText: {
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.textMuted,
    marginLeft: ONBOARDING_THEME.spacing.sm,
  },
});

