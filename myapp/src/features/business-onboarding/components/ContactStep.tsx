import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FormField } from "./ui/FormField";
import { BottomSheetPicker } from "./ui/BottomSheetPicker";
import {
  AddBusinessFormData,
  ContactPersonTitle,
  FormErrors,
} from "../types/addBusiness.types";
import { ONBOARDING_THEME } from "../theme/onboardingTheme";

interface ContactStepProps {
  formData: AddBusinessFormData;
  errors: FormErrors;
  onChangeField: <K extends keyof AddBusinessFormData>(
    key: K,
    value: AddBusinessFormData[K]
  ) => void;
}

const TITLE_OPTIONS: ContactPersonTitle[] = ["Ms.", "Mrs.", "Mr.", "Dr."];

export const ContactStep = React.memo(function ContactStep({
  formData,
  errors,
  onChangeField,
}: ContactStepProps) {
  const [showTitlePicker, setShowTitlePicker] = useState(false);

  return (
    <View style={styles.container}>
      {/* Contact Person Name with Title Trigger */}
      <View style={styles.personRow}>
        <View style={styles.titleColumn}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Title</Text>
          </View>
          <Pressable
            style={styles.titleTrigger}
            onPress={() => setShowTitlePicker(true)}
            accessibilityRole="button"
            accessibilityLabel={`Title: ${formData.contactPersonTitle}`}
          >
            <Text style={styles.titleTriggerText}>
              {formData.contactPersonTitle}
            </Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color={ONBOARDING_THEME.colors.textMuted}
            />
          </Pressable>
        </View>

        <View style={styles.nameColumn}>
          <FormField
            label="Contact Person Name"
            required
            placeholder="e.g. Surendhar, Priya"
            value={formData.contactPerson}
            onChangeText={(text) => onChangeField("contactPerson", text)}
            error={errors.contactPerson}
            isValid={Boolean(formData.contactPerson && formData.contactPerson.length >= 2)}
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* Mobile Number (+91) */}
      <FormField
        label="Mobile Number"
        required
        placeholder="9944312518"
        value={formData.mobile}
        onChangeText={(text) =>
          onChangeField("mobile", text.replace(/\D/g, "").slice(0, 10))
        }
        keyboardType="phone-pad"
        maxLength={10}
        error={errors.mobile}
        isValid={Boolean(formData.mobile && formData.mobile.length === 10)}
        leftAccessory={
          <View style={styles.dialCodeBox}>
            <Text style={styles.dialCodeText}>+91</Text>
          </View>
        }
        helperText="Customer calls and OTP verifications will be sent here"
      />

      {/* WhatsApp Number with "Same as Mobile" Toggle */}
      <View style={styles.whatsappContainer}>
        <FormField
          label="WhatsApp Number"
          placeholder="9944312518"
          value={formData.sameAsMobile ? formData.mobile : formData.whatsapp}
          onChangeText={(text) =>
            onChangeField("whatsapp", text.replace(/\D/g, "").slice(0, 10))
          }
          keyboardType="phone-pad"
          maxLength={10}
          editable={!formData.sameAsMobile}
          error={errors.whatsapp}
          leftAccessory={
            <View style={styles.dialCodeBox}>
              <Text style={styles.dialCodeText}>+91</Text>
            </View>
          }
        />

        <Pressable
          style={styles.checkboxRow}
          onPress={() => onChangeField("sameAsMobile", !formData.sameAsMobile)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: formData.sameAsMobile }}
        >
          <View
            style={[
              styles.checkbox,
              formData.sameAsMobile && styles.checkboxChecked,
            ]}
          >
            {formData.sameAsMobile && (
              <Ionicons
                name="checkmark"
                size={14}
                color={ONBOARDING_THEME.colors.surface}
              />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Same as mobile number</Text>
        </Pressable>
      </View>

      {/* Email Address */}
      <FormField
        label="Business / Contact Email"
        required
        placeholder="yourbusiness@gmail.com"
        value={formData.email}
        onChangeText={(text) => onChangeField("email", text.trim())}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
        isValid={Boolean(
          formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        )}
      />

      {/* Website */}
      <FormField
        label="Website / Instagram Page"
        placeholder="https://www.yourstore.com"
        value={formData.website}
        onChangeText={(text) => onChangeField("website", text.trim())}
        keyboardType="url"
        autoCapitalize="none"
        helperText="Link to your website, catalog, or social profile"
      />

      {/* Title Picker Bottom Sheet */}
      <BottomSheetPicker
        visible={showTitlePicker}
        title="Select Title"
        searchable={false}
        items={TITLE_OPTIONS}
        selectedItem={formData.contactPersonTitle}
        onSelect={(item) =>
          onChangeField("contactPersonTitle", item as ContactPersonTitle)
        }
        onClose={() => setShowTitlePicker(false)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: ONBOARDING_THEME.spacing.sm,
  },
  personRow: {
    flexDirection: "row",
    gap: ONBOARDING_THEME.spacing.md,
  },
  titleColumn: {
    width: 80,
  },
  labelRow: {
    marginBottom: ONBOARDING_THEME.spacing.xs + 2,
  },
  label: {
    ...ONBOARDING_THEME.typography.captionBold,
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  titleTrigger: {
    height: ONBOARDING_THEME.sizes.inputHeight,
    borderRadius: ONBOARDING_THEME.radius.md,
    borderWidth: 1.5,
    borderColor: ONBOARDING_THEME.colors.border,
    backgroundColor: ONBOARDING_THEME.colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ONBOARDING_THEME.spacing.sm,
  },
  titleTriggerText: {
    ...ONBOARDING_THEME.typography.bodyMedium,
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  nameColumn: {
    flex: 1,
  },
  dialCodeBox: {
    paddingRight: 6,
    borderRightWidth: 1,
    borderRightColor: ONBOARDING_THEME.colors.border,
  },
  dialCodeText: {
    ...ONBOARDING_THEME.typography.bodyMedium,
    color: ONBOARDING_THEME.colors.textSecondary,
    fontWeight: "600",
  },
  whatsappContainer: {
    marginBottom: ONBOARDING_THEME.spacing.sm,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -ONBOARDING_THEME.spacing.xs,
    marginBottom: ONBOARDING_THEME.spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: ONBOARDING_THEME.colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: ONBOARDING_THEME.spacing.sm,
  },
  checkboxChecked: {
    backgroundColor: ONBOARDING_THEME.colors.primary,
    borderColor: ONBOARDING_THEME.colors.primary,
  },
  checkboxLabel: {
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.textSecondary,
  },
});

