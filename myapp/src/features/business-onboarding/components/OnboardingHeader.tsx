import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ONBOARDING_THEME } from "../theme/onboardingTheme";
import { AddBusinessStep } from "../types/addBusiness.types";
import { STEP_CONFIGS } from "../data/addBusinessData";

interface OnboardingHeaderProps {
  currentStep: AddBusinessStep;
  onBack: () => void;
}

const TOTAL_SEGMENTS = 7;
const SEGMENT_IDS = Array.from({ length: TOTAL_SEGMENTS }, (_, i) => i + 1);

// Maps each step to its progress segment (1 to 7)
const STEP_SEGMENT_MAP: Record<AddBusinessStep, number> = {
  intro: 0,
  details: 1,
  category: 2,
  location: 3,
  contact: 4,
  timings: 5,
  media: 6,
  review: 7,
  success: 7,
};

// Text sizes (change these numbers to make the text bigger or smaller)
const COUNTER_FONT_SIZE = 15;
const ESTIMATE_FONT_SIZE = 14;
const TITLE_FONT_SIZE = 28;
const SUBTITLE_FONT_SIZE = 16;

export const OnboardingHeader = React.memo(function OnboardingHeader({
  currentStep,
  onBack,
}: OnboardingHeaderProps) {
  const config = STEP_CONFIGS[currentStep];

  if (!config) return null;

  const currentSegment = STEP_SEGMENT_MAP[currentStep] || 1;

  return (
    // No safe-area inset here: AddBusinessScreen's SafeAreaView already
    // applies the top inset.
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Pressable
          style={({ pressed }) => [
            styles.backBtn,
            pressed && styles.backBtnPressed,
          ]}
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go to previous step"
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={ONBOARDING_THEME.colors.textPrimary}
          />
        </Pressable>

        <View style={styles.counterGroup}>
          <Text style={styles.stepCounterText}>
            Step {currentSegment} of {TOTAL_SEGMENTS}
          </Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.timeEstimateText}>{config.estimatedTime}</Text>
        </View>

        <View style={styles.spacer} />
      </View>

      <View style={styles.progressContainer}>
        {SEGMENT_IDS.map((segment) => (
          <View
            key={segment}
            style={[
              styles.progressSegment,
              segment <= currentSegment && styles.segmentFilled,
            ]}
          />
        ))}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.stepTitle}>{config.title}</Text>
        <Text style={styles.stepSubtitle}>{config.subtitle}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: ONBOARDING_THEME.colors.surface,
    paddingHorizontal: ONBOARDING_THEME.spacing.screen,
    paddingTop: ONBOARDING_THEME.spacing.sm,
    paddingBottom: ONBOARDING_THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ONBOARDING_THEME.colors.border,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: ONBOARDING_THEME.spacing.sm,
  },
  // Back button: unchanged size
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: ONBOARDING_THEME.radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtnPressed: {
    opacity: 0.7,
  },
  // Same width as the back button, keeps the counter centered
  spacer: {
    width: 36,
  },
  counterGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCounterText: {
    ...ONBOARDING_THEME.typography.captionBold,
    fontSize: COUNTER_FONT_SIZE,
    lineHeight: COUNTER_FONT_SIZE + 6,
    color: ONBOARDING_THEME.colors.primary,
  },
  dotSeparator: {
    fontSize: COUNTER_FONT_SIZE,
    marginHorizontal: ONBOARDING_THEME.spacing.xs,
    color: ONBOARDING_THEME.colors.textPlaceholder,
  },
  timeEstimateText: {
    ...ONBOARDING_THEME.typography.caption,
    fontSize: ESTIMATE_FONT_SIZE,
    lineHeight: ESTIMATE_FONT_SIZE + 6,
    color: ONBOARDING_THEME.colors.textMuted,
  },
  progressContainer: {
    flexDirection: "row",
    gap: ONBOARDING_THEME.spacing.xs,
    marginVertical: ONBOARDING_THEME.spacing.sm,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: ONBOARDING_THEME.colors.surfaceSecondary,
  },
  segmentFilled: {
    backgroundColor: ONBOARDING_THEME.colors.primary,
  },
  titleContainer: {
    marginTop: ONBOARDING_THEME.spacing.xs,
  },
  stepTitle: {
    ...ONBOARDING_THEME.typography.title,
    fontSize: TITLE_FONT_SIZE,
    lineHeight: TITLE_FONT_SIZE + 8,
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  stepSubtitle: {
    ...ONBOARDING_THEME.typography.caption,
    fontSize: SUBTITLE_FONT_SIZE,
    lineHeight: SUBTITLE_FONT_SIZE + 6,
    color: ONBOARDING_THEME.colors.textMuted,
    marginTop: ONBOARDING_THEME.spacing.xs,
  },
});