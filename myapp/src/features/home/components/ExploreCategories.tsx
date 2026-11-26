import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "@/shared/theme/colors";
import { CATEGORY_SVGS } from "../data/categoryIcons";

// ======================================
// DESIGN NOTES
// - Multicolor, filled SVG icons (see categoryIcons.ts), one per category.
// - Icons sit on a clean light tile so their own colors stand out.
// - No internet images, so icons are always sharp and never fail to load.
// ======================================

interface CategoryItem {
  id: string;
  name: string;
  svg: keyof typeof CATEGORY_SVGS;
}

interface ExploreCategoriesProps {
  categories?: any[];
  onSelectCategory?: (category: any) => void;
  onViewAll?: () => void;
}

const ALL_CATEGORIES: CategoryItem[] = [
  { id: "1", name: "Jewellery", svg: "jewellery" },
  { id: "2", name: "Fashion", svg: "fashion" },
  { id: "3", name: "Beauty & Spa", svg: "beauty" },
  { id: "4", name: "Food", svg: "food" },
  { id: "5", name: "Textiles", svg: "textiles" },
  { id: "6", name: "Women Business", svg: "women" },
  { id: "7", name: "Organic & Grocery", svg: "organic" },
  { id: "8", name: "Bakery", svg: "bakery" },
  { id: "9", name: "Makeup Artist", svg: "makeup" },
  { id: "10", name: "Salon & Ayurveda", svg: "salon" },
  { id: "11", name: "Corporate Gifting", svg: "gifting" },
  { id: "12", name: "Home Decor", svg: "decor" },
  { id: "13", name: "Education", svg: "education" },
  { id: "14", name: "Photography", svg: "photography" },
  { id: "15", name: "Interior Design", svg: "interior" },
  { id: "16", name: "Travel", svg: "travel" },
  { id: "17", name: "Healthcare", svg: "healthcare" },
  { id: "18", name: "Handmade Crafts", svg: "crafts" },
  { id: "19", name: "Event Management", svg: "events" },
  { id: "20", name: "Professional Services", svg: "services" },
];

// ======================================
// SIZE CONFIGURATION
// ======================================

const COLUMNS = 4;
const SIDE_PADDING = 15;
const GAP = 10;

const VISIBLE_TILES = 12; // 11 categories + 1 "See more"
const VISIBLE_CATEGORIES = VISIBLE_TILES - 1;

const ARROW_BUTTON_SIZE = 34;
const ARROW_ICON_SIZE = 22;
const ICON_BOX_SIZE = 60;
const ICON_SIZE = 38;

export default function ExploreCategories({
  onSelectCategory,
  onViewAll,
}: ExploreCategoriesProps) {
  const { width } = useWindowDimensions();
  const [expanded, setExpanded] = useState(false);

  const itemWidth =
    (width - SIDE_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  const visibleCategories = expanded
    ? ALL_CATEGORIES
    : ALL_CATEGORIES.slice(0, VISIBLE_CATEGORIES);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Explore Categories</Text>

        <Pressable
          onPress={() => onViewAll?.()}
          hitSlop={8}
          style={({ pressed }) => [
            styles.arrowButton,
            pressed && styles.arrowButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="View all categories"
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={ARROW_ICON_SIZE}
            color={COLORS.brand}
          />
        </Pressable>
      </View>

      {/* CATEGORY GRID */}
      <View style={styles.grid}>
        {visibleCategories.map((cat) => (
          <Pressable
            key={cat.id}
            style={({ pressed }) => [
              styles.itemWrap,
              { width: itemWidth },
              pressed && styles.itemPressed,
            ]}
            onPress={() => onSelectCategory?.(cat)}
            accessibilityRole="button"
            accessibilityLabel={cat.name}
          >
            <View style={[styles.iconBox, styles.tile]}>
              <SvgXml
                xml={CATEGORY_SVGS[cat.svg]}
                width={ICON_SIZE}
                height={ICON_SIZE}
              />
            </View>

            <Text style={styles.label} numberOfLines={2}>
              {cat.name}
            </Text>
          </Pressable>
        ))}

        {/* SEE MORE / SEE LESS TILE */}

        <Pressable
          style={({ pressed }) => [
            styles.itemWrap,
            { width: itemWidth },
            pressed && styles.itemPressed,
          ]}
          onPress={() => setExpanded((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel={
            expanded ? "See less categories" : "See more categories"
          }
        >
          <View style={[styles.iconBox, styles.seeMoreBox]}>
            <MaterialCommunityIcons
              name={expanded ? "chevron-up" : "view-grid-plus-outline"}
              size={30}
              color="#FFFFFF"
            />
          </View>

          <Text style={[styles.label, styles.seeMoreLabel]} numberOfLines={2}>
            {expanded ? "See less" : "See more"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ======================================
// STYLES
// ======================================

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 17,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIDE_PADDING,
    marginBottom: 14,
    minHeight: ARROW_BUTTON_SIZE,
  },

  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
    fontFamily: "Georgia",
    color: "#211921",
    letterSpacing: -0.4,
  },

  arrowButton: {
    width: ARROW_BUTTON_SIZE,
    height: ARROW_BUTTON_SIZE,
    borderRadius: ARROW_BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },

  arrowButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.94 }],
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SIDE_PADDING,
    columnGap: GAP,
    rowGap: 10,
  },

  itemWrap: {
    alignItems: "center",
  },

  itemPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },

  iconBox: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
    borderRadius: ICON_BOX_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  // Clean light tile so the multicolor icons stand out
  tile: {
    backgroundColor: "#F7F8FA",
    borderWidth: 1,
    borderColor: "#ECEEF2",
  },

  // "See more" tile (solid brand color)
  seeMoreBox: {
    backgroundColor: COLORS.brand,
    shadowColor: COLORS.brand,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  seeMoreLabel: {
    color: COLORS.brand,
  },

  label: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#29232B",
    textAlign: "center",
    lineHeight: 15,
    minHeight: 30,
  },
});