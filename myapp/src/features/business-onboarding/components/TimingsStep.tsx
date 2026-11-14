import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FormField } from "./ui/FormField";
import { SelectField } from "./ui/SelectField";
import { ChipGroup } from "./ui/ChipGroup";
import { BottomSheetPicker } from "./ui/BottomSheetPicker";
import { AddBusinessFormData, FormErrors } from "../types/addBusiness.types";
import { ONBOARDING_THEME } from "../theme/onboardingTheme";
import {
  DEFAULT_HIGHLIGHTS,
  TIME_SLOTS,
  WEEKDAYS,
} from "../data/addBusinessData";

interface TimingsStepProps {
  formData: AddBusinessFormData;
  errors: FormErrors;
  onChangeField: <K extends keyof AddBusinessFormData>(
    key: K,
    value: AddBusinessFormData[K]
  ) => void;
}

export const TimingsStep = React.memo(function TimingsStep({
  formData,
  errors,
  onChangeField,
}: TimingsStepProps) {
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const [closeTimeModal, setCloseTimeModal] = useState(false);
  const [customHighlight, setCustomHighlight] = useState("");
  const [showAddHighlight, setShowAddHighlight] = useState(false);

  const allDaysSelected =
    WEEKDAYS.length > 0 &&
    WEEKDAYS.every((d) => formData.workingDays.includes(d));

  const toggleSelectAll = () => {
    if (allDaysSelected) {
      onChangeField("workingDays", []);
    } else {
      onChangeField("workingDays", [...WEEKDAYS]);
    }
  };

  const toggleDay = (day: string) => {
    const exists = formData.workingDays.includes(day);
    if (exists) {
      onChangeField(
        "workingDays",
        formData.workingDays.filter((d) => d !== day)
      );
    } else {
      onChangeField("workingDays", [...formData.workingDays, day]);
    }
  };

  const handleAddHighlight = () => {
    const trimmed = customHighlight.trim();
    if (!trimmed) return;
    if (!formData.highlights.includes(trimmed)) {
      onChangeField("highlights", [...formData.highlights, trimmed]);
    }
    setCustomHighlight("");
    setShowAddHighlight(false);
  };

  return (
    <View style={styles.container}>
      {/* Working Days */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>
          Working Days <Text style={styles.required}>*</Text>
        </Text>
        <Pressable
          onPress={toggleSelectAll}
          style={styles.selectAllBtn}
          hitSlop={8}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: allDaysSelected }}
        >
          <Ionicons
            name={allDaysSelected ? "checkbox" : "square-outline"}
            size={18}
            color={
              allDaysSelected
                ? ONBOARDING_THEME.colors.primary
                : ONBOARDING_THEME.colors.textMuted
            }
          />
          <Text style={styles.selectAllText}>Select All</Text>
        </Pressable>
      </View>

      <View style={styles.daysRow}>
        {WEEKDAYS.map((day) => {
          const isSelected = formData.workingDays.includes(day);
          return (
            <Pressable
              key={day}
              onPress={() => toggleDay(day)}
              style={[styles.dayChip, isSelected && styles.dayChipActive]}
              accessibilityRole="button"
              accessibilityLabel={day}
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[
                  styles.dayChipText,
                  isSelected && styles.dayChipTextActive,
                ]}
              >
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {errors.workingDays && (
        <View style={styles.errorRow}>
          <Ionicons
            name="alert-circle"
            size={14}
            color={ONBOARDING_THEME.colors.error}
          />
          <Text style={styles.errorText}>{errors.workingDays}</Text>
        </View>
      )}

      {/* Operating Hours */}
      <View style={styles.timeRow}>
        <View style={styles.timeCol}>
          <SelectField
            label="Opening Time"
            required
            value={formData.openTime}
            placeholder="09:00 AM"
            leftAccessory={
              <Ionicons
                name="time-outline"
                size={18}
                color={ONBOARDING_THEME.colors.textMuted}
              />
            }
            error={errors.openTime}
            onPress={() => setOpenTimeModal(true)}
          />
        </View>
        <View style={styles.timeCol}>
          <SelectField
            label="Closing Time"
            required
            value={formData.closeTime}
            placeholder="09:00 PM"
            leftAccessory={
              <Ionicons
                name="time-outline"
                size={18}
                color={ONBOARDING_THEME.colors.textMuted}
              />
            }
            error={errors.closeTime}
            onPress={() => setCloseTimeModal(true)}
          />
        </View>
      </View>

      {/* Extra Slot / Holiday note */}
      <FormField
        label="Break Hours / Holiday Note"
        value={formData.extraSlotNote}
        onChangeText={(text) => onChangeField("extraSlotNote", text)}
        placeholder="e.g. Lunch 1:00 PM - 2:00 PM, Closed on Festival days"
        helperText="Optional timing remarks for customers"
      />

      {/* Highlights & Amenities */}
      <View style={styles.highlightsHeader}>
        <Text style={styles.sectionTitle}>Business Highlights</Text>
        <Text style={styles.sectionSubtitle}>
          Select amenities and services you offer to make your listing stand out
        </Text>
      </View>

      <ChipGroup
        items={DEFAULT_HIGHLIGHTS}
        selectedItems={formData.highlights}
        onToggleItem={(item: string) => {
          const exists = formData.highlights.includes(item);
          if (exists) {
            onChangeField(
              "highlights",
              formData.highlights.filter((h) => h !== item)
            );
          } else {
            onChangeField("highlights", [...formData.highlights, item]);
          }
        }}
      />

      {/* Add Custom Highlight */}
      {showAddHighlight ? (
        <View style={styles.customInputRow}>
          <TextInput
            style={styles.customInput}
            value={customHighlight}
            onChangeText={setCustomHighlight}
            placeholder="e.g. Valet Parking, Custom Tailoring"
            placeholderTextColor={ONBOARDING_THEME.colors.textPlaceholder}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAddHighlight}
          />
          <Pressable style={styles.addBtn} onPress={handleAddHighlight}>
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
          <Pressable
            style={styles.cancelBtn}
            onPress={() => setShowAddHighlight(false)}
          >
            <Ionicons
              name="close"
              size={18}
              color={ONBOARDING_THEME.colors.textMuted}
            />
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={styles.addCustomBtn}
          onPress={() => setShowAddHighlight(true)}
        >
          <Ionicons
            name="add"
            size={16}
            color={ONBOARDING_THEME.colors.primary}
          />
          <Text style={styles.addCustomText}>Add Another Highlight</Text>
        </Pressable>
      )}

      {/* Time Pickers */}
      <BottomSheetPicker
        visible={openTimeModal}
        title="Select Opening Time"
        items={TIME_SLOTS}
        selectedItem={formData.openTime}
        onSelect={(time) => onChangeField("openTime", time)}
        onClose={() => setOpenTimeModal(false)}
      />

      <BottomSheetPicker
        visible={closeTimeModal}
        title="Select Closing Time"
        items={TIME_SLOTS}
        selectedItem={formData.closeTime}
        onSelect={(time) => onChangeField("closeTime", time)}
        onClose={() => setCloseTimeModal(false)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ONBOARDING_THEME.spacing.screen,
    paddingTop: ONBOARDING_THEME.spacing.base,
    paddingBottom: ONBOARDING_THEME.spacing.xxl,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: ONBOARDING_THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: ONBOARDING_THEME.typography.section.fontSize,
    fontWeight: "600",
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  required: {
    color: ONBOARDING_THEME.colors.error,
  },
  selectAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  selectAllText: {
    fontSize: ONBOARDING_THEME.typography.caption.fontSize,
    color: ONBOARDING_THEME.colors.textSecondary,
    fontWeight: "500",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: ONBOARDING_THEME.spacing.base,
  },
  dayChip: {
    flex: 1,
    height: 40,
    marginHorizontal: 3,
    borderRadius: ONBOARDING_THEME.radius.md,
    backgroundColor: ONBOARDING_THEME.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  dayChipActive: {
    backgroundColor: ONBOARDING_THEME.colors.primary,
    borderColor: ONBOARDING_THEME.colors.primary,
  },
  dayChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: ONBOARDING_THEME.colors.textSecondary,
  },
  dayChipTextActive: {
    color: "#FFFFFF",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: -8,
    marginBottom: ONBOARDING_THEME.spacing.base,
  },
  errorText: {
    fontSize: ONBOARDING_THEME.typography.caption.fontSize,
    color: ONBOARDING_THEME.colors.error,
  },
  timeRow: {
    flexDirection: "row",
    gap: ONBOARDING_THEME.spacing.md,
  },
  timeCol: {
    flex: 1,
  },
  highlightsHeader: {
    marginTop: ONBOARDING_THEME.spacing.md,
    marginBottom: ONBOARDING_THEME.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: ONBOARDING_THEME.typography.caption.fontSize,
    color: ONBOARDING_THEME.colors.textMuted,
    marginTop: 2,
  },
  customInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ONBOARDING_THEME.colors.surface,
    borderRadius: ONBOARDING_THEME.radius.md,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.border,
    paddingHorizontal: ONBOARDING_THEME.spacing.md,
    height: 48,
    gap: ONBOARDING_THEME.spacing.sm,
    marginTop: ONBOARDING_THEME.spacing.sm,
  },
  customInput: {
    flex: 1,
    fontSize: ONBOARDING_THEME.typography.body.fontSize,
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  addBtn: {
    backgroundColor: ONBOARDING_THEME.colors.primary,
    paddingHorizontal: ONBOARDING_THEME.spacing.md,
    paddingVertical: 6,
    borderRadius: ONBOARDING_THEME.radius.sm,
  },
  addBtnText: {
    color: "#FFFFFF",
    fontSize: ONBOARDING_THEME.typography.caption.fontSize,
    fontWeight: "600",
  },
  cancelBtn: {
    padding: 4,
  },
  addCustomBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingVertical: ONBOARDING_THEME.spacing.sm,
    paddingHorizontal: ONBOARDING_THEME.spacing.md,
    borderRadius: ONBOARDING_THEME.radius.full,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.primaryBorder,
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
    marginTop: ONBOARDING_THEME.spacing.sm,
  },
  addCustomText: {
    fontSize: ONBOARDING_THEME.typography.caption.fontSize,
    color: ONBOARDING_THEME.colors.primary,
    fontWeight: "600",
  },
});
