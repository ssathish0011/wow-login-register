import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/shared/theme/colors";

interface EmptyBusinessStateProps {
  onResetFilters: () => void;
  message?: string;
}

export default function EmptyBusinessState({
  onResetFilters,
  message = "No businesses match your active filters or search.",
}: EmptyBusinessStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="search" size={32} color={WOW_COLORS.primaryPink} />
      </View>
      <Text style={styles.title}>No Businesses Found</Text>
      <Text style={styles.subtitle}>{message}</Text>
      <Pressable
        style={styles.resetBtn}
        onPress={onResetFilters}
        accessibilityRole="button"
      >
        <Ionicons name="refresh" size={16} color={WOW_COLORS.white} />
        <Text style={styles.resetBtnText}>Reset All Filters</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WOW_COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    padding: 32,
    marginHorizontal: 16,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: WOW_COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: WOW_COLORS.secondaryText,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 18,
    maxWidth: 280,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: WOW_COLORS.primaryPink,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetBtnText: {
    color: WOW_COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
});

