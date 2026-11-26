import React, { useState } from "react";

import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/theme/colors";
import { TrendingItem } from "../types/home.types";

// ======================================
// LOCAL IMAGES
// ======================================

import gift from "../../../../assets/trending/gift.jpg";
import saree from "../../../../assets/trending/saree.jpg";
import food from "../../../../assets/trending/home-food.jpg";
import cafe from "../../../../assets/trending/home-food.jpg";
import house from "../../../../assets/trending/home-food.jpg";
import repair from "../../../../assets/trending/home-food.jpg";

// ======================================
// PROPS
// ======================================

interface TrendingNowSectionProps {
  items?: TrendingItem[];
  onViewMore?: () => void;
  onSelectItem?: (item: TrendingItem) => void;
}

// ======================================
// DEFAULT IMAGES
// ======================================

// Set to true to ignore API images and always show local images (for testing)
const FORCE_TOP_IMAGES = false;

const TOP_IMAGES: ImageSourcePropType[] = [gift, saree, food];

const SAMPLE_ITEMS: TrendingItem[] = [
  {
    id: "t1",
    title: "Glow Beauty Salon & Bridal Makeup",
    imageUrl: gift,
  },
  {
    id: "t2",
    title: "My Saree Boutique",
    imageUrl: saree,
  },
  {
    id: "t3",
    title: "Amma's Kitchen Restaurant",
    imageUrl: food,
  },
  {
    id: "t4",
    title: "Brew & Bites Cafe",
    imageUrl: cafe,
  },
  {
    id: "t5",
    title: "Urban Nest Real Estate",
    imageUrl: house,
  },
  {
    id: "t6",
    title: "SmartFix Mobile & Laptop Repair",
    imageUrl: repair,
  },
];

// ======================================
// IMAGE HELPER
// ======================================

const getImageSource = (src?: any): ImageSourcePropType => {
  // Nothing provided -> local fallback
  if (!src) return gift;

  // String URL from API
  if (typeof src === "string") {
    const url = src.trim();
    if (!url) return gift;

    // Android release builds block plain http
    const safeUrl = url.startsWith("http://")
      ? url.replace("http://", "https://")
      : url;

    // Only accept absolute URLs
    if (!/^(https?:|file:|data:)/.test(safeUrl)) return gift;

    return { uri: safeUrl };
  }

  // Object like { uri: "..." } with an empty/missing uri
  if (typeof src === "object" && !Array.isArray(src) && "uri" in src) {
    if (!src.uri) return gift;
  }

  // Local asset (require / import) or valid { uri }
  return src as ImageSourcePropType;
};

const cleanTitle = (title: string) => title.replace(/\n/g, " ");

const SIDE_PADDING = 16;
const GAP = 10;
const CARD_RADIUS = 18;
const LIST_LIMIT = 3;

// ======================================
// BENTO CARD
// ======================================

function BentoCard({
  item,
  rank,
  width,
  height,
  large,
  onPress,
}: {
  item: TrendingItem;
  rank: number;
  width: number;
  height: number;
  large?: boolean;
  onPress?: (item: TrendingItem) => void;
}) {
  const [failed, setFailed] = useState(false);

  const defaultImage = TOP_IMAGES[rank - 1] || gift;

  const source =
    FORCE_TOP_IMAGES || failed || !item.imageUrl
      ? defaultImage
      : getImageSource(item.imageUrl);

  return (
    <View style={[styles.cardShadow, { width, height }]}>
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { width, height },
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress?.(item)}
      accessibilityRole="button"
      accessibilityLabel={`Number ${rank}. ${cleanTitle(item.title)}`}
    >
      <View style={{ width, height }}>
        {/* Explicit size so the image can never collapse to 0x0 */}
        <Image
          source={source}
          style={[styles.cardImage, { width, height }]}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />

        {/* Bottom overlay */}
        <View pointerEvents="none" style={styles.overlay}>
          <View
            style={[styles.overlayLayer, { height: large ? 150 : 100 }]}
          />
          <View
            style={[styles.overlayLayer, { height: large ? 110 : 74 }]}
          />
          <View
            style={[styles.overlayLayer, { height: large ? 70 : 48 }]}
          />
          <View
            style={[styles.overlayLayer, { height: large ? 36 : 24 }]}
          />
        </View>

        {/* Rank badge */}
        <View style={styles.rankBadge}>
          <Text style={styles.rankBadgeText}>#{rank}</Text>
        </View>

        {/* Trending pill */}
        {large && (
          <View style={styles.trendPill}>
            <Ionicons name="flame" size={12} color="#FFFFFF" />
            <Text style={styles.trendPillText}>Trending</Text>
          </View>
        )}

        {/* Title */}
        <View style={styles.cardTitleWrap} pointerEvents="none">
          <Text
            style={[styles.cardTitle, large && styles.cardTitleLarge]}
            numberOfLines={large ? 3 : 2}
          >
            {cleanTitle(item.title)}
          </Text>
        </View>
      </View>
    </Pressable>
    </View>
  );
}

// ======================================
// RANKED LIST ITEM
// ======================================

function TrendingListRow({
  item,
  rank,
  isLast,
  onPress,
}: {
  item: TrendingItem;
  rank: number;
  isLast: boolean;
  onPress?: (item: TrendingItem) => void;
}) {
  const [failed, setFailed] = useState(false);

  const imageSource = failed ? gift : getImageSource(item.imageUrl);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.listRow,
        !isLast && styles.listRowBorder,
        pressed && styles.listRowPressed,
      ]}
      onPress={() => onPress?.(item)}
      accessibilityRole="button"
      accessibilityLabel={`Number ${rank}. ${cleanTitle(item.title)}`}
    >
      <Text style={styles.listRank}>{rank}</Text>

      <Image
        source={imageSource}
        style={styles.listThumb}
        resizeMode="cover"
        onError={() => setFailed(true)}
      />

      <View style={styles.listTextWrap}>
        <Text style={styles.listTitle} numberOfLines={2}>
          {cleanTitle(item.title)}
        </Text>

        <View style={styles.listMeta}>
          <Ionicons name="trending-up" size={12} color={COLORS.brand} />
          <Text style={styles.listMetaText}>Trending</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#B9AEB7" />
    </Pressable>
  );
}

// ======================================
// MAIN SECTION
// ======================================

export default function TrendingNowSection({
  items,
  onViewMore,
  onSelectItem,
}: TrendingNowSectionProps) {
  const { width } = useWindowDimensions();

  // API data or local sample data
  const data = items && items.length > 0 ? items : SAMPLE_ITEMS;

  // Responsive dimensions
  const gridWidth = width - SIDE_PADDING * 2;

  const bigWidth = Math.round((gridWidth - GAP) * 0.56);
  const smallWidth = gridWidth - GAP - bigWidth;

  const gridHeight = Math.round(bigWidth * 1.12);
  const smallHeight = Math.round((gridHeight - GAP) / 2);

  const [first, second, third] = data;

  const listItems = data.slice(3, 3 + LIST_LIMIT);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Pressable
        style={styles.headerRow}
        onPress={onViewMore}
        accessibilityRole="button"
        accessibilityLabel="View all trending"
      >
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Trending Now</Text>
        </View>

        <View style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View all</Text>
          <Ionicons name="chevron-forward" size={15} color={COLORS.brand} />
        </View>
      </Pressable>

      {/* Bento grid */}
      {first && (
        <View style={styles.grid}>
          <BentoCard
            item={first}
            rank={1}
            width={bigWidth}
            height={gridHeight}
            large
            onPress={onSelectItem}
          />

          <View style={[styles.rightCol, { width: smallWidth }]}>
            {second && (
              <BentoCard
                item={second}
                rank={2}
                width={smallWidth}
                height={smallHeight}
                onPress={onSelectItem}
              />
            )}

            {third && (
              <BentoCard
                item={third}
                rank={3}
                width={smallWidth}
                height={smallHeight}
                onPress={onSelectItem}
              />
            )}
          </View>
        </View>
      )}

      {/* Ranked list */}
      {listItems.length > 0 && (
        <View style={styles.listCard}>
          {listItems.map((item, index) => (
            <TrendingListRow
              key={item.id}
              item={item}
              rank={index + 4}
              isLast={index === listItems.length - 1}
              onPress={onSelectItem}
            />
          ))}
        </View>
      )}
    </View>
  );
}

// ======================================
// STYLES
// ======================================

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIDE_PADDING,
    marginBottom: 10,
  },

  headerLeft: {
    flex: 1,
    marginRight: 10,
  },

  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
    fontFamily: "Georgia",
    color: "#211921",
    letterSpacing: -0.4,
  },

  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  viewAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brand,
  },

  // Grid
  grid: {
    flexDirection: "row",
    gap: GAP,
    paddingHorizontal: SIDE_PADDING,
    paddingBottom: 6,
  },

  rightCol: {
    gap: GAP,
  },

  // Card
  cardShadow: {
    borderRadius: CARD_RADIUS,
    backgroundColor: "#FFFFFF",
    shadowColor: "#211921",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },

  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },

  // Fills the Pressable so image, overlay and badges stack reliably
  card: {
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: "#FCE7EF",
  },

  cardImage: {
    position: "absolute",
    top: 0,
    left: 0,
  },

  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },

  overlayLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(20, 12, 20, 0.22)",
  },

  rankBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    minWidth: 30,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.94)",
    alignItems: "center",
    justifyContent: "center",
  },

  rankBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.brand,
  },

  trendPill: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.brand,
  },

  trendPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  cardTitleWrap: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 11,
  },

  cardTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.1,
  },

  cardTitleLarge: {
    fontSize: 19,
    lineHeight: 24,
    fontFamily: "Georgia",
    letterSpacing: -0.3,
  },

  // Ranked list
  listCard: {
    marginHorizontal: SIDE_PADDING,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F3EAEE",
    shadowColor: "#211921",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },

  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  listRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F6EEF2",
  },

  listRowPressed: {
    backgroundColor: "#FFF6F9",
  },

  listRank: {
    width: 22,
    fontSize: 16,
    fontWeight: "800",
    fontFamily: "Georgia",
    color: COLORS.brand,
  },

  listThumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#FCE7EF",
    marginRight: 12,
  },

  listTextWrap: {
    flex: 1,
    marginRight: 8,
  },

  listTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "700",
    color: "#29232B",
    letterSpacing: -0.1,
  },

  listMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },

  listMetaText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#88818A",
  },
});