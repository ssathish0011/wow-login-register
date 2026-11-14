import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/shared/theme/colors";
import { SortOption } from "../types/business.types";

interface FilterBarProps {
  sortBy: SortOption;
  onOpenSortSheet: () => void;
  minRating: number | null;
  onToggleMinRating: () => void;
  maxDistance: number | null;
  onToggleDistance: () => void;
  openNowOnly: boolean;
  onToggleOpenNow: () => void;
  verifiedOnly: boolean;
  onToggleVerified: () => void;
  womenOwnedOnly: boolean;
  onToggleWomenOwned: () => void;
  onOpenFullFilterSheet: () => void;
  activeFilterCount: number;
}

const SORT_SHORT: Record<SortOption, string> = {
  recommended: "Recommended",
  popular: "Popular",
  rating: "Top Rated",
  recent: "Recent",
  nearest: "Nearest",
};

export default function FilterBar({
  sortBy,
  onOpenSortSheet,
  minRating,
  onToggleMinRating,
  maxDistance,
  onToggleDistance,
  openNowOnly,
  onToggleOpenNow,
  verifiedOnly,
  onToggleVerified,
  womenOwnedOnly,
  onToggleWomenOwned,
  onOpenFullFilterSheet,
  activeFilterCount,
}: FilterBarProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {/* Full Filters Button */}
        <Pressable
          style={[
            styles.filterPill,
            activeFilterCount > 0 && styles.filterPillActive,
          ]}
          onPress={onOpenFullFilterSheet}
          accessibilityRole="button"
        >
          <Ionicons
            name="options-outline"
            size={14}
            color={activeFilterCount > 0 ? WOW_COLORS.white : WOW_COLORS.primaryPink}
          />
          <Text
            style={[
              styles.filterPillText,
              activeFilterCount > 0 && styles.filterPillTextActive,
            ]}
          >
            Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
          </Text>
        </Pressable>

        {/* Sort Pill */}
        <Pressable
          style={[styles.chip, sortBy !== "recommended" && styles.chipActive]}
          onPress={onOpenSortSheet}
          accessibilityRole="button"
        >
          <Ionicons
            name="swap-vertical"
            size={13}
            color={sortBy !== "recommended" ? WOW_COLORS.white : WOW_COLORS.secondaryText}
          />
          <Text
            style={[
              styles.chipText,
              sortBy !== "recommended" && styles.chipTextActive,
            ]}
          >
            Sort: {SORT_SHORT[sortBy]}
          </Text>
          <Ionicons
            name="chevron-down"
            size={12}
            color={sortBy !== "recommended" ? WOW_COLORS.white : WOW_COLORS.secondaryText}
          />
        </Pressable>

        {/* Rating 4.0+ Pill */}
        <Pressable
          style={[styles.chip, minRating !== null && styles.chipActive]}
          onPress={onToggleMinRating}
          accessibilityRole="button"
        >
          <Ionicons
            name="star"
            size={12}
            color={minRating !== null ? WOW_COLORS.white : WOW_COLORS.gold}
          />
          <Text
            style={[
              styles.chipText,
              minRating !== null && styles.chipTextActive,
            ]}
          >
            4.0+ Star
          </Text>
        </Pressable>

        {/* Distance < 3km Pill */}
        <Pressable
          style={[styles.chip, maxDistance !== null && styles.chipActive]}
          onPress={onToggleDistance}
          accessibilityRole="button"
        >
          <Ionicons
            name="navigate-outline"
            size={12}
            color={maxDistance !== null ? WOW_COLORS.white : WOW_COLORS.secondaryText}
          />
          <Text
            style={[
              styles.chipText,
              maxDistance !== null && styles.chipTextActive,
            ]}
          >
            {"< 3 km"}
          </Text>
        </Pressable>

        {/* Open Now Pill */}
        <Pressable
          style={[styles.chip, openNowOnly && styles.chipActive]}
          onPress={onToggleOpenNow}
          accessibilityRole="button"
        >
          <View
            style={[
              styles.dot,
              { backgroundColor: openNowOnly ? WOW_COLORS.white : WOW_COLORS.green },
            ]}
          />
          <Text
            style={[
              styles.chipText,
              openNowOnly && styles.chipTextActive,
            ]}
          >
            Open Now
          </Text>
        </Pressable>

        {/* Verified Pill */}
        <Pressable
          style={[styles.chip, verifiedOnly && styles.chipActive]}
          onPress={onToggleVerified}
          accessibilityRole="button"
        >
          <Ionicons
            name="shield-checkmark"
            size={12}
            color={verifiedOnly ? WOW_COLORS.white : WOW_COLORS.blue}
          />
          <Text
            style={[
              styles.chipText,
              verifiedOnly && styles.chipTextActive,
            ]}
          >
            Verified
          </Text>
        </Pressable>

        {/* Women-Owned Pill */}
        <Pressable
          style={[styles.chip, womenOwnedOnly && styles.chipActive]}
          onPress={onToggleWomenOwned}
          accessibilityRole="button"
        >
          <Ionicons
            name="woman"
            size={12}
            color={womenOwnedOnly ? WOW_COLORS.white : WOW_COLORS.primaryPink}
          />
          <Text
            style={[
              styles.chipText,
              womenOwnedOnly && styles.chipTextActive,
            ]}
          >
            Women-Owned
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WOW_COLORS.background,
    paddingVertical: 8,
  },
  scrollList: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: WOW_COLORS.white,
    borderWidth: 1.5,
    borderColor: WOW_COLORS.primaryPink,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterPillActive: {
    backgroundColor: WOW_COLORS.primaryPink,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: WOW_COLORS.primaryPink,
  },
  filterPillTextActive: {
    color: WOW_COLORS.white,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: WOW_COLORS.white,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipActive: {
    backgroundColor: WOW_COLORS.primaryPink,
    borderColor: WOW_COLORS.primaryPink,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
  },
  chipTextActive: {
    color: WOW_COLORS.white,
    fontWeight: "700",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

