import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardTypeOptions,
  Platform,
  Pressable,
  ReturnKeyTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import API from "@/_duplicates/api/api";
import { getErrorMessage, saveSession } from "@/_duplicates/utils/auth";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "../slices/authSlice";

// Justdial-style palette (same as LoginForm)
const JD = {
  blue: "#0076D7",
  blueDark: "#005FB0",
  blueSoft: "#E6F2FC",
  green: "#00A650",
  text: "#1F2937",
  muted: "#6B7280",
  border: "#D1D5DB",
  red: "#E53935",
  redSoft: "#FDECEA",
  white: "#FFFFFF",
};

type FieldKey = "name" | "phone" | "email" | "password";

/* ------------------------------------------------------------------ */
/* Floating-label input                                                */
/* The label sits inside the box like a placeholder. When the field    */
/* is focused or has text, it shrinks and moves to the top edge.       */
/* ------------------------------------------------------------------ */

interface FloatingInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "words" | "sentences" | "characters";
  maxLength?: number;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  prefix?: string;
  right?: React.ReactNode;
}

function FloatingInput({
  label,
  value,
  onChangeText,
  focused,
  onFocus,
  onBlur,
  disabled,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
  maxLength,
  returnKeyType,
  onSubmitEditing,
  prefix,
  right,
}: FloatingInputProps) {
  const inputRef = useRef<TextInput>(null);
  const floated = focused || value.length > 0 || !!prefix;
  const anim = useRef(new Animated.Value(floated ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: floated ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false, // animating top / fontSize
    }).start();
  }, [floated, anim]);

  // Rest: vertically centred inside the box (box inner height = 53).
  // Floated: centred on the top border line.
  const labelTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [17, -11],
  });
  const labelSize = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 12],
  });
  const fieldBg = disabled ? "#F3F4F6" : JD.white;

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      style={[
        styles.field,
        focused && styles.fieldFocused,
        disabled && styles.fieldDisabled,
      ]}
    >
      <Animated.Text
        pointerEvents="none"
        numberOfLines={1}
        style={[
          styles.floatLabel,
          {
            top: labelTop,
            fontSize: labelSize,
            color: focused ? JD.blue : JD.muted,
            fontWeight: floated ? "600" : "400",
            // background "cuts" the border behind the floated label
            backgroundColor: floated ? fieldBg : "transparent",
          },
        ]}
      >
        {label}
      </Animated.Text>

      <View style={styles.fieldRow}>
        {!!prefix && (
          <View style={styles.prefixBox}>
            <Text style={styles.prefixText}>{prefix}</Text>
          </View>
        )}
        <TextInput
          ref={inputRef}
          style={styles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          autoCorrect={false}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          selectionColor={JD.blue}
        />
        {right}
      </View>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Register form                                                       */
/* ------------------------------------------------------------------ */

export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<FieldKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clearError = () => {
    if (errorMessage) setErrorMessage("");
  };

  const phoneValid = /^[6-9]\d{9}$/.test(phone);
  const passwordLen = password.trim().length;

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim().replace(/\D/g, ""); // digits only
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Frontend validations matching backend rules
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage("Name must be at least 2 characters.");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      setErrorMessage(
        "Please enter a valid 10-digit Indian mobile number (starting with 6-9)."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      // Backend expects: { name, phone, email, password, role? }
      // Route: POST /api/auth/register
      const response = await API.post("/auth/register", {
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        password: trimmedPassword,
        role: "user",
      });

      const { token, user } = response.data;

      const userData = {
        id: user?.id || user?._id,
        name: user?.name || trimmedName,
        email: user?.email || trimmedEmail,
        phone: user?.phone || trimmedPhone,
        role: user?.role || "user",
      };

      dispatch(setCredentials({ token, user: userData }));
      await saveSession(token, userData);

      // Navigate based on role (new users are always "user" unless backend says otherwise)
      const role = (userData.role || "").toLowerCase();
      if (role === "admin") {
        router.replace("/admin/dashboard");
      } else if (role === "owner" || role === "business_owner") {
        router.replace("/owner/dashboard");
      } else {
        router.replace("/home");
      }
    } catch (error: any) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formCard}>
      {/* Brand mark */}
      <View style={styles.brandRow}>
        <View style={styles.brandBadge}>
          <Ionicons name="person-add" size={20} color={JD.white} />
        </View>
        <Text style={styles.brandText}>WOW</Text>
      </View>

      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>
        Join Women of Wisdom to discover, enquire and rate women-owned businesses.
      </Text>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={18} color={JD.red} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Full Name */}
      <View style={styles.inputGroup}>
        <FloatingInput
          label="Full Name"
          value={name}
          onChangeText={(t) => {
            setName(t);
            clearError();
          }}
          focused={focused === "name"}
          onFocus={() => setFocused("name")}
          onBlur={() => setFocused(null)}
          autoCapitalize="words"
          disabled={loading}
        />
      </View>

      {/* Phone */}
      <View style={styles.inputGroup}>
        <FloatingInput
          label="Mobile Number"
          value={phone}
          onChangeText={(t) => {
            // Allow only digits, max 10
            const digits = t.replace(/\D/g, "").slice(0, 10);
            setPhone(digits);
            clearError();
          }}
          focused={focused === "phone"}
          onFocus={() => setFocused("phone")}
          onBlur={() => setFocused(null)}
          keyboardType="phone-pad"
          maxLength={10}
          prefix="+91"
          disabled={loading}
          right={
            phoneValid ? (
              <Ionicons name="checkmark-circle" size={20} color={JD.green} />
            ) : undefined
          }
        />
        <Text style={styles.hint}>Must start with 6, 7, 8 or 9</Text>
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <FloatingInput
          label="Email Address"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            clearError();
          }}
          focused={focused === "email"}
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused(null)}
          keyboardType="email-address"
          disabled={loading}
        />
      </View>

      {/* Password */}
      <View style={styles.inputGroup}>
        <FloatingInput
          label="Password"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            clearError();
          }}
          focused={focused === "password"}
          onFocus={() => setFocused("password")}
          onBlur={() => setFocused(null)}
          secureTextEntry={!showPassword}
          returnKeyType="done"
          onSubmitEditing={handleRegister}
          disabled={loading}
          right={
            <Pressable
              onPress={() => setShowPassword((v) => !v)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={21}
                color={JD.muted}
              />
            </Pressable>
          }
        />
        <View style={styles.strengthRow}>
          <Ionicons
            name={passwordLen >= 6 ? "checkmark-circle" : "ellipse-outline"}
            size={14}
            color={passwordLen >= 6 ? JD.green : "#9CA3AF"}
          />
          <Text style={[styles.hint, passwordLen >= 6 && { color: JD.green }]}>
            At least 6 characters
          </Text>
        </View>
      </View>

      {/* Primary button */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          loading && styles.disabledButton,
        ]}
        onPress={handleRegister}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Create account"
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </Pressable>

      <Text style={styles.termsText}>
        By signing up, you agree to our{" "}
        <Text style={styles.termsLink}>Terms of Use</Text> and{" "}
        <Text style={styles.termsLink}>Privacy Policy</Text>
      </Text>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Already a member?</Text>
        <View style={styles.dividerLine} />
      </View>

      <Link href="/login" asChild>
        <Pressable
          style={({ pressed }) => [
            styles.loginBtn,
            pressed && { backgroundColor: JD.blueSoft },
          ]}
          disabled={loading}
        >
          <Text style={styles.loginBtnText}>Login</Text>
        </Pressable>
      </Link>

      <View style={styles.trustRow}>
        <Ionicons name="shield-checkmark" size={16} color={JD.green} />
        <Text style={styles.trustText}>Your details are safe and secure with us</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: JD.white,
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  brandBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: JD.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    fontSize: 24,
    fontWeight: "900",
    color: JD.blue,
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: JD.text,
  },
  subtitle: {
    fontSize: 13.5,
    color: JD.muted,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 24,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: JD.redSoft,
    borderLeftWidth: 4,
    borderLeftColor: JD.red,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  errorText: {
    flex: 1,
    color: "#B71C1C",
    fontSize: 13,
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: 20,
  },

  /* floating-label field (label sits on the border when active) */
  field: {
    height: 56,
    borderWidth: 1.5,
    borderColor: JD.border,
    borderRadius: 10,
    backgroundColor: JD.white,
    paddingHorizontal: 14,
    justifyContent: "center",
    overflow: "visible",
  },
  fieldFocused: {
    borderColor: JD.blue,
  },
  fieldDisabled: {
    backgroundColor: "#F3F4F6",
  },
  floatLabel: {
    position: "absolute",
    left: 10,
    paddingHorizontal: 4,
    lineHeight: 18,
    zIndex: 2,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 40,
  },
  prefixBox: {
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: JD.border,
    height: 22,
    justifyContent: "center",
  },
  prefixText: {
    fontSize: 15,
    fontWeight: "700",
    color: JD.text,
  },
  fieldInput: {
    flex: 1,
    height: 36,
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontSize: 15.5,
    color: JD.text,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },

  hint: {
    fontSize: 11.5,
    color: "#9CA3AF",
    marginTop: 5,
    marginLeft: 4,
  },
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 1,
    marginLeft: 4,
  },
  button: {
    backgroundColor: JD.blue,
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonPressed: {
    backgroundColor: JD.blueDark,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: JD.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  termsText: {
    fontSize: 11.5,
    color: JD.muted,
    textAlign: "center",
    lineHeight: 17,
    marginTop: 14,
  },
  termsLink: {
    color: JD.blue,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 22,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    fontSize: 12,
    color: JD.muted,
    fontWeight: "600",
  },
  loginBtn: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: JD.blue,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: JD.white,
  },
  loginBtnText: {
    color: JD.blue,
    fontSize: 15,
    fontWeight: "800",
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 18,
  },
  trustText: {
    fontSize: 11.5,
    color: JD.muted,
  },
});