// WOW Business Directory bottom tab bar (modern floating style).
// Layout: Home | Businesses | (+) Add Business | Categories | Profile
// "Saved" is not in the bar (open it from the heart icon on the home header).

import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "../constants/colors";
import { getToken } from "@/utils/auth";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface TabConfig {
  icon: IoniconName;
  iconFocused: IoniconName;
  label: string;
}

const TAB_CONFIG: Record<string, TabConfig> = {
  home: {
    icon: "home-outline",
    iconFocused: "home",
    label: "Home",
  },
  businesses: {
    icon: "storefront-outline",
    iconFocused: "storefront",
    label: "Businesses",
  },
  categories: {
    icon: "grid-outline",
    iconFocused: "grid",
    label: "Categories",
  },
  profile: {
    icon: "person-outline",
    iconFocused: "person",
    label: "Profile",
  },
};

const TAB_PATHS: Record<string, string> = {
  home: "/home",
  businesses: "/businesses",
  categories: "/categorie",
  profile: "/profile",
  saved: "/saved",
  add: "/add",
};

const INACTIVE = "#8A8F98";

/* ---------- Single tab with smooth animation ---------- */
function TabItem({
  config,
  focused,
  onPress,
}: {
  config: TabConfig;
  focused: boolean;
  onPress: () => void;
}) {
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: focused ? 1 : 0,
      useNativeDriver: Platform.OS !== "web",
      friction: 7,
      tension: 90,
    }).start();
  }, [focused, progress]);

  const pillScaleX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const pillOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.12],
  });
  const iconLift = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2],
  });
  const iconScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  return (
    <Pressable
      style={styles.tabItem}
      onPress={onPress}
      accessibilityLabel={config.label}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      android_ripple={undefined}
    >
      <View style={styles.iconBox}>
        <Animated.View
          style={[
            styles.activePill,
            { opacity: pillOpacity, transform: [{ scaleX: pillScaleX }] },
          ]}
        />
        <Animated.View
          style={{ transform: [{ translateY: iconLift }, { scale: iconScale }] }}
        >
          <Ionicons
            name={focused ? config.iconFocused : config.icon}
            size={22}
            color={focused ? WOW_COLORS.primaryPink : INACTIVE}
          />
        </Animated.View>
      </View>
      <Text
        style={[styles.tabLabel, focused && styles.tabLabelActive]}
        numberOfLines={1}
      >
        {config.label}
      </Text>
    </Pressable>
  );
}

/* ---------- Center + button ---------- */
function AddButton({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const animate = (to: number) =>
    Animated.timing(scale, {
      toValue: to,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: Platform.OS !== "web",
    }).start();

  return (
    <View style={styles.addWrapper}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animate(0.92)}
        onPressOut={() => animate(1)}
        accessibilityLabel="Add Business"
        accessibilityRole="button"
      >
        <Animated.View style={[styles.addButton, { transform: [{ scale }] }]}>
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </Animated.View>
      </Pressable>
    </View>
  );
}

/* ---------- Bar ---------- */
export default function BottomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  if (!state || !state.routes || !Array.isArray(state.routes)) {
    return null;
  }

  const currentRouteName = state.routes[state.index]?.name;

  // Hide the bar on the Add Business page
  if (
    currentRouteName === "add" ||
    pathname.includes("/add") ||
    pathname.includes("add-business")
  ) {
    return null;
  }

  const visibleRoutes = state.routes.filter((route: any) => {
    const desc = descriptors?.[route.key];
    const options = desc?.options;
    if (options && options.href === null) return false;
    return Boolean(TAB_CONFIG[route.name]);
  });

  const middle = Math.floor(visibleRoutes.length / 2);

  // The + button opens existing Add Business page.
  // If user isn't logged in, redirect to login first then return.
  const onAddPress = async () => {
    try {
      const token = await getToken();
      if (!token) {
        router.push("/login?redirect=/add" as any);
      } else {
        try {
          navigation?.navigate?.("add");
        } catch { }
        router.push("/add" as any);
      }
    } catch {
      router.push("/add" as any);
    }
  };

  const items: React.ReactNode[] = [];
  visibleRoutes.forEach((route: any, index: number) => {
    if (index === middle) {
      items.push(<AddButton key="add-business" onPress={onAddPress} />);
    }

    // Determine if this tab is active, supporting child pages:
    // - Home active on /home or /
    // - Businesses active on /businesses or /business/[id]
    // - Categories active on /categories or /category/[slug]
    // - Profile active on /profile or /saved
    const isFocused = (() => {
      if (route.name === "home") {
        return (
          currentRouteName === "home" ||
          pathname === "/home" ||
          pathname === "/"
        );
      }
      if (route.name === "businesses") {
        return (
          currentRouteName === "businesses" ||
          pathname.includes("/businesses") ||
          pathname.includes("/business")
        );
      }
      if (route.name === "categories") {
        return (
          currentRouteName === "categories" ||
          pathname.includes("/categories") ||
          pathname.includes("/category")
        );
      }
      if (route.name === "profile") {
        return (
          currentRouteName === "profile" ||
          currentRouteName === "saved" ||
          pathname.includes("/profile") ||
          pathname.includes("/saved")
        );
      }
      return currentRouteName === route.name;
    })();

    const onPress = () => {
      let defaultPrevented = false;
      try {
        const event = navigation?.emit?.({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });
        defaultPrevented = !!event?.defaultPrevented;
      } catch { }

      if (!defaultPrevented) {
        const targetPath = TAB_PATHS[route.name] || `/(tabs)/${route.name}`;

        // 1. Try local navigator switch
        try {
          navigation?.navigate?.(route.name);
        } catch { }

        // 2. Guaranteed Expo Router navigation
        try {
          router.push(targetPath as any);
        } catch {
          try {
            router.push(`/${route.name}` as any);
          } catch { }
        }
      }
    };

    items.push(
      <TabItem
        key={route.key}
        config={TAB_CONFIG[route.name]}
        focused={isFocused}
        onPress={onPress}
      />
    );
  });

  return (
    // box-none lets touches pass through the empty space around the floating bar
    <View
      pointerEvents="box-none"
      style={[styles.outer, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <View style={styles.bar}>{items}</View>
    </View>
  );
}

const ADD_SIZE = 52;
const BAR_HEIGHT = 66;

const styles = StyleSheet.create({
  outer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    zIndex: 50,
  },
  bar: {
    height: BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: WOW_COLORS.white,
    borderRadius: 30,
    paddingHorizontal: 6,
    overflow: "visible",
    // soft floating shadow
    shadowColor: "#1F1030",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  iconBox: {
    width: 52,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  activePill: {
    position: "absolute",
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: WOW_COLORS.primaryPink,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: INACTIVE,
  },
  tabLabelActive: {
    color: WOW_COLORS.primaryPink,
    fontWeight: "700",
  },

  // Center + button, raised above the bar
  addWrapper: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
  addButton: {
    width: ADD_SIZE,
    height: ADD_SIZE,
    borderRadius: ADD_SIZE / 2,
    backgroundColor: WOW_COLORS.primaryPink,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: WOW_COLORS.white,
    shadowColor: WOW_COLORS.primaryPink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
});
