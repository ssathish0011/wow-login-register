import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "@/shared/theme/colors";

import {
  BEAUTY_WELLNESS_DATA,
  EXPLORE_CATEGORIES_DATA,
  HOME_SERVICES_DATA,
  POPULAR_CATEGORIES_DATA,
  STORIES_VIDEOS_DATA,
  TRENDING_NOW_DATA,
} from "@/features/home/data/homeData";
import { BUSINESS_CATEGORIES } from "@/features/business/data/businessListingData";

import HeaderBar from "@/shared/components/HeaderBar";
import SearchBar from "@/shared/components/SearchBar";
import HeroBanner from "@/features/home/components/HeroBanner";
import ExploreCategories from "@/features/home/components/ExploreCategories";
import ServiceShowcaseSection from "@/features/home/components/ServiceShowcaseSection";
import PromoteBusinessBanner from "@/features/home/components/PromoteBusinessBanner";
import PopularCategories from "@/features/home/components/PopularCategories";
import StoriesAndVideos from "@/features/home/components/StoriesAndVideos";
import ProductsPromoBanner from "@/features/home/components/ProductsPromoBanner";
import TrendingNowSection from "@/features/home/components/TrendingNowSection";
import HomeAddSection from "../components/HomeAddSection";

import LocationBottomSheet from "@/features/business/components/LocationBottomSheet";
import { useLocation } from "@/shared/context/LocationContext";
import { useNotifications } from "@/features/notifications/services/notificationService";

const HEADER_HEIGHT = 64;
const SEARCH_HEIGHT = 60;

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    userLocation,
    selectCityManual,
    detectLocationAgain,
    locationSheetVisible,
    setLocationSheetVisible,
    isLocating,
  } = useLocation();

  const { unreadCount } = useNotifications();

  // Scroll-linked header animation
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = useMemo(() => {
    const clampedScroll = scrollY.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolateLeft: "clamp",
    });
    const diff = Animated.diffClamp(clampedScroll, 0, HEADER_HEIGHT);
    return diff.interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [0, -HEADER_HEIGHT],
      extrapolate: "clamp",
    });
  }, [scrollY]);

  const topInset =
    insets.top > 0
      ? insets.top
      : Platform.OS === "android"
        ? RNStatusBar.currentHeight || 0
        : 0;

  const topOffset = topInset + HEADER_HEIGHT + SEARCH_HEIGHT;

  // Helper to open subcategories page for a category
  const handleCategoryPress = (categoryName: string) => {
    const clean = categoryName.toLowerCase().trim();
    const match = BUSINESS_CATEGORIES.find(
      (c) =>
        c.name.toLowerCase().includes(clean) ||
        clean.includes(c.name.toLowerCase()) ||
        c.id.toLowerCase() === clean
    );

    if (match) {
      router.push({
        pathname: "/category/[slug]",
        params: { slug: match.id },
      });
    } else {
      router.push({
        pathname: "/businesses",
        params: { category: categoryName },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Scrollable content */}
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingTop: topOffset,
          paddingBottom: 110 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: Platform.OS !== "web" }
        )}
      >
        {/* 1. Hero / Advertisement Banner */}
        <HeroBanner onExplorePress={() => router.push("/businesses")} />

        {/* 2. Explore Categories (Horizontal categories with View All) */}
        <ExploreCategories
          categories={EXPLORE_CATEGORIES_DATA}
          onSelectCategory={(cat) => {
            handleCategoryPress(cat.name.replace("\n", " "));
          }}
          onViewAll={() => router.push("/categories")}
        />

        {/* 3. Home Services Section */}
        <ServiceShowcaseSection
          iconName="home-outline"
          title="Home Services"
          items={HOME_SERVICES_DATA}
          onSeeAll={() =>
            router.push({
              pathname: "/businesses",
              params: { category: "Home & Interiors" },
            })
          }
          onSelectItem={() =>
            router.push({
              pathname: "/businesses",
              params: { category: "Home & Interiors" },
            })
          }
        />

        {/* 4. Beauty & Wellness Section */}
        <ServiceShowcaseSection
          title="Beauty & Wellness"
          items={BEAUTY_WELLNESS_DATA}
          onSeeAll={() => handleCategoryPress("Beauty & Wellness")}
          onSelectItem={() => handleCategoryPress("Beauty & Wellness")}
        />

        {/* 5. Promote Your Business Banner */}
        <PromoteBusinessBanner
          onAdvertisePress={() => router.push("/add-business" as any)}
        />

        {/* 6. Popular Categories (2x4 Pills Grid) */}
        {/* <PopularCategories
          categories={POPULAR_CATEGORIES_DATA}
          onSelectCategory={(item) => handleCategoryPress(item.name)}
        /> */}

        {/* 7. WOW Stories & Videos */}
        <StoriesAndVideos
          stories={STORIES_VIDEOS_DATA}
          onSeeAll={() => router.push("/categories")}
        />

        {/* 8. Products Promo Card */}
        <ProductsPromoBanner
          onShopPress={() => router.push("/businesses")}
        />

        {/* 9. Trending Now Section */}
        <TrendingNowSection
          items={TRENDING_NOW_DATA}
          onViewMore={() => router.push("/categories")}
          onSelectItem={(item) => {
            // Tapping a business in Trending Now leads to Business detail
            const bizId = item.id ? `biz-${item.id}` : "biz-1";
            router.push(`/business/${bizId}` as any);
          }}
        />

        <HomeAddSection />
      </Animated.ScrollView>

      {/* Floating Topbar (HeaderBar + SearchBar) */}
      <Animated.View
        style={[
          styles.overlay,
          { top: topInset, transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <View style={styles.headerWrap}>
          <HeaderBar
            userName="Priya"
            location={userLocation.displayName}
            onLocationPress={() => setLocationSheetVisible(true)}
            onBrandPress={() => { }}
          />
        </View>

        <View style={styles.stickySearch}>
          <SearchBar
            value=""
            placeholder='Search "Salon", "Catering", "Tailoring"...'
            onChangeText={() => { }}
            onSubmit={() => router.push("/search")}
            onVoicePress={() => router.push("/search")}
            onFavoritePress={() => router.push("/saved")}
            onNotificationPress={() => router.push("/notifications")}
            showNotificationDot={unreadCount > 0}
            notificationCount={unreadCount}
          />
        </View>
      </Animated.View>

      {/* Solid status-bar cover */}
      <View style={[styles.statusCover, { height: topInset }]} />

      {/* Location Bottom Sheet */}
      <LocationBottomSheet
        visible={locationSheetVisible}
        selectedCity={userLocation.city}
        onSelectCity={selectCityManual}
        onClose={() => setLocationSheetVisible(false)}
        onDetectCurrentLocation={detectLocationAgain}
        isDetecting={isLocating}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9FB",
  },
  scroll: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#FFFFFF",
  },
  headerWrap: {
    height: HEADER_HEIGHT,
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  stickySearch: {
    height: SEARCH_HEIGHT,
    justifyContent: "center",
    backgroundColor: COLORS.white,
    paddingBottom: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  statusCover: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: COLORS.white,
  },
});
