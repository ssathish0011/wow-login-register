// Mobile-first Business Listing Screen for WOW (Women of Wisdom).
//
// Layout (top to bottom, header block stays fixed while the list scrolls)
// 1. Search row: back button + Justdial-style tappable search field
// 2. Quick-filter row: [Filter] [Sort] | Verified, Women-Owned, Top Rated, Open Now, Premium
// 3. Applied row (only when a category / sub-category is active): removable chips
// 4. Count row: "24 businesses found in Chennai" + "View on map" pill
// 5. Business cards with infinite scroll, skeleton loader and empty state
//
// Same colour language as BusinessCard / BusinessQuickFilters / BusinessSearchBar:
// WOW pink = brand + selected state, blue = verified, amber = rating, green = open, purple = premium.

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { WOW_COLORS } from "@/common/constants/colors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectSavedIds, toggleSave } from "@/features/saved/slices/savedSlice";

import { ALL_BUSINESS_LISTINGS } from "../data/businessListingData";
import { BusinessListingItem, SortOption } from "../types/business.types";
import { useLocation } from "@/context/LocationContext";

import BusinessCard from "../components/BusinessCard";
import BusinessCardSkeleton from "../components/BusinessCardSkeleton";
import EmptyBusinessState from "../components/EmptyBusinessState";
import FullScreenSearchModal from "../components/FullScreenSearchModal";
import FilterBottomSheet from "../components/FilterBottomSheet";
import SortBottomSheet from "../components/SortBottomSheet";
import BusinessDetailsScreen from "../components/BusinessDetailsScreen";
import EnquiryModal from "../components/EnquiryModal";

const PAGE_SIZE = 6;
const PINK = WOW_COLORS?.primaryPink ?? "#D91B68";

const C = {
  pink: PINK,
  pinkSoft: "#FDECF3",
  pinkLine: "#F8CBDD",
  blue: "#1677D2",
  amber: "#E39A0B",
  green: "#1FA463",
  purple: "#7B3FD1",
  ink: "#14171C",
  text: "#3D444D",
  muted: "#78808A",
  placeholder: "#9AA1AB",
  line: "#E6E8EC",
  surface: "#FFFFFF",
  surfaceAlt: "#F6F7F9",
};

type IonName = React.ComponentProps<typeof Ionicons>["name"];

// Label shown on the Sort button once a non-default sort is chosen
const SORT_LABELS: Record<string, string> = {
  recommended: "Sort",
  popular: "Popular",
  rating: "Top rated",
  recent: "Newest",
  nearest: "Nearest",
};

/* ---------- small reusable chip ---------- */

const Chip = memo(function Chip({
  label,
  icon,
  tint,
  selected,
  soft,
  badge,
  trailing,
  onPress,
}: {
  label: string;
  icon?: IonName;
  tint?: string;
  selected?: boolean;
  /** soft = light-pink active style (used for Filter / Sort buttons) */
  soft?: boolean;
  badge?: number;
  trailing?: IonName;
  onPress: () => void;
}) {
  const solid = !!selected && !soft;
  const softActive = !!selected && !!soft;
  const fg = solid ? "#fff" : softActive ? C.pink : C.text;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        softActive && styles.chipSoftActive,
        solid && styles.chipSolid,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={label}
    >
      {icon && <Ionicons name={icon} size={14} color={solid ? "#fff" : softActive ? C.pink : tint ?? C.text} />}
      <Text style={[styles.chipText, { color: fg }, (solid || softActive) && styles.chipTextOn]} numberOfLines={1}>
        {label}
      </Text>
      {!!badge && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      {trailing && <Ionicons name={trailing} size={12} color={softActive ? C.pink : C.muted} />}
    </Pressable>
  );
});

/* ---------- screen ---------- */

export default function BusinessListingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const savedIds = useAppSelector(selectSavedIds);

  const isWideWeb = Platform.OS === "web" && width > 600;

  // Safe area top calculation with Android fallback
  const topInset =
    insets.top > 0 ? insets.top : Platform.OS === "android" ? RNStatusBar.currentHeight || 0 : 0;

  // Route params when navigated from Categories, Subcategories or Search
  const params = useLocalSearchParams<{ category?: string; query?: string; sub?: string }>();

  // Location from shared LocationContext
  const { userLocation, selectCityManual } = useLocation();
  const cityName = userLocation.city || "Chennai";

  // Filter & search state
  const [searchQuery, setSearchQuery] = useState(params.query || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(params.category || null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(params.sub || null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [womenOwnedOnly, setWomenOwnedOnly] = useState(false);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  // Keep route params in sync if they change
  useEffect(() => {
    if (params.category && params.category !== selectedCategory) setSelectedCategory(params.category);
    if (params.sub !== undefined && params.sub !== selectedSubcategory) setSelectedSubcategory(params.sub || null);
    if (params.query && params.query !== searchQuery) setSearchQuery(params.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.category, params.sub, params.query]);

  // Modals & sheets
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [sortSheetVisible, setSortSheetVisible] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessListingItem | null>(null);
  const [enquiryBusiness, setEnquiryBusiness] = useState<BusinessListingItem | null>(null);

  // Pagination
  const [pageLimit, setPageLimit] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const listRef = useRef<FlatList<BusinessListingItem>>(null);
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (loadTimer.current) clearTimeout(loadTimer.current);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count += 1;
    if (selectedSubcategory) count += 1;
    if (minRating !== null) count += 1;
    if (maxDistance !== null) count += 1;
    if (openNowOnly) count += 1;
    if (verifiedOnly) count += 1;
    if (womenOwnedOnly) count += 1;
    if (premiumOnly) count += 1;
    count += selectedServices.length;
    return count;
  }, [
    selectedCategory,
    selectedSubcategory,
    minRating,
    maxDistance,
    openNowOnly,
    verifiedOnly,
    womenOwnedOnly,
    premiumOnly,
    selectedServices,
  ]);

  const handleClearAllFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setMinRating(null);
    setMaxDistance(null);
    setOpenNowOnly(false);
    setVerifiedOnly(false);
    setWomenOwnedOnly(false);
    setPremiumOnly(false);
    setSelectedServices([]);
    setSortBy("recommended");
  }, []);

  // Filtered & sorted list
  const filteredBusinesses = useMemo(() => {
    let list = [...ALL_BUSINESS_LISTINGS];

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.subCategory.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          b.specialities.some((s) => s.toLowerCase().includes(q)) ||
          b.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) list = list.filter((b) => b.category === selectedCategory);
    if (selectedSubcategory) list = list.filter((b) => b.subCategory === selectedSubcategory);
    if (minRating !== null) list = list.filter((b) => b.rating >= minRating);

    if (maxDistance !== null) {
      list = list.filter((b) => (parseFloat(b.distance) || 99) <= maxDistance);
    }

    if (openNowOnly) list = list.filter((b) => b.isOpen);
    if (verifiedOnly) list = list.filter((b) => b.isVerified);
    if (womenOwnedOnly) list = list.filter((b) => b.isWomenOwned);
    if (premiumOnly) list = list.filter((b) => b.isPremium || b.isFeatured);

    if (selectedServices.length > 0) {
      list = list.filter((b) => selectedServices.some((srv) => b.services.includes(srv)));
    }

    list.sort((a, b) => {
      if (sortBy === "recommended") {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        return b.rating - a.rating;
      }
      if (sortBy === "popular") return b.reviewsCount - a.reviewsCount;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "recent") return (b.establishedYear || 2020) - (a.establishedYear || 2020);
      if (sortBy === "nearest") return (parseFloat(a.distance) || 99) - (parseFloat(b.distance) || 99);
      return 0;
    });

    return list;
  }, [
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    minRating,
    maxDistance,
    openNowOnly,
    verifiedOnly,
    womenOwnedOnly,
    premiumOnly,
    selectedServices,
    sortBy,
  ]);

  // Whenever the result set changes, start again from page 1 at the top of the list
  useEffect(() => {
    setPageLimit(PAGE_SIZE);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [filteredBusinesses]);

  const visibleBusinesses = useMemo(
    () => filteredBusinesses.slice(0, pageLimit),
    [filteredBusinesses, pageLimit]
  );

  const handleLoadMore = useCallback(() => {
    if (pageLimit < filteredBusinesses.length && !isLoadingMore) {
      setIsLoadingMore(true);
      loadTimer.current = setTimeout(() => {
        setPageLimit((prev) => prev + PAGE_SIZE);
        setIsLoadingMore(false);
      }, 400);
    }
  }, [pageLimit, filteredBusinesses.length, isLoadingMore]);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/categories");
  };

  const handleViewOnMap = () => {
    const query = encodeURIComponent(`Women Owned Businesses in ${cityName}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch(() => { });
  };

  const handleSelectFromSearch = (term: string, cat?: string) => {
    if (cat) {
      setSelectedCategory(cat);
      setSelectedSubcategory(null);
    }
    setSearchQuery(term);
  };

  // Stable handlers so the memoised BusinessCard only re-renders when its own data changes
  const handleToggleSave = useCallback((id: string) => dispatch(toggleSave(id)), [dispatch]);
  const handleOpenEnquiry = useCallback((b: BusinessListingItem) => setEnquiryBusiness(b), []);
  const handlePressCard = useCallback(
    (b: BusinessListingItem) => router.push(`/business/${b.id}` as any),
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: BusinessListingItem }) => (
      <BusinessCard
        business={item}
        isSaved={savedIds.includes(item.id)}
        onToggleSave={handleToggleSave}
        onOpenEnquiry={handleOpenEnquiry}
        onPressCard={handlePressCard}
      />
    ),
    [savedIds, handleToggleSave, handleOpenEnquiry, handlePressCard]
  );

  const sortActive = sortBy !== "recommended";
  const total = filteredBusinesses.length;

  return (
    <View style={styles.rootBackground}>
      <View style={[styles.mobileShell, isWideWeb && styles.mobileShellDesktop]}>
        {/* ===== FIXED HEADER BLOCK ===== */}
        <View style={styles.header}>
          {/* 1. Back + search */}
          <View style={[styles.searchRow, { paddingTop: topInset > 0 ? topInset + 6 : 12 }]}>
            <Pressable
              style={styles.backBtn}
              onPress={handleBack}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={24} color={C.ink} />
            </Pressable>

            <Pressable
              style={styles.searchField}
              onPress={() => router.push("/search")}
              accessibilityRole="button"
              accessibilityLabel="Search businesses, services or products"
            >
              <Ionicons name="search" size={19} color={C.pink} style={styles.searchIcon} />

              <Text
                style={[styles.searchText, !!searchQuery && styles.searchTextActive]}
                numberOfLines={1}
              >
                {searchQuery || "Search businesses, services..."}
              </Text>

              {!!searchQuery && (
                <Pressable
                  onPress={() => setSearchQuery("")}
                  hitSlop={8}
                  style={styles.fieldIconBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                >
                  <Ionicons name="close-circle" size={18} color="#AEB4BC" />
                </Pressable>
              )}

              <Pressable
                onPress={() => setSearchModalVisible(true)}
                hitSlop={6}
                style={styles.fieldIconBtn}
                accessibilityRole="button"
                accessibilityLabel="Search by voice"
              >
                <Ionicons name="mic-outline" size={20} color={C.muted} />
              </Pressable>
            </Pressable>
          </View>

          {/* 2. One horizontal row: Filter, Sort and quick chips all scroll together */}
          <View style={styles.quickRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
              contentContainerStyle={styles.chipScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <Chip
                label="Filter"
                icon="options-outline"
                selected={activeFilterCount > 0}
                soft
                badge={activeFilterCount}
                onPress={() => setFilterSheetVisible(true)}
              />
              <Chip
                label={SORT_LABELS[sortBy as string] ?? "Sort"}
                icon="swap-vertical"
                selected={sortActive}
                soft
                trailing="chevron-down"
                onPress={() => setSortSheetVisible(true)}
              />

              <View style={styles.divider} />

              <Chip
                label="Verified"
                icon="shield-checkmark"
                tint={C.blue}
                selected={verifiedOnly}
                onPress={() => setVerifiedOnly((p) => !p)}
              />
              <Chip
                label="Women-Owned"
                icon="woman"
                tint={C.pink}
                selected={womenOwnedOnly}
                onPress={() => setWomenOwnedOnly((p) => !p)}
              />
              <Chip
                label="Top Rated"
                icon="star"
                tint={C.amber}
                selected={minRating === 4.5}
                onPress={() => setMinRating((r) => (r === 4.5 ? null : 4.5))}
              />
              <Chip
                label="Open Now"
                icon="time"
                tint={C.green}
                selected={openNowOnly}
                onPress={() => setOpenNowOnly((p) => !p)}
              />
              <Chip
                label="Premium"
                icon="ribbon"
                tint={C.purple}
                selected={premiumOnly}
                onPress={() => setPremiumOnly((p) => !p)}
              />
            </ScrollView>
          </View>


        </View>

        {/* 4. Count + map */}
        <View style={styles.countBar}>
          <Text style={styles.countText} numberOfLines={1}>
            <Text style={styles.countBold}>{total}</Text> {total === 1 ? "business" : "businesses"} found in{" "}
            {cityName}
          </Text>

          <Pressable
            style={({ pressed }) => [styles.mapBtn, pressed && styles.pressed]}
            onPress={handleViewOnMap}
            accessibilityRole="button"
            accessibilityLabel="View businesses on map"
          >
            <Ionicons name="location" size={14} color={C.pink} />
            <Text style={styles.mapText}>View on map</Text>
          </Pressable>
        </View>

        {/* 5. Cards */}
        <FlatList
          ref={listRef}
          data={visibleBusinesses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.listContent, { paddingBottom: 110 + insets.bottom }]}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={7}
          removeClippedSubviews={Platform.OS !== "web"}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          renderItem={renderItem}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.loaderFooter}>
                <BusinessCardSkeleton />
              </View>
            ) : undefined
          }
          ListEmptyComponent={
            <EmptyBusinessState
              onResetFilters={handleClearAllFilters}
              message={selectedCategory ? `No businesses yet in "${selectedCategory}".` : undefined}
            />
          }
        />

        {/* Full-screen search */}
        <FullScreenSearchModal
          visible={searchModalVisible}
          onClose={() => setSearchModalVisible(false)}
          onSelectSearch={handleSelectFromSearch}
          onSelectBusiness={(b) => setSelectedBusiness(b)}
          initialQuery={searchQuery}
        />

        {/* Filter sheet */}
        <FilterBottomSheet
          visible={filterSheetVisible}
          onClose={() => setFilterSheetVisible(false)}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedSubcategory={selectedSubcategory}
          onSelectSubcategory={setSelectedSubcategory}
          selectedCity={userLocation.city}
          onSelectCity={selectCityManual}
          minRating={minRating}
          onSelectRating={setMinRating}
          womenOwnedOnly={womenOwnedOnly}
          onToggleWomenOwned={setWomenOwnedOnly}
          verifiedOnly={verifiedOnly}
          onToggleVerified={setVerifiedOnly}
          premiumOnly={premiumOnly}
          onTogglePremium={setPremiumOnly}
          openNowOnly={openNowOnly}
          onToggleOpenNow={setOpenNowOnly}
          selectedServices={selectedServices}
          onToggleService={(srv) =>
            setSelectedServices((prev) =>
              prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
            )
          }
          onClearAll={handleClearAllFilters}
          totalMatchingCount={filteredBusinesses.length}
        />

        {/* Sort sheet */}
        <SortBottomSheet
          visible={sortSheetVisible}
          selectedSort={sortBy}
          onApplySort={setSortBy}
          onClose={() => setSortSheetVisible(false)}
        />

        {/* Business details */}
        <BusinessDetailsScreen
          business={selectedBusiness}
          visible={!!selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
          isSaved={selectedBusiness ? savedIds.includes(selectedBusiness.id) : false}
          onToggleSave={handleToggleSave}
          onOpenEnquiry={handleOpenEnquiry}
          similarBusinesses={ALL_BUSINESS_LISTINGS}
          onSelectSimilar={(b) => setSelectedBusiness(b)}
        />

        {/* Enquiry */}
        <EnquiryModal
          business={enquiryBusiness}
          visible={!!enquiryBusiness}
          onClose={() => setEnquiryBusiness(null)}
        />
      </View>
    </View>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  rootBackground: { flex: 1, backgroundColor: "#F3F4F6", alignItems: "center" },
  mobileShell: { flex: 1, width: "100%", backgroundColor: WOW_COLORS.background },
  mobileShellDesktop: {
    maxWidth: 520,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: C.line,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },

  /* header block */
  header: {
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    paddingBottom: 10,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 6,
  },
  backBtn: { padding: 6, alignItems: "center", justifyContent: "center" },
  searchField: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 5,
    borderRadius: 24,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.line,
    elevation: 2,
    shadowColor: "#101828",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  searchIcon: { marginRight: 8 },
  searchText: { flex: 1, fontSize: 14, color: C.placeholder, fontWeight: "500" },
  searchTextActive: { color: C.ink, fontWeight: "700" },
  fieldIconBtn: { paddingHorizontal: 5, paddingVertical: 4 },
  searchSquare: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginLeft: 2,
    backgroundColor: C.pink,
    alignItems: "center",
    justifyContent: "center",
  },

  /* quick row */
  quickRow: { flexDirection: "row", alignItems: "center" },
  divider: { width: 1, height: 22, backgroundColor: C.line },
  chipScroll: { flex: 1 },
  chipScrollContent: { paddingHorizontal: 14, gap: 8, alignItems: "center" },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: C.surfaceAlt,
    borderWidth: 1,
    borderColor: C.line,
  },
  chipSoftActive: { backgroundColor: C.pinkSoft, borderColor: C.pinkLine },
  chipSolid: {
    backgroundColor: C.pink,
    borderColor: C.pink,
    elevation: 2,
    shadowColor: C.pink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  chipText: { fontSize: 12.5, fontWeight: "600" },
  chipTextOn: { fontWeight: "800" },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: C.pink,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 10.5, fontWeight: "800" },

  /* applied row */
  appliedRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  appliedChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    maxWidth: "100%",
    paddingLeft: 11,
    paddingRight: 8,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: C.pinkSoft,
    borderWidth: 1,
    borderColor: C.pinkLine,
  },
  appliedText: { color: "#8E1048", fontSize: 12.5, fontWeight: "700", flexShrink: 1 },

  /* count */
  countBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },
  countText: { flex: 1, fontSize: 13, color: C.text },
  countBold: { fontWeight: "800", color: C.ink },
  mapBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: C.pinkSoft,
  },
  mapText: { fontSize: 12.5, fontWeight: "800", color: C.pink },

  listContent: { paddingTop: 2, flexGrow: 1 },
  loaderFooter: { paddingVertical: 10 },
});