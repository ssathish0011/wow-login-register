import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { getToken } from "../utils/auth";
import LoginForm from "../features/auth/components/LoginForm";

export default function LoginScreen() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const token = await getToken();
      if (token && isMounted) {
        router.replace("/home");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <LoginForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE4EE",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  formContainer: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
});
