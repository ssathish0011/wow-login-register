import React, { useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ONBOARDING_THEME } from "../theme/onboardingTheme";
import { INTRO_BENEFITS } from "../data/addBusinessData";

interface IntroStepProps {
  onStart: () => void;
  onClose: () => void;
}

const CLOSE_BUTTON_SIZE = 38;
const BENEFIT_ICON_SIZE = 40;
const DEFAULT_BOTTOM_BAR_HEIGHT = 140;

// Gradient built from theme tokens (no hardcoded hex values)
const HERO_GRADIENT = [
  ONBOARDING_THEME.colors.primaryLight,
  ONBOARDING_THEME.colors.surface,
] as const;

export const IntroStep = React.memo(function IntroStep({
  onStart,
  onClose,
}: IntroStepProps) {
  const insets = useSafeAreaInsets();
  const [bottomBarHeight, setBottomBarHeight] = useState(
    DEFAULT_BOTTOM_BAR_HEIGHT
  );

  const handleBottomBarLayout = (e: LayoutChangeEvent) => {
    setBottomBarHeight(e.nativeEvent.layout.height);
  };

  const closeTop = insets.top + ONBOARDING_THEME.spacing.sm;
  // Content starts below the floating close button, so they never overlap
  const contentTop =
    closeTop + CLOSE_BUTTON_SIZE + ONBOARDING_THEME.spacing.md;

  return (
    <View style={styles.root}>
      {/* Top floating close button */}
      <View style={[styles.header, { top: closeTop }]}>
        <Pressable
          style={styles.closeBtn}
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Exit onboarding"
        >
          <Ionicons
            name="close"
            size={22}
            color={ONBOARDING_THEME.colors.textPrimary}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: contentTop,
            // Real height of the bottom bar, so nothing hides behind it
            paddingBottom: bottomBarHeight + ONBOARDING_THEME.spacing.lg,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand hero */}
        <LinearGradient colors={HERO_GRADIENT} style={styles.heroCard}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Ionicons
                name="sparkles"
                size={13}
                color={ONBOARDING_THEME.colors.primary}
              />
              <Text style={styles.badgeText}>PARTNER ONBOARDING</Text>
            </View>
          </View>

          <Text style={styles.headline}>
            Grow Your Business on{" "}
            <Text style={styles.headlineHighlight}>WOW</Text>
          </Text>

          <Text style={styles.tagline}>
            Get discovered by customers, build a trusted business profile, and
            reach more people across Tamil Nadu.
          </Text>
        </LinearGradient>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.sectionHeader}>Why List on WOW?</Text>

          {INTRO_BENEFITS.map((benefit) => (
            <View key={benefit.title} style={styles.benefitRow}>
              <View style={styles.benefitIconBox}>
                <Ionicons
                  name={benefit.icon}
                  size={20}
                  color={ONBOARDING_THEME.colors.primary}
                />
              </View>
              <View style={styles.benefitTextGroup}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>
                  {benefit.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Trust box (confirm each claim is true before release) */}
        <View style={styles.guaranteeBox}>
          <Ionicons
            name="checkmark-done-circle"
            size={20}
            color={ONBOARDING_THEME.colors.success}
          />
          <Text style={styles.guaranteeText}>
            Free to list • Verified listings • Customers across Tamil Nadu
          </Text>
        </View>
      </ScrollView>

      {/* Sticky bottom action */}
      <View
        onLayout={handleBottomBarLayout}
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom, ONBOARDING_THEME.spacing.md),
          },
        ]}
      >
        <View style={styles.estimateRow}>
          <Ionicons
            name="time-outline"
            size={14}
            color={ONBOARDING_THEME.colors.textMuted}
          />
          <Text style={styles.estimateText}>
            Takes only about 3 minutes to complete
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
          onPress={onStart}
          accessibilityRole="button"
          accessibilityLabel="Start Business Registration"
        >
          <Text style={styles.ctaButtonText}>Get Started Now</Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color={ONBOARDING_THEME.colors.surface}
          />
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ONBOARDING_THEME.colors.surface,
  },
  header: {
    position: "absolute",
    left: ONBOARDING_THEME.spacing.screen,
    zIndex: 10,
  },
  closeBtn: {
    width: CLOSE_BUTTON_SIZE,
    height: CLOSE_BUTTON_SIZE,
    borderRadius: ONBOARDING_THEME.radius.full,
    backgroundColor: ONBOARDING_THEME.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.border,
  },
  scrollContent: {
    paddingHorizontal: ONBOARDING_THEME.spacing.screen,
  },
  heroCard: {
    borderRadius: ONBOARDING_THEME.radius.lg,
    padding: ONBOARDING_THEME.spacing.lg,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.primaryBorder,
    marginBottom: ONBOARDING_THEME.spacing.lg,
  },
  badgeRow: {
    flexDirection: "row",
    marginBottom: ONBOARDING_THEME.spacing.sm,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ONBOARDING_THEME.colors.surface,
    paddingVertical: ONBOARDING_THEME.spacing.xs,
    paddingHorizontal: ONBOARDING_THEME.spacing.sm,
    borderRadius: ONBOARDING_THEME.radius.full,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.primaryBorder,
    gap: ONBOARDING_THEME.spacing.xs,
  },
  badgeText: {
    ...ONBOARDING_THEME.typography.tag,
    color: ONBOARDING_THEME.colors.primary,
  },
  headline: {
    ...ONBOARDING_THEME.typography.title,
    fontSize: 28,
    lineHeight: 36,
    color: ONBOARDING_THEME.colors.textPrimary,
    marginBottom: ONBOARDING_THEME.spacing.sm,
  },
  headlineHighlight: {
    color: ONBOARDING_THEME.colors.primary,
  },
  tagline: {
    ...ONBOARDING_THEME.typography.body,
    color: ONBOARDING_THEME.colors.textSecondary,
  },
  benefitsContainer: {
    marginBottom: ONBOARDING_THEME.spacing.lg,
  },
  sectionHeader: {
    ...ONBOARDING_THEME.typography.section,
    color: ONBOARDING_THEME.colors.textPrimary,
    marginBottom: ONBOARDING_THEME.spacing.md,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: ONBOARDING_THEME.spacing.md,
    backgroundColor: ONBOARDING_THEME.colors.bg,
    padding: ONBOARDING_THEME.spacing.md,
    borderRadius: ONBOARDING_THEME.radius.md,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.border,
  },
  benefitIconBox: {
    width: BENEFIT_ICON_SIZE,
    height: BENEFIT_ICON_SIZE,
    borderRadius: ONBOARDING_THEME.radius.sm,
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: ONBOARDING_THEME.spacing.md,
  },
  benefitTextGroup: {
    flex: 1,
  },
  benefitTitle: {
    ...ONBOARDING_THEME.typography.bodyMedium,
    fontWeight: "600",
    color: ONBOARDING_THEME.colors.textPrimary,
    marginBottom: 2,
  },
  benefitDescription: {
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.textSecondary,
  },
  guaranteeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ONBOARDING_THEME.colors.successLight,
    padding: ONBOARDING_THEME.spacing.md,
    borderRadius: ONBOARDING_THEME.radius.md,
    gap: ONBOARDING_THEME.spacing.sm,
  },
  guaranteeText: {
    ...ONBOARDING_THEME.typography.captionBold,
    color: ONBOARDING_THEME.colors.success,
    flex: 1,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: ONBOARDING_THEME.colors.surface,
    paddingTop: ONBOARDING_THEME.spacing.sm,
    paddingHorizontal: ONBOARDING_THEME.spacing.screen,
    borderTopWidth: 1,
    borderTopColor: ONBOARDING_THEME.colors.border,
  },
  estimateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: ONBOARDING_THEME.spacing.sm,
    gap: ONBOARDING_THEME.spacing.xs,
  },
  estimateText: {
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.textMuted,
  },
  ctaButton: {
    height: ONBOARDING_THEME.sizes.buttonHeight,
    borderRadius: ONBOARDING_THEME.radius.md,
    backgroundColor: ONBOARDING_THEME.colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: ONBOARDING_THEME.spacing.sm,
  },
  ctaButtonPressed: {
    backgroundColor: ONBOARDING_THEME.colors.primaryDark,
  },
  ctaButtonText: {
    ...ONBOARDING_THEME.typography.bodyMedium,
    color: ONBOARDING_THEME.colors.surface,
    fontWeight: "700",
  },
});