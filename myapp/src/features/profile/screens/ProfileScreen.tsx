import React, { useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "@/shared/theme/colors";

import {
    BEAUTY_WELLNESS_DATA,
    EXPLORE_CATEGORIES_DATA,
    FEATURED_BUSINESSES_DATA,
    HOME_SERVICES_DATA,
    POPULAR_CATEGORIES_DATA,
    STORIES_VIDEOS_DATA,
    TRENDING_NOW_DATA,
} from "@/features/home/data/homeData";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    selectSavedIds,
    toggleSave,
} from "@/features/saved/slices/savedSlice";

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
import FeaturedBusinesses from "@/features/home/components/FeaturedBusinesses";
import HomeAddSection from "@/features/home/components/HomeAddSection";

const HEADER_HEIGHT = 64;
const SEARCH_HEIGHT = 60;

export function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const dispatch = useAppDispatch();
    const savedIds = useAppSelector(selectSavedIds);

    const [search, setSearch] = useState("");

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

    const filtered = FEATURED_BUSINESSES_DATA.filter(
        (b) =>
            b.name.toLowerCase().includes(search.toLowerCase()) ||
            b.category.toLowerCase().includes(search.toLowerCase()) ||
            b.location.toLowerCase().includes(search.toLowerCase())
    );

    const topOffset = insets.top + HEADER_HEIGHT + SEARCH_HEIGHT;

    const handleNavigateCategories = () => {
        router.push("/categories");
    };

    const handleNavigateAddBusiness = () => {
        router.push("/add");
    };

    return (
        <View style={styles.container}>
            {/* Scrollable content */}
            <Animated.ScrollView
                style={styles.scroll}
                contentContainerStyle={{
                    paddingTop: topOffset,
                    paddingBottom: 100 + insets.bottom,
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
            >
                {/* 1. Hero / Advertisement Banner */}
                <HeroBanner onExplorePress={handleNavigateCategories} />

                {/* 2. Explore Categories (Horizontal 8 categories with View All) */}
                <ExploreCategories
                    categories={EXPLORE_CATEGORIES_DATA}
                    onSelectCategory={(cat) => {
                        setSearch(cat.name.replace("\n", " "));
                    }}
                    onViewAll={handleNavigateCategories}
                />



                {/* 1. Home Services Section */}
                <ServiceShowcaseSection
                    iconName="home-outline"
                    title="Home Services"
                    subtitle="Trusted home solutions by women entrepreneurs"
                    items={HOME_SERVICES_DATA}
                    onSeeAll={handleNavigateCategories}
                    onSelectItem={(item) =>
                        setSearch((item.title || item.name || "").replace(/\n/g, " "))
                    }
                />



                {/* 5. Promote Your Business Banner */}
                <PromoteBusinessBanner onAdvertisePress={handleNavigateAddBusiness} />

                {/* 6. Popular Categories (2x4 Pills Grid) */}
                <PopularCategories
                    categories={POPULAR_CATEGORIES_DATA}
                    onSelectCategory={(item) => setSearch(item.name)}
                />

                {/* 7. WOW Stories & Videos */}
                <StoriesAndVideos
                    stories={STORIES_VIDEOS_DATA}
                    onSeeAll={handleNavigateCategories}
                />

                {/* 8. Products Promo Card */}
                <ProductsPromoBanner onShopPress={handleNavigateCategories} />

                {/* 9. Trending Now Section */}
                <TrendingNowSection
                    items={TRENDING_NOW_DATA}
                    onViewMore={handleNavigateCategories}
                    onSelectItem={(item) => setSearch(item.title.replace("\n", " "))}
                />

                <HomeAddSection />

            </Animated.ScrollView>

            {/* Floating Topbar (HeaderBar + SearchBar) */}
            <Animated.View
                style={[
                    styles.overlay,
                    { top: insets.top, transform: [{ translateY: headerTranslateY }] },
                ]}
            >
                <View style={styles.headerWrap}>
                    <HeaderBar userName="Priya" />
                </View>

                <View style={styles.stickySearch}>
                    <SearchBar value={search} onChangeText={setSearch} />
                </View>
            </Animated.View>

            {/* Solid status-bar cover */}
            <View style={[styles.statusCover, { height: insets.top }]} />
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
