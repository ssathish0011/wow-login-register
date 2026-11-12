import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
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

export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clearError = () => {
    if (errorMessage) setErrorMessage("");
  };

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
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join Women of Wisdom today</Text>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Full Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[styles.input, loading && styles.disabledInput]}
          placeholder="Enter your full name"
          placeholderTextColor="#9ca3af"
          value={name}
          onChangeText={(t) => { setName(t); clearError(); }}
          autoCapitalize="words"
          editable={!loading}
        />
      </View>

      {/* Phone */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.phoneRow}>
          <View style={styles.phonePrefix}>
            <Text style={styles.phonePrefixText}>+91</Text>
          </View>
          <TextInput
            style={[styles.phoneInput, loading && styles.disabledInput]}
            placeholder="10-digit mobile number"
            placeholderTextColor="#9ca3af"
            value={phone}
            onChangeText={(t) => {
              // Allow only digits, max 10
              const digits = t.replace(/\D/g, "").slice(0, 10);
              setPhone(digits);
              clearError();
            }}
            keyboardType="phone-pad"
            maxLength={10}
            editable={!loading}
          />
        </View>
        <Text style={styles.hint}>Must start with 6, 7, 8 or 9</Text>
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, loading && styles.disabledInput]}
          placeholder="Enter your email"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={(t) => { setEmail(t); clearError(); }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
      </View>

      {/* Password */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password (min. 6 characters)</Text>
        <TextInput
          style={[styles.input, loading && styles.disabledInput]}
          placeholder="Create a strong password"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={(t) => { setPassword(t); clearError(); }}
          secureTextEntry
          editable={!loading}
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          loading && styles.disabledButton,
        ]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </Pressable>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/login" asChild>
          <Pressable disabled={loading}>
            <Text style={styles.linkText}>Sign In</Text>
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
  hint: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 4,
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
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  phonePrefix: {
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  phonePrefixText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    color: "#1f2937",
    backgroundColor: "#f9fafb",
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
