
import React, { useMemo, useState } from "react";

import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { WOW_COLORS } from "@/common/constants/colors";
import ScreenWrapper from "@/common/components/ScreenWrapper";

import {
  ALL_BUSINESS_LISTINGS,
  BUSINESS_CATEGORIES,
} from "@/features/business/data/businessListingData";

/* ================================================================ */
/* COLORS                                                            */
/* ================================================================ */

const COLORS = {
  pink: "#E91166",
  softPink: "#FCE7EF",
  background: "#FFF7FA",
  white: "#FFFFFF",
  black: "#171717",
  secondary: "#6B6B6B",
  border: "#F0DDE5",
  muted: "#A1A1AA",
  green: "#168B52",
};

/* ================================================================ */
/* MAIN SCREEN                                                       */
/* ================================================================ */

export default function SubcategoriesScreen() {
  const router = useRouter();

  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  /* ============================================================ */
  /* FIND CATEGORY                                                 */
  /* ============================================================ */

  const category = useMemo(() => {
    if (!slug) return null;

    let clean = slug;

    try {
      clean = decodeURIComponent(slug);
    } catch {
      clean = slug;
    }

    const normalizedSlug = clean
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    return (
      BUSINESS_CATEGORIES.find((item) => {
        const normalizedId = item.id.toLowerCase();

        const normalizedName = item.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

        return (
          normalizedId === clean.toLowerCase() ||
          normalizedName === normalizedSlug
        );
      }) || null
    );
  }, [slug]);

  /* ============================================================ */
  /* CATEGORY BUSINESS COUNT                                       */
  /* ============================================================ */

  const categoryBusinesses = useMemo(() => {
    if (!category) return [];

    return ALL_BUSINESS_LISTINGS.filter(
      (business) =>
        business.category?.toLowerCase().trim() ===
        category.name.toLowerCase().trim()
    );
  }, [category]);

  const totalBusinessesCount = categoryBusinesses.length;

  /* ============================================================ */
  /* SUBCATEGORY LIST                                              */
  /* ============================================================ */

  const subcategoryItems = useMemo(() => {
    if (!category) return [];

    const allSubcategories = category.subcategories ?? [];

    const items = allSubcategories.map((subcategory) => {
      const count = categoryBusinesses.filter(
        (business) =>
          business.subCategory?.toLowerCase().trim() ===
          subcategory.toLowerCase().trim()
      ).length;

      return {
        id: subcategory,
        title: subcategory,
        count,
        isAll: false,
      };
    });

    // Search matching subcategories
    const filteredItems = normalizedQuery
      ? items.filter((item) =>
        item.title.toLowerCase().includes(normalizedQuery)
      )
      : items;

    // Show ALL option when not searching
    if (!normalizedQuery) {
      return [
        {
          id: "ALL",
          title: `All in ${category.name}`,
          count: totalBusinessesCount,
          isAll: true,
        },
        ...filteredItems,
      ];
    }

    return filteredItems;
  }, [
    category,
    categoryBusinesses,
    normalizedQuery,
    totalBusinessesCount,
  ]);

  /* ============================================================ */
  /* NAVIGATION                                                    */
  /* ============================================================ */

  const handleBack = () => {
    Keyboard.dismiss();

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/categories");
    }
  };

  const handleSelectSubcategory = (subcategory?: string) => {
    if (!category) return;

    Keyboard.dismiss();

    router.push({
      pathname: "/businesses",
      params: {
        category: category.name,
        sub: subcategory || "",
      },
    });
  };

  /* ============================================================ */
  /* SEARCH CLEAR                                                  */
  /* ============================================================ */

  const clearSearch = () => {
    setSearchQuery("");
    Keyboard.dismiss();
  };

  /* ============================================================ */
  /* CATEGORY NOT FOUND                                            */
  /* ============================================================ */

  if (!category) {
    return (
      <ScreenWrapper
        style={{
          backgroundColor: COLORS.background,
        }}
      >
        <View style={styles.notFoundHeader}>
          <Pressable
            style={styles.backBtn}
            onPress={handleBack}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color={COLORS.black}
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Category Not Found
          </Text>

          <View style={{ width: 40 }} />
        </View>

        <View style={styles.notFoundWrap}>
          <View style={styles.notFoundIcon}>
            <Ionicons
              name="grid-outline"
              size={40}
              color={COLORS.pink}
            />
          </View>

          <Text style={styles.notFoundTitle}>
            Category unavailable
          </Text>

          <Text style={styles.notFoundText}>
            This category is currently not available.
          </Text>

          <Pressable
            style={styles.browseAllBtn}
            onPress={() =>
              router.replace("/categories")
            }
          >
            <Text style={styles.browseAllBtnText}>
              Browse All Categories
            </Text>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  /* ============================================================ */
  /* SUBCATEGORY CARD                                              */
  /* ============================================================ */

  const renderSubcategory = ({ item, index }: any) => {
    const isAll = item.isAll;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.subCard,
          isAll && styles.allSubCard,
          pressed && styles.cardPressed,
        ]}
        onPress={() =>
          handleSelectSubcategory(
            isAll ? undefined : item.title
          )
        }
        accessibilityRole="button"
        accessibilityLabel={`Explore ${item.title}`}
      >
        {/* ICON */}

        <View
          style={[
            styles.iconWrap,
            isAll && styles.allIconWrap,
          ]}
        >
          <Ionicons
            name={
              isAll
                ? "layers-outline"
                : category.iconName || "grid-outline"
            }
            size={23}
            color={isAll ? COLORS.white : COLORS.pink}
          />
        </View>

        {/* CONTENT */}

        <View style={styles.subCardContent}>
          <Text
            style={[
              styles.subCardTitle,
              isAll && styles.allSubCardTitle,
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <View style={styles.countRow}>
            <Ionicons
              name="business-outline"
              size={12}
              color={COLORS.secondary}
            />

            <Text style={styles.subCardCount}>
              {item.count > 0
                ? `${item.count} businesses`
                : "Explore services"}
            </Text>
          </View>
        </View>

        {/* ARROW */}

        <View
          style={[
            styles.arrowWrap,
            isAll && styles.allArrowWrap,
          ]}
        >
          <Ionicons
            name="chevron-forward"
            size={17}
            color={COLORS.pink}
          />
        </View>
      </Pressable>
    );
  };

  /* ============================================================ */
  /* EMPTY SEARCH STATE                                            */
  /* ============================================================ */

  const emptyComponent = (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name="search-outline"
          size={36}
          color={COLORS.muted}
        />
      </View>

      <Text style={styles.emptyTitle}>
        No subcategories found
      </Text>

      <Text style={styles.emptyDescription}>
        No services match "{searchQuery}". Try another
        keyword.
      </Text>

      <Pressable
        style={styles.clearSearchBtn}
        onPress={clearSearch}
      >
        <Text style={styles.clearSearchText}>
          Clear Search
        </Text>
      </Pressable>
    </View>
  );

  /* ============================================================ */
  /* MAIN RENDER                                                   */
  /* ============================================================ */

  return (
    <ScreenWrapper
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      {/* ====================================================== */}
      {/* FIXED HEADER                                             */}
      {/* ====================================================== */}

      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={handleBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color={COLORS.black}
          />
        </Pressable>

        <View style={styles.headerTitleWrap}>
          <Text
            style={styles.headerTitle}
            numberOfLines={1}
          >
            {category.name}
          </Text>

          <Text style={styles.headerSub}>
            {totalBusinessesCount.toLocaleString("en-IN")} businesses available
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="grid-outline"
            size={21}
            color={COLORS.pink}
          />
        </View>
      </View>

      {/* ====================================================== */}
      {/* SEARCH BAR                                              */}
      {/* ====================================================== */}

      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={19}
            color={COLORS.pink}
          />

          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${category.name} services...`}
            placeholderTextColor={COLORS.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="never"
            underlineColorAndroid="transparent"
          />

          {searchQuery.length > 0 && (
            <Pressable
              onPress={clearSearch}
              hitSlop={8}
              style={styles.clearIcon}
            >
              <Ionicons
                name="close-circle"
                size={21}
                color={COLORS.secondary}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* ====================================================== */}
      {/* CATEGORY INTRODUCTION + SUBCATEGORY LIST                */}
      {/* ====================================================== */}

      <FlatList
        data={subcategoryItems}
        keyExtractor={(item) => item.id}
        renderItem={renderSubcategory}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* CATEGORY INTRO CARD */}

            <View style={styles.categoryIntro}>
              <View style={styles.introIcon}>
                <Ionicons
                  name={
                    category.iconName || "grid-outline"
                  }
                  size={29}
                  color={COLORS.pink}
                />
              </View>

              <View style={styles.introContent}>
                <Text style={styles.introTitle}>
                  Explore {category.name}
                </Text>

                <Text style={styles.introDescription}>
                  Find trusted women-led businesses and
                  services in this category.
                </Text>
              </View>
            </View>

            {/* SECTION TITLE */}

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  {normalizedQuery
                    ? "Matching services"
                    : "Browse services"}
                </Text>

                <Text style={styles.sectionSubtitle}>
                  {normalizedQuery
                    ? `${subcategoryItems.length} matching services`
                    : "Choose a service to explore businesses"}
                </Text>
              </View>

              <View style={styles.resultBadge}>
                <Text style={styles.resultBadgeText}>
                  {subcategoryItems.length}
                </Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={emptyComponent}
        ItemSeparatorComponent={() => (
          <View style={{ height: 10 }} />
        )}
        ListFooterComponent={<View style={{ height: 30 }} />}
      />
    </ScreenWrapper>
  );
}

/* ================================================================ */
/* STYLES                                                            */
/* ================================================================ */

const styles = StyleSheet.create({
  /* HEADER */

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  notFoundHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#F7F7F8",
  },

  headerTitleWrap: {
    flex: 1,
    marginHorizontal: 11,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.black,
  },

  headerSub: {
    fontSize: 11.5,
    color: COLORS.secondary,
    marginTop: 3,
  },

  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
  },

  /* SEARCH */

  searchSection: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 49,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.black,
    paddingVertical: 0,
    outlineStyle: "none" as any,
  },

  clearIcon: {
    width: 28,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },

  /* LIST */

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexGrow: 1,
  },

  /* CATEGORY INTRO */

  categoryIntro: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 17,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 22,
  },

  introIcon: {
    width: 55,
    height: 55,
    borderRadius: 16,
    backgroundColor: COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  introContent: {
    flex: 1,
  },

  introTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.black,
  },

  introDescription: {
    fontSize: 11.5,
    color: COLORS.secondary,
    lineHeight: 17,
    marginTop: 5,
  },

  /* SECTION HEADER */

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.black,
  },

  sectionSubtitle: {
    fontSize: 11.5,
    color: COLORS.secondary,
    marginTop: 4,
  },

  resultBadge: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
  },

  resultBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.pink,
  },

  /* SUBCATEGORY CARDS */

  subCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.035,
    shadowRadius: 5,
    elevation: 2,
  },

  allSubCard: {
    borderColor: COLORS.pink,
    backgroundColor: "#FFF9FC",
  },

  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  allIconWrap: {
    backgroundColor: COLORS.pink,
  },

  subCardContent: {
    flex: 1,
    justifyContent: "center",
  },

  subCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 5,
  },

  allSubCardTitle: {
    color: COLORS.pink,
    fontWeight: "800",
  },

  countRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  subCardCount: {
    fontSize: 11.5,
    color: COLORS.secondary,
    fontWeight: "500",
  },

  arrowWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  allArrowWrap: {
    backgroundColor: COLORS.softPink,
  },

  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.985 }],
  },

  /* EMPTY STATE */

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 50,
  },

  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.black,
  },

  emptyDescription: {
    fontSize: 12.5,
    color: COLORS.secondary,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 7,
  },

  clearSearchBtn: {
    backgroundColor: COLORS.pink,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 18,
  },

  clearSearchText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },

  /* NOT FOUND */

  notFoundWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },

  notFoundIcon: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
  },

  notFoundTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.black,
    marginTop: 5,
  },

  notFoundText: {
    fontSize: 13,
    color: COLORS.secondary,
    textAlign: "center",
  },

  browseAllBtn: {
    backgroundColor: COLORS.pink,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 13,
    marginTop: 10,
  },

  browseAllBtnText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 13,
  },
});
