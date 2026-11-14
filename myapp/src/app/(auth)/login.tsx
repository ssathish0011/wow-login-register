import React, { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getToken, getUser } from "@/utils/auth";
import LoginUI from "@/features/auth/components/LoginForm";

export default function LoginScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const token = await getToken();
      const user = await getUser();
      if (token && isMounted) {
        if (redirect) {
          router.replace(redirect as any);
        } else if (user?.role === "admin") {
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
  }, [router, redirect]);

  return <LoginUI onSkip={() => router.replace("/home")} />;
}