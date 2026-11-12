// app/index.tsx
// WOW (Women of Wisdom) landing page.
// Auth check + redirects are unchanged; only the visual design is new.

import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getToken, getUser } from "../utils/auth";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/features/auth/slices/authSlice";

const MIN_LOADING_MS = 1200;

const COLORS = {
  magenta: "#D1006C",
  magentaDeep: "#A80056",
  magentaGlow: "#E3278A",
  plum: "#3B0A2B",
  blush: "#FFE4EE",
  white: "#FFFFFF",
  amber: "#B26A00",
  amberSoft: "#FFF1D6",
  green: "#14804A",
  greenSoft: "#E6F5EC",
  muted: "#7A6A74",
};

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/* ---------- small building blocks ---------- */

function Tile({
  icon,
  label,
  fg,
  bg,
}: {
  icon: IoniconName;
  label: string;
  fg: string;
  bg: string;
}) {
  return (
    <View style={styles.tile}>
      <View style={[styles.tileIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color={fg} />
      </View>
      <Text style={styles.tileLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export default function Index() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const topInset =
    insets.top > 0
      ? insets.top
      : Platform.OS === "android"
        ? RNStatusBar.currentHeight || 0
        : 0;

  // Three states: "checking" | "authenticated" | "guest"
  const [state, setState] = useState<"checking" | "authenticated" | "guest">(
    "checking"
  );

  // One entrance moment: hero rises in, then the sheet slides up.
  const hero = useRef(new Animated.Value(0)).current;
  const sheet = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const [token] = await Promise.all([getToken(), wait(MIN_LOADING_MS)]);
        if (!isMounted) return;

        if (token) {
          const user = await getUser();
          if (user && isMounted) {
            dispatch(setCredentials({ token, user }));
          }
          const role = user?.role?.toLowerCase();
          if (role === "admin") {
            router.replace("/admin/dashboard");
          } else if (role === "owner" || role === "business_owner") {
            router.replace("/owner/dashboard");
          } else {
            router.replace("/home");
          }
          return;
        }
      } catch {
        // fall through to show landing page
      }

      if (isMounted) {
        setState("guest");
      }
    }

    checkSession();
    return () => {
      isMounted = false;
    };
  }, [router, dispatch]);

  useEffect(() => {
    if (state === "guest") {
      const native = Platform.OS !== "web";
      Animated.sequence([
        Animated.timing(hero, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: native,
        }),
        Animated.timing(sheet, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: native,
        }),
      ]).start();
    }
  }, [state, hero, sheet]);

  /* ---------- loading ---------- */
  if (state === "checking") {
    return (
      <View style={styles.loadingContainer}>
        <RNStatusBar barStyle="light-content" backgroundColor={COLORS.magenta} />
        <Text style={styles.loadingMark}>WOW</Text>
        <ActivityIndicator
          size="small"
          color={COLORS.white}
          style={{ marginTop: 18 }}
        />
      </View>
    );
  }

  const heroStyle = {
    opacity: hero,
    transform: [
      {
        translateY: hero.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  };
  const sheetStyle = {
    opacity: sheet,
    transform: [
      {
        translateY: sheet.interpolate({
          inputRange: [0, 1],
          outputRange: [40, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <RNStatusBar barStyle="light-content" backgroundColor={COLORS.magenta} />

      {/* HERO */}
      <View style={styles.heroWrap}>
        <View style={styles.ringLarge} />
        <View style={styles.ringSmall} />

        <ScrollView
          contentContainerStyle={[
            styles.heroContent,
            { paddingTop: topInset + 16 },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={heroStyle}>
            {/* brand row */}
            <View style={styles.brandRow}>
              <Text style={styles.brandMark}>WOW</Text>
              <View style={styles.brandDivider} />
              <Text style={styles.brandName}>Women of Wisdom</Text>
            </View>

            {/* headline */}
            <Text style={styles.headline}>
              Where women-led businesses get found.
            </Text>
            <Text style={styles.subline}>
              Discover local shops, services and makers run by women, and list
              your own business to reach more customers.
            </Text>

            {/* category tiles */}
            <View style={styles.tileGrid}>
              <View style={styles.tileCol}>
                <Tile
                  icon="shirt-outline"
                  label="Fashion"
                  fg={COLORS.magenta}
                  bg={COLORS.blush}
                />
                <Tile
                  icon="flower-outline"
                  label="Beauty"
                  fg={COLORS.green}
                  bg={COLORS.greenSoft}
                />
              </View>
              <View style={[styles.tileCol, styles.tileColOffset]}>
                <Tile
                  icon="restaurant-outline"
                  label="Food"
                  fg={COLORS.amber}
                  bg={COLORS.amberSoft}
                />
                <Tile
                  icon="color-palette-outline"
                  label="Handmade"
                  fg={COLORS.magenta}
                  bg={COLORS.blush}
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>

      {/* ACTION SHEET */}
      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: Math.max(insets.bottom, 16) + 16 },
          sheetStyle,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && styles.primaryBtnPressed,
          ]}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.primaryText}>Create account</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.secondaryBtn,
            pressed && styles.secondaryBtnPressed,
          ]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.secondaryText}>I already have an account</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={styles.guestBtn}
          onPress={() => router.replace("/home")}
          hitSlop={8}
        >
          <Text style={styles.guestText}>Browse as guest</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* loading */
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.magenta,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingMark: {
    fontSize: 56,
    fontWeight: "900",
    letterSpacing: 4,
    color: COLORS.white,
  },

  container: { flex: 1, backgroundColor: COLORS.magenta },

  /* hero */
  heroWrap: {
    flex: 1,
    backgroundColor: COLORS.magenta,
    overflow: "hidden",
  },
  ringLarge: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
    right: -150,
    top: -90,
    backgroundColor: COLORS.magentaGlow,
    opacity: 0.45,
  },
  ringSmall: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    left: -60,
    bottom: 30,
    backgroundColor: COLORS.magentaDeep,
    opacity: 0.5,
  },
  heroContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 36,
    justifyContent: "center",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  brandMark: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 2,
    color: COLORS.white,
  },
  brandDivider: {
    width: 1,
    height: 18,
    backgroundColor: "rgba(255,255,255,0.45)",
    marginHorizontal: 12,
  },
  brandName: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.88)",
  },

  headline: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: COLORS.white,
  },
  subline: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
    color: "rgba(255,255,255,0.85)",
    maxWidth: 340,
  },

  /* tiles */
  tileGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 26,
  },
  tileCol: { flex: 1, gap: 12 },
  tileColOffset: { marginTop: 26 },
  tile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: COLORS.plum,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  tileIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  tileLabel: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.plum,
  },

  /* sheet */
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 26,
    paddingHorizontal: 24,
    gap: 12,
  },
  primaryBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.magenta,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.magenta,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnPressed: { backgroundColor: COLORS.magentaDeep },
  primaryText: { color: COLORS.white, fontSize: 16, fontWeight: "800" },

  secondaryBtn: {
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: COLORS.magenta,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnPressed: { backgroundColor: COLORS.blush },
  secondaryText: { color: COLORS.magenta, fontSize: 15, fontWeight: "700" },

  guestBtn: { alignItems: "center", paddingVertical: 6 },
  guestText: { color: COLORS.muted, fontSize: 14, fontWeight: "600" },
});