import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface HeaderBarProps {
  userName?: string;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
}

export default function HeaderBar({
  userName = "Priya",
  onMenuPress,
  onNotificationPress,
}: HeaderBarProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.iconButton} onPress={onMenuPress}>
        <View style={styles.menuIconContainer}>
          <View style={styles.menuBarTop} />
          <View style={styles.menuBarMiddle} />
          <View style={styles.menuBarBottom} />
        </View>
      </Pressable>

      <View style={styles.titleContainer}>
        <Text style={styles.greetingText}>
          Hello, {userName} <Text style={styles.waveEmoji}>👋</Text>
        </Text>
      </View>

      <Pressable style={styles.notificationButton} onPress={onNotificationPress}>
        {/* Bell Icon rendered cleanly with pure styles & unicode for zero-dep reliability */}
        <Text style={styles.bellIcon}>🔔</Text>
        <View style={styles.badgeDot} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    padding: 6,
    justifyContent: "center",
  },
  menuIconContainer: {
    width: 22,
    height: 16,
    justifyContent: "space-between",
  },
  menuBarTop: {
    width: 20,
    height: 2.5,
    backgroundColor: "#111827",
    borderRadius: 2,
  },
  menuBarMiddle: {
    width: 14,
    height: 2.5,
    backgroundColor: "#111827",
    borderRadius: 2,
  },
  menuBarBottom: {
    width: 18,
    height: 2.5,
    backgroundColor: "#111827",
    borderRadius: 2,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.3,
  },
  waveEmoji: {
    fontSize: 18,
  },
  notificationButton: {
    padding: 6,
    position: "relative",
  },
  bellIcon: {
    fontSize: 20,
    color: "#111827",
  },
  badgeDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1006C",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
});

