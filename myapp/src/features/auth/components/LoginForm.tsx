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
import { getErrorMessage, isValidEmail, saveSession } from "../../../utils/auth";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
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
      const response = await API.post("/users/login", {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      const { token, user } = response.data;
      const userData = user || { name: "User", email: trimmedEmail };

      await saveSession(token, userData);
      router.replace("/home");
    } catch (error: any) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formCard}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, loading && styles.disabledInput]}
          placeholder="Enter your email"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errorMessage) setErrorMessage("");
          }}
          keyboardType="email-address"
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
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </Pressable>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/register" asChild>
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
