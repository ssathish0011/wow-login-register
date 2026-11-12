import React, { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";
import { Tabs } from "expo-router";
import BottomTabBar from "@/common/navigation/BottomTabBar";

export default function TabsLayout() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";

    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () =>
      setKeyboardVisible(true)
    );

    const hideSubscription = Keyboard.addListener(hideEvent, () =>
      setKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Tabs
      tabBar={(props) =>
        keyboardVisible ? null : <BottomTabBar {...props} />
      }
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="businesses" options={{ title: "Businesses" }} />
      <Tabs.Screen name="categories" options={{ title: "Categories" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="saved" options={{ title: "Saved", href: null }} />
      <Tabs.Screen name="add" options={{ title: "Add", href: null }} />
    </Tabs>
  );
}

