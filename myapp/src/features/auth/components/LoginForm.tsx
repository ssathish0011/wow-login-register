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
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import API from "@/_duplicates/api/api";
import { getErrorMessage, saveSession } from "@/_duplicates/utils/auth";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "../slices/authSlice";

// Header image
const DEFAULT_HERO = require("../../../../assets/images/login-img.png");

/* ------------------------------------------------------------------ */
/* Original multicolour Google G icon                                  */
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
/* Props & Colors                                                      */
/* ------------------------------------------------------------------ */

interface LoginScreenProps {
  heroImage?: ImageSourcePropType;
  onSubmit?: (phone: string) => void;
  onSkip?: () => void;
  onSocial?: (provider: "google" | "facebook" | "apple") => void;
  onTerms?: () => void;
  onPrivacy?: () => void;
  redirect?: string;
}

const C = {
  blueTop: "#00347B",
  blueBottom: "#2E9BF5",
  blue: "#0076D7",
  blueDark: "#005FB0",
  blueSoft: "#EAF3FC",
  blueDisabled: "#AFD3F2",
  text: "#111827",
  muted: "#6B7280",
  border: "#D9DDE3",
  borderActive: "#0076D7",
  white: "#FFFFFF",
  error: "#DC2626",
  errorSoft: "#FEE2E2",
  success: "#16A34A",
  successSoft: "#DCFCE7",
  amber: "#D97706",
  amberSoft: "#FEF3C7",
};

/* ------------------------------------------------------------------ */
/* Phone field component                                               */
/* ------------------------------------------------------------------ */

interface PhoneFieldProps {
  value: string;
  onChangeText: (t: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onSubmitEditing: () => void;
  disabled?: boolean;
}

function PhoneField({
  value,
  onChangeText,
  focused,
  onFocus,
  onBlur,
  onSubmitEditing,
  disabled,
}: PhoneFieldProps) {
  const inputRef = useRef<any>(null);
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
      style={[
        styles.inputBox,
        focused && styles.inputBoxFocused,
        disabled && styles.inputBoxDisabled,
      ]}
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
          setRestLeft(e.nativeEvent.layout.x + e.nativeEvent.layout.width - 4)
        }
      >
        <Text style={styles.cc}>+91</Text>
        <View style={styles.inputDivider} />
      </View>

      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={(t) => onChangeText(t.replace(/\D/g, "").slice(0, 10))}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType="number-pad"
        maxLength={10}
        returnKeyType="done"
        onSubmitEditing={onSubmitEditing}
        selectionColor={C.blue}
        textContentType="telephoneNumber"
        autoComplete="tel"
        editable={!disabled}
      />
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* 6-Digit OTP Box Component                                          */
/* ------------------------------------------------------------------ */

interface OtpInputBoxesProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

function OtpInputBoxes({ value, onChangeText, onSubmit }: OtpInputBoxesProps) {
  const inputRef = useRef<any>(null);
  const [isFocused, setIsFocused] = useState(true);

  return (
    <Pressable
      style={styles.otpBoxesContainer}
      onPress={() => inputRef.current?.focus()}
      accessibilityLabel="OTP Input"
    >
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const digit = value[index] || "";
        const isActive = isFocused && (index === value.length || (index === 5 && value.length === 6));
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

      {/* Invisible overlay input */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={(text) => {
          const clean = text.replace(/\D/g, "").slice(0, 6);
          onChangeText(clean);
          if (clean.length === 6) {
            Keyboard.dismiss();
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType="number-pad"
        maxLength={6}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        autoFocus
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
      />
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Main Login Screen with Demo OTP Flow                               */
/* ------------------------------------------------------------------ */

export default function LoginScreen({
  heroImage = DEFAULT_HERO,
  onSubmit,
  onSkip,
  onSocial,
  onTerms,
  onPrivacy,
  redirect: propRedirect,
}: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useLocalSearchParams<{ redirect?: string }>();
  const effectiveRedirect = propRedirect || searchParams.redirect;

  const { width: winW, height: winH } = useRef(
    Dimensions.get("window")
  ).current;

  const src = Image.resolveAssetSource(heroImage);
  const imgH = winW * (src?.height && src?.width ? src.height / src.width : 0.8);
  const heroH = Math.min(Math.max(insets.top + imgH, 240), winH * 0.45);

  // Flow step: "phone" | "otp"
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const [agreed, setAgreed] = useState(true);

  // OTP state
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);

  // Loading & error feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState("");

  const validPhone = phone.length === 10 && /^[6-9]\d{9}$/.test(phone) && agreed;
  const validOtp = otp.length === 6;

  /* Resend countdown timer */
  useEffect(() => {
    let timer: any;
    if (step === "otp" && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  /* Keyboard animation */
  const shift = useRef(new Animated.Value(0)).current;
  const shiftNow = useRef(0);
  const altRef = useRef<any>(null);

  const SHEET_REST = -30;
  const SHEET_OPEN = -80;

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

      altRef.current?.measureInWindow?.((_x: number, y: number, _w: number, h: number) => {
        const bottomAtRest =
          y + h + shiftNow.current + (SHEET_REST - sheetNow.current);

        const sheetRise = SHEET_REST - SHEET_OPEN;
        const need = bottomAtRest + 20 - sheetRise - kbTop;
        const maxShift = heroH - 26 - (insets.top + 28);

        animate(shift, Math.max(0, Math.min(need, maxShift)), e.duration);
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

  const isCurrentStepValid = step === "phone" ? validPhone : validOtp;

  useEffect(() => {
    Animated.timing(validAnim, {
      toValue: isCurrentStepValid ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isCurrentStepValid, validAnim]);

  const btnBg = validAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.blueDisabled, C.blue],
  });

  /* ---------------------------------------------------------------- */
  /* Step 1: Send OTP via Backend (POST /api/auth/send-otp)           */
  /* ---------------------------------------------------------------- */

  const handleSendOtp = async () => {
    const cleanPhone = phone.trim().replace(/\D/g, "");

    if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number (starts with 6-9).");
      return;
    }

    if (!agreed) {
      setErrorMessage("Please accept the Terms and Conditions to proceed.");
      return;
    }

    setErrorMessage("");
    setLoading(true);
    Keyboard.dismiss();

    try {
      // If external onSubmit is supplied and handles everything, call it
      if (onSubmit) {
        onSubmit(cleanPhone);
        return;
      }

      // Backend API: POST /api/auth/send-otp
      console.log("📤 Sending OTP for mobile:", cleanPhone);
      const response = await API.post("/auth/send-otp", { phone: cleanPhone });

      const returnedDevOtp = response.data?.devOtp;
      setDevOtp(returnedDevOtp || "123456");
      setSuccessInfo(response.data?.message || "OTP sent successfully!");

      // Navigate to dedicated OTP Verification page (Page 2)
      router.push({
        pathname: "/(auth)/otp-verify" as any,
        params: {
          phone: cleanPhone,
          devOtp: returnedDevOtp || "123456",
          ...(effectiveRedirect ? { redirect: effectiveRedirect } : {}),
        },
      });
    } catch (err: any) {
      console.error("❌ Send OTP Error:", err);
      setErrorMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Step 2: Verify OTP & Save User in Backend (POST /api/auth/verify-otp) */
  /* ---------------------------------------------------------------- */

  const handleVerifyOtp = async () => {
    const cleanPhone = phone.trim().replace(/\D/g, "");
    const cleanOtp = otp.trim();

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
      // The backend creates user record if new and saves to MongoDB User collection!
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

      // 1. Save session in SecureStorage / LocalStorage
      await saveSession(token, userData);

      // 2. Dispatch to Redux store
      dispatch(setCredentials({ token, user: userData }));

      console.log("✅ Successfully logged in! User saved in backend:", userData);

      // 3. Navigate appropriately based on role or redirect query
      const safeRedirect =
        effectiveRedirect &&
        effectiveRedirect.startsWith("/") &&
        !effectiveRedirect.startsWith("//")
          ? effectiveRedirect
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

  /* ---------------------------------------------------------------- */
  /* Quick Auto-fill Demo OTP                                          */
  /* ---------------------------------------------------------------- */

  const handleAutoFillOtp = () => {
    if (devOtp) {
      setOtp(devOtp);
      setErrorMessage("");
    }
  };

  /* ---------------------------------------------------------------- */
  /* Back to phone step                                               */
  /* ---------------------------------------------------------------- */

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp("");
    setErrorMessage("");
    setSuccessInfo("");
  };

  /* ---------------------------------------------------------------- */

  return (
    <View style={styles.root}>
      {/* Status bar */}
      <StatusBar barStyle="light-content" />

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
        <View style={[styles.hero, { height: heroH - insets.top }]}>
          <View style={[styles.heroBottom, { top: (heroH - insets.top) * 0.45 }]} />

          <Image
            source={heroImage}
            resizeMode="cover"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: heroH - insets.top,
            }}
          />
        </View>

        {/* White login section */}
        <Animated.View style={[styles.sheet, { marginTop: sheetMargin }]}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Step 1: Mobile Number Input */}
            {step === "phone" ? (
              <>
                <Text style={styles.title}>Best Business App for Women's</Text>

                {errorMessage ? (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={18} color={C.error} />
                    <Text style={styles.errorBannerText}>{errorMessage}</Text>
                  </View>
                ) : null}

                {/* Mobile number */}
                <PhoneField
                  value={phone}
                  onChangeText={(t) => {
                    setPhone(t);
                    if (errorMessage) setErrorMessage("");
                  }}
                  focused={focused}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onSubmitEditing={handleSendOtp}
                  disabled={loading}
                />

                {/* Login with OTP */}
                <View style={styles.btnWrap}>
                  <Pressable
                    onPress={handleSendOtp}
                    disabled={!validPhone || loading}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !validPhone || loading }}
                  >
                    <Animated.View
                      style={[styles.otpBtn, { backgroundColor: btnBg }]}
                    >
                      {loading ? (
                        <ActivityIndicator color={C.white} size="small" />
                      ) : (
                        <Text style={styles.otpText}>Login with OTP</Text>
                      )}
                    </Animated.View>
                  </Pressable>
                </View>

                {/* Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or continue with</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google and Facebook social login */}
                <View ref={altRef} collapsable={false} style={styles.altRow}>
                  <Pressable
                    onPress={() => onSocial?.("google")}
                    style={styles.altBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Continue with Google"
                  >
                    <GoogleIcon size={28} />
                  </Pressable>

                  <Pressable
                    onPress={() => onSocial?.("facebook")}
                    style={styles.altBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Continue with Facebook"
                  >
                    <Ionicons name="logo-facebook" size={29} color="#1877F2" />
                  </Pressable>
                </View>
              </>
            ) : (
              /* Step 2: OTP Verification */
              <View style={styles.otpStepContainer}>
                {/* Back / Edit number header */}
                <Pressable
                  onPress={handleBackToPhone}
                  style={styles.backToPhoneBtn}
                  hitSlop={8}
                >
                  <Ionicons name="arrow-back" size={20} color={C.blue} />
                  <Text style={styles.backToPhoneText}>Change Number</Text>
                </Pressable>

                <Text style={styles.otpStepTitle}>Enter Verification Code</Text>
                <Text style={styles.otpStepSubtitle}>
                  We have sent a 6-digit OTP to{" "}
                  <Text style={styles.phoneHighlight}>+91 {phone}</Text>
                </Text>

                {/* Demo OTP Banner with quick Auto-fill */}
                {devOtp && (
                  <View style={styles.demoBanner}>
                    <View style={styles.demoBannerLeft}>
                      <Ionicons name="key" size={16} color={C.blue} />
                      <Text style={styles.demoBannerText}>
                        Demo OTP: <Text style={styles.demoCode}>{devOtp}</Text>
                      </Text>
                    </View>
                    <Pressable
                      onPress={handleAutoFillOtp}
                      style={styles.autoFillBtn}
                      accessibilityRole="button"
                    >
                      <Text style={styles.autoFillBtnText}>Auto-fill</Text>
                    </Pressable>
                  </View>
                )}

                {errorMessage ? (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={18} color={C.error} />
                    <Text style={styles.errorBannerText}>{errorMessage}</Text>
                  </View>
                ) : null}

                {/* 6 Digit OTP input */}
                <OtpInputBoxes
                  value={otp}
                  onChangeText={(val) => {
                    setOtp(val);
                    if (errorMessage) setErrorMessage("");
                  }}
                  onSubmit={handleVerifyOtp}
                />

                {/* Verify & Login Button */}
                <View style={styles.btnWrap}>
                  <Pressable
                    onPress={handleVerifyOtp}
                    disabled={!validOtp || loading}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !validOtp || loading }}
                  >
                    <Animated.View
                      style={[styles.otpBtn, { backgroundColor: btnBg }]}
                    >
                      {loading ? (
                        <ActivityIndicator color={C.white} size="small" />
                      ) : (
                        <Text style={styles.otpText}>Verify & Login</Text>
                      )}
                    </Animated.View>
                  </Pressable>
                </View>

                {/* Resend OTP */}
                <View style={styles.resendContainer}>
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
                      <Pressable onPress={handleSendOtp} disabled={loading}>
                        <Text style={styles.resendLink}>Resend OTP</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Terms and conditions */}
          <View
            style={[
              styles.terms,
              { paddingBottom: Math.max(insets.bottom, 16) },
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
                  agreed ? styles.checkboxOn : styles.checkboxOff,
                ]}
              >
                {agreed && (
                  <Ionicons name="checkmark" size={16} color={C.white} />
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
                <Text style={styles.link}>Privacy policy</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Skip button */}
      <Pressable
        onPress={onSkip}
        style={[styles.skip, { top: insets.top + 12 }]}
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
    paddingTop: 26,
    paddingBottom: 16,
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
    color: C.text,
    textAlign: "center",
    marginBottom: 24,
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

  inputBoxDisabled: {
    backgroundColor: "#F9FAFB",
    opacity: 0.8,
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
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
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
    fontSize: 18,
    fontWeight: "600",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 24,
    marginBottom: 18,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ECEEF1",
  },

  dividerText: {
    fontSize: 14,
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
    width: 24,
    height: 24,
    borderRadius: 6,
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
    fontSize: 14,
    color: "#4B5563",
  },

  linksRow: {
    flexDirection: "row",
    gap: 22,
    marginTop: 8,
  },

  link: {
    fontSize: 14,
    color: "#4B5563",
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
  },

  /* OTP Step styles */
  otpStepContainer: {
    paddingTop: 4,
  },

  backToPhoneBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginBottom: 14,
  },

  backToPhoneText: {
    fontSize: 14,
    fontWeight: "600",
    color: C.blue,
  },

  otpStepTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: C.text,
    textAlign: "center",
    marginBottom: 6,
  },

  otpStepSubtitle: {
    fontSize: 14,
    color: C.muted,
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 20,
  },

  phoneHighlight: {
    fontWeight: "700",
    color: C.text,
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

  otpBoxesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 8,
    position: "relative",
  },

  otpBox: {
    width: "14.5%",
    aspectRatio: 0.9,
    maxWidth: 48,
    minHeight: 52,
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

  resendContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 8,
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
