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

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
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
  openNowOnly: boolean;
  onToggleOpenNow: (val: boolean) => void;
  selectedServices: string[];
  onToggleService: (service: string) => void;
  onClearAll: () => void;
  totalMatchingCount: number;
}

export default function FilterBottomSheet({
  visible,
  onClose,
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
  openNowOnly,
  onToggleOpenNow,
  selectedServices,
  onToggleService,
  onClearAll,
  totalMatchingCount,
}: FilterBottomSheetProps) {
  const [expandedCat, setExpandedCat] = useState<string | null>(selectedCategory);

  const toggleAccordion = (catName: string) => {
    setExpandedCat((prev) => (prev === catName ? null : catName));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
        <View style={styles.sheetContainer}>
          {/* Handle */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleWrap}>
              <Ionicons name="options-outline" size={18} color={WOW_COLORS.primaryPink} />
              <Text style={styles.headerTitle}>Filters</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={WOW_COLORS.primaryText} />
            </Pressable>
          </View>

          {/* Scrollable Filters */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
          >
            {/* 1. Quick Toggles */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>Business Verification</Text>

              <View style={styles.toggleRow}>
                <View style={styles.toggleMeta}>
                  <Ionicons name="woman" size={16} color={WOW_COLORS.primaryPink} />
                  <Text style={styles.toggleLabel}>Women-Owned</Text>
                </View>
                <Switch
                  value={womenOwnedOnly}
                  onValueChange={onToggleWomenOwned}
                  trackColor={{ false: "#E5E7EB", true: WOW_COLORS.softPink }}
                  thumbColor={womenOwnedOnly ? WOW_COLORS.primaryPink : "#FFFFFF"}
                />
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleMeta}>
                  <Ionicons name="shield-checkmark" size={16} color={WOW_COLORS.blue} />
                  <Text style={styles.toggleLabel}>Verified Businesses</Text>
                </View>
                <Switch
                  value={verifiedOnly}
                  onValueChange={onToggleVerified}
                  trackColor={{ false: "#E5E7EB", true: WOW_COLORS.softPink }}
                  thumbColor={verifiedOnly ? WOW_COLORS.primaryPink : "#FFFFFF"}
                />
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleMeta}>
                  <Ionicons name="time" size={16} color={WOW_COLORS.green} />
                  <Text style={styles.toggleLabel}>Open Now</Text>
                </View>
                <Switch
                  value={openNowOnly}
                  onValueChange={onToggleOpenNow}
                  trackColor={{ false: "#E5E7EB", true: WOW_COLORS.softPink }}
                  thumbColor={openNowOnly ? WOW_COLORS.green : "#FFFFFF"}
                />
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleMeta}>
                  <Ionicons name="ribbon" size={16} color={WOW_COLORS.gold} />
                  <Text style={styles.toggleLabel}>Premium / Sponsored</Text>
                </View>
                <Switch
                  value={premiumOnly}
                  onValueChange={onTogglePremium}
                  trackColor={{ false: "#E5E7EB", true: WOW_COLORS.softPink }}
                  thumbColor={premiumOnly ? WOW_COLORS.primaryPink : "#FFFFFF"}
                />
              </View>
            </View>

            {/* 2. Customer Ratings */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>Customer Ratings</Text>
              <View style={styles.ratingRowGroup}>
                {[
                  { label: "5.0 ★", val: 5 },
                  { label: "4.0+ ★", val: 4 },
                  { label: "3.0+ ★", val: 3 },
                ].map(({ label, val }) => {
                  const isSelected = minRating === val;
                  return (
                    <Pressable
                      key={val}
                      style={[styles.ratingPill, isSelected && styles.ratingPillSelected]}
                      onPress={() => onSelectRating(isSelected ? null : val)}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.ratingPillText,
                          isSelected && styles.ratingPillTextSelected,
                        ]}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 3. Location Filter */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>Location / City</Text>
              <View style={styles.chipGrid}>
                {CITIES_LIST.map((city) => {
                  const isSelected = selectedCity === city;
                  return (
                    <Pressable
                      key={city}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => onSelectCity(city)}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {city}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 4. Categories & Subcategories Accordion */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>Categories & Specialties</Text>
              <View style={styles.catAccordionList}>
                {BUSINESS_CATEGORIES.map((cat) => {
                  const isCatSelected = selectedCategory === cat.name;
                  const isExpanded = expandedCat === cat.name;

                  return (
                    <View key={cat.id} style={styles.catAccordionWrap}>
                      <Pressable
                        style={[
                          styles.catRow,
                          isCatSelected && styles.catRowSelected,
                        ]}
                        onPress={() => {
                          if (isCatSelected) {
                            onSelectCategory(null);
                            onSelectSubcategory(null);
                          } else {
                            onSelectCategory(cat.name);
                            onSelectSubcategory(null);
                          }
                          toggleAccordion(cat.name);
                        }}
                        accessibilityRole="button"
                      >
                        <View style={styles.catMeta}>
                          <Ionicons
                            name={cat.iconName}
                            size={16}
                            color={isCatSelected ? WOW_COLORS.primaryPink : WOW_COLORS.primaryText}
                          />
                          <Text
                            style={[
                              styles.catName,
                              isCatSelected && styles.catNameSelected,
                            ]}
                          >
                            {cat.name}
                          </Text>
                        </View>
                        <Ionicons
                          name={isExpanded ? "chevron-up" : "chevron-down"}
                          size={16}
                          color={WOW_COLORS.secondaryText}
                        />
                      </Pressable>

                      {/* Subcategories list */}
                      {isExpanded && (
                        <View style={styles.subCatContainer}>
                          {cat.subcategories.map((sub) => {
                            const isSubSelected = selectedSubcategory === sub;
                            return (
                              <Pressable
                                key={sub}
                                style={[
                                  styles.subCatItem,
                                  isSubSelected && styles.subCatItemSelected,
                                ]}
                                onPress={() => {
                                  onSelectCategory(cat.name);
                                  onSelectSubcategory(isSubSelected ? null : sub);
                                }}
                              >
                                <View
                                  style={[
                                    styles.radioIndicator,
                                    isSubSelected && styles.radioIndicatorSelected,
                                  ]}
                                />
                                <Text
                                  style={[
                                    styles.subCatText,
                                    isSubSelected && styles.subCatTextSelected,
                                  ]}
                                >
                                  {sub}
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

            {/* 5. Services Offered */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>Services Offered</Text>
              <View style={styles.chipGrid}>
                {SERVICES_FILTER_LIST.map((srv) => {
                  const isSelected = selectedServices.includes(srv);
                  return (
                    <Pressable
                      key={srv}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => onToggleService(srv)}
                      accessibilityRole="button"
                    >
                      <Ionicons
                        name={isSelected ? "checkmark" : "add"}
                        size={12}
                        color={isSelected ? WOW_COLORS.white : WOW_COLORS.secondaryText}
                      />
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {srv}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Sticky Bottom Action Bar */}
          <View style={styles.footerActions}>
            <Pressable
              style={styles.clearBtn}
              onPress={onClearAll}
              accessibilityRole="button"
            >
              <Text style={styles.clearBtnText}>Clear All</Text>
            </Pressable>

            <Pressable
              style={styles.applyBtn}
              onPress={onClose}
              accessibilityRole="button"
            >
              <Text style={styles.applyBtnText}>
                Show {totalMatchingCount} Results
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 18, 28, 0.48)",
    justifyContent: "flex-end",
  },
  backdropPressable: {
    flex: 1,
  },

  // Justdial-inspired large bottom filter panel
  sheetContainer: {
    backgroundColor: "#F7F8FA",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 10,
    paddingBottom: 12,
    maxHeight: "91%",
    overflow: "hidden",
  },
  handleBar: {
    width: 42,
    height: 4,
    borderRadius: 5,
    backgroundColor: "#CDD2DA",
    alignSelf: "center",
    marginBottom: 10,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 5,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ECEEF2",
  },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#20242C",
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F2F3F5",
    alignItems: "center",
    justifyContent: "center",
  },

  // Scroll area
  scrollBody: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 18,
  },
  sectionBlock: {
    marginBottom: 12,
    padding: 15,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9ECF1",
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: "800",
    color: "#252A33",
    marginBottom: 12,
    textTransform: "none",
    letterSpacing: 0,
  },

  // Business quick switches
  toggleRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderTopWidth: 1,
    borderTopColor: "#F0F1F4",
  },
  toggleMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  toggleLabel: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#343A45",
  },

  // Ratings
  ratingRowGroup: {
    flexDirection: "row",
    gap: 9,
  },
  ratingPill: {
    flex: 1,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE1E7",
  },
  ratingPillSelected: {
    backgroundColor: "#FCEAF2",
    borderColor: WOW_COLORS.primaryPink,
  },
  ratingPillText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#454B55",
  },
  ratingPillTextSelected: {
    color: WOW_COLORS.primaryPink,
  },

  // City and service chips
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE1E7",
  },
  chipSelected: {
    backgroundColor: "#FCEAF2",
    borderColor: WOW_COLORS.primaryPink,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B525E",
  },
  chipTextSelected: {
    color: WOW_COLORS.primaryPink,
    fontWeight: "800",
  },

  // Category accordion
  catAccordionList: {
    gap: 8,
  },
  catAccordionWrap: {
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E8ED",
    overflow: "hidden",
  },
  catRow: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: "#FFFFFF",
  },
  catRowSelected: {
    backgroundColor: "#FFF5F9",
  },
  catMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  catName: {
    fontSize: 13,
    fontWeight: "650",
    color: "#343A45",
  },
  catNameSelected: {
    color: WOW_COLORS.primaryPink,
    fontWeight: "800",
  },
  subCatContainer: {
    paddingLeft: 39,
    paddingRight: 13,
    paddingTop: 3,
    paddingBottom: 10,
    gap: 2,
    backgroundColor: "#FAFBFC",
    borderTopWidth: 1,
    borderTopColor: "#F0F1F4",
  },
  subCatItem: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 7,
  },
  subCatItemSelected: {},
  radioIndicator: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#AEB6C2",
    backgroundColor: "#FFFFFF",
  },
  radioIndicatorSelected: {
    borderWidth: 4,
    borderColor: WOW_COLORS.primaryPink,
    backgroundColor: "#FFFFFF",
    transform: [{ scale: 1 }],
  },
  subCatText: {
    fontSize: 12.5,
    color: "#626B78",
  },
  subCatTextSelected: {
    color: WOW_COLORS.primaryPink,
    fontWeight: "700",
  },

  // Fixed bottom action bar
  footerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E9ECF1",
  },
  clearBtn: {
    flex: 1,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: WOW_COLORS.primaryPink,
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: WOW_COLORS.primaryPink,
  },
  applyBtn: {
    flex: 2,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: WOW_COLORS.primaryPink,
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: WOW_COLORS.white,
  },
});
