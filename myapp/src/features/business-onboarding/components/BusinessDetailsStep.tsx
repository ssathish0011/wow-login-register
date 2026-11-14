import React from "react";
import { StyleSheet, View } from "react-native";
import { FormField } from "./ui/FormField";
import { AddBusinessFormData, FormErrors } from "../types/addBusiness.types";
import { ONBOARDING_THEME } from "../theme/onboardingTheme";

interface BusinessDetailsStepProps {
  formData: AddBusinessFormData;
  errors: FormErrors;
  onChangeField: <K extends keyof AddBusinessFormData>(
    key: K,
    value: AddBusinessFormData[K]
  ) => void;
}

export const BusinessDetailsStep = React.memo(function BusinessDetailsStep({
  formData,
  errors,
  onChangeField,
}: BusinessDetailsStepProps) {
  return (
    <View style={styles.container}>
      <FormField
        label="Business Name"
        required
        placeholder="e.g. Aura Beauty Studio, Priya Handlooms"
        value={formData.businessName}
        onChangeText={(text) => onChangeField("businessName", text)}
        error={errors.businessName}
        isValid={Boolean(formData.businessName && formData.businessName.length >= 2)}
        autoCapitalize="words"
        returnKeyType="next"
      />

      <FormField
        label="Tagline"
        placeholder="e.g. Handcrafted Sarees & Traditional Wear"
        value={formData.tagline}
        onChangeText={(text) => onChangeField("tagline", text)}
        helperText="A catchy one-line summary displayed under your name"
        autoCapitalize="sentences"
        returnKeyType="next"
      />

      <FormField
        label="Business Description"
        required
        placeholder="Describe what services or products you provide, your specialities, experience, and why customers love your work."
        value={formData.description}
        onChangeText={(text) => onChangeField("description", text)}
        error={errors.description}
        isValid={Boolean(formData.description && formData.description.length >= 10)}
        multiline
        numberOfLines={4}
        maxLength={500}
        showCharCount
        helperText="Minimum 10 characters required"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: ONBOARDING_THEME.spacing.sm,
  },
});

