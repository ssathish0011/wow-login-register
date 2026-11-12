
import React, { memo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/common/constants/colors";

export type QuickFilterId =
  | "all"
  | "verified"
  | "womenOwned"
  | "topRated"
  | "openNow"
  | "premium";

interface BusinessQuickFiltersProps {
  activeQuickFilter: QuickFilterId;
  onSelectQuickFilter: (id: QuickFilterId) => void;
  onOpenSortSheet: () => void;
  onOpenFilterSheet: () => void;
  activeFilterCount?: number;
  currentSortLabel?: string;
}

type IonName = React.ComponentProps<typeof Ionicons>["name"];

const PINK = WOW_COLORS?.primaryPink ?? "#D91B68";

const C = {
  primary: PINK,
  primaryLight: "#FCEAF2",
  primaryBorder: "#F3C5D8",
  text: "#242832",
  muted: "#7A818D",
  border: "#E6E8ED",
  white: "#FFFFFF",
  background: "#F7F8FA",
  blue: "#2878CF",
  amber: "#D99416",
  green: "#21965C",
  purple: "#8252C7",
};

const CHIPS: {
  id: QuickFilterId;
  label: string;
  icon?: IonName;
  tint?: string;
}[] = [
    { id: "all", label: "All" },
    { id: "verified", label: "Verified", icon: "shield-checkmark", tint: C.blue },
    { id: "womenOwned", label: "Women Owned", icon: "woman", tint: C.primary },
    { id: "topRated", label: "Top Rated", icon: "star", tint: C.amber },
    { id: "openNow", label: "Open Now", icon: "time", tint: C.green },
    { id: "premium", label: "Premium", icon: "ribbon", tint: C.purple },
  ];

function BusinessQuickFilters({
  activeQuickFilter,
  onSelectQuickFilter,
  onOpenSortSheet,
  onOpenFilterSheet,
  activeFilterCount = 0,
  currentSortLabel = "Sort",
}: BusinessQuickFiltersProps) {
  const hasFilters = activeFilterCount > 0;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ALL FILTERS */}
        <Pressable
          onPress={onOpenFilterSheet}
          accessibilityRole="button"
          accessibilityLabel={
            hasFilters
              ? `Open all filters, ${activeFilterCount} applied`
              : "Open all filters"
          }
          style={({ pressed }) => [
            styles.actionChip,
            hasFilters && styles.filterActive,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="options-outline"
            size={16}
            color={C.primary}
          />

          <Text style={styles.filterText}>Filters</Text>

          {hasFilters && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>

        {/* SORT */}
        <Pressable
          onPress={onOpenSortSheet}
          accessibilityRole="button"
          accessibilityLabel={`Sort by ${currentSortLabel}`}
          style={({ pressed }) => [
            styles.actionChip,
            styles.sortChip,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="swap-vertical"
            size={16}
            color={C.text}
          />

          <Text
            style={styles.sortText}
            numberOfLines={1}
          >
            {currentSortLabel}
          </Text>

          <Ionicons
            name="chevron-down"
            size={13}
            color={C.muted}
          />
        </Pressable>

        <View style={styles.divider} />

        {/* QUICK FILTERS */}
        {CHIPS.map((chip) => {
          const selected = activeQuickFilter === chip.id;

          return (
            <Pressable
              key={chip.id}
              onPress={() => onSelectQuickFilter(chip.id)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={chip.label}
              style={({ pressed }) => [
                styles.quickChip,
                selected && styles.quickChipSelected,
                pressed && styles.pressed,
              ]}
            >
              {chip.icon && (
                <Ionicons
                  name={chip.icon}
                  size={14}
                  color={selected ? C.white : chip.tint || C.primary}
                />
              )}

              <Text
                style={[
                  styles.quickChipText,
                  selected && styles.quickChipTextSelected,
                ]}
              >
                {chip.label}
              </Text>

              {selected && (
                <Ionicons
                  name="checkmark"
                  size={13}
                  color={C.white}
                />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default memo(BusinessQuickFilters);

const styles = StyleSheet.create({
  container: {
    backgroundColor: C.white,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#ECEEF2",
    elevation: 2,
    shadowColor: "#172033",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.035,
    shadowRadius: 5,
  },

  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 9,
  },

  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.97 }],
  },

  // Filters and Sort buttons
  actionChip: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 9,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
  },

  filterActive: {
    backgroundColor: C.primaryLight,
    borderColor: C.primaryBorder,
  },

  filterText: {
    color: C.primary,
    fontSize: 12.5,
    fontWeight: "700",
  },

  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.primary,
  },

  countText: {
    color: C.white,
    fontSize: 10,
    fontWeight: "800",
  },

  sortChip: {
    maxWidth: 135,
  },

  sortText: {
    maxWidth: 85,
    color: C.text,
    fontSize: 12.5,
    fontWeight: "600",
  },

  divider: {
    width: 1,
    height: 23,
    backgroundColor: C.border,
    marginHorizontal: 2,
  },

  // Justdial-inspired quick filter pills
  quickChip: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 13,
    borderRadius: 9,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: "#DFE3E9",
  },

  quickChipSelected: {
    backgroundColor: C.primary,
    borderColor: C.primary,
    elevation: 2,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },

  quickChipText: {
    color: "#424954",
    fontSize: 12.5,
    fontWeight: "600",
  },

  quickChipTextSelected: {
    color: C.white,
    fontWeight: "700",
  },
});
