import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import API from "../../../api/api";
import { getErrorMessage, saveSession } from "../../../utils/auth";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "../slices/authSlice";

interface LoginFormProps {
  redirect?: string;
}

export default function LoginForm({ redirect }: LoginFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // "identifier" can be email OR phone (backend accepts both)
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to your WOW account</Text>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email or Phone Number</Text>
        <TextInput
          style={[styles.input, loading && styles.disabledInput]}
          placeholder="Enter your email or phone"
          placeholderTextColor="#9ca3af"
          value={identifier}
          onChangeText={(text) => {
            setIdentifier(text);
            if (errorMessage) setErrorMessage("");
          }}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.input, loading && styles.disabledInput]}
          placeholder="Enter your password"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errorMessage) setErrorMessage("");
          }}
          secureTextEntry
          editable={!loading}
          onSubmitEditing={handleLogin}
          returnKeyType="done"
        />
      </View>

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
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </Pressable>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/signup" asChild>
          <Pressable disabled={loading}>
            <Text style={styles.linkText}>Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#D1006C",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    borderColor: "#ef4444",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    color: "#1f2937",
    backgroundColor: "#f9fafb",
  },
  disabledInput: {
    backgroundColor: "#f3f4f6",
    color: "#9ca3af",
  },
  button: {
    backgroundColor: "#D1006C",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#D1006C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonPressed: {
    backgroundColor: "#A80056",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D1006C",
  },
});