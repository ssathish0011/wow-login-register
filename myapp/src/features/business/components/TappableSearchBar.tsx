import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/shared/theme/colors";

interface TappableSearchBarProps {
  query?: string;
  onPressSearch: () => void;
  onPressFilter: () => void;
  activeFilterCount?: number;
}

export default function TappableSearchBar({
  query = "",
  onPressSearch,
  onPressFilter,
  activeFilterCount = 0,
}: TappableSearchBarProps) {
  return (
    <View style={styles.container}>
      {/* Tappable Search Box */}
      <Pressable
        style={styles.searchBox}
        onPress={onPressSearch}
        accessibilityRole="button"
        accessibilityLabel="Open search"
      >
        <Ionicons name="search" size={18} color={WOW_COLORS.primaryPink} style={styles.searchIcon} />
        <Text style={[styles.placeholderText, !!query && styles.activeQueryText]} numberOfLines={1}>
          {query ? query : "Search for services, businesses, products..."}
        </Text>

        {/* Mic Icon */}
        <View style={styles.micCircle}>
          <Ionicons name="mic" size={14} color={WOW_COLORS.white} />
        </View>
      </Pressable>

      {/* Filter Icon Button */}
      <Pressable
        style={[
          styles.filterBtn,
          activeFilterCount > 0 && styles.filterBtnActive,
        ]}
        onPress={onPressFilter}
        accessibilityRole="button"
        accessibilityLabel="Filter businesses"
      >
        <Ionicons
          name="options-outline"
          size={18}
          color={activeFilterCount > 0 ? WOW_COLORS.white : WOW_COLORS.primaryPink}
        />
        {activeFilterCount > 0 && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: WOW_COLORS.white,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: WOW_COLORS.border,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  placeholderText: {
    flex: 1,
    fontSize: 13,
    color: "#9CA3AF",
  },
  activeQueryText: {
    color: WOW_COLORS.primaryText,
    fontWeight: "700",
  },
  micCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: WOW_COLORS.primaryPink,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WOW_COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  filterBtnActive: {
    backgroundColor: WOW_COLORS.primaryPink,
  },
  filterBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: WOW_COLORS.primaryText,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  filterBadgeText: {
    color: WOW_COLORS.white,
    fontSize: 9,
    fontWeight: "800",
  },
});

