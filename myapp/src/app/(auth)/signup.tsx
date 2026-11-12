import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { getToken, getUser } from "@/utils/auth";
import RegisterForm from "@/features/auth/components/RegisterForm";
import ScreenWrapper from "@/common/components/ScreenWrapper";

export default function SignupScreen() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const token = await getToken();
      const user = await getUser();
      if (token && isMounted) {
        if (user?.role === "admin") {
          router.replace("/admin/dashboard");
        } else if (user?.role === "owner" || user?.role === "business_owner") {
          router.replace("/owner/dashboard");
        } else {
          router.replace("/home");
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <ScreenWrapper style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <RegisterForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE4EE",
  },
  keyboardView: {
    flex: 1,
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

