import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/shared/theme/colors";
import { BUSINESS_CATEGORIES } from "../data/businessListingData";

interface CategoryChipsRowProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
}

export default function CategoryChipsRow({
  selectedCategory,
  onSelectCategory,
}: CategoryChipsRowProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {/* All Pill */}
        <Pressable
          style={[
            styles.chip,
            selectedCategory === null && styles.chipActive,
          ]}
          onPress={() => onSelectCategory(null)}
          accessibilityRole="button"
        >
          <View
            style={[
              styles.iconCircle,
              selectedCategory === null && styles.iconCircleActive,
            ]}
          >
            <Ionicons
              name="apps"
              size={14}
              color={selectedCategory === null ? WOW_COLORS.white : WOW_COLORS.primaryPink}
            />
          </View>
          <Text
            style={[
              styles.chipLabel,
              selectedCategory === null && styles.chipLabelActive,
            ]}
          >
            All Categories
          </Text>
        </Pressable>

        {/* 10 Category Chips */}
        {BUSINESS_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.name;

          return (
            <Pressable
              key={cat.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelectCategory(isActive ? null : cat.name)}
              accessibilityRole="button"
            >
              <View
                style={[
                  styles.iconCircle,
                  isActive && styles.iconCircleActive,
                ]}
              >
                <Ionicons
                  name={cat.iconName}
                  size={14}
                  color={isActive ? WOW_COLORS.white : WOW_COLORS.primaryPink}
                />
              </View>
              <Text
                style={[
                  styles.chipLabel,
                  isActive && styles.chipLabelActive,
                ]}
                numberOfLines={1}
              >
                {cat.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WOW_COLORS.white,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: WOW_COLORS.border,
  },
  scrollList: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  chipActive: {
    backgroundColor: WOW_COLORS.softPink,
    borderColor: WOW_COLORS.primaryPink,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: WOW_COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleActive: {
    backgroundColor: WOW_COLORS.primaryPink,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
  },
  chipLabelActive: {
    color: WOW_COLORS.primaryPink,
    fontWeight: "800",
  },
});

