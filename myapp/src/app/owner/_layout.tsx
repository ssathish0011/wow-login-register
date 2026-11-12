import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { getToken, getUser } from "@/utils/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuth, setCredentials } from "@/features/auth/slices/authSlice";
import { WOW_COLORS } from "@/common/constants/colors";

export default function OwnerLayout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkOwnerRole() {
      try {
        const token = await getToken();
        const user = await getUser();

        if (token && user && !auth.token) {
          dispatch(setCredentials({ token, user }));
        }

        const role = (user?.role || auth.user?.role)?.toLowerCase();

        if (!token) {
          if (isMounted) {
            setIsAuthorized(false);
            router.replace("/login?redirect=/owner/dashboard");
          }
          return;
        }

        if (role !== "owner" && role !== "business_owner") {
          if (isMounted) {
            setIsAuthorized(false);
            router.replace("/home");
          }
          return;
        }

        if (isMounted) {
          setIsAuthorized(true);
        }
      } catch (e) {
        if (isMounted) {
          setIsAuthorized(false);
          router.replace("/home");
        }
      }
    }

    checkOwnerRole();

    return () => {
      isMounted = false;
    };
  }, [auth.token, auth.user?.role, router, dispatch]);

  if (isAuthorized !== true) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={WOW_COLORS.primaryPink} />
        <Text style={styles.loadingText}>Verifying Business Owner Access...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "600",
    color: WOW_COLORS.primaryPink,
  },
});

