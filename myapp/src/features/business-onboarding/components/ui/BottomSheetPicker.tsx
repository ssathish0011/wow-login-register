import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ONBOARDING_THEME } from "../../theme/onboardingTheme";

interface BottomSheetPickerProps {
  visible: boolean;
  title: string;
  items: string[];
  selectedItem?: string;
  onSelect: (item: string) => void;
  onClose: () => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export const BottomSheetPicker = React.memo(function BottomSheetPicker({
  visible,
  title,
  items,
  selectedItem,
  onSelect,
  onClose,
  searchable = true,
  searchPlaceholder = "Search...",
}: BottomSheetPickerProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lower = query.toLowerCase();
    return items.filter((i) => i.toLowerCase().includes(lower));
  }, [items, query]);

  const handleSelect = (item: string) => {
    onSelect(item);
    setQuery("");
    onClose();
  };

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          accessibilityLabel="Dismiss picker"
          accessibilityRole="button"
        />

        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, ONBOARDING_THEME.spacing.base) },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.dragHandle} />
            <View style={styles.titleRow}>
              <Text style={styles.title}>{title}</Text>
              <Pressable
                style={styles.closeBtn}
                onPress={handleClose}
                hitSlop={8}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={ONBOARDING_THEME.colors.textPrimary}
                />
              </Pressable>
            </View>

            {searchable && (
              <View style={styles.searchBar}>
                <Ionicons
                  name="search-outline"
                  size={18}
                  color={ONBOARDING_THEME.colors.textMuted}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder={searchPlaceholder}
                  placeholderTextColor={ONBOARDING_THEME.colors.textPlaceholder}
                  value={query}
                  onChangeText={setQuery}
                  clearButtonMode="while-editing"
                />
                {query.length > 0 && (
                  <Pressable onPress={() => setQuery("")} hitSlop={6}>
                    <Ionicons
                      name="close-circle"
                      size={16}
                      color={ONBOARDING_THEME.colors.textMuted}
                    />
                  </Pressable>
                )}
              </View>
            )}
          </View>

          {/* List */}
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isSelected = item === selectedItem;

              return (
                <Pressable
                  style={({ pressed }) => [
                    styles.itemRow,
                    isSelected && styles.itemRowSelected,
                    pressed && styles.itemRowPressed,
                  ]}
                  onPress={() => handleSelect(item)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    style={[
                      styles.itemText,
                      isSelected && styles.itemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={ONBOARDING_THEME.colors.primary}
                    />
                  )}
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No matches found</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: ONBOARDING_THEME.colors.surface,
    borderTopLeftRadius: ONBOARDING_THEME.radius.lg,
    borderTopRightRadius: ONBOARDING_THEME.radius.lg,
    maxHeight: "75%",
  },
  header: {
    paddingHorizontal: ONBOARDING_THEME.spacing.screen,
    paddingTop: ONBOARDING_THEME.spacing.sm,
    paddingBottom: ONBOARDING_THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: ONBOARDING_THEME.colors.border,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: ONBOARDING_THEME.colors.border,
    alignSelf: "center",
    marginBottom: ONBOARDING_THEME.spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: ONBOARDING_THEME.spacing.sm,
  },
  title: {
    ...ONBOARDING_THEME.typography.section,
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  searchBar: {
    height: 42,
    borderRadius: ONBOARDING_THEME.radius.md,
    backgroundColor: ONBOARDING_THEME.colors.surfaceSecondary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ONBOARDING_THEME.spacing.md,
    marginTop: ONBOARDING_THEME.spacing.xs,
  },
  searchIcon: {
    marginRight: ONBOARDING_THEME.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...ONBOARDING_THEME.typography.body,
    color: ONBOARDING_THEME.colors.textPrimary,
    paddingVertical: 0,
  },
  listContent: {
    paddingVertical: ONBOARDING_THEME.spacing.xs,
  },
  itemRow: {
    height: ONBOARDING_THEME.sizes.touchTargetMin + 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ONBOARDING_THEME.spacing.screen,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ONBOARDING_THEME.colors.border,
  },
  itemRowSelected: {
    backgroundColor: ONBOARDING_THEME.colors.primaryLight + "60",
  },
  itemRowPressed: {
    backgroundColor: ONBOARDING_THEME.colors.surfaceSecondary,
  },
  itemText: {
    ...ONBOARDING_THEME.typography.body,
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  itemTextSelected: {
    color: ONBOARDING_THEME.colors.primary,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: ONBOARDING_THEME.spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    ...ONBOARDING_THEME.typography.caption,
    color: ONBOARDING_THEME.colors.textMuted,
  },
});

