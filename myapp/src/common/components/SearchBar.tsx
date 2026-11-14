// Simple, clean search row in the Justdial style: white box with a thin border,
// search icon, mic on the right, and plain heart / bell icons beside it.
// Used by: features/home/screens/HomeScreen.tsx

import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/theme/colors";

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

const UI = {
  text: "#111827",
  muted: "#6B7280",
  placeholder: "#8A8F98",
  border: "#D9DDE3",
  divider: "#E5E7EB",
  alert: "#E53935", // notification badge
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
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const hasCount = typeof notificationCount === "number" && notificationCount > 0;
  const countLabel = hasCount ? (notificationCount! > 9 ? "9+" : String(notificationCount)) : "";

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
        <Ionicons name="search" size={20} color={focused ? COLORS.brand : UI.muted} />

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
            <Ionicons name="close-circle" size={18} color={UI.placeholder} />
          </Pressable>
        ) : null}

        {/* Mic: plain brand icon after a thin divider */}
        <View style={styles.divider} />
        <Pressable
          onPress={onVoicePress}
          hitSlop={8}
          style={({ pressed }) => pressed && styles.pressed}
          accessibilityRole="button"
          accessibilityLabel="Voice search"
        >
          <Ionicons name="mic" size={22} color={COLORS.brand} />
        </Pressable>
      </Pressable>

      {/* Favourites */}
      <Pressable
        onPress={onFavoritePress}
        hitSlop={6}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Favourites"
      >
        <Ionicons name="heart-outline" size={25} color={UI.text} />
      </Pressable>

      {/* Notifications */}
      <Pressable
        onPress={onNotificationPress}
        hitSlop={6}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={hasCount ? `Notifications, ${notificationCount} new` : "Notifications"}
      >
        <Ionicons name="notifications-outline" size={25} color={UI.text} />
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
    gap: 4,
    paddingLeft: 14,
    paddingRight: 8,
    paddingVertical: 10,
    backgroundColor: UI.white,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: UI.white,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: UI.border,
    // soft lift, like the Justdial search bar
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchBoxFocused: {
    borderColor: COLORS.brand,
  },
  input: {
    flex: 1,
    height: "100%",
    minWidth: 0,
    fontSize: 16,
    color: UI.text,
    paddingVertical: 0,
  },
  divider: {
    width: 1,
    height: 22,
    backgroundColor: UI.divider,
  },
  iconBtn: {
    width: 42,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
  badgeDot: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: UI.alert,
    borderWidth: 1.5,
    borderColor: UI.white,
  },
  countBadge: {
    position: "absolute",
    top: 4,
    right: 2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: UI.alert,
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