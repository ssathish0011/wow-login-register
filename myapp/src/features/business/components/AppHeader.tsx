import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { WOW_COLORS } from "@/shared/theme/colors";

const LOGO_IMG = require("../../../../assets/logo.png");

interface AppHeaderProps {
  locationDisplayName: string;
  isLocating?: boolean;
  onOpenLocationSheet: () => void;
  notificationCount?: number;
}

export default function AppHeader({
  locationDisplayName,
  isLocating = false,
  onOpenLocationSheet,
  notificationCount = 2,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 8) }]}>
      <View style={styles.topRow}>
        {/* Left: WOW Brand Logo */}
        <Pressable
          style={styles.logoBtn}
          onPress={() => router.push("/home")}
          accessibilityRole="button"
          accessibilityLabel="Home"
        >
          <Image source={LOGO_IMG} style={styles.logoImage} resizeMode="contain" />
        </Pressable>

        {/* Right: Location Selector + Notification + Profile */}
        <View style={styles.rightGroup}>
          {/* Location Selector Pill */}
          <Pressable
            style={styles.locationPill}
            onPress={onOpenLocationSheet}
            accessibilityRole="button"
            accessibilityLabel={`Location: ${locationDisplayName}. Tap to change.`}
          >
            {isLocating ? (
              <ActivityIndicator size="small" color={WOW_COLORS.primaryPink} />
            ) : (
              <Ionicons name="location-sharp" size={14} color={WOW_COLORS.primaryPink} />
            )}
            <Text style={styles.locationText} numberOfLines={1}>
              {locationDisplayName}
            </Text>
            <Ionicons name="chevron-down" size={12} color={WOW_COLORS.secondaryText} />
          </Pressable>

          {/* Notification Button */}
          <Pressable
            style={styles.iconCircle}
            onPress={() => { }}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={18} color={WOW_COLORS.primaryText} />
            {notificationCount > 0 && (
              <View style={styles.notifDot}>
                <Text style={styles.notifDotText}>{notificationCount}</Text>
              </View>
            )}
          </Pressable>

          {/* Profile Avatar */}
          <Pressable
            style={styles.avatarBtn}
            onPress={() => router.push("/profile")}
            accessibilityRole="button"
            accessibilityLabel="Profile"
          >
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={15} color={WOW_COLORS.primaryPink} />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: WOW_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: WOW_COLORS.border,
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  logoBtn: {
    justifyContent: "center",
  },
  logoImage: {
    width: 125,
    height: 40,
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WOW_COLORS.softPink,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
    maxWidth: 155,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
    flexShrink: 1,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notifDot: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: WOW_COLORS.primaryPink,
    borderRadius: 6,
    minWidth: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  notifDotText: {
    color: WOW_COLORS.white,
    fontSize: 9,
    fontWeight: "800",
  },
  avatarBtn: {
    padding: 1,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: WOW_COLORS.softPink,
    borderWidth: 1.5,
    borderColor: WOW_COLORS.primaryPink,
    alignItems: "center",
    justifyContent: "center",
  },
});
