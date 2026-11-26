import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import API from "@/_duplicates/api/api";
import { getErrorMessage, saveSession } from "@/_duplicates/utils/auth";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "../slices/authSlice";

const DEFAULT_HERO = require("../../../../assets/images/login-img.png");

interface OtpVerifyScreenProps {
  heroImage?: ImageSourcePropType;
}

const C = {
  blue: "#0076D7",
  blueDark: "#005FB0",
  blueSoft: "#EAF3FC",
  blueDisabled: "#AFD3F2",
  text: "#111827",
  muted: "#6B7280",
  border: "#D9DDE3",
  white: "#FFFFFF",
  error: "#DC2626",
  errorSoft: "#FEE2E2",
};

export default function OtpVerifyScreen({
  heroImage = DEFAULT_HERO,
}: OtpVerifyScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{
    phone?: string;
    devOtp?: string;
    redirect?: string;
  }>();

  const phone = params.phone || "";
  const initialDevOtp = params.devOtp || "";
  const redirect = params.redirect;

  const { width: winW, height: winH } = useRef(Dimensions.get("window")).current;
  const src = Image.resolveAssetSource(heroImage);
  const imgH = winW * (src?.height && src?.width ? src.height / src.width : 0.8);
  const heroH = Math.min(Math.max(insets.top + imgH, 200), winH * 0.35);

  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState(initialDevOtp);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [isFocused, setIsFocused] = useState(true);
  const inputRef = useRef<any>(null);

  // 30-second countdown for resend OTP
  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const validOtp = otp.trim().length === 6;

  /* ---------------------------------------------------------------- */
  /* Keyboard animation (same behaviour as the login screen)          */
  /* ---------------------------------------------------------------- */

  const shift = useRef(new Animated.Value(0)).current;
  const shiftNow = useRef(0);
  const bottomRef = useRef<any>(null); // last element that must stay visible

  const SHEET_REST = -22;
  const SHEET_OPEN = -60;

  const sheetMargin = useRef(new Animated.Value(SHEET_REST)).current;
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
    const showEvt = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

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
        Dimensions.get("window").height - e.endCoordinates.height;

      bottomRef.current?.measureInWindow?.(
        (_x: number, y: number, _w: number, h: number) => {
          const bottomAtRest =
            y + h + shiftNow.current + (SHEET_REST - sheetNow.current);

          const sheetRise = SHEET_REST - SHEET_OPEN;
          const need = bottomAtRest + 20 - sheetRise - kbTop;
          const maxShift = heroH - 26 - (insets.top + 28);

          animate(shift, Math.max(0, Math.min(need, maxShift)), e.duration);
        }
      );

      animate(sheetMargin, SHEET_OPEN, e.duration, false);
    };

    const onHide = (e: KeyboardEvent) => {
      animate(shift, 0, e.duration);
      animate(sheetMargin, SHEET_REST, e.duration, false);
    };

    const a = Keyboard.addListener(showEvt, onShow);
    const b = Keyboard.addListener(hideEvt, onHide);

    return () => {
      a.remove();
      b.remove();
    };
  }, [shift, sheetMargin, heroH, insets.top]);

  // Focus after the listeners are attached so the first keyboard-open also animates
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  const translateY = shift.interpolate({
    inputRange: [0, 1000],
    outputRange: [0, -1000],
  });

  /* ---------------------------------------------------------------- */

  // Auto-fill demo OTP
  const handleAutoFill = () => {
    if (devOtp) {
      setOtp(devOtp);
      setErrorMessage("");
    }
  };

  // Verify OTP via Backend
  const handleVerify = async () => {
    const cleanOtp = otp.trim();
    const cleanPhone = phone.trim().replace(/\D/g, "");

    if (cleanOtp.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setErrorMessage("");
    setLoading(true);
    Keyboard.dismiss();

    try {
      console.log("📤 Verifying OTP:", cleanOtp, "for phone:", cleanPhone);

      // Backend API: POST /api/auth/verify-otp
      // Saves phone and creates user in MongoDB if not exists!
      const response = await API.post("/auth/verify-otp", {
        phone: cleanPhone,
        otp: cleanOtp,
        name: "WOW User",
      });

      const { token, user } = response.data;

      const userData = {
        id: user?.id || user?._id,
        name: user?.name || "WOW User",
        phone: user?.phone || cleanPhone,
        email: user?.email || "",
        role: user?.role || "user",
      };

      // 1. Save session
      await saveSession(token, userData);

      // 2. Dispatch to Redux
      dispatch(setCredentials({ token, user: userData }));

      console.log("✅ Successfully logged in! User saved in MongoDB:", userData);

      // 3. Navigate
      const safeRedirect =
        redirect && redirect.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : undefined;

      const role = String(userData.role).toLowerCase();

      if (safeRedirect) {
        router.replace(safeRedirect as any);
      } else if (role === "admin") {
        router.replace("/admin/dashboard");
      } else if (role === "owner" || role === "business_owner") {
        router.replace("/owner/dashboard");
      } else {
        router.replace("/home");
      }
    } catch (err: any) {
      console.error("❌ Verify OTP Error:", err);
      setErrorMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP via Backend
  const handleResend = async () => {
    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (!cleanPhone) return;

    setErrorMessage("");
    setLoading(true);

    try {
      console.log("📤 Resending OTP for phone:", cleanPhone);
      const response = await API.post("/auth/send-otp", { phone: cleanPhone });

      if (response.data?.devOtp) {
        setDevOtp(response.data.devOtp);
      }
      setResendTimer(30);
      setOtp("");
    } catch (err: any) {
      console.error("❌ Resend OTP Error:", err);
      setErrorMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Everything that moves up with the keyboard */}
      <Animated.View
        style={[
          styles.layer,
          {
            height: winH,
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Hero header */}
        <View style={[styles.hero, { height: heroH }]}>
          <Image
            source={heroImage}
            resizeMode="cover"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: heroH,
            }}
          />
        </View>

        {/* Content Sheet */}
        <Animated.View style={[styles.sheet, { marginTop: sheetMargin }]}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>
              We have sent a 6-digit OTP to{" "}
              <Text style={styles.phoneHighlight}>+91 {phone}</Text>
            </Text>

            {/* Change number link */}
            <Pressable
              onPress={() => router.back()}
              style={styles.changePhoneRow}
              hitSlop={8}
            >
              <Ionicons name="pencil" size={14} color={C.blue} />
              <Text style={styles.changePhoneText}>Change Mobile Number</Text>
            </Pressable>

            {/* Demo OTP Banner with quick Auto-fill */}
            {devOtp ? (
              <View style={styles.demoBanner}>
                <View style={styles.demoBannerLeft}>
                  <Ionicons name="key" size={16} color={C.blue} />
                  <Text style={styles.demoBannerText}>
                    Demo OTP: <Text style={styles.demoCode}>{devOtp}</Text>
                  </Text>
                </View>
                <Pressable
                  onPress={handleAutoFill}
                  style={styles.autoFillBtn}
                  accessibilityRole="button"
                >
                  <Text style={styles.autoFillBtnText}>Auto-fill</Text>
                </Pressable>
              </View>
            ) : null}

            {/* Error Message */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color={C.error} />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* 6 Digit OTP input boxes */}
            <Pressable
              style={styles.otpBoxesContainer}
              onPress={() => inputRef.current?.focus()}
              accessibilityLabel="OTP Input Boxes"
            >
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const digit = otp[index] || "";
                const isActive =
                  isFocused &&
                  (index === otp.length || (index === 5 && otp.length === 6));
                const isFilled = digit.length > 0;

                return (
                  <View
                    key={index}
                    style={[
                      styles.otpBox,
                      isActive && styles.otpBoxActive,
                      isFilled && styles.otpBoxFilled,
                    ]}
                  >
                    <Text style={styles.otpDigitText}>{digit}</Text>
                  </View>
                );
              })}

              {/* Hidden native input */}
              <TextInput
                ref={inputRef}
                style={styles.hiddenInput}
                value={otp}
                onChangeText={(text) => {
                  const clean = text.replace(/\D/g, "").slice(0, 6);
                  setOtp(clean);
                  if (errorMessage) setErrorMessage("");
                  if (clean.length === 6) {
                    Keyboard.dismiss();
                  }
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType="number-pad"
                maxLength={6}
                returnKeyType="done"
                onSubmitEditing={handleVerify}
                caretHidden
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
              />
            </Pressable>

            {/* Verify & Login Button */}
            <View style={styles.btnWrap}>
              <Pressable
                onPress={handleVerify}
                disabled={!validOtp || loading}
                style={[
                  styles.verifyBtn,
                  { backgroundColor: validOtp ? C.blue : C.blueDisabled },
                ]}
                accessibilityRole="button"
                accessibilityState={{ disabled: !validOtp || loading }}
              >
                {loading ? (
                  <ActivityIndicator color={C.white} size="small" />
                ) : (
                  <Text style={styles.verifyBtnText}>Verify & Login</Text>
                )}
              </Pressable>
            </View>

            {/* Resend OTP */}
            <View
              ref={bottomRef}
              collapsable={false}
              style={styles.resendContainer}
            >
              {resendTimer > 0 ? (
                <Text style={styles.resendTimerText}>
                  Resend code in{" "}
                  <Text style={styles.resendSeconds}>
                    00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                  </Text>
                </Text>
              ) : (
                <View style={styles.resendActiveRow}>
                  <Text style={styles.resendPrompt}>Didn't receive code? </Text>
                  <Pressable onPress={handleResend} disabled={loading}>
                    <Text style={styles.resendLink}>Resend OTP</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>

      {/* Back button stays fixed on screen (outside the moving layer) */}
      <Pressable
        style={[styles.backBtn, { top: insets.top + 10 }]}
        onPress={() => router.back()}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Ionicons name="arrow-back" size={22} color={C.white} />
      </Pressable>
    </View>
  );
}

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
    overflow: "hidden",
    position: "relative",
  },

  backBtn: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(10,60,120,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },

  sheet: {
    flex: 1,
    backgroundColor: C.white,
    marginTop: -22,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: "hidden",
  },

  sheetContent: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: C.text,
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: C.muted,
    textAlign: "center",
    lineHeight: 20,
  },

  phoneHighlight: {
    fontWeight: "700",
    color: C.text,
  },

  changePhoneRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: 6,
    marginTop: 8,
    marginBottom: 20,
  },

  changePhoneText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.blue,
  },

  demoBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.blueSoft,
    borderWidth: 1,
    borderColor: "#BAD9F7",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },

  demoBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  demoBannerText: {
    fontSize: 14,
    color: C.blueDark,
    fontWeight: "500",
  },

  demoCode: {
    fontWeight: "800",
    color: C.blue,
    letterSpacing: 1,
    fontSize: 16,
  },

  autoFillBtn: {
    backgroundColor: C.blue,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },

  autoFillBtnText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "700",
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.errorSoft,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 16,
  },

  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: C.error,
    fontWeight: "500",
  },

  // Boxes are evenly sized and centered, so they line up with the button width
  otpBoxesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
    position: "relative",
  },

  otpBox: {
    flex: 1,
    maxWidth: 52,
    height: 56,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },

  otpBoxActive: {
    borderColor: C.blue,
    backgroundColor: C.blueSoft,
  },

  otpBoxFilled: {
    borderColor: C.blue,
    backgroundColor: C.white,
  },

  otpDigitText: {
    fontSize: 22,
    fontWeight: "700",
    color: C.text,
  },

  hiddenInput: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.01,
  },

  btnWrap: {
    marginTop: 18,
  },

  verifyBtn: {
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  verifyBtnText: {
    color: C.white,
    fontSize: 18,
    fontWeight: "600",
  },

  resendContainer: {
    alignItems: "center",
    marginTop: 22,
    marginBottom: 10,
  },

  resendTimerText: {
    fontSize: 14,
    color: C.muted,
  },

  resendSeconds: {
    fontWeight: "700",
    color: C.text,
  },

  resendActiveRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  resendPrompt: {
    fontSize: 14,
    color: C.muted,
  },

  resendLink: {
    fontSize: 14,
    fontWeight: "700",
    color: C.blue,
  },
});