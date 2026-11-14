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
import API from "../../../api/api";
import { getErrorMessage, saveSession } from "../../../utils/auth";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "../slices/authSlice";

interface LoginFormProps {
    redirect?: string;
}

// Justdial-style palette
const JD = {
    blue: "#0076D7",
    blueDark: "#005FB0",
    blueSoft: "#E6F2FC",
    green: "#00A650",
    text: "#1F2937",
    muted: "#6B7280",
    border: "#D1D5DB",
    bg: "#F9FAFB",
    red: "#E53935",
    redSoft: "#FDECEA",
    white: "#FFFFFF",
};

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
                    autoCapitalize="none"
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
/* Login form                                                          */
/* ------------------------------------------------------------------ */

export default function LoginForm({ redirect }: LoginFormProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();

    // "identifier" can be email OR phone (backend accepts both)
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState<"identifier" | "password" | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const looksLikeEmail = identifier.includes("@");
    const looksLikePhone =
        !looksLikeEmail && /^[0-9+\s-]+$/.test(identifier) && identifier.length > 0;

    const handleLogin = async () => {
        const trimmedIdentifier = identifier.trim();

        if (!trimmedIdentifier || !password) {
            setErrorMessage("Please enter your email/phone and password.");
            return;
        }

        // Password is NOT trimmed: it must match exactly what was set at signup
        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters long.");
            return;
        }

        setErrorMessage("");
        setLoading(true);

        const isEmail = trimmedIdentifier.includes("@");
        const cleanIdentifier = isEmail
            ? trimmedIdentifier.toLowerCase()
            : trimmedIdentifier.replace(/\D/g, "");

        try {
            // Backend expects: { identifier, password }
            // Route: POST /api/auth/login
            const response = await API.post("/auth/login", {
                identifier: cleanIdentifier,
                password,
            });

            const { token, user } = response.data;

            const userData = {
                id: user?.id || user?._id,
                name: user?.name || "User",
                email: user?.email || (isEmail ? cleanIdentifier : ""),
                phone: user?.phone || (!isEmail ? cleanIdentifier : undefined),
                role: user?.role || "user",
            };

            // Persist first, then update Redux, so a storage failure
            // never leaves the app in a half-logged-in state.
            await saveSession(token, userData);
            dispatch(setCredentials({ token, user: userData }));

            // Only allow internal paths as redirect targets
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
        } catch (error: any) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.formCard}>
            {/* Brand mark */}
            <View style={styles.brandRow}>
                <View style={styles.brandBadge}>
                    <Ionicons name="person" size={22} color={JD.white} />
                </View>
                <Text style={styles.brandText}>WOW</Text>
            </View>

            <Text style={styles.title}>Login or Sign Up</Text>
            <Text style={styles.subtitle}>
                Welcome back! Sign in to enquire, rate and save your favourite businesses.
            </Text>

            {errorMessage ? (
                <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={18} color={JD.red} />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
            ) : null}

            {/* Email / phone */}
            <FloatingInput
                label="Email or Mobile Number"
                value={identifier}
                onChangeText={(text) => {
                    setIdentifier(text);
                    if (errorMessage) setErrorMessage("");
                }}
                focused={focused === "identifier"}
                onFocus={() => setFocused("identifier")}
                onBlur={() => setFocused(null)}
                disabled={loading}
                prefix={looksLikePhone ? "+91" : undefined}
                right={
                    identifier.length > 0 && !loading ? (
                        <Pressable
                            onPress={() => setIdentifier("")}
                            hitSlop={8}
                            accessibilityRole="button"
                            accessibilityLabel="Clear"
                        >
                            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                        </Pressable>
                    ) : undefined
                }
            />

            {/* Password */}
            <View style={{ height: 16 }} />
            <FloatingInput
                label="Password"
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    if (errorMessage) setErrorMessage("");
                }}
                focused={focused === "password"}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                disabled={loading}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
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

            {/* Primary button */}
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    loading && styles.disabledButton,
                ]}
                onPress={handleLogin}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Sign in"
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </Pressable>

            <Text style={styles.termsText}>
                By continuing, you agree to our{" "}
                <Text style={styles.termsLink}>Terms of Use</Text> and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>

            {/* Divider */}
            <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>New to WOW?</Text>
                <View style={styles.dividerLine} />
            </View>

            <Link href="/signup" asChild>
                <Pressable
                    style={({ pressed }) => [
                        styles.signupBtn,
                        pressed && { backgroundColor: JD.blueSoft },
                    ]}
                    disabled={loading}
                >
                    <Text style={styles.signupBtnText}>Create an Account</Text>
                </Pressable>
            </Link>

            {/* Trust strip */}
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
        marginBottom: 22,
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
        marginBottom: 16,
    },
    errorText: {
        flex: 1,
        color: "#B71C1C",
        fontSize: 13,
        fontWeight: "500",
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

    button: {
        backgroundColor: JD.blue,
        height: 52,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 24,
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
    signupBtn: {
        height: 50,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: JD.blue,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: JD.white,
    },
    signupBtnText: {
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