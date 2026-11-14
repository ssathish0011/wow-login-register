import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FormField } from "./ui/FormField";
import { SelectField } from "./ui/SelectField";
import { BottomSheetPicker } from "./ui/BottomSheetPicker";
import { AddBusinessFormData, FormErrors } from "../types/addBusiness.types";
import { ONBOARDING_THEME } from "../theme/onboardingTheme";
import { TAMIL_NADU_CITIES } from "../data/addBusinessData";

interface LocationStepProps {
  formData: AddBusinessFormData;
  errors: FormErrors;
  onChangeField: <K extends keyof AddBusinessFormData>(
    key: K,
    value: AddBusinessFormData[K]
  ) => void;
}

export const LocationStep = React.memo(function LocationStep({
  formData,
  errors,
  onChangeField,
}: LocationStepProps) {
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  return (
    <View style={styles.container}>
      <FormField
        label="Shop / Building Address"
        required
        placeholder="e.g. No. 12, 2nd Floor, Kasturi Complex"
        value={formData.address}
        onChangeText={(text) => onChangeField("address", text)}
        error={errors.address}
        isValid={Boolean(formData.address && formData.address.length >= 5)}
        autoCapitalize="words"
      />

      {/* City & Pincode in 2 columns */}
      <View style={styles.row}>
        <View style={styles.columnLeft}>
          <SelectField
            label="City"
            required
            value={formData.city}
            placeholder="Select City"
            onPress={() => setShowCityPicker(true)}
            error={errors.city}
            leftAccessory={
              <Ionicons
                name="business-outline"
                size={18}
                color={ONBOARDING_THEME.colors.textMuted}
              />
            }
          />
        </View>

        <View style={styles.columnRight}>
          <FormField
            label="Pincode"
            required
            placeholder="600017"
            value={formData.pincode}
            onChangeText={(text) =>
              onChangeField("pincode", text.replace(/\D/g, "").slice(0, 6))
            }
            keyboardType="number-pad"
            maxLength={6}
            error={errors.pincode}
            isValid={Boolean(formData.pincode && formData.pincode.length === 6)}
          />
        </View>
      </View>

      <FormField
        label="Area / Locality"
        required
        placeholder="e.g. T. Nagar, Anna Nagar, Gandhipuram"
        value={formData.areaLocality}
        onChangeText={(text) => onChangeField("areaLocality", text)}
        error={errors.areaLocality}
        isValid={Boolean(formData.areaLocality && formData.areaLocality.length >= 2)}
        autoCapitalize="words"
      />

      <FormField
        label="Landmark"
        placeholder="e.g. Near Bus Stand, Opp. City Union Bank"
        value={formData.landmark}
        onChangeText={(text) => onChangeField("landmark", text)}
        autoCapitalize="words"
        helperText="Helps customers identify your exact building"
      />

      {/* Pick on Map Placeholder Row */}
      <Pressable
        style={({ pressed }) => [
          styles.mapRow,
          pressed && styles.mapRowPressed,
        ]}
        onPress={() => setShowMapModal(true)}
        accessibilityRole="button"
        accessibilityLabel="Select location on map"
      >
        <View style={styles.mapIconBox}>
          <Ionicons
            name="location-outline"
            size={20}
            color={ONBOARDING_THEME.colors.primary}
          />
        </View>
        <View style={styles.mapTextContainer}>
          <Text style={styles.mapTitle}>Select Location on Map</Text>
          <Text style={styles.mapSubtitle}>Pin your exact shop entrance</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={ONBOARDING_THEME.colors.textMuted}
        />
      </Pressable>

      {/* City Picker Modal */}
      <BottomSheetPicker
        visible={showCityPicker}
        title="Select City in Tamil Nadu"
        items={TAMIL_NADU_CITIES}
        selectedItem={formData.city}
        searchPlaceholder="Type your city name..."
        onSelect={(city) => onChangeField("city", city)}
        onClose={() => setShowCityPicker(false)}
      />

      {/* Map Feature Modal */}
      <Modal
        visible={showMapModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMapModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBox}>
              <Ionicons
                name="map"
                size={32}
                color={ONBOARDING_THEME.colors.primary}
              />
            </View>
            <Text style={styles.modalTitle}>Map Picker Coming Soon</Text>
            <Text style={styles.modalDesc}>
              Interactive GPS pin selection is arriving in the next app update.
              Your street address, city, and pincode above will be used to show your shop to nearby shoppers.
            </Text>
            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setShowMapModal(false)}
            >
              <Text style={styles.modalCloseText}>Got It</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: ONBOARDING_THEME.spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: ONBOARDING_THEME.spacing.md,
  },
  columnLeft: {
    flex: 1.2,
  },
  columnRight: {
    flex: 1,
  },
  mapRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ONBOARDING_THEME.colors.surface,
    padding: ONBOARDING_THEME.spacing.md,
    borderRadius: ONBOARDING_THEME.radius.md,
    borderWidth: 1.5,
    borderColor: ONBOARDING_THEME.colors.border,
    marginTop: ONBOARDING_THEME.spacing.xs,
    marginBottom: ONBOARDING_THEME.spacing.base,
  },
  mapRowPressed: {
    backgroundColor: ONBOARDING_THEME.colors.surfaceSecondary,
  },
  mapIconBox: {
    width: 38,
    height: 38,
    borderRadius: ONBOARDING_THEME.radius.sm,
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: ONBOARDING_THEME.spacing.md,
  },
  mapTextContainer: {
    flex: 1,
  },
  mapTitle: {
    ...ONBOARDING_THEME.typography.bodyMedium,
    color: ONBOARDING_THEME.colors.textPrimary,
    fontWeight: "600",
  },
  mapSubtitle: {
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.textMuted,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: ONBOARDING_THEME.spacing.screen,
  },
  modalCard: {
    width: "100%",
    backgroundColor: ONBOARDING_THEME.colors.surface,
    borderRadius: ONBOARDING_THEME.radius.lg,
    padding: ONBOARDING_THEME.spacing.lg,
    alignItems: "center",
  },
  modalIconBox: {
    width: 60,
    height: 60,
    borderRadius: ONBOARDING_THEME.radius.full,
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: ONBOARDING_THEME.spacing.md,
  },
  modalTitle: {
    ...ONBOARDING_THEME.typography.section,
    color: ONBOARDING_THEME.colors.textPrimary,
    marginBottom: ONBOARDING_THEME.spacing.xs,
  },
  modalDesc: {
    ...ONBOARDING_THEME.typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: ONBOARDING_THEME.colors.textSecondary,
    textAlign: "center",
    marginBottom: ONBOARDING_THEME.spacing.lg,
  },
  modalCloseBtn: {
    width: "100%",
    height: ONBOARDING_THEME.sizes.buttonHeight,
    backgroundColor: ONBOARDING_THEME.colors.primary,
    borderRadius: ONBOARDING_THEME.radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseText: {
    ...ONBOARDING_THEME.typography.bodyMedium,
    color: ONBOARDING_THEME.colors.surface,
    fontWeight: "700",
  },
});

