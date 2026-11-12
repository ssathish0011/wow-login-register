// Professional search row: soft filled search box with a brand mic button,
// plus rounded favourites and notification buttons.
// Used by: features/home/screens/HomeScreen.tsx

import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: (text: string) => void; // keyboard "search" key
  onVoicePress?: () => void;
  onFavoritePress?: () => void;
  onNotificationPress?: () => void;
  showNotificationDot?: boolean;
  notificationCount?: number; // optional number badge instead of the dot
  onFilterPress?: () => void; // kept so existing usage still compiles
}

// Neutral palette: one brand accent, everything else slate/grey
const UI = {
  text: "#111827",
  muted: "#6B7280",
  placeholder: "#9CA3AF",
  surface: "#F4F5F7",
  border: "#E5E7EB",
  white: "#FFFFFF",
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search "Salon"',
  onSubmit,
  onVoicePress,
  onFavoritePress,
  onNotificationPress,
  showNotificationDot = true,
  notificationCount,
}: SearchBarProps) {
  const inputRef = useRef<any>(null);
  const [focused, setFocused] = useState(false);

  const hasCount =
    typeof notificationCount === "number" && notificationCount > 0;
  const countLabel = hasCount
    ? notificationCount! > 9
      ? "9+"
      : String(notificationCount)
    : "";

  const handleClear = () => {
    onChangeText("");
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      {/* Search box */}
      <Pressable
        style={[styles.searchBox, focused && styles.searchBoxFocused]}
        onPress={() => inputRef.current?.focus()}
        accessible={false}
      >
        <Ionicons
          name="search"
          size={20}
          color={focused ? COLORS.brand : UI.muted}
        />

        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={UI.placeholder}
          selectionColor={COLORS.brand}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={() => onSubmit?.(value.trim())}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityLabel="Search"
        />

        {value.length > 0 ? (
          <Pressable
            onPress={handleClear}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={19} color={UI.placeholder} />
          </Pressable>
        ) : null}

        {/* Mic: filled brand circle */}
        <Pressable
          onPress={onVoicePress}
          hitSlop={6}
          style={({ pressed }) => [styles.micBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Voice search"
        >
          <Ionicons name="mic" size={17} color={UI.white} />
        </Pressable>
      </Pressable>

      {/* Favourites */}
      <Pressable
        onPress={onFavoritePress}
        hitSlop={4}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Favourites"
      >
        <Ionicons name="heart-outline" size={23} color={UI.text} />
      </Pressable>

      {/* Notifications */}
      <Pressable
        onPress={onNotificationPress}
        hitSlop={4}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={
          hasCount ? `Notifications, ${notificationCount} new` : "Notifications"
        }
      >
        <Ionicons name="notifications-outline" size={23} color={UI.text} />
        {hasCount ? (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{countLabel}</Text>
          </View>
        ) : showNotificationDot ? (
          <View style={styles.badgeDot} />
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: UI.white,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 48,
    paddingLeft: 14,
    paddingRight: 8,
    backgroundColor: UI.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  // On focus: white box, brand border, soft brand glow
  searchBoxFocused: {
    backgroundColor: UI.white,
    borderColor: COLORS.brand,
    shadowColor: COLORS.brand,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    height: "100%",
    minWidth: 0,
    fontSize: 15,
    fontWeight: "500",
    color: UI.text,
    paddingVertical: 0,
  },
  micBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: UI.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  badgeDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.brand,
    borderWidth: 1.5,
    borderColor: UI.surface,
  },
  countBadge: {
    position: "absolute",
    top: 3,
    right: 3,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: COLORS.brand,
    borderWidth: 1.5,
    borderColor: UI.white,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: UI.white,
    lineHeight: 12,
  },
});