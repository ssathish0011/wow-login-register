import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { store } from "../store/store";
import { getToken, getUser } from "../utils/auth";
import { LocationProvider } from "../context/LocationContext";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/features/auth/slices/authSlice";

function SessionHydration() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const token = await getToken();
        const user = await getUser();
        if (token && user && isMounted) {
          dispatch(setCredentials({ token, user }));
        }
      } catch {}
    })();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Provider store={store}>
        <LocationProvider>
          <SessionHydration />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(user)" />
            <Stack.Screen name="owner" />
            <Stack.Screen name="admin" />
          </Stack>
        </LocationProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
