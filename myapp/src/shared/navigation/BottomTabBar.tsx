// WOW Business Directory bottom tab bar (clean flat layout + original spring animation).
// Layout: Home | Businesses | (+) Add | Categories | Profile

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
import { WOW_COLORS } from "@/shared/theme/colors";
import { getToken } from "@/_duplicates/utils/auth";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface TabConfig {
  icon: IoniconName;
  iconFocused: IoniconName;
  label: string;
}

const TAB_CONFIG: Record<string, TabConfig> = {
  home: { icon: "home-outline", iconFocused: "home", label: "Home" },
  businesses: {
    icon: "storefront-outline",
    iconFocused: "storefront",
    label: "Businesses",
  },
  categories: { icon: "grid-outline", iconFocused: "grid", label: "Categories" },
  profile: { icon: "person-outline", iconFocused: "person", label: "Profile" },
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
const BORDER = "#E8EAEE";

/* ---------- Single tab with original spring animation ---------- */
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

/* ---------- Center Add button (original press animation) ---------- */
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
    <Pressable
      style={styles.tabItem}
      onPress={onPress}
      onPressIn={() => animate(0.92)}
      onPressOut={() => animate(1)}
      accessibilityLabel="Add Business"
      accessibilityRole="button"
    >
      <View style={styles.iconBox}>
        <Animated.View style={[styles.addCircle, { transform: [{ scale }] }]}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </Animated.View>
      </View>
      <Text style={styles.addLabel} numberOfLines={1}>
        Add Business
      </Text>
    </Pressable>
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
    const options = descriptors?.[route.key]?.options;
    if (options && options.href === null) return false;
    return Boolean(TAB_CONFIG[route.name]);
  });

  const middle = Math.floor(visibleRoutes.length / 2);

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

  const isRouteFocused = (name: string) => {
    switch (name) {
      case "home":
        return (
          currentRouteName === "home" || pathname === "/home" || pathname === "/"
        );
      case "businesses":
        return (
          currentRouteName === "businesses" || pathname.includes("/business")
        );
      case "categories":
        return (
          currentRouteName === "categories" || pathname.includes("/categor")
        );
      case "profile":
        return (
          currentRouteName === "profile" ||
          currentRouteName === "saved" ||
          pathname.includes("/profile") ||
          pathname.includes("/saved")
        );
      default:
        return currentRouteName === name;
    }
  };

  const items: React.ReactNode[] = [];
  visibleRoutes.forEach((route: any, index: number) => {
    if (index === middle) {
      items.push(<AddButton key="add-business" onPress={onAddPress} />);
    }

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
        try {
          navigation?.navigate?.(route.name);
        } catch { }
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
        focused={isRouteFocused(route.name)}
        onPress={onPress}
      />
    );
  });

  return (
    <View style={[styles.outer, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar}>{items}</View>
    </View>
  );
}

const BAR_HEIGHT = 75;

const styles = StyleSheet.create({
  // Flat bar: no rounded corners, hairline border, very light shadow
  outer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: WOW_COLORS.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
    zIndex: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 8,
  },
  bar: {
    height: BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
  },

  tabItem: {
    flex: 1,
    height: "100%",
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

  addCircle: {
    width: 50,
    height: 30,
    borderRadius: 20,
    backgroundColor: WOW_COLORS.primaryPink,
    alignItems: "center",
    justifyContent: "center",
  },
  addLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: WOW_COLORS.primaryPink,
  },
});