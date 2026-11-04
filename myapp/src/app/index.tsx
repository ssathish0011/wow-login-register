import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getToken } from "../utils/auth";

// Minimum time the loading screen stays visible (milliseconds)
const MIN_LOADING_MS = 1800;

const COLORS = {
  blush: "#FFE4EE", // light pink background
  magenta: "#D1006C", // main brand pink
  magentaDark: "#A80056",
  plum: "#8F1458", // text color
  white: "#FFFFFF",
  ink: "#1A1A1A",
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <StatusBar style="dark" />
      <ActivityIndicator size="large" color={COLORS.magenta} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const checkExistingSession = async () => {
      try {
        const [token] = await Promise.all([getToken(), wait(MIN_LOADING_MS)]);
        if (token && isMounted) {
          router.replace("/dashboard");
          return;
        }
      } catch {
        // If the token check fails, show the home page
      }
      if (isMounted) {
        setCheckingAuth(false);
      }
    };

    checkExistingSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!checkingAuth) {
      Animated.timing(fade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [checkingAuth, fade]);

  if (checkingAuth) {
    return <LoadingScreen />;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      <StatusBar style="dark" />

      {/* Top area: title and tagline */}
      <View style={[styles.top, { paddingTop: insets.top + 24 }]}>
        <Text style={styles.title}>WOW</Text>
        <Text style={styles.subtitle}>Welcome to women of wisdom</Text>
        <Text style={styles.tagline}>
          Online education has never been this easy. Get your Account now and
          let's get started already.
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
          style={({ pressed }) => [
            styles.signUpButton,
            pressed && styles.signUpPressed,
          ]}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.signUpText}>SIGN UP</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Loading screen
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

  // Home page
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
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    color: COLORS.plum,
    textAlign: "center",
  },
  actionPanel: {
    backgroundColor: COLORS.magenta,
    borderTopLeftRadius: 72,
    borderTopRightRadius: 72,
    paddingTop: 34,
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
    color: COLORS.ink,
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
    backgroundColor: "rgba(255,255,255,0.7)",
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
});