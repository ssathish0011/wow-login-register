import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SectionCard } from "./ui/SectionCard";
import { SummaryRow } from "./ui/SummaryRow";
import {
  AddBusinessFormData,
  AddBusinessStep,
  FormErrors,
  ListingPlanOption,
  ListingPlanType,
} from "../types/addBusiness.types";
import { ONBOARDING_THEME } from "../theme/onboardingTheme";
import { LISTING_PLANS } from "../data/addBusinessData";

interface ReviewStepProps {
  formData: AddBusinessFormData;
  errors: FormErrors;
  onEditSection: (step: AddBusinessStep) => void;
  onSelectPlan: (plan: ListingPlanType) => void;
  onToggleTerms: (agreed: boolean) => void;
}

export const ReviewStep = React.memo(function ReviewStep({
  formData,
  errors,
  onEditSection,
  onSelectPlan,
  onToggleTerms,
}: ReviewStepProps) {
  const primaryCategory = formData.categories[0] || "None";
  const subCategories =
    formData.categories.length > 1
      ? formData.categories.slice(1).join(", ")
      : "";

  const workingDaysLabel =
    formData.workingDays.length === 7
      ? "All 7 Days (Mon - Sun)"
      : formData.workingDays.length > 0
        ? formData.workingDays.join(", ")
        : "Not set";

  const photoCount = formData.photos.length;

  return (
    <View style={styles.container}>
      <View style={styles.noticeBanner}>
        <Ionicons
          name="information-circle-outline"
          size={18}
          color={ONBOARDING_THEME.colors.primary}
        />
        <Text style={styles.noticeText}>
          Please verify your business profile before submitting. You can edit
          any section using the edit icon.
        </Text>
      </View>

      <SectionCard
        title="Business Details"
        iconName="business-outline"
        onEdit={() => onEditSection("details")}
      >
        <SummaryRow label="Business Name" value={formData.businessName} />
        {formData.tagline ? (
          <SummaryRow label="Tagline" value={formData.tagline} />
        ) : null}
        <SummaryRow label="Description" value={formData.description} />
      </SectionCard>

      <SectionCard
        title="Categories"
        iconName="grid-outline"
        onEdit={() => onEditSection("category")}
      >
        <SummaryRow label="Primary Category" value={primaryCategory} />
        {subCategories ? (
          <SummaryRow label="Additional Categories" value={subCategories} />
        ) : null}
      </SectionCard>

      <SectionCard
        title="Location"
        iconName="location-outline"
        onEdit={() => onEditSection("location")}
      >
        <SummaryRow label="Address" value={formData.address} />
        <SummaryRow
          label="City & Pincode"
          value={`${formData.city} - ${formData.pincode}`}
        />
        {formData.areaLocality ? (
          <SummaryRow label="Locality" value={formData.areaLocality} />
        ) : null}
        {formData.landmark ? (
          <SummaryRow label="Landmark" value={formData.landmark} />
        ) : null}
      </SectionCard>

      <SectionCard
        title="Contact Information"
        iconName="call-outline"
        onEdit={() => onEditSection("contact")}
      >
        <SummaryRow
          label="Contact Person"
          value={`${formData.contactPersonTitle} ${formData.contactPerson}`}
        />
        <SummaryRow label="Mobile" value={`+91 ${formData.mobile}`} />
        <SummaryRow
          label="WhatsApp"
          value={
            formData.sameAsMobile
              ? `Same as mobile (+91 ${formData.mobile})`
              : formData.whatsapp
                ? `+91 ${formData.whatsapp}`
                : "Not provided"
          }
        />
        <SummaryRow label="Email" value={formData.email} />
        {formData.website ? (
          <SummaryRow label="Website" value={formData.website} />
        ) : null}
      </SectionCard>

      <SectionCard
        title="Operating Hours & Amenities"
        iconName="time-outline"
        onEdit={() => onEditSection("timings")}
      >
        <SummaryRow label="Working Days" value={workingDaysLabel} />
        <SummaryRow
          label="Timings"
          value={`${formData.openTime} - ${formData.closeTime}`}
        />
        {formData.highlights.length > 0 ? (
          <SummaryRow
            label="Highlights"
            value={formData.highlights.join(", ")}
          />
        ) : null}
      </SectionCard>

      <SectionCard
        title="Media & Photos"
        iconName="images-outline"
        onEdit={() => onEditSection("media")}
      >
        <SummaryRow
          label="Business Logo"
          value={formData.logoUri ? "Logo uploaded" : "Not uploaded"}
        />
        <SummaryRow
          label="Photos"
          value={
            photoCount === 0
              ? "No photos added"
              : `${photoCount} ${photoCount === 1 ? "photo" : "photos"} added`
          }
        />
        {formData.videoUrl ? (
          <SummaryRow label="Promotional Video" value={formData.videoUrl} />
        ) : null}
      </SectionCard>

      <View style={styles.planSection}>
        <View>
          <Text style={styles.sectionTitle}>Choose Your Listing Plan</Text>
          <Text style={styles.sectionSubtitle}>
            Select a package that best fits your business visibility goals
          </Text>
        </View>

        <View style={styles.plansRow}>
          {LISTING_PLANS.map((plan: ListingPlanOption) => {
            const isSelected = formData.selectedPlan === plan.id;
            return (
              <Pressable
                key={plan.id}
                style={[styles.planCard, isSelected && styles.planCardActive]}
                onPress={() => onSelectPlan(plan.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${plan.name} plan, ${plan.price} ${plan.billingPeriod}`}
              >
                {plan.badge ? (
                  <View
                    style={[
                      styles.planBadge,
                      plan.id === "Gold" && styles.planBadgeGold,
                    ]}
                  >
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                ) : null}

                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planBillingPeriod}>
                    {" "}
                    {plan.billingPeriod}
                  </Text>
                </View>

                <View style={styles.planFeatures}>
                  {plan.features.map((feat: string) => (
                    <View key={feat} style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={14}
                        color={
                          isSelected
                            ? ONBOARDING_THEME.colors.primary
                            : ONBOARDING_THEME.colors.success
                        }
                      />
                      <Text style={styles.featureText}>{feat}</Text>
                    </View>
                  ))}
                </View>

                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioCircleActive,
                  ]}
                >
                  {isSelected ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.termsSection}>
        <Pressable
          style={[
            styles.termsRow,
            errors.agreedToTerms ? styles.termsRowError : null,
          ]}
          onPress={() => onToggleTerms(!formData.agreedToTerms)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: formData.agreedToTerms }}
        >
          <Ionicons
            name={formData.agreedToTerms ? "checkbox" : "square-outline"}
            size={22}
            color={
              formData.agreedToTerms
                ? ONBOARDING_THEME.colors.primary
                : ONBOARDING_THEME.colors.textMuted
            }
          />
          <Text style={styles.termsText}>
            I agree to the{" "}
            <Text style={styles.termsHighlight}>Terms & Conditions</Text> and{" "}
            <Text style={styles.termsHighlight}>Privacy Policy</Text> and
            declare that all business information provided is true and
            authentic.
          </Text>
        </Pressable>

        {errors.agreedToTerms ? (
          <View style={styles.errorRow}>
            <Ionicons
              name="alert-circle"
              size={14}
              color={ONBOARDING_THEME.colors.error}
            />
            <Text style={styles.errorText}>{errors.agreedToTerms}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  // No padding: AddBusinessScreen already adds the screen padding.
  container: {
    gap: ONBOARDING_THEME.spacing.md,
  },
  noticeBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: ONBOARDING_THEME.spacing.sm,
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.primaryBorder,
    borderRadius: ONBOARDING_THEME.radius.md,
    padding: ONBOARDING_THEME.spacing.md,
  },
  noticeText: {
    flex: 1,
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.textSecondary,
  },
  planSection: {
    gap: ONBOARDING_THEME.spacing.md,
    marginTop: ONBOARDING_THEME.spacing.sm,
  },
  sectionTitle: {
    ...ONBOARDING_THEME.typography.section,
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  sectionSubtitle: {
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.textMuted,
    marginTop: 2,
  },
  plansRow: {
    flexDirection: "row",
    gap: ONBOARDING_THEME.spacing.md,
    paddingTop: ONBOARDING_THEME.spacing.sm,
  },
  planCard: {
    flex: 1,
    backgroundColor: ONBOARDING_THEME.colors.surface,
    borderRadius: ONBOARDING_THEME.radius.lg,
    borderWidth: 1.5,
    borderColor: ONBOARDING_THEME.colors.border,
    paddingHorizontal: ONBOARDING_THEME.spacing.md,
    paddingBottom: ONBOARDING_THEME.spacing.md,
    paddingTop: ONBOARDING_THEME.spacing.lg,
    alignItems: "center",
  },
  planCardActive: {
    borderColor: ONBOARDING_THEME.colors.primary,
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
  },
  planBadge: {
    position: "absolute",
    top: -10,
    backgroundColor: ONBOARDING_THEME.colors.textMuted,
    paddingHorizontal: ONBOARDING_THEME.spacing.sm,
    paddingVertical: 2,
    borderRadius: ONBOARDING_THEME.radius.full,
  },
  planBadgeGold: {
    backgroundColor: ONBOARDING_THEME.colors.warning,
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: ONBOARDING_THEME.colors.surface,
    textTransform: "uppercase",
  },
  planName: {
    ...ONBOARDING_THEME.typography.bodyMedium,
    fontWeight: "700",
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: ONBOARDING_THEME.spacing.xs,
    marginBottom: ONBOARDING_THEME.spacing.sm,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  planBillingPeriod: {
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.textMuted,
  },
  planFeatures: {
    gap: ONBOARDING_THEME.spacing.sm,
    width: "100%",
    marginBottom: ONBOARDING_THEME.spacing.md,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: ONBOARDING_THEME.spacing.xs,
  },
  featureText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: ONBOARDING_THEME.colors.textSecondary,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: ONBOARDING_THEME.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
  },
  radioCircleActive: {
    borderColor: ONBOARDING_THEME.colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ONBOARDING_THEME.colors.primary,
  },
  termsSection: {
    gap: ONBOARDING_THEME.spacing.xs,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: ONBOARDING_THEME.spacing.sm,
    backgroundColor: ONBOARDING_THEME.colors.surface,
    padding: ONBOARDING_THEME.spacing.md,
    borderRadius: ONBOARDING_THEME.radius.md,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.border,
  },
  termsRowError: {
    borderColor: ONBOARDING_THEME.colors.error,
  },
  termsText: {
    flex: 1,
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.textSecondary,
  },
  termsHighlight: {
    color: ONBOARDING_THEME.colors.primary,
    fontWeight: "600",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ONBOARDING_THEME.spacing.xs,
  },
  errorText: {
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.error,
  },
});