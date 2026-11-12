// Shared full-screen loading spinner with optional message.
// Used by: any feature that needs a loading state indicator.

import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/common/constants/colors";

interface LoaderProps {
  message?: string;
  size?: "small" | "large";
}

export default function Loader({ message, size = "large" }: LoaderProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={COLORS.brand} />
      {message ? <Text style={styles.text}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
});

