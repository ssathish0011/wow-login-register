import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabType } from "../types/home.types";

interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomTabBar({
  activeTab,
  onTabChange,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.barContainer,
        { paddingBottom: Math.max(insets.bottom, 8) + 4 },
      ]}
    >
      {/* 1. Home */}
      <Pressable
        style={styles.tabItem}
        onPress={() => onTabChange("home")}
      >
        <Text
          style={[
            styles.tabIcon,
            activeTab === "home" && styles.tabIconActive,
          ]}
        >
          🏠
        </Text>
        <Text
          style={[
            styles.tabLabel,
            activeTab === "home" && styles.tabLabelActive,
          ]}
        >
          Home
        </Text>
      </Pressable>

      {/* 2. Categories */}
      <Pressable
        style={styles.tabItem}
        onPress={() => onTabChange("categories")}
      >
        <View style={styles.gridIconContainer}>
          <View
            style={[
              styles.gridDot,
              activeTab === "categories" && styles.gridDotActive,
            ]}
          />
          <View
            style={[
              styles.gridDot,
              activeTab === "categories" && styles.gridDotActive,
            ]}
          />
          <View
            style={[
              styles.gridDot,
              activeTab === "categories" && styles.gridDotActive,
            ]}
          />
          <View
            style={[
              styles.gridDot,
              activeTab === "categories" && styles.gridDotActive,
            ]}
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            activeTab === "categories" && styles.tabLabelActive,
          ]}
        >
          Categories
        </Text>
      </Pressable>

      {/* 3. Add Business (Elevated central button) */}
      <Pressable
        style={styles.centerAddTab}
        onPress={() => onTabChange("add")}
      >
        <View style={styles.addCircle}>
          <Text style={styles.plusSymbol}>＋</Text>
        </View>
        <Text style={styles.addBusinessLabel}>Add Business</Text>
      </Pressable>

      {/* 4. Saved */}
      <Pressable
        style={styles.tabItem}
        onPress={() => onTabChange("saved")}
      >
        <Text
          style={[
            styles.tabIcon,
            activeTab === "saved" && styles.tabIconActive,
          ]}
        >
          ♡
        </Text>
        <Text
          style={[
            styles.tabLabel,
            activeTab === "saved" && styles.tabLabelActive,
          ]}
        >
          Saved
        </Text>
      </Pressable>

      {/* 5. Profile */}
      <Pressable
        style={styles.tabItem}
        onPress={() => onTabChange("profile")}
      >
        <Text
          style={[
            styles.tabIcon,
            activeTab === "profile" && styles.tabIconActive,
          ]}
        >
          👤
        </Text>
        <Text
          style={[
            styles.tabLabel,
            activeTab === "profile" && styles.tabLabelActive,
          ]}
        >
          Profile
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 20,
    color: "#9CA3AF",
  },
  tabIconActive: {
    color: "#D1006C",
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: "500",
    color: "#9CA3AF",
    marginTop: 4,
  },
  tabLabelActive: {
    color: "#D1006C",
    fontWeight: "700",
  },
  gridIconContainer: {
    width: 17,
    height: 17,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  gridDot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
  },
  gridDotActive: {
    borderColor: "#D1006C",
    backgroundColor: "#D1006C",
  },
  centerAddTab: {
    flex: 1.3,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -24,
  },
  addCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#D1006C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D1006C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  plusSymbol: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: -2,
  },
  addBusinessLabel: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#D1006C",
    marginTop: 3,
  },
});

