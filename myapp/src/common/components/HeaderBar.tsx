
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

import icon from "../../../assets/logo.png";

interface HeaderBarProps {
  location?: string;
  userName?: string;
  onLocationPress?: () => void;
  onMenuPress?: () => void;
  onBrandPress?: () => void;
  safeTop?: boolean;
}

// Logo sizing
const LOGO_HEIGHT = 50;

// Set the actual logo aspect ratio here if needed.
const LOGO_WIDTH = 140;

const LOGO_OFFSET_LEFT = 0;

export default function HeaderBar({
  location = "Chennai, Tamil Nadu",
  onLocationPress,
  onBrandPress,
  safeTop = false,
}: HeaderBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: (safeTop ? insets.top : 0) + 4,
        },
      ]}
    >
      {/* LEFT: Brand */}
      <Pressable
        style={styles.logoButton}
        onPress={onBrandPress}
        accessibilityRole="button"
        accessibilityLabel="Go to home"
      >
        <Image source={icon} style={styles.logo} resizeMode="contain" />
      </Pressable>

      {/* RIGHT: Location selector */}
      <Pressable
        style={({ pressed }) => [
          styles.locationButton,
          pressed && styles.locationPressed,
        ]}
        onPress={onLocationPress}
        accessibilityRole="button"
        accessibilityLabel={`Change location, current ${location}`}
        hitSlop={8}
      >
        <Ionicons name="location-outline" size={18} color={COLORS.brand} />

        <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
          {location}
        </Text>

        <Ionicons
          name="chevron-down"
          size={16}
          color={COLORS.text ?? "#111827"}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },

  logoButton: {
    height: LOGO_HEIGHT,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    marginLeft: LOGO_OFFSET_LEFT,
  },

  locationButton: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginLeft: 10,
    paddingVertical: 8,
  },

  locationText: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text ?? "#111827",
  },

  locationPressed: {
    opacity: 0.65,
  },
});
