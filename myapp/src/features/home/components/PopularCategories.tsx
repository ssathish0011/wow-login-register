import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/common/constants/colors";
import { PopularCategoryItem } from "../types/home.types";

interface PopularCategoriesProps {
  categories: PopularCategoryItem[];
  selectedId?: string | null; // highlights the chip that is currently selected
  onSelectCategory?: (category: PopularCategoryItem) => void;
}

// ======================================
// SIZE CONFIGURATION
// ======================================

const SIDE_PADDING = 15;
const CHIP_GAP = 8;
const CHIP_ICON_SIZE = 15;
const CHIP_ICON_CIRCLE = 26;

// "flame-outline" -> "flame" (filled Ionicons variant)
const toFilledIcon = (name: string) => name.replace(/-outline$/, "");

export default function PopularCategories({
  categories,
  selectedId = null,
  onSelectCategory,
}: PopularCategoriesProps) {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Popular Categories</Text>
      </View>

      {/* CHIPS: one swipeable row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {categories.map((item) => {
          const active = item.id === selectedId;

          return (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.chip,
                active && styles.chipActive,
                pressed && styles.chipPressed,
              ]}
              onPress={() => onSelectCategory?.(item)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={item.name}
            >
              <View
                style={[
                  styles.chipIconCircle,
                  active && styles.chipIconCircleActive,
                ]}
              >
                <Ionicons
                  name={toFilledIcon(item.iconName) as any}
                  size={CHIP_ICON_SIZE}
                  color={COLORS.brand}
                />
              </View>

              <Text
                style={[styles.chipText, active && styles.chipTextActive]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ======================================
// STYLES
// ======================================

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 12,
  },

  header: {
    paddingHorizontal: SIDE_PADDING,
    marginBottom: 12,
  },

  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
    fontFamily: "Georgia",
    color: "#211921",
    letterSpacing: -0.4,
  },

  chipsRow: {
    paddingHorizontal: SIDE_PADDING,
    paddingVertical: 4,
    gap: CHIP_GAP,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F3DCE6",
    paddingLeft: 5,
    paddingRight: 14,
    paddingVertical: 5,
    borderRadius: 999,
    shadowColor: "#211921",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },

  chipActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },

  chipPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },

  chipIconCircle: {
    width: CHIP_ICON_CIRCLE,
    height: CHIP_ICON_CIRCLE,
    borderRadius: CHIP_ICON_CIRCLE / 2,
    backgroundColor: "#FCE7EF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  chipIconCircleActive: {
    backgroundColor: "#FFFFFF",
  },

  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#29232B",
  },

  chipTextActive: {
    color: "#FFFFFF",
  },
});