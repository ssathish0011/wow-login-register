import React, { useMemo, useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/common/constants/colors";
import {
  ALL_BUSINESS_LISTINGS,
  BUSINESS_CATEGORIES,
  POPULAR_SEARCH_TERMS,
} from "../data/businessListingData";
import { BusinessListingItem } from "../types/business.types";

interface FullScreenSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSearch: (query: string, category?: string) => void;
  onSelectBusiness?: (business: BusinessListingItem) => void;
  initialQuery?: string;
}

export default function FullScreenSearchModal({
  visible,
  onClose,
  onSelectSearch,
  onSelectBusiness,
  initialQuery = "",
}: FullScreenSearchModalProps) {
  const insets = useSafeAreaInsets();
  const topInset =
    insets.top > 0
      ? insets.top
      : Platform.OS === "android"
        ? RNStatusBar.currentHeight || 0
        : 0;

  const [query, setQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Bridal Makeup Studio",
    "Silk Sarees Mylapore",
    "Homemade Tiffin",
    "Aari Work Tailoring",
  ]);

  const handleSelectTerm = (term: string, category?: string) => {
    if (!recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev.slice(0, 5)]);
    }
    onSelectSearch(term, category);
    onClose();
  };

  const handleRemoveRecent = (termToRemove: string) => {
    setRecentSearches((prev) => prev.filter((t) => t !== termToRemove));
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
  };

  // Live matching suggestions based on query
  const liveSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    return ALL_BUSINESS_LISTINGS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.subCategory.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.specialities.some((s) => s.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: topInset > 0 ? topInset + 6 : 12 }]}>
        {/* TOP SEARCH HEADER */}
        <View style={styles.headerBar}>
          <Pressable
            style={styles.backButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Ionicons name="arrow-back" size={24} color={WOW_COLORS.primaryText} />
          </Pressable>

          <View style={styles.searchInputWrap}>
            <Ionicons
              name="search"
              size={18}
              color={WOW_COLORS.primaryPink}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Search businesses, services, products..."
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
              autoFocus
              returnKeyType="search"
              onSubmitEditing={() => {
                if (query.trim()) {
                  handleSelectTerm(query.trim());
                }
              }}
            />
            {query.length > 0 ? (
              <Pressable
                onPress={() => setQuery("")}
                style={styles.clearBtn}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Clear input"
              >
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </Pressable>
            ) : null}
            <Pressable
              onPress={() => {
                setQuery("Bridal Makeup Studio");
              }}
              style={styles.micBtn}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Voice search"
            >
              <Ionicons name="mic" size={18} color={WOW_COLORS.primaryPink} />
            </Pressable>
          </View>
        </View>

        {/* CONTENT AREA */}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 30 },
          ]}
        >
          {/* STATE A: QUERY TYPED -> SHOW LIVE SUGGESTIONS */}
          {query.trim().length > 0 ? (
            <View style={styles.suggestionsSection}>
              <Text style={styles.sectionHeader}>Matching Businesses & Services</Text>

              {liveSuggestions.length === 0 ? (
                <View style={styles.noMatchBox}>
                  <Ionicons name="search-outline" size={28} color="#9CA3AF" />
                  <Text style={styles.noMatchText}>No matches found for "{query}"</Text>
                  <Pressable
                    style={styles.searchExactBtn}
                    onPress={() => handleSelectTerm(query.trim())}
                  >
                    <Text style={styles.searchExactBtnText}>
                      Search all businesses for "{query}"
                    </Text>
                  </Pressable>
                </View>
              ) : (
                liveSuggestions.map((item) => (
                  <Pressable
                    key={item.id}
                    style={styles.suggestionRow}
                    onPress={() => {
                      if (onSelectBusiness) {
                        onSelectBusiness(item);
                        onClose();
                      } else {
                        handleSelectTerm(item.name);
                      }
                    }}
                    accessibilityRole="button"
                  >
                    <View style={styles.suggestionIconWrap}>
                      <Ionicons
                        name="storefront-outline"
                        size={18}
                        color={WOW_COLORS.primaryPink}
                      />
                    </View>
                    <View style={styles.suggestionMeta}>
                      <Text style={styles.suggestionTitle} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.suggestionSubtitle} numberOfLines={1}>
                        {item.category} • {item.location}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                  </Pressable>
                ))
              )}
            </View>
          ) : (
            /* STATE B: EMPTY QUERY -> SHOW RECENT, POPULAR CATEGORIES & TRENDS */
            <View>
              {/* 1. RECENT SEARCHES */}
              {recentSearches.length > 0 && (
                <View style={styles.sectionBlock}>
                  <View style={styles.sectionTitleRow}>
                    <View style={styles.titleWithIcon}>
                      <Ionicons name="time-outline" size={16} color={WOW_COLORS.primaryPink} />
                      <Text style={styles.sectionTitle}>Recent Searches</Text>
                    </View>
                    <Pressable onPress={handleClearAllRecent}>
                      <Text style={styles.clearAllText}>Clear All</Text>
                    </Pressable>
                  </View>

                  <View style={styles.recentList}>
                    {recentSearches.map((term) => (
                      <View key={term} style={styles.recentRow}>
                        <Pressable
                          style={styles.recentTextPressable}
                          onPress={() => handleSelectTerm(term)}
                        >
                          <Ionicons name="search-outline" size={15} color="#9CA3AF" />
                          <Text style={styles.recentTermText}>{term}</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => handleRemoveRecent(term)}
                          style={styles.removeRecentBtn}
                          hitSlop={8}
                        >
                          <Ionicons name="close" size={16} color="#9CA3AF" />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* 2. POPULAR SEARCH TRENDS */}
              <View style={styles.sectionBlock}>
                <View style={styles.titleWithIcon}>
                  <Ionicons name="trending-up" size={16} color={WOW_COLORS.primaryPink} />
                  <Text style={styles.sectionTitle}>Trending on WOW</Text>
                </View>
                <View style={styles.chipsWrap}>
                  {POPULAR_SEARCH_TERMS.map((term) => (
                    <Pressable
                      key={term}
                      style={styles.trendingChip}
                      onPress={() => handleSelectTerm(term)}
                      accessibilityRole="button"
                    >
                      <Ionicons name="flame" size={12} color={WOW_COLORS.primaryPink} />
                      <Text style={styles.trendingChipText}>{term}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* 3. POPULAR CATEGORIES */}
              <View style={styles.sectionBlock}>
                <View style={styles.titleWithIcon}>
                  <Ionicons name="grid-outline" size={16} color={WOW_COLORS.primaryPink} />
                  <Text style={styles.sectionTitle}>Explore Categories</Text>
                </View>

                <View style={styles.catGrid}>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat.id}
                      style={styles.catGridItem}
                      onPress={() => handleSelectTerm("", cat.name)}
                      accessibilityRole="button"
                    >
                      <View style={styles.catIconCircle}>
                        <Ionicons
                          name={cat.iconName}
                          size={18}
                          color={WOW_COLORS.primaryPink}
                        />
                      </View>
                      <Text style={styles.catGridLabel} numberOfLines={1}>
                        {cat.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WOW_COLORS.white,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: WOW_COLORS.border,
    gap: 10,
  },
  backButton: {
    padding: 6,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1.5,
    borderColor: WOW_COLORS.primaryPink,
    borderRadius: 22,
    paddingHorizontal: 12,
    height: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: WOW_COLORS.primaryText,
    height: "100%",
  },
  clearBtn: {
    padding: 4,
  },
  micBtn: {
    padding: 4,
    marginLeft: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  clearAllText: {
    fontSize: 12,
    color: WOW_COLORS.primaryPink,
    fontWeight: "700",
  },
  recentList: {
    gap: 6,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: WOW_COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  recentTextPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  recentTermText: {
    fontSize: 13,
    color: WOW_COLORS.primaryText,
    fontWeight: "500",
  },
  removeRecentBtn: {
    padding: 4,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  trendingChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: WOW_COLORS.softPink,
    borderWidth: 1,
    borderColor: "#FBCFE8",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  trendingChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: WOW_COLORS.primaryPink,
  },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  catGridItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    borderRadius: 12,
    padding: 10,
  },
  catIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WOW_COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
  },
  catGridLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
  },
  suggestionsSection: {
    gap: 8,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: WOW_COLORS.secondaryText,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: WOW_COLORS.white,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    borderRadius: 12,
    padding: 12,
  },
  suggestionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: WOW_COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionMeta: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  suggestionSubtitle: {
    fontSize: 11,
    color: WOW_COLORS.secondaryText,
    marginTop: 2,
  },
  noMatchBox: {
    alignItems: "center",
    paddingVertical: 36,
    gap: 8,
  },
  noMatchText: {
    fontSize: 14,
    color: WOW_COLORS.secondaryText,
  },
  searchExactBtn: {
    marginTop: 10,
    backgroundColor: WOW_COLORS.primaryPink,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchExactBtnText: {
    color: WOW_COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
});

