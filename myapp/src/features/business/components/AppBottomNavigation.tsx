import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { WOW_COLORS } from "@/common/constants/colors";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface TabItem {
  id: string;
  route: string;
  label: string;
  icon: IoniconName;
  iconActive: IoniconName;
}

const TABS: TabItem[] = [
  {
    id: "home",
    route: "/home",
    label: "Home",
    icon: "home-outline",
    iconActive: "home",
  },
  {
    id: "categories",
    route: "/categories",
    label: "Categories",
    icon: "grid-outline",
    iconActive: "grid",
  },
  {
    id: "saved",
    route: "/saved",
    label: "Saved",
    icon: "heart-outline",
    iconActive: "heart",
  },
  {
    id: "videos",
    route: "/home", // or videos section
    label: "Videos",
    icon: "play-circle-outline",
    iconActive: "play-circle",
  },
  {
    id: "profile",
    route: "/profile",
    label: "Profile",
    icon: "person-outline",
    iconActive: "person",
  },
];

export default function AppBottomNavigation() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View
      style={[
        styles.navContainer,
        { paddingBottom: Math.max(insets.bottom, 8) + 4 },
      ]}
    >
      {TABS.map((tab) => {
        const isActive =
          pathname === tab.route ||
          (tab.id === "categories" && pathname.includes("categories"));

        return (
          <Pressable
            key={tab.id}
            style={styles.tabBtn}
            onPress={() => router.push(tab.route as any)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={24}
              color={isActive ? WOW_COLORS.primaryPink : "#6B7280"}
            />
            <Text
              style={[
                styles.tabLabel,
                isActive && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: WOW_COLORS.white,
    borderTopWidth: 1,
    borderTopColor: WOW_COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
  },
  tabLabelActive: {
    color: WOW_COLORS.primaryPink,
    fontWeight: "700",
  },
});

