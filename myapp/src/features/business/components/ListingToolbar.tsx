import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/common/constants/colors";
import { SortOption } from "../types/business.types";

interface ListingToolbarProps {
  heading: string;
  totalCount: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
  isDesktop: boolean;
}

const SORT_LABELS: Record<SortOption, string> = {
  recommended: "Recommended",
  popular: "Popular",
  rating: "Highest Rated",
  recent: "Recently Added",
  nearest: "Nearest First",
};

export default function ListingToolbar({
  heading,
  totalCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenFilters,
  activeFilterCount = 0,
  isDesktop,
}: ListingToolbarProps) {
  const [sortModalVisible, setSortModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Title & Count */}
      <View style={styles.titleGroup}>
        <Text style={styles.heading}>{heading}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{totalCount} businesses found</Text>
        </View>
      </View>

      {/* Controls: Filter (Mobile), Sort Dropdown, Grid/List view toggle */}
      <View style={styles.controlsGroup}>
        {/* Mobile Filter Button */}
        {!isDesktop && onOpenFilters && (
          <Pressable
            style={[
              styles.filterBtn,
              activeFilterCount > 0 && styles.filterBtnActive,
            ]}
            onPress={onOpenFilters}
            accessibilityRole="button"
          >
            <Ionicons
              name="filter"
              size={14}
              color={activeFilterCount > 0 ? WOW_COLORS.white : WOW_COLORS.primaryPink}
            />
            <Text
              style={[
                styles.filterBtnText,
                activeFilterCount > 0 && styles.filterBtnTextActive,
              ]}
            >
              Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
            </Text>
          </Pressable>
        )}

        {/* Sort Trigger */}
        <Pressable
          style={styles.sortBtn}
          onPress={() => setSortModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Sort businesses"
        >
          <Ionicons name="swap-vertical" size={14} color={WOW_COLORS.secondaryText} />
          <Text style={styles.sortBtnText}>Sort: </Text>
          <Text style={styles.sortBtnTextHighlight}>{SORT_LABELS[sortBy]}</Text>
          <Ionicons name="chevron-down" size={14} color={WOW_COLORS.secondaryText} />
        </Pressable>

        {/* View Toggle */}
        <View style={styles.toggleGroup}>
          <Pressable
            style={[styles.toggleBtn, viewMode === "list" && styles.toggleBtnActive]}
            onPress={() => onViewModeChange("list")}
            accessibilityRole="button"
            accessibilityLabel="List View"
          >
            <Ionicons
              name="list"
              size={16}
              color={viewMode === "list" ? WOW_COLORS.primaryPink : WOW_COLORS.secondaryText}
            />
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, viewMode === "grid" && styles.toggleBtnActive]}
            onPress={() => onViewModeChange("grid")}
            accessibilityRole="button"
            accessibilityLabel="Grid View"
          >
            <Ionicons
              name="grid"
              size={16}
              color={viewMode === "grid" ? WOW_COLORS.primaryPink : WOW_COLORS.secondaryText}
            />
          </Pressable>
        </View>
      </View>

      {/* Sort Dropdown Modal */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={styles.sortModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort Businesses By</Text>
              <Pressable onPress={() => setSortModalVisible(false)}>
                <Ionicons name="close" size={20} color={WOW_COLORS.secondaryText} />
              </Pressable>
            </View>

            {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => {
              const isSelected = sortBy === option;
              return (
                <Pressable
                  key={option}
                  style={[
                    styles.sortOptionRow,
                    isSelected && styles.sortOptionRowActive,
                  ]}
                  onPress={() => {
                    onSortChange(option);
                    setSortModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      isSelected && styles.sortOptionTextActive,
                    ]}
                  >
                    {SORT_LABELS[option]}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={WOW_COLORS.primaryPink}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: WOW_COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 12,
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
  },
  countBadge: {
    backgroundColor: WOW_COLORS.softPink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: "700",
    color: WOW_COLORS.primaryPink,
  },
  controlsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: WOW_COLORS.softPink,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: WOW_COLORS.primaryPink,
  },
  filterBtnActive: {
    backgroundColor: WOW_COLORS.primaryPink,
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: WOW_COLORS.primaryPink,
  },
  filterBtnTextActive: {
    color: WOW_COLORS.white,
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  sortBtnText: {
    fontSize: 12,
    color: WOW_COLORS.secondaryText,
  },
  sortBtnTextHighlight: {
    fontSize: 12,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  toggleGroup: {
    flexDirection: "row",
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  toggleBtnActive: {
    backgroundColor: WOW_COLORS.softPink,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  sortModalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: WOW_COLORS.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  sortOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  sortOptionRowActive: {
    backgroundColor: WOW_COLORS.softPink,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: WOW_COLORS.primaryText,
  },
  sortOptionTextActive: {
    fontWeight: "700",
    color: WOW_COLORS.primaryPink,
  },
});

