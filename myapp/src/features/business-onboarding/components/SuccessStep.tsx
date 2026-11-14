import React, { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ONBOARDING_THEME } from "../theme/onboardingTheme";

interface SuccessStepProps {
  businessName: string;
  onHomePress: () => void;
}

export const SuccessStep = React.memo(function SuccessStep({
  businessName,
  onHomePress,
}: SuccessStepProps) {
  const referenceId = useMemo(() => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `WOW-BIZ-${randomNum}`;
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Success Badge */}
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons
            name="checkmark-circle"
            size={72}
            color={ONBOARDING_THEME.colors.success}
          />
        </View>
      </View>

      <Text style={styles.title}>Application Submitted!</Text>
      <Text style={styles.subtitle}>
        Thank you for listing{" "}
        <Text style={styles.businessHighlight}>
          {businessName || "your business"}
        </Text>{" "}
        on WOW Women of Wisdom. Our onboarding team is reviewing your profile
        details.
      </Text>

      {/* Reference ID Card */}
      <View style={styles.referenceCard}>
        <Text style={styles.referenceLabel}>Registration Reference ID</Text>
        <Text style={styles.referenceId}>{referenceId}</Text>
        <Text style={styles.referenceNote}>
          Please note this ID for all status and verification enquiries.
        </Text>
      </View>

      {/* Next Steps Timeline */}
      <View style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>What happens next?</Text>

        <View style={styles.timelineItem}>
          <View style={styles.timelineTrack}>
            <View style={[styles.timelineNode, styles.timelineNodeActive]}>
              <Ionicons
                name="time-outline"
                size={16}
                color={ONBOARDING_THEME.colors.primary}
              />
            </View>
            <View style={styles.timelineLine} />
          </View>
          <View style={styles.timelineContent}>
            <Text style={styles.stepTitle}>1. Profile & Document Review</Text>
            <Text style={styles.stepDesc}>
              Our curation team reviews your details, category, and portfolio
              photos within 24 hours.
            </Text>
          </View>
        </View>

        <View style={styles.timelineItem}>
          <View style={styles.timelineTrack}>
            <View style={styles.timelineNode}>
              <Ionicons
                name="call-outline"
                size={16}
                color={ONBOARDING_THEME.colors.textMuted}
              />
            </View>
            <View style={styles.timelineLine} />
          </View>
          <View style={styles.timelineContent}>
            <Text style={styles.stepTitle}>2. Verification Call</Text>
            <Text style={styles.stepDesc}>
              A quick verification call to confirm business identity and
              operating hours.
            </Text>
          </View>
        </View>

        <View style={styles.timelineItem}>
          <View style={styles.timelineTrack}>
            <View style={styles.timelineNode}>
              <Ionicons
                name="rocket-outline"
                size={16}
                color={ONBOARDING_THEME.colors.textMuted}
              />
            </View>
          </View>
          <View style={styles.timelineContent}>
            <Text style={styles.stepTitle}>3. Listing Goes Live</Text>
            <Text style={styles.stepDesc}>
              Your business becomes publicly visible to thousands of local
              customers in your city!
            </Text>
          </View>
        </View>
      </View>

      {/* Notice */}
      <View style={styles.noticeBox}>
        <Ionicons
          name="information-circle-outline"
          size={20}
          color={ONBOARDING_THEME.colors.primary}
        />
        <Text style={styles.noticeText}>
          You will receive approval status updates via WhatsApp and SMS on your
          registered mobile number.
        </Text>
      </View>

      {/* Home Button */}
      <Pressable
        style={styles.homeBtn}
        onPress={onHomePress}
        accessibilityRole="button"
      >
        <Text style={styles.homeBtnText}>Back to Home</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </Pressable>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ONBOARDING_THEME.spacing.screen,
    paddingTop: ONBOARDING_THEME.spacing.lg,
    paddingBottom: ONBOARDING_THEME.spacing.xxl,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: ONBOARDING_THEME.spacing.base,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: ONBOARDING_THEME.colors.successLight,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: ONBOARDING_THEME.typography.title.fontSize,
    fontWeight: "700",
    color: ONBOARDING_THEME.colors.textPrimary,
    textAlign: "center",
    marginBottom: ONBOARDING_THEME.spacing.sm,
  },
  subtitle: {
    fontSize: ONBOARDING_THEME.typography.body.fontSize,
    color: ONBOARDING_THEME.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: ONBOARDING_THEME.spacing.lg,
    paddingHorizontal: ONBOARDING_THEME.spacing.xs,
  },
  businessHighlight: {
    fontWeight: "700",
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  referenceCard: {
    width: "100%",
    backgroundColor: ONBOARDING_THEME.colors.surfaceSecondary,
    borderRadius: ONBOARDING_THEME.radius.lg,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.border,
    padding: ONBOARDING_THEME.spacing.base,
    alignItems: "center",
    marginBottom: ONBOARDING_THEME.spacing.base,
  },
  referenceLabel: {
    fontSize: ONBOARDING_THEME.typography.caption.fontSize,
    color: ONBOARDING_THEME.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  referenceId: {
    fontSize: 20,
    fontWeight: "700",
    color: ONBOARDING_THEME.colors.primary,
    letterSpacing: 1,
  },
  referenceNote: {
    fontSize: 11,
    color: ONBOARDING_THEME.colors.textMuted,
    marginTop: 4,
    textAlign: "center",
  },
  timelineCard: {
    width: "100%",
    backgroundColor: ONBOARDING_THEME.colors.surface,
    borderRadius: ONBOARDING_THEME.radius.lg,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.border,
    padding: ONBOARDING_THEME.spacing.base,
    marginBottom: ONBOARDING_THEME.spacing.base,
  },
  timelineTitle: {
    fontSize: ONBOARDING_THEME.typography.section.fontSize,
    fontWeight: "600",
    color: ONBOARDING_THEME.colors.textPrimary,
    marginBottom: ONBOARDING_THEME.spacing.base,
  },
  timelineItem: {
    flexDirection: "row",
    gap: ONBOARDING_THEME.spacing.md,
  },
  timelineTrack: {
    alignItems: "center",
  },
  timelineNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ONBOARDING_THEME.colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.border,
  },
  timelineNodeActive: {
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
    borderColor: ONBOARDING_THEME.colors.primary,
  },
  timelineLine: {
    width: 2,
    height: 36,
    backgroundColor: ONBOARDING_THEME.colors.border,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: ONBOARDING_THEME.spacing.sm,
  },
  stepTitle: {
    fontSize: ONBOARDING_THEME.typography.body.fontSize,
    fontWeight: "600",
    color: ONBOARDING_THEME.colors.textPrimary,
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: ONBOARDING_THEME.typography.caption.fontSize,
    color: ONBOARDING_THEME.colors.textMuted,
    lineHeight: 18,
  },
  noticeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: ONBOARDING_THEME.spacing.sm,
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
    padding: ONBOARDING_THEME.spacing.md,
    borderRadius: ONBOARDING_THEME.radius.md,
    width: "100%",
    marginBottom: ONBOARDING_THEME.spacing.lg,
  },
  noticeText: {
    flex: 1,
    fontSize: ONBOARDING_THEME.typography.caption.fontSize,
    color: ONBOARDING_THEME.colors.textSecondary,
    lineHeight: 18,
  },
  homeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: ONBOARDING_THEME.spacing.sm,
    backgroundColor: ONBOARDING_THEME.colors.primary,
    height: ONBOARDING_THEME.sizes.buttonHeight,
    borderRadius: ONBOARDING_THEME.radius.full,
    width: "100%",
  },
  homeBtnText: {
    fontSize: ONBOARDING_THEME.typography.body.fontSize,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
