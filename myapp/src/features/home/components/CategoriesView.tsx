import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CategoryItem } from "../types/home.types";

interface CategoriesViewProps {
  categories: CategoryItem[];
  onSelectCategory: (category: CategoryItem) => void;
}

export default function CategoriesView({
  categories,
  onSelectCategory,
}: CategoriesViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore All Categories</Text>
      <Text style={styles.subheading}>
        Discover women-led ventures across diverse industries
      </Text>

      <View style={styles.list}>
        {categories.map((c) => (
          <Pressable
            key={c.id}
            style={({ pressed }) => [
              styles.itemRow,
              pressed && styles.itemRowPressed,
            ]}
            onPress={() => onSelectCategory(c)}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>
                {c.iconType === "beauty"
                  ? "✨"
                  : c.iconType === "fashion"
                  ? "👗"
                  : c.iconType === "food"
                  ? "☕"
                  : c.iconType === "home"
                  ? "🏠"
                  : "➕"}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{c.name}</Text>
              <Text style={styles.subtitle}>
                Browse verified women entrepreneurs in {c.name.toLowerCase()}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#D1006C",
    textAlign: "center",
  },
  subheading: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  list: {
    gap: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.2,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  itemRowPressed: {
    backgroundColor: "#FFF1F5",
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconText: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: "#D1006C",
    fontWeight: "600",
  },
});

