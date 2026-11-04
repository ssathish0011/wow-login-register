import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CategoryItem } from "../types/home.types";

interface TopCategoriesProps {
  categories: CategoryItem[];
  selectedCategoryId: string;
  onSelectCategory: (category: CategoryItem) => void;
  onViewAllPress?: () => void;
}

export default function TopCategories({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onViewAllPress,
}: TopCategoriesProps) {
  const renderCategoryIcon = (iconType: string, isActive: boolean) => {
    switch (iconType) {
      case "beauty":
        return <Text style={[styles.iconText, isActive && styles.iconActive]}>✨</Text>;
      case "fashion":
        return <Text style={[styles.iconText, isActive && styles.iconActive]}>👗</Text>;
      case "food":
        return <Text style={[styles.iconText, isActive && styles.iconActive]}>☕</Text>;
      case "home":
        return <Text style={[styles.iconText, isActive && styles.iconActive]}>🏠</Text>;
      case "more":
        return <Text style={[styles.iconText, isActive && styles.iconActive]}>➕</Text>;
      default:
        return <Text style={[styles.iconText, isActive && styles.iconActive]}>✨</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Top Categories</Text>
        <Pressable onPress={onViewAllPress}>
          <Text style={styles.viewAllText}>View All</Text>
        </Pressable>
      </View>

      <View style={styles.categoriesRow}>
        {categories.map((cat) => {
          const isSelected = cat.id === selectedCategoryId;
          return (
            <Pressable
              key={cat.id}
              style={styles.categoryItem}
              onPress={() => onSelectCategory(cat)}
            >
              <View
                style={[
                  styles.circle,
                  isSelected && styles.circleActive,
                ]}
              >
                {renderCategoryIcon(cat.iconType, isSelected)}
              </View>
              <Text
                style={[
                  styles.categoryLabel,
                  isSelected && styles.categoryLabelActive,
                ]}
              >
                {cat.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#D1006C",
  },
  categoriesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryItem: {
    alignItems: "center",
    width: 60,
  },
  circle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFF1F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#FCE7F3",
  },
  circleActive: {
    backgroundColor: "#D1006C",
    borderColor: "#D1006C",
    shadowColor: "#D1006C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
  },
  iconText: {
    fontSize: 20,
  },
  iconActive: {
    transform: [{ scale: 1.05 }],
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4B5563",
    textAlign: "center",
  },
  categoryLabelActive: {
    fontWeight: "700",
    color: "#D1006C",
  },
});

