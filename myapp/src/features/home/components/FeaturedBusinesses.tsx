import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/theme/colors";
import { BusinessItem } from "../types/home.types";
import BusinessCard from "./BusinessCard";

interface FeaturedBusinessesProps {
  businesses: BusinessItem[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onBusinessPress?: (business: BusinessItem) => void;
  onViewAllPress?: () => void;
  isFiltering?: boolean; // true when a search or category filter is active
  onClearFilters?: () => void;
}

export default function FeaturedBusinesses({
  businesses,
  savedIds,
  onToggleSave,
  onBusinessPress,
  onViewAllPress,
  isFiltering = false,
  onClearFilters,
}: FeaturedBusinessesProps) {
  const savedSet = useMemo(() => new Set(savedIds), [savedIds]);

  return (
    <View style={styles.container}>
      {/* Section Heading */}
      <View style={styles.headerRow}>
        <View style={styles.headingContent}>
          <View style={styles.titleRow}>
            <View style={styles.titleIndicator} />
            <Text style={styles.sectionTitle}>Featured Businesses</Text>
          </View>

          {/* <Text style={styles.sectionSubtitle}>
            Explore top-rated businesses around you
          </Text> */}
        </View>

        <Pressable
          onPress={onViewAllPress}
          style={({ pressed }) => [
            styles.viewAllButton,
            pressed && styles.viewAllPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="View all businesses"
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.brand} />
        </Pressable>
      </View>

      {/* Business Grid */}
      {businesses.length > 0 ? (
        <View style={styles.grid}>
          {businesses.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              <BusinessCard
                business={item}
                isSaved={savedSet.has(item.id)}
                onToggleSave={onToggleSave}
                onPress={() => onBusinessPress?.(item)}
              />
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name={isFiltering ? "search-outline" : "storefront-outline"}
            size={34}
            color={COLORS.brand}
          />

          <Text style={styles.emptyTitle}>
            {isFiltering ? "No businesses found" : "No Featured Businesses"}
          </Text>

          <Text style={styles.emptySubtitle}>
            {isFiltering
              ? "Try a different category or search term."
              : "New businesses will appear here soon."}
          </Text>

          {isFiltering && !!onClearFilters && (
            <Pressable
              onPress={onClearFilters}
              style={({ pressed }) => [
                styles.clearButton,
                pressed && styles.viewAllPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Clear filters"
            >
              <Text style={styles.clearButtonText}>Clear filters</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  headingContent: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  titleIndicator: {
    width: 4,
    height: 19,
    borderRadius: 5,
    backgroundColor: COLORS.brand,
    marginRight: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.ink,
    letterSpacing: -0.4,
  },

  sectionSubtitle: {
    fontSize: 11,
    color: "#888888",
    marginTop: 5,
    marginLeft: 12,
    fontWeight: "500",
  },

  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingLeft: 8,
    gap: 2,
  },

  viewAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brand,
  },

  viewAllPressed: {
    opacity: 0.6,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },

  cardWrapper: {
    width: "48.5%",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 35,
    paddingHorizontal: 15,
    backgroundColor: "#FFF7FA",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F5E2EA",
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.ink,
    marginTop: 10,
  },

  emptySubtitle: {
    fontSize: 12,
    color: "#888888",
    marginTop: 5,
    textAlign: "center",
  },

  clearButton: {
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: COLORS.brand,
  },

  clearButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});