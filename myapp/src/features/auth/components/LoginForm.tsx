
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageSourcePropType,
  Keyboard,
  KeyboardEvent,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Header image
const DEFAULT_HERO = require("../../../../assets/images/login-img.png");

/* ------------------------------------------------------------------ */
/* Original multicolour Google G icon - no image required              */
/* ------------------------------------------------------------------ */

function GoogleIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="#4285F4"
        d="M43.6 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-9 6-15.5Z"
      />
      <Path
        fill="#34A853"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.1c-1.8 1.2-4.1 2-6.8 2-5.2 0-9.6-3.5-11.2-8.2H5.9v5.2A20 20 0 0 0 24 44Z"
      />
      <Path
        fill="#FBBC05"
        d="M12.8 27.8a12 12 0 0 1 0-7.6V15H5.9a20 20 0 0 0 0 18Z"
      />
      <Path
        fill="#EA4335"
        d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.9 15l6.9 5.2c1.6-4.7 6-8.1 11.2-8.1Z"
      />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

interface LoginScreenProps {
  heroImage?: ImageSourcePropType;
  onSubmit?: (phone: string) => void;
  onSkip?: () => void;
  onSocial?: (provider: "google" | "facebook" | "apple") => void;
  onTerms?: () => void;
  onPrivacy?: () => void;
}

const C = {
  blueTop: "#00347B",
  blueBottom: "#2E9BF5",
  blue: "#0076D7",
  blueDisabled: "#AFD3F2",
  text: "#111827",
  muted: "#6B7280",
  border: "#D9DDE3",
  white: "#FFFFFF",
};

/* ------------------------------------------------------------------ */
/* Phone field                                                         */
/* ------------------------------------------------------------------ */

interface PhoneFieldProps {
  value: string;
  onChangeText: (t: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onSubmitEditing: () => void;
}

function PhoneField({
  value,
  onChangeText,
  focused,
  onFocus,
  onBlur,
  onSubmitEditing,
}: PhoneFieldProps) {
  const inputRef = useRef<TextInput>(null);
  const floated = focused || value.length > 0;

  const anim = useRef(new Animated.Value(floated ? 1 : 0)).current;
  const [restLeft, setRestLeft] = useState(84);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: floated ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [floated, anim]);

  const labelTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [17, -11],
  });

  const labelLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [restLeft, 12],
  });

  const labelSize = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [17, 12],
  });

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      style={[styles.inputBox, focused && styles.inputBoxFocused]}
    >
      <Animated.Text
        pointerEvents="none"
        numberOfLines={1}
        style={[
          styles.floatLabel,
          {
            top: labelTop,
            left: labelLeft,
            fontSize: labelSize,
            color: focused ? C.blue : "#7B8190",
            fontWeight: floated ? "600" : "400",
            backgroundColor: floated ? C.white : "transparent",
          },
        ]}
      >
        Enter Mobile Number
      </Animated.Text>

      <View
        style={styles.ccGroup}
        onLayout={(e) =>
          setRestLeft(
            e.nativeEvent.layout.x +
            e.nativeEvent.layout.width -
            4
          )
        }
      >
        <Text style={styles.cc}>+91</Text>
        <View style={styles.inputDivider} />
      </View>

      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={(t) =>
          onChangeText(t.replace(/\D/g, "").slice(0, 10))
        }
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType="number-pad"
        maxLength={10}
        returnKeyType="done"
        onSubmitEditing={onSubmitEditing}
        selectionColor={C.blue}
        textContentType="telephoneNumber"
        autoComplete="tel"
      />
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Login screen                                                        */
/* ------------------------------------------------------------------ */

export default function LoginScreen({
  heroImage = DEFAULT_HERO,
  onSubmit,
  onSkip,
  onSocial,
  onTerms,
  onPrivacy,
}: LoginScreenProps) {
  const insets = useSafeAreaInsets();

  const { width: winW, height: winH } = useRef(
    Dimensions.get("window")
  ).current;

  const src = Image.resolveAssetSource(heroImage);
  const imgH = winW * (src ? src.height / src.width : 0.8);

  const heroH = Math.min(
    Math.max(insets.top + imgH, 240),
    winH * 0.45
  );

  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const valid = phone.length === 10 && agreed;

  /* Keyboard animation */

  const shift = useRef(new Animated.Value(0)).current;
  const shiftNow = useRef(0);
  const altRef = useRef<View>(null);

  const SHEET_REST = -30;
  const SHEET_OPEN = -80;

  const sheetMargin = useRef(
    new Animated.Value(SHEET_REST)
  ).current;

  const sheetNow = useRef(SHEET_REST);

  useEffect(() => {
    const a = shift.addListener(({ value }) => {
      shiftNow.current = value;
    });

    const b = sheetMargin.addListener(({ value }) => {
      sheetNow.current = value;
    });

    return () => {
      shift.removeListener(a);
      sheetMargin.removeListener(b);
    };
  }, [shift, sheetMargin]);

  useEffect(() => {
    const showEvt =
      Platform.OS === "ios"
        ? "keyboardWillShow"
        : "keyboardDidShow";

    const hideEvt =
      Platform.OS === "ios"
        ? "keyboardWillHide"
        : "keyboardDidHide";

    const animate = (
      value: Animated.Value,
      to: number,
      duration?: number,
      native = true
    ) =>
      Animated.timing(value, {
        toValue: to,
        duration: duration && duration > 0 ? duration : 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: native,
      }).start();

    const onShow = (e: KeyboardEvent) => {
      const kbTop =
        e.endCoordinates.screenY ??
        Dimensions.get("window").height -
        e.endCoordinates.height;

      altRef.current?.measureInWindow((_x, y, _w, h) => {
        const bottomAtRest =
          y +
          h +
          shiftNow.current +
          (SHEET_REST - sheetNow.current);

        const sheetRise = SHEET_REST - SHEET_OPEN;

        const need =
          bottomAtRest + 20 - sheetRise - kbTop;

        const maxShift =
          heroH - 26 - (insets.top + 28);

        animate(
          shift,
          Math.max(0, Math.min(need, maxShift)),
          e.duration
        );
      });

      animate(sheetMargin, SHEET_OPEN, e.duration, false);
    };

    const onHide = (e: KeyboardEvent) => {
      animate(shift, 0, e.duration);
      animate(sheetMargin, SHEET_REST, e.duration, false);
      Keyboard.dismiss();
    };

    const a = Keyboard.addListener(showEvt, onShow);
    const b = Keyboard.addListener(hideEvt, onHide);

    return () => {
      a.remove();
      b.remove();
    };
  }, [shift, sheetMargin, heroH, insets.top]);

  const translateY = shift.interpolate({
    inputRange: [0, 1000],
    outputRange: [0, -1000],
  });

  /* OTP button animation */

  const validAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(validAnim, {
      toValue: valid ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [valid, validAnim]);

  const btnBg = validAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.blueDisabled, C.blue],
  });

  const submit = () => {
    if (!valid) return;

    Keyboard.dismiss();
    onSubmit?.(phone);
  };

  /* ---------------------------------------------------------------- */

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={C.blueTop}
      />

      <Animated.View
        style={[
          styles.layer,
          {
            height: winH,
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Hero section */}

        <View
          style={[
            styles.hero,
            {
              height: heroH,
              paddingTop: insets.top,
            },
          ]}
        >
          <View
            style={[
              styles.heroBottom,
              { top: heroH * 0.45 },
            ]}
          />

          <Image
            source={heroImage}
            resizeMode="cover"
            style={{
              width: "100%",
              height: heroH - insets.top,
            }}
          />
        </View>

        {/* White login section */}

        <Animated.View
          style={[
            styles.sheet,
            { marginTop: sheetMargin },
          ]}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>
              Best App Business Womens
            </Text>

            {/* Mobile number */}

            <PhoneField
              value={phone}
              onChangeText={setPhone}
              focused={focused}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onSubmitEditing={submit}
            />

            {/* Login with OTP */}

            <View style={styles.btnWrap}>
              <Pressable
                onPress={submit}
                disabled={!valid}
                accessibilityRole="button"
                accessibilityState={{
                  disabled: !valid,
                }}
              >
                <Animated.View
                  style={[
                    styles.otpBtn,
                    { backgroundColor: btnBg },
                  ]}
                >
                  <Text style={styles.otpText}>
                    Login with OTP
                  </Text>
                </Animated.View>
              </Pressable>
            </View>

            {/* Divider */}

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />

              <Text style={styles.dividerText}>
                or continue with
              </Text>

              <View style={styles.dividerLine} />
            </View>

            {/* Google and Facebook social login */}

            <View
              ref={altRef}
              collapsable={false}
              style={styles.altRow}
            >
              {/* Google */}

              <Pressable
                onPress={() => onSocial?.("google")}
                style={styles.altBtn}
                accessibilityRole="button"
                accessibilityLabel="Continue with Google"
              >
                <GoogleIcon size={28} />
              </Pressable>

              {/* Facebook */}

              <Pressable
                onPress={() => onSocial?.("facebook")}
                style={styles.altBtn}
                accessibilityRole="button"
                accessibilityLabel="Continue with Facebook"
              >
                <Ionicons
                  name="logo-facebook"
                  size={29}
                  color="#1877F2"
                />
              </Pressable>
            </View>
          </ScrollView>

          {/* Terms and conditions */}

          <View
            style={[
              styles.terms,
              {
                paddingBottom: Math.max(
                  insets.bottom,
                  16
                ),
              },
            ]}
          >
            <Pressable
              onPress={() => setAgreed((v) => !v)}
              style={styles.agreeRow}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: agreed }}
            >
              <View
                style={[
                  styles.checkbox,
                  agreed
                    ? styles.checkboxOn
                    : styles.checkboxOff,
                ]}
              >
                {agreed && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={C.white}
                  />
                )}
              </View>

              <Text style={styles.agreeText}>
                I Agree to Terms and Conditions
              </Text>
            </Pressable>

            <View style={styles.linksRow}>
              <Pressable onPress={onTerms}>
                <Text style={styles.link}>T&C's</Text>
              </Pressable>

              <Pressable onPress={onPrivacy}>
                <Text style={styles.link}>
                  Privacy policy
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Skip button */}

      <Pressable
        onPress={onSkip}
        style={[
          styles.skip,
          { top: insets.top + 12 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Skip"
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.white,
    overflow: "hidden",
  },

  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },

  hero: {
    backgroundColor: C.blueTop,
    overflow: "hidden",
  },

  heroBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: C.blueBottom,
  },

  skip: {
    position: "absolute",
    right: 16,
    zIndex: 5,
    backgroundColor: "rgba(10,60,120,0.45)",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 22,
  },

  skipText: {
    color: C.white,
    fontSize: 15,
    fontWeight: "600",
  },

  sheet: {
    flex: 1,
    backgroundColor: C.white,
    marginTop: -26,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },

  sheetContent: {
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 16,
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
    color: C.text,
    textAlign: "center",
    marginBottom: 34,
  },

  ccGroup: {
    flexDirection: "row",
    alignItems: "center",
  },

  floatLabel: {
    position: "absolute",
    paddingHorizontal: 4,
    lineHeight: 20,
    zIndex: 2,
  },

  inputBox: {
    height: 58,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: C.white,
  },

  inputBoxFocused: {
    borderColor: C.blue,
  },

  cc: {
    fontSize: 17,
    color: C.text,
    fontWeight: "500",
  },

  inputDivider: {
    width: 1,
    height: 26,
    backgroundColor: C.border,
    marginHorizontal: 16,
  },

  input: {
    flex: 1,
    fontSize: 17,
    color: C.text,
    paddingVertical: 0,
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none" } as any)
      : {}),
  },

  otpBtn: {
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  btnWrap: {
    marginTop: 16,
  },

  otpText: {
    color: C.white,
    fontSize: 19,
    fontWeight: "500",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 26,
    marginBottom: 22,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ECEEF1",
  },

  dividerText: {
    fontSize: 15,
    color: C.muted,
  },

  altRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 14,
  },

  altBtn: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },

  terms: {
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 22,
    backgroundColor: C.white,
  },

  agreeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxOn: {
    backgroundColor: C.blue,
  },

  checkboxOff: {
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.white,
  },

  agreeText: {
    fontSize: 15,
    color: "#4B5563",
  },

  linksRow: {
    flexDirection: "row",
    gap: 22,
    marginTop: 8,
  },

  link: {
    fontSize: 15,
    color: "#4B5563",
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
  },
});
