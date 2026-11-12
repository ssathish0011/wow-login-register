import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getToken, getUser } from "../utils/auth";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/features/auth/slices/authSlice";

const MIN_LOADING_MS = 1200;

const COLORS = {
  blush: "#FFE4EE",
  magenta: "#D1006C",
  magentaDark: "#A80056",
  plum: "#8F1458",
  white: "#FFFFFF",
  ink: "#1A1A1A",
};

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

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
  const fade = useRef(new Animated.Value(0)).current;

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

  // Fade in landing page once auth check completes
  useEffect(() => {
    if (state === "guest") {
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    }
  }, [state, fade]);

  if (state === "checking") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.magenta} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      {/* Top area: title and tagline */}
      <View style={[styles.top, { paddingTop: topInset + 24 }]}>
        <Text style={styles.title}>WOW</Text>
        <Text style={styles.subtitle}>Women of Wisdom</Text>
        <Text style={styles.tagline}>
          Discover and support women-led businesses in your city.
          {"\n"}Join thousands of women entrepreneurs today.
        </Text>
      </View>

      {/* Bottom area: magenta panel with buttons */}
      <View
        style={[
          styles.actionPanel,
          { paddingBottom: Math.max(insets.bottom, 20) + 20 },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.signInButton,
            pressed && styles.signInPressed,
          ]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.signInText}>SIGN IN</Text>
        </Pressable>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.signUpButton,
            pressed && styles.signUpPressed,
          ]}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.signUpText}>CREATE ACCOUNT</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={styles.skipButton}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.skipText}>Browse as Guest →</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.blush,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    letterSpacing: 1,
    color: COLORS.plum,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.blush,
  },
  top: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 72,
    fontWeight: "900",
    letterSpacing: 4,
    color: COLORS.magenta,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.plum,
  },
  tagline: {
    marginTop: 28,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "500",
    color: COLORS.plum,
    textAlign: "center",
  },
  actionPanel: {
    backgroundColor: COLORS.magenta,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 32,
    paddingHorizontal: 28,
  },
  signInButton: {
    backgroundColor: COLORS.white,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  signInPressed: {
    backgroundColor: COLORS.blush,
  },
  signInText: {
    color: COLORS.magenta,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  orText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
    marginHorizontal: 12,
  },
  signUpButton: {
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  signUpPressed: {
    backgroundColor: COLORS.magentaDark,
  },
  signUpText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  skipButton: {
    alignItems: "center",
    marginTop: 18,
    paddingVertical: 6,
  },
  skipText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontWeight: "600",
  },
});
