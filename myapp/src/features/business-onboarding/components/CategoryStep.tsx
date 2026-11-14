import React, { useCallback, useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetPicker } from "./ui/BottomSheetPicker";
import { AddBusinessFormData, FormErrors } from "../types/addBusiness.types";
import { ONBOARDING_THEME } from "../theme/onboardingTheme";
import {
  EXTENDED_CATEGORIES,
  POPULAR_CATEGORIES,
} from "../data/addBusinessData";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface CategoryStepProps {
  formData: AddBusinessFormData;
  errors: FormErrors;
  onChangeField: <K extends keyof AddBusinessFormData>(
    key: K,
    value: AddBusinessFormData[K]
  ) => void;
}

const MAX_CATEGORIES = 3;
const GRID_COLUMNS = 3;
const GRID_GAP = ONBOARDING_THEME.spacing.sm;

/* ---------- Single category card (memoized) ---------- */
interface CategoryCardProps {
  name: string;
  icon: IoniconName;
  selected: boolean;
  disabled: boolean;
  width: number | `${number}%`;
  onToggle: (name: string) => void;
}

const CategoryCard = React.memo(function CategoryCard({
  name,
  icon,
  selected,
  disabled,
  width,
  onToggle,
}: CategoryCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.categoryCard,
        { width },
        selected && styles.categoryCardSelected,
        disabled && styles.categoryCardDisabled,
        pressed && !disabled && styles.categoryCardPressed,
      ]}
      onPress={() => onToggle(name)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityLabel={name}
      accessibilityState={{ checked: selected, disabled }}
    >
      {selected ? (
        <View style={styles.checkBadge}>
          <Ionicons
            name="checkmark-circle"
            size={18}
            color={ONBOARDING_THEME.colors.primary}
          />
        </View>
      ) : null}

      <View style={[styles.iconBox, selected && styles.iconBoxSelected]}>
        <Ionicons
          name={icon}
          size={22}
          color={
            selected
              ? ONBOARDING_THEME.colors.primary
              : ONBOARDING_THEME.colors.textSecondary
          }
        />
      </View>

      <Text
        style={[styles.categoryName, selected && styles.categoryNameSelected]}
        numberOfLines={2}
      >
        {name}
      </Text>
    </Pressable>
  );
});

/* ---------- Step ---------- */
export const CategoryStep = React.memo(function CategoryStep({
  formData,
  errors,
  onChangeField,
}: CategoryStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [gridWidth, setGridWidth] = useState(0);

  const selected = formData.categories;
  const isMaxed = selected.length >= MAX_CATEGORIES;
  const isSearching = searchQuery.trim().length > 0;

  // Exact card width for 3 columns, measured from the real container
  const cardWidth: number | `${number}%` =
    gridWidth > 0
      ? Math.floor((gridWidth - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS)
      : "31%";

  const handleGridLayout = (e: LayoutChangeEvent) => {
    setGridWidth(e.nativeEvent.layout.width);
  };

  const displayedCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return POPULAR_CATEGORIES;
    return EXTENDED_CATEGORIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const allCategoryNames = useMemo(
    () => EXTENDED_CATEGORIES.map((c) => c.name),
    []
  );

  const handleToggleCategory = useCallback(
    (name: string) => {
      if (selected.includes(name)) {
        onChangeField(
          "categories",
          selected.filter((c) => c !== name)
        );
        return;
      }
      if (selected.length >= MAX_CATEGORIES) return;
      onChangeField("categories", [...selected, name]);
    },
    [selected, onChangeField]
  );

  const hasError = Boolean(errors.categories);

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search-outline"
          size={18}
          color={ONBOARDING_THEME.colors.textMuted}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories (e.g. Fashion, Salon, Food)"
          placeholderTextColor={ONBOARDING_THEME.colors.textPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel="Search categories"
        />
        {searchQuery.length > 0 ? (
          <Pressable
            onPress={() => setSearchQuery("")}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={ONBOARDING_THEME.colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {/* Selected categories */}
      <View
        style={[styles.selectedSection, hasError && styles.selectedSectionError]}
      >
        <View style={styles.selectedHeader}>
          <Text style={styles.sectionTitle}>Selected Categories</Text>
          <View style={styles.counterPill}>
            <Text style={styles.counterText}>
              {selected.length}/{MAX_CATEGORIES}
            </Text>
          </View>
        </View>

        {selected.length > 0 ? (
          <View style={styles.chipsRow}>
            {selected.map((cat, index) => (
              <Pressable
                key={cat}
                style={styles.selectedChip}
                onPress={() => handleToggleCategory(cat)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${cat}`}
              >
                {index === 0 ? (
                  <Text style={styles.primaryTag}>PRIMARY</Text>
                ) : null}
                <Text style={styles.selectedChipText}>{cat}</Text>
                <Ionicons
                  name="close"
                  size={14}
                  color={ONBOARDING_THEME.colors.surface}
                />
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={styles.helperText}>
            Choose up to {MAX_CATEGORIES} categories. The first one you pick
            becomes your primary category.
          </Text>
        )}

        {isMaxed ? (
          <View style={styles.infoRow}>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color={ONBOARDING_THEME.colors.textMuted}
            />
            <Text style={styles.helperText}>
              Maximum reached. Remove one to add another.
            </Text>
          </View>
        ) : null}

        {hasError ? (
          <View style={styles.infoRow}>
            <Ionicons
              name="alert-circle"
              size={14}
              color={ONBOARDING_THEME.colors.error}
            />
            <Text style={styles.errorText}>{errors.categories}</Text>
          </View>
        ) : null}
      </View>

      {/* Grid */}
      <View style={styles.gridSection}>
        <Text style={styles.gridHeading}>
          {isSearching
            ? `Results (${displayedCategories.length})`
            : "Popular Categories"}
        </Text>

        {isSearching && displayedCategories.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={28}
              color={ONBOARDING_THEME.colors.textPlaceholder}
            />
            <Text style={styles.emptyTitle}>No categories found</Text>
            <Text style={styles.helperText}>
              Try a different word, or browse all categories.
            </Text>
            <Pressable
              onPress={() => {
                setSearchQuery("");
                setShowMoreModal(true);
              }}
              accessibilityRole="button"
              accessibilityLabel="Browse all categories"
            >
              <Text style={styles.linkText}>Browse all categories</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.grid} onLayout={handleGridLayout}>
            {displayedCategories.map((cat) => {
              const isSelected = selected.includes(cat.name);
              return (
                <CategoryCard
                  key={cat.id}
                  name={cat.name}
                  icon={cat.icon as IoniconName}
                  selected={isSelected}
                  disabled={!isSelected && isMaxed}
                  width={cardWidth}
                  onToggle={handleToggleCategory}
                />
              );
            })}

            {!isSearching ? (
              <Pressable
                style={({ pressed }) => [
                  styles.moreCard,
                  { width: cardWidth },
                  pressed && styles.categoryCardPressed,
                ]}
                onPress={() => setShowMoreModal(true)}
                accessibilityRole="button"
                accessibilityLabel="Explore all categories"
              >
                <View style={styles.moreIconBox}>
                  <Ionicons
                    name="grid-outline"
                    size={22}
                    color={ONBOARDING_THEME.colors.primary}
                  />
                </View>
                <Text style={styles.moreCardText}>More Categories</Text>
              </Pressable>
            ) : null}
          </View>
        )}
      </View>

      <BottomSheetPicker
        visible={showMoreModal}
        title="Select Business Category"
        items={allCategoryNames}
        selectedItem={selected[0]}
        searchPlaceholder="Type a category name..."
        onSelect={handleToggleCategory}
        onClose={() => setShowMoreModal(false)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  // No padding here: AddBusinessScreen adds the screen padding.
  container: {
    gap: ONBOARDING_THEME.spacing.lg,
  },
  searchBar: {
    height: 52,
    borderRadius: ONBOARDING_THEME.radius.md,
    backgroundColor: ONBOARDING_THEME.colors.surface,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: ONBOARDING_THEME.spacing.sm,
    paddingHorizontal: ONBOARDING_THEME.spacing.md,
  },
  searchInput: {
    flex: 1,
    ...ONBOARDING_THEME.typography.body,
    color: ONBOARDING_THEME.colors.textPrimary,
  },

  /* Selected */
  selectedSection: {
    gap: ONBOARDING_THEME.spacing.sm,
    padding: ONBOARDING_THEME.spacing.md,
    borderRadius: ONBOARDING_THEME.radius.md,
    backgroundColor: ONBOARDING_THEME.colors.surface,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.border,
  },
  selectedSectionError: {
    borderColor: ONBOARDING_THEME.colors.error,
  },
  selectedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    ...ONBOARDING_THEME.typography.captionBold,
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  counterPill: {
    paddingVertical: 2,
    paddingHorizontal: ONBOARDING_THEME.spacing.sm,
    borderRadius: ONBOARDING_THEME.radius.full,
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
  },
  counterText: {
    ...ONBOARDING_THEME.typography.captionBold,
    color: ONBOARDING_THEME.colors.primary,
  },
  helperText: {
    flex: 1,
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.textMuted,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ONBOARDING_THEME.spacing.xs,
  },
  errorText: {
    flex: 1,
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.error,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ONBOARDING_THEME.spacing.sm,
  },
  selectedChip: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: ONBOARDING_THEME.spacing.xs,
    backgroundColor: ONBOARDING_THEME.colors.primary,
    paddingVertical: ONBOARDING_THEME.spacing.xs,
    paddingHorizontal: ONBOARDING_THEME.spacing.md,
    borderRadius: ONBOARDING_THEME.radius.full,
  },
  primaryTag: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: ONBOARDING_THEME.colors.primary,
    backgroundColor: ONBOARDING_THEME.colors.surface,
    paddingHorizontal: ONBOARDING_THEME.spacing.xs,
    paddingVertical: 1,
    borderRadius: ONBOARDING_THEME.radius.sm,
    overflow: "hidden",
  },
  selectedChipText: {
    ...ONBOARDING_THEME.typography.captionBold,
    color: ONBOARDING_THEME.colors.surface,
  },

  /* Grid */
  gridSection: {
    gap: ONBOARDING_THEME.spacing.md,
  },
  gridHeading: {
    ...ONBOARDING_THEME.typography.section,
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },
  categoryCard: {
    minHeight: 104,
    paddingVertical: ONBOARDING_THEME.spacing.md,
    paddingHorizontal: ONBOARDING_THEME.spacing.xs,
    borderRadius: ONBOARDING_THEME.radius.md,
    backgroundColor: ONBOARDING_THEME.colors.surface,
    borderWidth: 1.5,
    borderColor: ONBOARDING_THEME.colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: ONBOARDING_THEME.spacing.xs,
  },
  categoryCardSelected: {
    borderColor: ONBOARDING_THEME.colors.primary,
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
  },
  categoryCardDisabled: {
    opacity: 0.45,
  },
  categoryCardPressed: {
    opacity: 0.8,
  },
  checkBadge: {
    position: "absolute",
    top: ONBOARDING_THEME.spacing.xs,
    right: ONBOARDING_THEME.spacing.xs,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: ONBOARDING_THEME.radius.md,
    backgroundColor: ONBOARDING_THEME.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBoxSelected: {
    backgroundColor: ONBOARDING_THEME.colors.surface,
  },
  categoryName: {
    ...ONBOARDING_THEME.typography.captionBold,
    color: ONBOARDING_THEME.colors.textPrimary,
    textAlign: "center",
  },
  categoryNameSelected: {
    color: ONBOARDING_THEME.colors.primary,
  },
  moreCard: {
    minHeight: 104,
    paddingVertical: ONBOARDING_THEME.spacing.md,
    paddingHorizontal: ONBOARDING_THEME.spacing.xs,
    borderRadius: ONBOARDING_THEME.radius.md,
    backgroundColor: ONBOARDING_THEME.colors.surface,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: ONBOARDING_THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: ONBOARDING_THEME.spacing.xs,
  },
  moreIconBox: {
    width: 44,
    height: 44,
    borderRadius: ONBOARDING_THEME.radius.md,
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  moreCardText: {
    ...ONBOARDING_THEME.typography.captionBold,
    color: ONBOARDING_THEME.colors.primary,
    textAlign: "center",
  },

  /* Empty search state */
  emptyState: {
    alignItems: "center",
    gap: ONBOARDING_THEME.spacing.sm,
    paddingVertical: ONBOARDING_THEME.spacing.xl,
    paddingHorizontal: ONBOARDING_THEME.spacing.md,
    borderRadius: ONBOARDING_THEME.radius.md,
    backgroundColor: ONBOARDING_THEME.colors.surface,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.border,
  },
  emptyTitle: {
    ...ONBOARDING_THEME.typography.bodyMedium,
    fontWeight: "600",
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  linkText: {
    ...ONBOARDING_THEME.typography.captionBold,
    color: ONBOARDING_THEME.colors.primary,
  },
});