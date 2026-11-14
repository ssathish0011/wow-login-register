// Shared text input with optional label and error message.
// Used by: auth forms (LoginForm, RegisterForm).

import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { COLORS } from "@/shared/theme/colors";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function Input({ label, error, style, ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : undefined, style]}
        placeholderTextColor={COLORS.placeholder}
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1.2,
    borderColor: COLORS.borderMedium,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: COLORS.ink,
    backgroundColor: COLORS.bgLight,
  },
  inputError: { borderColor: COLORS.danger, backgroundColor: "#FEE2E2" },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});

