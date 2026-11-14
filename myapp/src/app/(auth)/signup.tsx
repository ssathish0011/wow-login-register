import React, { useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { getToken, getUser } from "@/_duplicates/utils/auth";
import RegisterForm from "@/features/auth/components/RegisterForm";
import ScreenWrapper from "@/shared/components/ScreenWrapper";

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
    <ScreenWrapper>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View>
            <RegisterForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}