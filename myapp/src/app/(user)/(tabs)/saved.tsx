import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, WOW_COLORS } from "@/shared/theme/colors";
import ScreenWrapper from "@/shared/components/ScreenWrapper";
import { FEATURED_BUSINESSES_DATA } from "@/features/home/data/homeData";
import { ALL_BUSINESS_LISTINGS } from "@/features/business/data/businessListingData";
import { BusinessItem } from "@/features/home/types/home.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectSavedIds,
  toggleSave,
} from "@/features/saved/slices/savedSlice";
import SavedList from "@/features/saved/components/SavedList";

export default function SavedRoute() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const savedIds = useAppSelector(selectSavedIds);

  // Combine both sources so saved IDs always find their matching business
  const combinedBusinesses: BusinessItem[] = useMemo(() => {
    const listMap = new Map<string, BusinessItem>();
    FEATURED_BUSINESSES_DATA.forEach((b) => listMap.set(b.id, b));
    ALL_BUSINESS_LISTINGS.forEach((b) => {
      listMap.set(b.id, {
        id: b.id,
        name: b.name,
        category: b.category,
        rating: b.rating,
        reviewsCount: b.reviewsCount,
        reviews: `${b.reviewsCount}`,
        location: b.location,
        image: b.imageUrl,
        imageUrl: b.imageUrl,
      });
    });
    return Array.from(listMap.values());
  }, []);

  const handleBusinessPress = (item: BusinessItem) => {
    router.push(`/business/${item.id}` as any);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: COLORS.white }}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={WOW_COLORS.primaryText} />
        </Pressable>
        <Text style={styles.headerTitle}>Saved Businesses</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SavedList
          businesses={combinedBusinesses}
          savedIds={savedIds}
          onToggleSave={(id) => dispatch(toggleSave(id))}
          onBusinessPress={handleBusinessPress}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: COLORS.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  scroll: {
    paddingBottom: 110,
  },
});
