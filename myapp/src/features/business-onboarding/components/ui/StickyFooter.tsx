import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ONBOARDING_THEME } from "../../theme/onboardingTheme";

interface StickyFooterProps {
  primaryTitle?: string;
  onPrimaryPress: () => void;
  primaryDisabled?: boolean;
  isLoading?: boolean;
  secondaryTitle?: string;
  onSecondaryPress?: () => void;
}

export const StickyFooter = React.memo(function StickyFooter({
  primaryTitle = "Save & Continue",
  onPrimaryPress,
  primaryDisabled = false,
  isLoading = false,
  secondaryTitle,
  onSecondaryPress,
}: StickyFooterProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footer,
        {
          paddingBottom: Math.max(insets.bottom, ONBOARDING_THEME.spacing.md),
        },
      ]}
    >
      <View style={styles.actionsRow}>
        {secondaryTitle && onSecondaryPress && (
          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && styles.secondaryBtnPressed,
            ]}
            onPress={onSecondaryPress}
            accessibilityRole="button"
            accessibilityLabel={secondaryTitle}
          >
            <Text style={styles.secondaryBtnText}>{secondaryTitle}</Text>
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            primaryDisabled && styles.primaryBtnDisabled,
            pressed && !primaryDisabled && styles.primaryBtnPressed,
          ]}
          onPress={onPrimaryPress}
          disabled={primaryDisabled || isLoading}
          accessibilityRole="button"
          accessibilityLabel={primaryTitle}
          accessibilityState={{ disabled: primaryDisabled, busy: isLoading }}
        >
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={ONBOARDING_THEME.colors.surface}
            />
          ) : (
            <Text style={styles.primaryBtnText}>{primaryTitle}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  footer: {
    backgroundColor: ONBOARDING_THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: ONBOARDING_THEME.colors.border,
    paddingTop: ONBOARDING_THEME.spacing.md,
    paddingHorizontal: ONBOARDING_THEME.spacing.screen,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ONBOARDING_THEME.spacing.md,
  },
  secondaryBtn: {
    height: ONBOARDING_THEME.sizes.buttonHeight,
    paddingHorizontal: ONBOARDING_THEME.spacing.base,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryBtnPressed: {
    opacity: 0.6,
  },
  secondaryBtnText: {
    ...ONBOARDING_THEME.typography.bodyMedium,
    color: ONBOARDING_THEME.colors.textSecondary,
  },
  primaryBtn: {
    flex: 1,
    height: ONBOARDING_THEME.sizes.buttonHeight,
    borderRadius: ONBOARDING_THEME.radius.md,
    backgroundColor: ONBOARDING_THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnDisabled: {
    opacity: 0.5,
  },
  primaryBtnPressed: {
    backgroundColor: ONBOARDING_THEME.colors.primaryDark,
  },
  primaryBtnText: {
    ...ONBOARDING_THEME.typography.bodyMedium,
    color: ONBOARDING_THEME.colors.surface,
    fontWeight: "700",
  },
});

