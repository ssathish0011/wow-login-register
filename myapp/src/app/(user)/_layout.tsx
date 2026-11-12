import React from "react";
import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="search" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="category/[slug]" />
      <Stack.Screen name="business/[id]" />
      <Stack.Screen name="add-business" />
    </Stack>
  );
}
