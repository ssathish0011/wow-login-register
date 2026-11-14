// app/index.tsx
// WOW - Women of Wisdom
// Premium mobile landing page (improved)
// Authentication and navigation logic preserved.
//
// New dependency (Expo): npx expo install expo-linear-gradient

import React, { useEffect, useRef, useState } from "react";

import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Platform,
  Pressable,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getToken, getUser } from "@/_duplicates/utils/auth";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/features/auth/slices/authSlice";

/* -------------------------------------------------------
   CONFIGURATION
------------------------------------------------------- */

const MIN_LOADING_MS = 1200;

// CHANGE THIS PATH TO YOUR ACTUAL WOW LOGO
const WOW_LOGO = require("../../assets/logo.png");

// Hero background image (replace with a local image for faster loads)
const HERO_IMAGE: ImageSourcePropType = require("../../assets/images/index-img.png");



// Short value points shown under the headline
const HIGHLIGHTS = [
  "Trusted local businesses",
  "Services near you",
  "Women entrepreneurs",
];

// Headline uses a serif face for a warmer, editorial feel
const SERIF = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "Georgia, 'Times New Roman', serif",
});

/* -------------------------------------------------------
   COLORS
------------------------------------------------------- */

const COLORS = {
  primary: "#D41470",
  primaryDark: "#A90D59",
  plum: "#26051F",
  blush: "#FFF0F6",
  white: "#FFFFFF",
  text: "#241722",
  muted: "#6F5F6C", // darker than before for better contrast on white
  border: "#EBD9E2",
  gold: "#E9BD72",
};

/* -------------------------------------------------------
   HELPERS
------------------------------------------------------- */

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/* -------------------------------------------------------
   MAIN SCREEN
------------------------------------------------------- */

export default function Index() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const topInset =
    insets.top > 0
      ? insets.top
      : Platform.OS === "android"
        ? RNStatusBar.currentHeight || 0
        : 0;

  const [state, setState] = useState<"checking" | "guest">("checking");
  const [imageFailed, setImageFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Responsive headline
  const headingSize = Math.min(40, Math.max(30, width * 0.098));

  // Animation values
  const logoFade = useRef(new Animated.Value(0)).current;
  const hero = useRef(new Animated.Value(0)).current;
  const sheet = useRef(new Animated.Value(0)).current;

  /* -------------------------------------------------------
     ACCESSIBILITY: respect "reduce motion"
  ------------------------------------------------------- */

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => { });
  }, []);

  /* -------------------------------------------------------
     AUTHENTICATION CHECK
     Existing redirect logic preserved.
  ------------------------------------------------------- */

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const [token] = await Promise.all([getToken(), wait(MIN_LOADING_MS)]);

        if (!isMounted) return;

        if (token) {
          const user = await getUser();

          if (!isMounted) return;

          if (user) {
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
        // Show guest landing page
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

  /* -------------------------------------------------------
     LOADING LOGO FADE-IN
  ------------------------------------------------------- */

  useEffect(() => {
    Animated.timing(logoFade, {
      toValue: 1,
      duration: reduceMotion ? 0 : 500,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [logoFade, reduceMotion]);

  /* -------------------------------------------------------
     ENTRANCE ANIMATION (one orchestrated moment)
  ------------------------------------------------------- */

  useEffect(() => {
    if (state !== "guest") return;

    if (reduceMotion) {
      hero.setValue(1);
      sheet.setValue(1);
      return;
    }

    const native = Platform.OS !== "web";

    Animated.sequence([
      Animated.timing(hero, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: native,
      }),
      Animated.timing(sheet, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: native,
      }),
    ]).start();
  }, [state, hero, sheet, reduceMotion]);

  const heroStyle = {
    opacity: hero,
    transform: [
      {
        translateY: hero.interpolate({
          inputRange: [0, 1],
          outputRange: [22, 0],
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

  /* -------------------------------------------------------
     LOADING SCREEN
  ------------------------------------------------------- */

  if (state === "checking") {
    return (
      <View style={styles.loadingContainer}>
        <RNStatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

        <Animated.View style={[styles.loadingContent, { opacity: logoFade }]}>
          <Image
            source={WOW_LOGO}
            style={styles.loadingLogo}
            resizeMode="contain"
            accessibilityLabel="Women of Wisdom logo"
          />

          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>
              Empowering women entrepreneurs
            </Text>
          </View>
        </Animated.View>

        <Text style={styles.loadingFooter}>Women of Wisdom</Text>
      </View>
    );
  }

  /* -------------------------------------------------------
     LANDING PAGE
  ------------------------------------------------------- */

  return (
    <View style={styles.container}>
      <RNStatusBar barStyle="light-content" backgroundColor={COLORS.plum} />

      {/* ================= HERO ================= */}

      <ImageBackground
        source={HERO_IMAGE}
        style={styles.hero}
        imageStyle={imageFailed ? styles.imageHidden : undefined}
        resizeMode="cover"
        onError={() => setImageFailed(true)}
      >
        {/* Real gradient: lighter at the top, deep plum where text sits */}
        <LinearGradient
          colors={[
            "rgba(38,5,31,0.55)",
            "rgba(38,5,31,0.30)",
            "rgba(38,5,31,0.82)",
            "rgba(38,5,31,0.97)",
          ]}
          locations={[0, 0.3, 0.7, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Brand */}
        <View style={[styles.brandRow, { paddingTop: topInset + 16 }]}>
          <View style={styles.brandLogoBox}>
            <Image
              source={WOW_LOGO}
              style={styles.brandLogo}
              resizeMode="contain"
              accessibilityLabel="WOW logo"
            />
          </View>

          <View style={styles.brandDetails}>
            <Text style={styles.brandName}>Women of Wisdom</Text>
            <Text style={styles.brandTagline}>Empower, connect, grow</Text>
          </View>
        </View>

        {/* Hero content */}
        <Animated.View
          style={[
            styles.heroContent,
            { paddingBottom: Math.max(44, height * 0.06) },
            heroStyle,
          ]}
        >
          <Text
            accessibilityRole="header"
            style={[
              styles.headline,
              { fontSize: headingSize, lineHeight: headingSize * 1.14 },
            ]}
          >
            Discover businesses.{"\n"}Celebrate women.
          </Text>

          <Text style={styles.subline}>
            Find trusted local businesses, explore services and connect with
            inspiring women entrepreneurs.
          </Text>

          {/* <View style={styles.highlights}>
            {HIGHLIGHTS.map((item) => (
              <View key={item} style={styles.highlightChip}>
                <View style={styles.chipDot} />
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View> */}
        </Animated.View>
      </ImageBackground>

      {/* ================= ACTION SHEET ================= */}

      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: Math.max(insets.bottom, 18) + 6 },
          sheetStyle,
        ]}
      >
        <View style={styles.grabber} />

        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Join the community</Text>
          <Text style={styles.sheetSubtitle}>
            Create a free account to save businesses and get in touch.
          </Text>
        </View>

        {/* Primary action */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create your account"
          onPress={() => router.push("/login")}
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && styles.primaryBtnPressed,
          ]}
        >
          <Text style={styles.primaryText}>Create your account</Text>
        </Pressable>

        {/* Secondary action */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log in to your account"
          onPress={() => router.push("/login")}
          style={({ pressed }) => [
            styles.secondaryBtn,
            pressed && styles.secondaryBtnPressed,
          ]}
        >
          <Text style={styles.secondaryText}>I already have an account</Text>
        </Pressable>

        {/* Guest */}
        {/* <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue as guest"
          onPress={() => router.replace("/home")}
          style={({ pressed }) => [
            styles.guestBtn,
            pressed && styles.guestBtnPressed,
          ]}
          hitSlop={8}
        >
          <Text style={styles.guestText}>Continue as guest</Text>
        </Pressable> */}
      </Animated.View>
    </View>
  );
}

/* -------------------------------------------------------
   STYLES
------------------------------------------------------- */

const styles = StyleSheet.create({
  /* LOADING */

  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  loadingLogo: {
    width: 190,
    height: 115,
  },

  loadingIndicator: {
    alignItems: "center",
    marginTop: 24,
    gap: 13,
  },

  loadingText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "500",
    letterSpacing: 0.3,
  },

  loadingFooter: {
    position: "absolute",
    bottom: 30,
    fontSize: 12,
    letterSpacing: 1,
    color: "#A895A2",
    fontWeight: "600",
  },

  /* CONTAINER */

  container: {
    flex: 1,
    backgroundColor: COLORS.plum,
  },

  /* HERO */

  hero: {
    flex: 1,
    minHeight: 300,
    justifyContent: "space-between",
    overflow: "hidden",
    backgroundColor: COLORS.plum,
  },

  imageHidden: {
    opacity: 0,
  },

  /* BRAND */

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 12,
    zIndex: 2,
  },

  brandLogoBox: {
    width: 56,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },

  brandLogo: {
    width: "100%",
    height: "100%",
  },

  brandDetails: {
    flex: 1,
  },

  brandName: {
    fontSize: 17,
    color: COLORS.white,
    fontWeight: "700",
  },

  brandTagline: {
    marginTop: 2,
    fontSize: 12.5,
    color: COLORS.gold,
    fontWeight: "500",
    letterSpacing: 0.3,
  },

  /* HERO CONTENT */

  heroContent: {
    paddingHorizontal: 25,
    zIndex: 2,
  },

  headline: {
    color: COLORS.white,
    fontFamily: SERIF,
    fontWeight: "600",
    letterSpacing: -0.6,
  },

  subline: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 14,
    maxWidth: 340,
  },

  highlights: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 20,
  },

  highlightChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
    marginRight: 7,
  },

  chipText: {
    color: COLORS.white,
    fontSize: 12.5,
    fontWeight: "600",
  },

  /* SHEET */

  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -26,
    paddingTop: 12,
    paddingHorizontal: 25,
    gap: 12,
    zIndex: 3,
  },

  grabber: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginBottom: 10,
  },

  sheetHeader: {
    alignItems: "center",
    marginBottom: 6,
  },

  sheetTitle: {
    fontSize: 22,
    color: COLORS.text,
    fontFamily: SERIF,
    fontWeight: "700",
    letterSpacing: -0.3,
    textAlign: "center",
  },

  sheetSubtitle: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 13.5,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 300,
  },

  /* PRIMARY */

  primaryBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  primaryBtnPressed: {
    backgroundColor: COLORS.primaryDark,
    transform: [{ scale: 0.98 }],
  },

  primaryText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  /* SECONDARY */

  secondaryBtn: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },

  secondaryBtnPressed: {
    backgroundColor: COLORS.blush,
    transform: [{ scale: 0.98 }],
  },

  secondaryText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },

  /* GUEST */

  guestBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
  },

  guestBtnPressed: {
    opacity: 0.6,
  },

  guestText: {
    fontSize: 14.5,
    color: COLORS.text,
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: COLORS.border,
  },
});