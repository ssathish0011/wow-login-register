import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/theme/colors";
import { BusinessItem } from "../types/home.types";

interface BusinessCardProps {
  business: BusinessItem;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onPress?: () => void;
}

export default function BusinessCard({
  business,
  isSaved,
  onToggleSave,
  onPress,
}: BusinessCardProps) {
  const imageUrl = business.imageUrl || business.image;
  const reviewCount = business.reviewsCount ?? (Number(business.reviews) || 0);

  return (
    // Outer view: shadow only (no overflow hidden, so iOS shadow shows)
    <View style={styles.shadowWrap}>
      {/* Inner view: rounded corners and clipping */}
      <View style={styles.card}>
        <Pressable
          style={({ pressed }) => [
            styles.cardPressable,
            pressed && styles.cardPressed,
          ]}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`View ${business.name}`}
        >
          {/* Image */}
          <View style={styles.imageContainer}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>
                  {business.name?.[0]?.toUpperCase() || "?"}
                </Text>
              </View>
            )}

            <View style={styles.imageOverlay} />

            {!!business.category && (
              <View style={styles.categoryChip}>
                <Text style={styles.categoryText} numberOfLines={1}>
                  {business.category}
                </Text>
              </View>
            )}
          </View>

          {/* Details */}
          <View style={styles.infoContainer}>
            <Text style={styles.nameText} numberOfLines={1}>
              {business.name}
            </Text>

            <View style={styles.ratingRow}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text style={styles.ratingText}>
                  {Number(business.rating || 0).toFixed(1)}
                </Text>
              </View>

              <Text style={styles.reviewsText} numberOfLines={1}>
                {reviewCount} reviews
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color={COLORS.brand}
              />
              <Text style={styles.locationText} numberOfLines={1}>
                {business.location || "Location unavailable"}
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Favourite button */}
        <Pressable
          style={({ pressed }) => [
            styles.saveBadge,
            isSaved && styles.savedBadge,
            pressed && styles.saveBadgePressed,
          ]}
          onPress={() => onToggleSave(business.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={
            isSaved ? "Remove from favourites" : "Add to favourites"
          }
          accessibilityState={{ selected: isSaved }}
        >
          <Ionicons
            name={isSaved ? "heart" : "heart-outline"}
            size={19}
            color={isSaved ? COLORS.brand : "#333333"}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    width: "100%",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 9,
    elevation: 3,
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F0DDE5",
    overflow: "hidden",
  },

  cardPressable: {
    width: "100%",
  },

  cardPressed: {
    opacity: 0.94,
  },

  imageContainer: {
    width: "100%",
    height: 142,
    backgroundColor: "#FCE7EF",
    position: "relative",
    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCE7EF",
  },

  placeholderText: {
    fontSize: 42,
    fontWeight: "800",
    color: COLORS.brand,
  },

  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 35,
    backgroundColor: "rgba(0,0,0,0.08)",
  },

  categoryChip: {
    position: "absolute",
    bottom: 9,
    left: 9,
    maxWidth: "78%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.96)",
  },

  categoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.brand,
  },

  saveBadge: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 4,
  },

  savedBadge: {
    backgroundColor: "#FFF0F5",
  },

  saveBadgePressed: {
    transform: [{ scale: 0.88 }],
  },

  infoContainer: {
    paddingHorizontal: 11,
    paddingTop: 11,
    paddingBottom: 12,
  },

  nameText: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.ink,
    letterSpacing: -0.25,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E8",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 3,
  },

  ratingText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#333333",
  },

  reviewsText: {
    fontSize: 10,
    color: "#929292",
    flexShrink: 1,
  },

  divider: {
    height: 1,
    backgroundColor: "#F2EDF0",
    marginVertical: 9,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  locationText: {
    flex: 1,
    fontSize: 11,
    color: "#777777",
    fontWeight: "500",
  },
});