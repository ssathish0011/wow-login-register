import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/shared/theme/colors";
import { BusinessListingItem } from "../types/business.types";

interface FeaturedBusinessCarouselProps {
  businesses: BusinessListingItem[];
  onSelectBusiness: (business: BusinessListingItem) => void;
  onOpenEnquiry: (business: BusinessListingItem) => void;
}

export default function FeaturedBusinessCarousel({
  businesses,
  onSelectBusiness,
  onOpenEnquiry,
}: FeaturedBusinessCarouselProps) {
  const featured = businesses.filter((b) => b.isFeatured);

  if (featured.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Ionicons name="sparkles" size={14} color={WOW_COLORS.primaryPink} />
          <Text style={styles.title}>Featured Businesses</Text>
        </View>
        <View style={styles.sponsoredTag}>
          <Text style={styles.sponsoredText}>SPONSORED</Text>
        </View>
      </View>

      {/* Horizontal Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {featured.map((item) => (
          <View key={item.id} style={styles.card}>
            <Pressable
              style={styles.cardImageWrap}
              onPress={() => onSelectBusiness(item)}
              accessibilityRole="button"
            >
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
              <View style={styles.badgePill}>
                <Ionicons name="sparkles" size={9} color={WOW_COLORS.white} />
                <Text style={styles.badgeText}>Featured</Text>
              </View>
            </Pressable>

            <View style={styles.cardInfo}>
              <Pressable onPress={() => onSelectBusiness(item)}>
                <Text style={styles.bizName} numberOfLines={1}>
                  {item.name}
                </Text>
              </Pressable>

              <View style={styles.metaRow}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={10} color={WOW_COLORS.white} />
                  <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.locationText} numberOfLines={1}>
                  {item.city}
                </Text>
              </View>

              <Pressable
                style={styles.enquiryBtn}
                onPress={() => onOpenEnquiry(item)}
                accessibilityRole="button"
                accessibilityLabel={`Quick enquiry for ${item.name}`}
              >
                <Ionicons name="mail" size={12} color={WOW_COLORS.primaryPink} />
                <Text style={styles.enquiryBtnText}>Quick Enquiry</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WOW_COLORS.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: WOW_COLORS.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
  },
  sponsoredTag: {
    backgroundColor: WOW_COLORS.softPink,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sponsoredText: {
    fontSize: 9,
    fontWeight: "800",
    color: WOW_COLORS.primaryPink,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 190,
    backgroundColor: WOW_COLORS.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    overflow: "hidden",
  },
  cardImageWrap: {
    width: "100%",
    height: 95,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  badgePill: {
    position: "absolute",
    top: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: WOW_COLORS.primaryPink,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: WOW_COLORS.white,
    fontSize: 9,
    fontWeight: "800",
  },
  cardInfo: {
    padding: 10,
  },
  bizName: {
    fontSize: 13,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: WOW_COLORS.green,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    color: WOW_COLORS.white,
    fontSize: 10,
    fontWeight: "800",
  },
  locationText: {
    fontSize: 11,
    color: WOW_COLORS.secondaryText,
    flex: 1,
  },
  enquiryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: WOW_COLORS.softPink,
    borderWidth: 1,
    borderColor: WOW_COLORS.primaryPink,
    paddingVertical: 6,
    borderRadius: 6,
  },
  enquiryBtnText: {
    color: WOW_COLORS.primaryPink,
    fontSize: 11,
    fontWeight: "700",
  },
});

