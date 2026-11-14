import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/shared/theme/colors";
import {
  BUSINESS_CATEGORIES,
  CITIES_LIST,
  SERVICES_FILTER_LIST,
} from "../data/businessListingData";

interface FilterSidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  selectedSubcategory: string | null;
  onSelectSubcategory: (subcat: string | null) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  minRating: number | null;
  onSelectRating: (rating: number | null) => void;
  womenOwnedOnly: boolean;
  onToggleWomenOwned: (val: boolean) => void;
  verifiedOnly: boolean;
  onToggleVerified: (val: boolean) => void;
  premiumOnly: boolean;
  onTogglePremium: (val: boolean) => void;
  selectedServices: string[];
  onToggleService: (service: string) => void;
  onClearAll: () => void;
  // Modal mode props
  isModal?: boolean;
  visible?: boolean;
  onClose?: () => void;
}

export default function FilterSidebar({
  selectedCategory,
  onSelectCategory,
  selectedSubcategory,
  onSelectSubcategory,
  selectedCity,
  onSelectCity,
  minRating,
  onSelectRating,
  womenOwnedOnly,
  onToggleWomenOwned,
  verifiedOnly,
  onToggleVerified,
  premiumOnly,
  onTogglePremium,
  selectedServices,
  onToggleService,
  onClearAll,
  isModal = false,
  visible = false,
  onClose,
}: FilterSidebarProps) {
  // Collapsible category accordion state: keep track of which category is expanded
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    [selectedCategory || "Beauty & Wellness"]: true,
  });

  const toggleCategoryExpand = (catName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const content = (
    <View style={styles.container}>
      {/* Sidebar Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleWrap}>
          <Ionicons name="filter-outline" size={18} color={WOW_COLORS.primaryPink} />
          <Text style={styles.headerTitle}>Filter Businesses</Text>
        </View>
        <Pressable
          onPress={onClearAll}
          style={styles.clearBtn}
          accessibilityRole="button"
          accessibilityLabel="Clear all filters"
        >
          <Text style={styles.clearBtnText}>Clear All</Text>
        </Pressable>
        {isModal && onClose && (
          <Pressable onPress={onClose} style={styles.modalCloseIcon}>
            <Ionicons name="close" size={22} color={WOW_COLORS.primaryText} />
          </Pressable>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
        {/* 1. BUSINESS CATEGORIES & EXPANDABLE SUBCATEGORIES */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoryAccordionList}>
            {BUSINESS_CATEGORIES.map((cat) => {
              const isCatSelected = selectedCategory === cat.name;
              const isExpanded = !!expandedCategories[cat.name];

              return (
                <View key={cat.id} style={styles.categoryItemWrap}>
                  <Pressable
                    style={[
                      styles.categoryMainRow,
                      isCatSelected && styles.categoryMainRowActive,
                    ]}
                    onPress={() => {
                      if (isCatSelected) {
                        onSelectCategory(null);
                        onSelectSubcategory(null);
                      } else {
                        onSelectCategory(cat.name);
                        onSelectSubcategory(null);
                      }
                      toggleCategoryExpand(cat.name);
                    }}
                    accessibilityRole="button"
                  >
                    <View style={styles.categoryNameRow}>
                      <Ionicons
                        name={cat.iconName}
                        size={16}
                        color={isCatSelected ? WOW_COLORS.primaryPink : WOW_COLORS.secondaryText}
                      />
                      <Text
                        style={[
                          styles.categoryNameText,
                          isCatSelected && styles.categoryNameTextActive,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={14}
                      color={isCatSelected ? WOW_COLORS.primaryPink : WOW_COLORS.secondaryText}
                    />
                  </Pressable>

                  {/* Expandable Subcategories */}
                  {isExpanded && (
                    <View style={styles.subCategoryContainer}>
                      {cat.subcategories.map((subcat) => {
                        const isSubSelected = selectedSubcategory === subcat;
                        return (
                          <Pressable
                            key={subcat}
                            style={[
                              styles.subCategoryRow,
                              isSubSelected && styles.subCategoryRowActive,
                            ]}
                            onPress={() => {
                              onSelectCategory(cat.name);
                              onSelectSubcategory(isSubSelected ? null : subcat);
                            }}
                            accessibilityRole="button"
                          >
                            <View
                              style={[
                                styles.subRadioDot,
                                isSubSelected && styles.subRadioDotActive,
                              ]}
                            />
                            <Text
                              style={[
                                styles.subCategoryText,
                                isSubSelected && styles.subCategoryTextActive,
                              ]}
                            >
                              {subcat}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* 2. LOCATION FILTERS */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.chipWrap}>
            {CITIES_LIST.map((city) => {
              const isSelected = selectedCity === city;
              return (
                <Pressable
                  key={city}
                  style={[styles.filterChip, isSelected && styles.filterChipActive]}
                  onPress={() => onSelectCity(city)}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={city === "All Locations" ? "globe-outline" : "location-outline"}
                    size={13}
                    color={isSelected ? WOW_COLORS.white : WOW_COLORS.primaryText}
                  />
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.filterChipTextActive,
                    ]}
                  >
                    {city}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 3. RATING FILTERS */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Customer Rating</Text>
          <View style={styles.ratingRowGroup}>
            {[
              { label: "5.0", val: 5 },
              { label: "4.0+", val: 4 },
              { label: "3.0+", val: 3 },
            ].map(({ label, val }) => {
              const isSelected = minRating === val;
              return (
                <Pressable
                  key={val}
                  style={[styles.ratingPill, isSelected && styles.ratingPillActive]}
                  onPress={() => onSelectRating(isSelected ? null : val)}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name="star"
                    size={14}
                    color={isSelected ? WOW_COLORS.white : WOW_COLORS.gold}
                  />
                  <Text
                    style={[
                      styles.ratingPillText,
                      isSelected && styles.ratingPillTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 4. BUSINESS TYPE SWITCHES */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Business Type</Text>

          <View style={styles.switchRow}>
            <View style={styles.switchMeta}>
              <View style={styles.switchIconBadgePink}>
                <Ionicons name="woman-outline" size={16} color={WOW_COLORS.primaryPink} />
              </View>
              <Text style={styles.switchLabel}>Women-Owned</Text>
            </View>
            <Switch
              value={womenOwnedOnly}
              onValueChange={onToggleWomenOwned}
              trackColor={{ false: "#E5E7EB", true: WOW_COLORS.softPink }}
              thumbColor={womenOwnedOnly ? WOW_COLORS.primaryPink : "#FFFFFF"}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchMeta}>
              <View style={styles.switchIconBadgeBlue}>
                <Ionicons name="shield-checkmark" size={16} color={WOW_COLORS.blue} />
              </View>
              <Text style={styles.switchLabel}>Verified Businesses</Text>
            </View>
            <Switch
              value={verifiedOnly}
              onValueChange={onToggleVerified}
              trackColor={{ false: "#E5E7EB", true: WOW_COLORS.softPink }}
              thumbColor={verifiedOnly ? WOW_COLORS.primaryPink : "#FFFFFF"}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchMeta}>
              <View style={styles.switchIconBadgeGold}>
                <Ionicons name="ribbon-outline" size={16} color={WOW_COLORS.gold} />
              </View>
              <Text style={styles.switchLabel}>Premium / Sponsored</Text>
            </View>
            <Switch
              value={premiumOnly}
              onValueChange={onTogglePremium}
              trackColor={{ false: "#E5E7EB", true: WOW_COLORS.softPink }}
              thumbColor={premiumOnly ? WOW_COLORS.primaryPink : "#FFFFFF"}
            />
          </View>
        </View>

        {/* 5. SERVICES OFFERED */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Services Offered</Text>
          <View style={styles.chipWrap}>
            {SERVICES_FILTER_LIST.map((service) => {
              const isSelected = selectedServices.includes(service);
              return (
                <Pressable
                  key={service}
                  style={[styles.serviceChip, isSelected && styles.serviceChipActive]}
                  onPress={() => onToggleService(service)}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={isSelected ? "checkbox" : "square-outline"}
                    size={15}
                    color={isSelected ? WOW_COLORS.white : WOW_COLORS.secondaryText}
                  />
                  <Text
                    style={[
                      styles.serviceChipText,
                      isSelected && styles.serviceChipTextActive,
                    ]}
                  >
                    {service}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Mobile Footer Apply Button */}
      {isModal && onClose && (
        <View style={styles.modalFooter}>
          <Pressable style={styles.applyBtn} onPress={onClose} accessibilityRole="button">
            <Text style={styles.applyBtnText}>Apply Filters</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  if (isModal) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>{content}</View>
        </View>
      </Modal>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WOW_COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: WOW_COLORS.border,
    marginBottom: 14,
  },
  headerTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
  },
  clearBtn: {
    backgroundColor: WOW_COLORS.softPink,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  clearBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: WOW_COLORS.primaryPink,
  },
  modalCloseIcon: {
    padding: 4,
    marginLeft: 8,
  },
  scrollBody: {
    paddingBottom: 20,
  },
  filterSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: WOW_COLORS.border,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  categoryAccordionList: {
    gap: 6,
  },
  categoryItemWrap: {
    borderRadius: 8,
    overflow: "hidden",
  },
  categoryMainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: WOW_COLORS.background,
  },
  categoryMainRowActive: {
    backgroundColor: WOW_COLORS.softPink,
  },
  categoryNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  categoryNameText: {
    fontSize: 13,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
  },
  categoryNameTextActive: {
    color: WOW_COLORS.primaryPink,
    fontWeight: "700",
  },
  subCategoryContainer: {
    paddingLeft: 26,
    paddingTop: 6,
    paddingBottom: 4,
    gap: 6,
  },
  subCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 5,
  },
  subCategoryRowActive: {},
  subRadioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: WOW_COLORS.secondaryText,
  },
  subRadioDotActive: {
    backgroundColor: WOW_COLORS.primaryPink,
    transform: [{ scale: 1.4 }],
  },
  subCategoryText: {
    fontSize: 12,
    color: WOW_COLORS.secondaryText,
  },
  subCategoryTextActive: {
    color: WOW_COLORS.primaryPink,
    fontWeight: "700",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
  },
  filterChipActive: {
    backgroundColor: WOW_COLORS.primaryPink,
    borderColor: WOW_COLORS.primaryPink,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: WOW_COLORS.primaryText,
  },
  filterChipTextActive: {
    color: WOW_COLORS.white,
    fontWeight: "700",
  },
  ratingRowGroup: {
    flexDirection: "row",
    gap: 10,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
  },
  ratingPillActive: {
    backgroundColor: WOW_COLORS.gold,
    borderColor: WOW_COLORS.gold,
  },
  ratingPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  ratingPillTextActive: {
    color: WOW_COLORS.white,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  switchMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  switchIconBadgePink: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: WOW_COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
  },
  switchIconBadgeBlue: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  switchIconBadgeGold: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
  },
  serviceChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
  },
  serviceChipActive: {
    backgroundColor: WOW_COLORS.primaryPink,
    borderColor: WOW_COLORS.primaryPink,
  },
  serviceChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: WOW_COLORS.primaryText,
  },
  serviceChipTextActive: {
    color: WOW_COLORS.white,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    height: "85%",
    backgroundColor: WOW_COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  modalFooter: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: WOW_COLORS.border,
  },
  applyBtn: {
    backgroundColor: WOW_COLORS.primaryPink,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  applyBtnText: {
    color: WOW_COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
});

