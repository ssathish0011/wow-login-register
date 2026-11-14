import React, { useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "@/shared/theme/colors";

// ======================================
// ICONS8 SETTINGS
// URL pattern: https://img.icons8.com/{style}/{size}/{name}.png
// Styles you can try: "color", "fluency", "emoji", "3d-fluency"
// ======================================

const ICONS8_STYLE = "color";
const ICONS8_SIZE = 96; // free CDN limit is about 100px

// Free Icons8 use requires a visible link to icons8.com.
// Keep this true unless you have a paid Icons8 plan.
const SHOW_ICONS8_CREDIT = true;

const icons8Url = (name: string) =>
  `https://img.icons8.com/${ICONS8_STYLE}/${ICONS8_SIZE}/${name}.png`;

// ======================================
// TYPES
// ======================================

type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface CategoryItem {
  id: string;
  name: string;
  icons8: string; // icon name (slug) from icons8.com
  fallback: MaterialIconName; // shown only if the Icons8 image fails to load
}

interface ExploreCategoriesProps {
  categories?: any[];
  onSelectCategory?: (category: any) => void;
  onViewAll?: () => void;
}

// ======================================
// ALL 20 CATEGORIES
// If an icon shows the Material fallback, that Icons8 name is wrong:
// search the icon on icons8.com and copy the name from its page URL.
// ======================================

const ALL_CATEGORIES: CategoryItem[] = [
  { id: "1", name: "Jewellery", icons8: "diamond", fallback: "diamond-stone" },
  { id: "2", name: "Fashion", icons8: "dress", fallback: "hanger" },
  { id: "3", name: "Beauty & Spa", icons8: "spa-flower", fallback: "spa" },
  { id: "4", name: "Food", icons8: "meal", fallback: "silverware-fork-knife" },
  { id: "5", name: "Textiles", icons8: "sewing-machine", fallback: "tshirt-crew" },
  { id: "6", name: "Women Business", icons8: "businesswoman", fallback: "human-female" },
  { id: "7", name: "Organic & Grocery", icons8: "organic-food", fallback: "leaf" },
  { id: "8", name: "Bakery", icons8: "bread", fallback: "cupcake" },
  { id: "9", name: "Makeup Artist", icons8: "lipstick", fallback: "lipstick" },
  { id: "10", name: "Salon & Ayurveda", icons8: "hair-dryer", fallback: "content-cut" },
  { id: "11", name: "Corporate Gifting", icons8: "gift", fallback: "gift" },
  { id: "12", name: "Home Decor", icons8: "vase", fallback: "lamp" },
  { id: "13", name: "Education", icons8: "graduation-cap", fallback: "school" },
  { id: "14", name: "Photography", icons8: "camera", fallback: "camera" },
  { id: "15", name: "Interior Design", icons8: "sofa", fallback: "sofa" },
  { id: "16", name: "Travel", icons8: "airplane-take-off", fallback: "airplane" },
  { id: "17", name: "Healthcare", icons8: "stethoscope", fallback: "stethoscope" },
  { id: "18", name: "Handmade Crafts", icons8: "paint-palette", fallback: "palette" },
  { id: "19", name: "Event Management", icons8: "party-baloons", fallback: "party-popper" },
  { id: "20", name: "Professional Services", icons8: "briefcase", fallback: "briefcase" },
];

// ======================================
// SIZE CONFIGURATION
// Change these values to resize the section
// ======================================

const COLUMNS = 4;
const SIDE_PADDING = 15;
const GAP = 10;

// Tiles shown before "See more": 11 categories + 1 "See more" tile
const VISIBLE_TILES = 12;
const VISIBLE_CATEGORIES = VISIBLE_TILES - 1;

const ARROW_BUTTON_SIZE = 30; // round arrow button (touch + visual size)
const ARROW_ICON_SIZE = 22; // chevron inside the button
const ICON_BOX_SIZE = 56; // rounded box that holds each icon
const ICON_IMAGE_SIZE = 38; // Icons8 image size inside the box
const FALLBACK_ICON_SIZE = 26; // Material fallback / See more icon size

// ======================================
// SINGLE CATEGORY ICON (Icons8 -> Material fallback)
// ======================================

function CategoryIcon({ item }: { item: CategoryItem }) {
  const [failed, setFailed] = useState(false);

  return (
    <View style={[styles.iconBox, styles.softBox]}>
      {failed ? (
        <MaterialCommunityIcons
          name={item.fallback}
          size={FALLBACK_ICON_SIZE}
          color={COLORS.brand}
        />
      ) : (
        <Image
          source={{ uri: icons8Url(item.icons8) }}
          style={styles.iconImage}
          resizeMode="contain"
          onError={() => setFailed(true)}
        />
      )}
    </View>
  );
}

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
            <CategoryIcon item={cat} />

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
              name={expanded ? "chevron-up" : "view-grid-plus"}
              size={FALLBACK_ICON_SIZE}
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
    marginRight: 8,
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
    rowGap: 8,
  },

  itemWrap: {
    alignItems: "center",
  },

  itemPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },

  iconBox: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  iconImage: {
    width: ICON_IMAGE_SIZE,
    height: ICON_IMAGE_SIZE,
  },

  // Soft rounded box behind each colored icon
  softBox: {
    borderRadius: 18,
    backgroundColor: "#FFF6F9",
    borderWidth: 1,
    borderColor: "#F8D4E2",
  },

  // "See more" tile (solid brand color)
  seeMoreBox: {
    borderRadius: 18,
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
    fontSize: 13,
    fontWeight: "600",
    color: "#29232B",
    textAlign: "center",
    lineHeight: 15,
    minHeight: 30,
  },

  credit: {
    alignSelf: "center",
    marginTop: 12,
  },

  creditText: {
    fontSize: 10,
    color: "#9A93A0",
    textDecorationLine: "underline",
  },
});