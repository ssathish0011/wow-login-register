import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/common/constants/colors";
import ScreenWrapper from "@/common/components/ScreenWrapper";
import ProfileCard from "@/features/profile/components/ProfileCard";
import LocationBottomSheet from "@/features/business/components/LocationBottomSheet";
import { useLocation } from "@/context/LocationContext";

export default function ProfileRoute() {
  const insets = useSafeAreaInsets();
  const {
    userLocation,
    selectCityManual,
    detectLocationAgain,
    locationSheetVisible,
    setLocationSheetVisible,
    isLocating,
  } = useLocation();

  return (
    <ScreenWrapper style={{ backgroundColor: COLORS.white }}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: 110 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileCard />
      </ScrollView>

      {/* Location Bottom Sheet */}
      <LocationBottomSheet
        visible={locationSheetVisible}
        selectedCity={userLocation.city}
        onSelectCity={selectCityManual}
        onClose={() => setLocationSheetVisible(false)}
        onDetectCurrentLocation={detectLocationAgain}
        isDetecting={isLocating}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 16,
  },
});

