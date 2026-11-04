import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { BusinessItem } from "../types/home.types";

interface FeaturedBusinessesProps {
  businesses: BusinessItem[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onBusinessPress?: (business: BusinessItem) => void;
  onViewAllPress?: () => void;
}

export default function FeaturedBusinesses({
  businesses,
  savedIds,
  onToggleSave,
  onBusinessPress,
  onViewAllPress,
}: FeaturedBusinessesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Featured Businesses</Text>
        <Pressable onPress={onViewAllPress}>
          <Text style={styles.viewAllText}>View All</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {businesses.map((item) => {
          const isSaved = savedIds.includes(item.id);
          return (
            <Pressable
              key={item.id}
              style={styles.card}
              onPress={() => onBusinessPress && onBusinessPress(item)}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <Pressable
                  style={styles.saveBadge}
                  onPress={() => onToggleSave(item.id)}
                >
                  <Text style={styles.heartText}>{isSaved ? "💖" : "🤍"}</Text>
                </Pressable>
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.nameText} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.categoryText} numberOfLines={1}>
                  {item.category}
                </Text>

                <View style={styles.ratingRow}>
                  <Text style={styles.ratingText}>
                    ⭐ {item.rating}{" "}
                    <Text style={styles.reviewsText}>({item.reviewsCount})</Text>
                  </Text>
                </View>

                <View style={styles.locationRow}>
                  <Text style={styles.locationText} numberOfLines={1}>
                    📍 {item.location}
                  </Text>
                </View>
              </View>
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
    marginVertical: 12,
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: "#F3F4F6",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: 120,
    position: "relative",
    backgroundColor: "#F3F4F6",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  saveBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  heartText: {
    fontSize: 13,
  },
  infoContainer: {
    padding: 11,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  categoryText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  ratingRow: {
    marginTop: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },
  reviewsText: {
    color: "#9CA3AF",
    fontWeight: "400",
  },
  locationRow: {
    marginTop: 4,
  },
  locationText: {
    fontSize: 11.5,
    color: "#6B7280",
  },
});

