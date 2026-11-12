
import React, { useMemo, useState } from "react";

import {
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  StatusBar,
  Platform,
} from "react-native";

import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { BUSINESS_CATEGORIES } from "@/features/business/data/businessListingData";
import type { BusinessCategory } from "@/features/business/types/business.types";

const COLORS = {
  primary: "#E91166",
  softPink: "#FCE7EF",
  background: "#FFF7FA",
  white: "#FFFFFF",
  text: "#171717",
  secondary: "#77717A",
  border: "#F0DDE5",
  light: "#FFF0F5",
};

type MciName =
  React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const ICON_RULES: [RegExp, MciName][] = [
  [/beauty|salon|skin|facial|makeup/i, "face-woman-shimmer"],
  [/hair|barber/i, "content-cut"],
  [/doctor|clinic|health|medical/i, "stethoscope"],
  [/spa|massage|wellness/i, "spa"],
  [/nail|mehendi|henna/i, "hand-heart"],
  [/fashion|boutique|saree|sari|tailor|dress|cloth/i, "hanger"],
  [/jewel|gold|silver/i, "diamond-stone"],
  [/food|restaurant|catering|kitchen/i, "silverware-fork-knife"],
  [/bakery|cake|sweet/i, "cake-variant"],
  [/education|school|tuition|training|course/i, "school"],
  [/home|interior|furniture|decor/i, "sofa"],
  [/event|wedding|party/i, "party-popper"],
  [/photography|photo|video/i, "camera"],
  [/travel|tour/i, "airplane"],
  [/fitness|gym|yoga|sports/i, "dumbbell"],
  [/technology|software|digital|computer/i, "laptop"],
  [/marketing|advertising/i, "bullhorn"],
  [/real estate|property/i, "home-city"],
  [/baby|kids|child/i, "baby-carriage"],
  [/pet|animal/i, "paw"],
  [/craft|art|handmade/i, "palette"],
  [/flower|florist/i, "flower"],
  [/repair|plumbing|electric|service/i, "tools"],
];

const getCategoryIcon = (name: string): MciName => {
  const match = ICON_RULES.find(([regex]) => regex.test(name));
  return match?.[1] ?? "storefront-outline";
};

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Search categories and their subcategories on this screen.
  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) return BUSINESS_CATEGORIES;

    return BUSINESS_CATEGORIES
      .map((category) => {
        const categoryMatch = category.name
          .toLowerCase()
          .includes(normalizedQuery);

        const matchingSubcategories =
          category.subcategories?.filter((sub) =>
            sub.toLowerCase().includes(normalizedQuery)
          ) ?? [];

        if (categoryMatch) {
          return category;
        }

        if (matchingSubcategories.length > 0) {
          return {
            ...category,
            subcategories: matchingSubcategories,
          };
        }

        return null;
      })
      .filter((category): category is BusinessCategory => category !== null);
  }, [normalizedQuery]);

  // Tap main category: show all businesses in that category.
  const handleCategoryPress = (category: BusinessCategory) => {
    Keyboard.dismiss();

    router.push({
      pathname: "/businesses",
      params: {
        category: category.name,
        sub: "",
      },
    });
  };

  // Tap subcategory: show only matching businesses.
  const handleSubcategoryPress = (
    category: BusinessCategory,
    subcategory: string
  ) => {
    Keyboard.dismiss();

    router.push({
      pathname: "/businesses",
      params: {
        category: category.name,
        sub: subcategory,
      },
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
    Keyboard.dismiss();
  };

  const renderCategorySection = (category: BusinessCategory) => {
    const subcategories = category.subcategories ?? [];

    return (
      <View key={category.id} style={styles.categorySection}>
        {/* CATEGORY HEADING */}
        <View style={styles.categoryHeader}>
          <Pressable
            style={styles.categoryHeadingLeft}
            onPress={() => handleCategoryPress(category)}
          >
            <View style={styles.categoryIcon}>
              <MaterialCommunityIcons
                name={getCategoryIcon(category.name)}
                size={23}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.categoryHeadingText}>
              <Text style={styles.categoryTitle} numberOfLines={2}>
                {category.name}
              </Text>

              <Text style={styles.categorySubtitle}>
                {subcategories.length} services
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.viewAllButton}
            onPress={() => handleCategoryPress(category)}
            hitSlop={8}
          >
            <Text style={styles.viewAllText}>View all</Text>
            <Ionicons
              name="chevron-forward"
              size={15}
              color={COLORS.primary}
            />
          </Pressable>
        </View>

        {/* INNER SUBCATEGORIES */}
        {subcategories.length > 0 ? (
          <View style={styles.subcategoryGrid}>
            {subcategories.map((subcategory, index) => (
              <Pressable
                key={`${category.id}-${subcategory}-${index}`}
                style={({ pressed }) => [
                  styles.subcategoryItem,
                  pressed && styles.subcategoryPressed,
                ]}
                onPress={() =>
                  handleSubcategoryPress(category, subcategory)
                }
              >
                <Text
                  style={styles.subcategoryText}
                  numberOfLines={2}
                >
                  {subcategory}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={COLORS.primary}
                />
              </Pressable>
            ))}
          </View>
        ) : (
          <Pressable
            style={styles.exploreItem}
            onPress={() => handleCategoryPress(category)}
          >
            <Text style={styles.exploreText}>
              Explore businesses
            </Text>
            <Ionicons
              name="arrow-forward"
              size={15}
              color={COLORS.primary}
            />
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      {/* FIXED HEADER */}
      <View
        style={[
          styles.topHeader,
          {
            paddingTop: Math.max(insets.top, 10) + 5,
          },
        ]}
      >


        {/* INLINE SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.primary}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search categories or services..."
            placeholderTextColor="#A49AA1"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            underlineColorAndroid="transparent"
          />

          {searchQuery.length > 0 && (
            <Pressable onPress={clearSearch} hitSlop={8}>
              <Ionicons
                name="close-circle"
                size={21}
                color={COLORS.secondary}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* ALL CATEGORY SECTIONS ON ONE PAGE */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 25 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >


        {filteredCategories.length > 0 ? (
          filteredCategories.map(renderCategorySection)
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="search-outline"
                size={32}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No categories found
            </Text>

            <Text style={styles.emptyDescription}>
              Try another category or service name.
            </Text>

            <Pressable
              style={styles.clearButton}
              onPress={clearSearch}
            >
              <Text style={styles.clearButtonText}>
                Clear search
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // HEADER
  topHeader: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 5,
  },

  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 15,
  },

  brandIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
  },

  headerSubtitle: {
    fontSize: 11,
    color: COLORS.secondary,
    marginTop: 3,
  },

  categoryCount: {
    minWidth: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  categoryCountText: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 13,
  },

  // SEARCH
  searchBox: {
    height: 49,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.background,
  },

  searchInput: {
    flex: 1,
    height: 48,
    paddingVertical: 0,
    fontSize: 13,
    color: COLORS.text,
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none" } as any)
      : {}),
  },

  // SCROLL CONTENT
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 17,
  },

  listIntro: {
    marginBottom: 15,
  },

  listIntroTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.4,
  },

  listIntroSubtitle: {
    fontSize: 11.5,
    color: COLORS.secondary,
    marginTop: 5,
    lineHeight: 17,
  },

  // CATEGORY SECTION
  categorySection: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    padding: 14,
    marginBottom: 13,
  },

  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  categoryHeadingLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingRight: 8,
  },

  categoryIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryHeadingText: {
    flex: 1,
  },

  categoryTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },

  categorySubtitle: {
    fontSize: 10.5,
    color: COLORS.secondary,
    marginTop: 3,
  },

  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingVertical: 8,
    paddingLeft: 5,
  },

  viewAllText: {
    color: COLORS.primary,
    fontSize: 11.5,
    fontWeight: "700",
  },

  // SUBCATEGORY GRID
  subcategoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  subcategoryItem: {
    width: "48%",
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  subcategoryText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: "600",
    color: COLORS.text,
  },

  subcategoryPressed: {
    backgroundColor: COLORS.softPink,
    borderColor: COLORS.primary,
    opacity: 0.85,
  },

  exploreItem: {
    minHeight: 42,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  exploreText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  // EMPTY STATE
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 65,
    paddingHorizontal: 25,
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
  },

  emptyDescription: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 7,
    textAlign: "center",
  },

  clearButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 11,
    paddingHorizontal: 22,
    paddingVertical: 11,
    marginTop: 18,
  },

  clearButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
});
