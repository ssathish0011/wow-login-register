import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/shared/theme/colors";
import ScreenWrapper from "@/shared/components/ScreenWrapper";
import {
  ALL_BUSINESS_LISTINGS,
  BUSINESS_CATEGORIES,
  POPULAR_SEARCH_TERMS,
} from "@/features/business/data/businessListingData";
import { BusinessListingItem } from "@/features/business/types/business.types";

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const inputRef = useRef<any>(null);

  const [query, setQuery] = useState(params.q || "");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Bridal Makeup Studio",
    "Silk Sarees Mylapore",
    "Homemade Tiffin",
    "Aari Work Tailoring",
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    Keyboard.dismiss();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home" as any);
    }
  };

  const handleSelectTerm = (term: string, category?: string) => {
    Keyboard.dismiss();
    if (term.trim() && !recentSearches.includes(term.trim())) {
      setRecentSearches((prev) => [term.trim(), ...prev.slice(0, 5)]);
    }
    router.push({
      pathname: "/businesses" as any,
      params: {
        query: term,
        category: category || "",
      },
    });
  };

  const handleRemoveRecent = (termToRemove: string) => {
    setRecentSearches((prev) => prev.filter((t) => t !== termToRemove));
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
  };

  // Live suggestions matching businesses
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

  // Live category matches
  const categorySuggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return BUSINESS_CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.subcategories.some((sub) => sub.toLowerCase().includes(q))
    ).slice(0, 4);
  }, [query]);

  return (
    <ScreenWrapper style={{ backgroundColor: WOW_COLORS.white }}>
      {/* Top Search Bar */}
      <View style={styles.headerBar}>
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={24} color={WOW_COLORS.primaryText} />
        </Pressable>

        <View style={styles.searchInputWrap}>
          <Ionicons name="search" size={18} color="#6B7280" style={{ marginRight: 8 }} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Search businesses, services, products..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={() => {
              if (query.trim()) handleSelectTerm(query.trim());
            }}
            clearButtonMode="while-editing"
          />

          {query.length > 0 ? (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </Pressable>
          ) : (
            <Ionicons name="mic-outline" size={19} color="#6B7280" />
          )}
        </View>

        {query.trim().length > 0 && (
          <Pressable
            style={styles.searchActionBtn}
            onPress={() => handleSelectTerm(query.trim())}
          >
            <Text style={styles.searchActionText}>Search</Text>
          </Pressable>
        )}
      </View>

      {/* BODY */}
      {query.trim().length > 0 ? (
        <ScrollView
          style={styles.resultsScroll}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Category matches */}
          {categorySuggestions.length > 0 && (
            <View style={styles.suggestionSection}>
              <Text style={styles.suggestionSectionTitle}>Categories</Text>
              {categorySuggestions.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={styles.categoryItem}
                  onPress={() => handleSelectTerm(cat.name, cat.name)}
                >
                  <View style={styles.catIconWrap}>
                    <Ionicons name={cat.iconName} size={16} color={WOW_COLORS.primaryPink} />
                  </View>
                  <Text style={styles.catNameText}>{cat.name}</Text>
                  <Ionicons name="chevron-back" size={16} color="#9CA3AF" />
                </Pressable>
              ))}
            </View>
          )}

          {/* Business suggestions */}
          <View style={styles.suggestionSection}>
            <Text style={styles.suggestionSectionTitle}>Matching Businesses</Text>
            {liveSuggestions.length > 0 ? (
              liveSuggestions.map((biz) => (
                <Pressable
                  key={biz.id}
                  style={styles.bizSuggestionItem}
                  onPress={() => {
                    Keyboard.dismiss();
                    router.push(`/business/${biz.id}` as any);
                  }}
                >
                  <Ionicons name="business-outline" size={18} color="#6B7280" />
                  <View style={styles.bizSuggestionInfo}>
                    <Text style={styles.bizSuggestionName}>{biz.name}</Text>
                    <Text style={styles.bizSuggestionMeta}>
                      {biz.category} • {biz.location}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </Pressable>
              ))
            ) : (
              <View style={styles.noMatchBox}>
                <Text style={styles.noMatchText}>
                  No direct name matches. Tap "Search" to explore all matching listings.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleWithIcon}>
                  <Ionicons name="time-outline" size={18} color="#4B5563" />
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                </View>
                <Pressable onPress={handleClearAllRecent} hitSlop={6}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </Pressable>
              </View>

              <View style={styles.chipsWrap}>
                {recentSearches.map((term, index) => (
                  <View key={index} style={styles.recentChip}>
                    <Pressable
                      style={styles.recentChipPressable}
                      onPress={() => handleSelectTerm(term)}
                    >
                      <Text style={styles.recentChipText}>{term}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleRemoveRecent(term)}
                      hitSlop={6}
                      style={styles.removeChipBtn}
                    >
                      <Ionicons name="close" size={14} color="#6B7280" />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Popular / Trending Searches */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionTitleWithIcon}>
              <Ionicons name="trending-up-outline" size={18} color={WOW_COLORS.primaryPink} />
              <Text style={styles.sectionTitle}>Trending Searches</Text>
            </View>

            <View style={styles.chipsWrap}>
              {POPULAR_SEARCH_TERMS.map((term, index) => (
                <Pressable
                  key={index}
                  style={styles.trendingChip}
                  onPress={() => handleSelectTerm(term)}
                >
                  <Text style={styles.trendingChipText}>{term}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Popular Categories */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionTitleWithIcon}>
              <Ionicons name="grid-outline" size={17} color="#4B5563" />
              <Text style={styles.sectionTitle}>Explore Categories</Text>
            </View>

            <View style={styles.categoryGrid}>
              {BUSINESS_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={styles.categoryTile}
                  onPress={() => {
                    Keyboard.dismiss();
                    router.push({
                      pathname: "/category/[slug]",
                      params: { slug: cat.id },
                    });
                  }}
                >
                  <View style={styles.catTileIcon}>
                    <Ionicons name={cat.iconName} size={20} color={WOW_COLORS.primaryPink} />
                  </View>
                  <Text style={styles.catTileLabel} numberOfLines={2}>
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: WOW_COLORS.white,
    gap: 8,
  },
  backButton: {
    padding: 6,
    borderRadius: 20,
  },
  searchInputWrap: {
    flex: 1,
    height: 44,
    backgroundColor: "#F3F4F6",
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: WOW_COLORS.primaryText,
    height: "100%",
  },
  searchActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchActionText: {
    fontSize: 14,
    fontWeight: "700",
    color: WOW_COLORS.primaryPink,
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  resultsScroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  sectionWrap: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: WOW_COLORS.primaryPink,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
  },
  recentChipPressable: {
    paddingRight: 4,
  },
  recentChipText: {
    fontSize: 12.5,
    color: "#374151",
    fontWeight: "500",
  },
  removeChipBtn: {
    padding: 3,
  },
  trendingChip: {
    backgroundColor: WOW_COLORS.softPink,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#FCE7EF",
  },
  trendingChipText: {
    fontSize: 12.5,
    color: WOW_COLORS.primaryPink,
    fontWeight: "600",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryTile: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 10,
  },
  catTileIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: WOW_COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
  },
  catTileLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
  },
  suggestionSection: {
    marginBottom: 20,
  },
  suggestionSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  catIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WOW_COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  catNameText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
  },
  bizSuggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 10,
  },
  bizSuggestionInfo: {
    flex: 1,
  },
  bizSuggestionName: {
    fontSize: 14,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
  },
  bizSuggestionMeta: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  noMatchBox: {
    paddingVertical: 14,
  },
  noMatchText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
});

