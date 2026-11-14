import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "@/shared/theme/colors";
import { CategoryItem } from "../types/home.types";

interface TopCategoriesProps {
  categories: CategoryItem[];
  selectedCategoryId: string;
  onSelectCategory: (category: CategoryItem) => void;
  onViewAllPress?: () => void;
}

type MCIName = keyof typeof MaterialCommunityIcons.glyphMap;

const CATEGORY_ICONS: Record<string, MCIName> = {
  beauty: "spa",
  food: "silverware-fork-knife",
  health: "hospital-box",
  home: "home-city",
  fashion: "tshirt-crew",
  education: "school",
  automobile: "car-sports",
  events: "calendar-star",
  electronics: "cellphone",
  more: "view-grid-plus",
};

const DEFAULT_ICON: MCIName = "storefront";

const ITEMS_PER_ROW = 5;

export default function TopCategories({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onViewAllPress,
}: TopCategoriesProps) {
  // 9 normal categories + "More" always as the 10th
  const moreItem =
    categories.find((c) => c.iconType === "more") ??
    ({ id: "more", name: "More", iconType: "more" } as CategoryItem);

  const items: CategoryItem[] = [
    ...categories.filter((c) => c.iconType !== "more").slice(0, 9),
    moreItem,
  ];

  const rows: CategoryItem[][] = [];
  for (let i = 0; i < items.length; i += ITEMS_PER_ROW) {
    rows.push(items.slice(i, i + ITEMS_PER_ROW));
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
        </View>

        <Pressable
          style={styles.viewAllButton}
          onPress={onViewAllPress}
          accessibilityRole="button"
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={15} color={COLORS.brand} />
        </Pressable>
      </View>

      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cat) => {
              const iconName = CATEGORY_ICONS[cat.iconType || ""] || DEFAULT_ICON;
              const isMore = cat.iconType === "more";
              const isSelected = !isMore && cat.id === selectedCategoryId;

              return (
                <Pressable
                  key={cat.id}
                  style={({ pressed }) => [
                    styles.categoryItem,
                    pressed && styles.itemPressed,
                  ]}
                  onPress={() =>
                    isMore ? onViewAllPress?.() : onSelectCategory(cat)
                  }
                  accessibilityRole="button"
                  accessibilityLabel={cat.name}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      isSelected && styles.iconContainerSelected,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={iconName}
                      size={26}
                      color={COLORS.brand}
                    />
                  </View>

                  <Text
                    style={[
                      styles.categoryLabel,
                      isSelected && styles.categoryLabelSelected,
                    ]}
                    numberOfLines={2}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 20,
  },

  headerRow: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.ink,
    letterSpacing: -0.5,
  },

  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingVertical: 7,
  },

  viewAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brand,
  },

  grid: {
    paddingHorizontal: 5,
    rowGap: 20,
  },

  row: {
    flexDirection: "row",
  },

  categoryItem: {
    width: "20%",
    alignItems: "center",
  },

  itemPressed: {
    opacity: 0.6,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainerSelected: {
    borderWidth: 1.5,
    borderColor: COLORS.brand,
  },

  categoryLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#424242",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 13,
    paddingHorizontal: 1,
  },

  categoryLabelSelected: {
    color: COLORS.ink,
    fontWeight: "700",
  },
});