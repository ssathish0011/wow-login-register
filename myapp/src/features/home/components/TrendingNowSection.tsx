import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/common/constants/colors";
import { TrendingItem } from "../types/home.types";

interface TrendingNowSectionProps {
  items: TrendingItem[];
  onViewMore?: () => void;
  onSelectItem?: (item: TrendingItem) => void;
}

// Accept either a remote URL (string) or a local require() asset.
const getImageSource = (
  src: string | ImageSourcePropType
): ImageSourcePropType => (typeof src === "string" ? { uri: src } : src);

export default function TrendingNowSection({
  items,
  onViewMore,
  onSelectItem,
}: TrendingNowSectionProps) {
  const { width } = useWindowDimensions();

  // ✅ SAME sizing as ServiceShowcaseSection
  const cardWidth = Math.min(155, Math.max(125, width * 0.36));
  const imageHeight = cardWidth * 1.05;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.headerTitleRow}>
            <Ionicons
              name="flame"
              size={22}
              color={COLORS.brand}
              style={styles.headerIcon}
            />
            <Text style={styles.title}>Trending Now</Text>
          </View>
          <Text style={styles.subtitle}>
            Popular categories people are booking near you
          </Text>
        </View>

        <Pressable
          onPress={onViewMore}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="View More Trending"
        >
          <Text style={styles.viewMoreText}>View More →</Text>
        </Pressable>
      </View>

      {/* Horizontal Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.cardShadow,
              { width: cardWidth },
              pressed && styles.cardPressed,
            ]}
            onPress={() => onSelectItem?.(item)}
            accessibilityRole="button"
            accessibilityLabel={item.title.replace(/\n/g, " ")}
          >
            <View style={styles.card}>
              <View style={[styles.imageWrap, { height: imageHeight }]}>
                <Image
                  source={getImageSource(item.imageUrl)}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View pointerEvents="none" style={styles.imageOverlay} />
              </View>

              <View style={styles.nameWrap}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.title.replace(/\n/g, " ")}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const SIDE_PADDING = 15;
const CARD_GAP = 12;
const CARD_RADIUS = 16;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  headerLeft: {
    flex: 1,
    marginRight: 10,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  headerIcon: {
    marginRight: 6,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
    fontFamily: "Georgia",
    color: "#211921",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "500",
    color: "#88818A",
    marginTop: 2,
    marginLeft: 28,
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brand,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: SIDE_PADDING,
    paddingTop: 10,
    paddingBottom: 16,
    gap: CARD_GAP,
  },
  cardShadow: {
    borderRadius: CARD_RADIUS,
    backgroundColor: "#FFFFFF",
    shadowColor: "#211921",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  card: {
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F3EAEE",
  },
  imageWrap: {
    width: "100%",
    backgroundColor: "#FCE7EF",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 45,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  nameWrap: {
    paddingHorizontal: 10,
    paddingVertical: 11,
    minHeight: 48,
    justifyContent: "center",
  },
  name: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: "#29232B",
    letterSpacing: -0.2,
  },
});