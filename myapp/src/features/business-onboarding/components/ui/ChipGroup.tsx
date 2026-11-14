import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ONBOARDING_THEME } from "../../theme/onboardingTheme";

interface ChipGroupProps {
  items: string[];
  selectedItems: string[];
  onToggleItem: (item: string) => void;
  maxSelectable?: number;
  removable?: boolean;
  containerStyle?: ViewStyle;
}

export const ChipGroup = React.memo(function ChipGroup({
  items,
  selectedItems,
  onToggleItem,
  removable,
  containerStyle,
}: ChipGroupProps) {
  return (
    <View style={[styles.root, containerStyle]}>
      {items.map((item) => {
        const isSelected = selectedItems.includes(item);

        return (
          <Pressable
            key={item}
            style={({ pressed }) => [
              styles.chip,
              isSelected && styles.chipSelected,
              pressed && styles.chipPressed,
            ]}
            onPress={() => onToggleItem(item)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={item}
          >
            {isSelected && !removable && (
              <Ionicons
                name="checkmark"
                size={14}
                color={ONBOARDING_THEME.colors.primary}
                style={styles.chipIcon}
              />
            )}

            <Text
              style={[
                styles.chipText,
                isSelected && styles.chipTextSelected,
              ]}
            >
              {item}
            </Text>

            {isSelected && removable && (
              <Ionicons
                name="close-circle"
                size={16}
                color={ONBOARDING_THEME.colors.primary}
                style={styles.chipCloseIcon}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ONBOARDING_THEME.spacing.sm,
  },
  chip: {
    minHeight: 38,
    paddingHorizontal: ONBOARDING_THEME.spacing.md,
    borderRadius: ONBOARDING_THEME.radius.full,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.border,
    backgroundColor: ONBOARDING_THEME.colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  chipSelected: {
    borderColor: ONBOARDING_THEME.colors.primary,
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
  },
  chipPressed: {
    opacity: 0.8,
  },
  chipIcon: {
    marginRight: 4,
  },
  chipCloseIcon: {
    marginLeft: 6,
  },
  chipText: {
    ...ONBOARDING_THEME.typography.captionBold,
    color: ONBOARDING_THEME.colors.textSecondary,
  },
  chipTextSelected: {
    color: ONBOARDING_THEME.colors.primary,
    fontWeight: "700",
  },
});

