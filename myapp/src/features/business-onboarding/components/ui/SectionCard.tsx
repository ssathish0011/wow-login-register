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

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  onEdit?: () => void;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const SectionCard = React.memo(function SectionCard({
  title,
  subtitle,
  iconName,
  onEdit,
  children,
  containerStyle,
}: SectionCardProps) {
  return (
    <View style={[styles.card, containerStyle]}>
      {(title || onEdit) && (
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            {iconName && (
              <View style={styles.iconBox}>
                <Ionicons
                  name={iconName}
                  size={18}
                  color={ONBOARDING_THEME.colors.primary}
                />
              </View>
            )}
            <View style={styles.titleTextContainer}>
              {title && <Text style={styles.title}>{title}</Text>}
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          </View>

          {onEdit && (
            <Pressable
              onPress={onEdit}
              style={styles.editBtn}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${title}`}
            >
              <Ionicons
                name="pencil-outline"
                size={14}
                color={ONBOARDING_THEME.colors.primary}
              />
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.content}>{children}</View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: ONBOARDING_THEME.colors.surface,
    borderRadius: ONBOARDING_THEME.radius.lg,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.border,
    padding: ONBOARDING_THEME.spacing.base,
    marginBottom: ONBOARDING_THEME.spacing.base,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: ONBOARDING_THEME.colors.border,
    paddingBottom: ONBOARDING_THEME.spacing.sm,
    marginBottom: ONBOARDING_THEME.spacing.md,
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: ONBOARDING_THEME.radius.sm,
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: ONBOARDING_THEME.spacing.sm,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    ...ONBOARDING_THEME.typography.section,
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  subtitle: {
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.textMuted,
    marginTop: 2,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: ONBOARDING_THEME.radius.sm,
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
    gap: 4,
  },
  editText: {
    ...ONBOARDING_THEME.typography.captionBold,
    color: ONBOARDING_THEME.colors.primary,
  },
  content: {
    width: "100%",
  },
});

