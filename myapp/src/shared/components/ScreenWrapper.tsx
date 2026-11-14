/**
 * ScreenWrapper – shared safe-area container used across screens.
 *
 * • Applies top safe-area inset (with Android StatusBar fallback) so content
 *   never clips behind the notch or status bar.
 * • Applies bottom safe-area inset so content is never hidden behind the
 *   home gesture bar.
 * • White background by default (matches WOW brand).
 */

import React from "react";
import {
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  /** Override or extend container styles (e.g. background colour). */
  style?: ViewStyle | ViewStyle[];
  /** Set false to skip top inset (e.g. screens with their own sticky header). */
  applyTopInset?: boolean;
  /** Set false to skip bottom inset when you need manual control. */
  applyBottomInset?: boolean;
}

export default function ScreenWrapper({
  children,
  style,
  applyTopInset = true,
  applyBottomInset = true,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  // Robust top inset: fallback to Android StatusBar.currentHeight if insets.top is 0
  const topInset =
    insets.top > 0
      ? insets.top
      : Platform.OS === "android"
      ? RNStatusBar.currentHeight || 0
      : 0;

  return (
    <View
      style={[
        styles.base,
        applyTopInset && { paddingTop: topInset },
        applyBottomInset && { paddingBottom: insets.bottom },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
