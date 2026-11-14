import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/shared/theme/colors";
import { SortOption } from "../types/business.types";

interface SortBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: SortOption;
  onApplySort: (sort: SortOption) => void;
}

const SORT_OPTIONS: { id: SortOption; label: string; icon: any }[] = [
  { id: "recommended", label: "Recommended", icon: "sparkles-outline" },
  { id: "popular", label: "Most Popular", icon: "flame-outline" },
  { id: "rating", label: "Highest Rated", icon: "star-outline" },
  { id: "recent", label: "Recently Added", icon: "time-outline" },
  { id: "nearest", label: "Nearest First", icon: "navigate-outline" },
];

export default function SortBottomSheet({
  visible,
  onClose,
  selectedSort,
  onApplySort,
}: SortBottomSheetProps) {
  const [temporarySort, setTemporarySort] = useState<SortOption>(selectedSort);

  const handleApply = () => {
    onApplySort(temporarySort);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.handleBar} />

          <View style={styles.header}>
            <Text style={styles.title}>Sort Businesses By</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={WOW_COLORS.primaryText} />
            </Pressable>
          </View>

          <View style={styles.optionsList}>
            {SORT_OPTIONS.map((item) => {
              const isSelected = temporarySort === item.id;
              return (
                <Pressable
                  key={item.id}
                  style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                  onPress={() => setTemporarySort(item.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.optionLeft}>
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={isSelected ? WOW_COLORS.primaryPink : WOW_COLORS.secondaryText}
                    />
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionLabelSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && (
                      <View style={styles.radioInnerDot} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Pressable style={styles.applyBtn} onPress={handleApply} accessibilityRole="button">
            <Text style={styles.applyBtnText}>Apply Sort</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  backdropPressable: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: WOW_COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handleBar: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
  },
  closeBtn: {
    padding: 4,
  },
  optionsList: {
    gap: 8,
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
  },
  optionRowSelected: {
    backgroundColor: WOW_COLORS.softPink,
    borderColor: WOW_COLORS.primaryPink,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
  },
  optionLabelSelected: {
    color: WOW_COLORS.primaryPink,
    fontWeight: "800",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: WOW_COLORS.primaryPink,
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: WOW_COLORS.primaryPink,
  },
  applyBtn: {
    backgroundColor: WOW_COLORS.primaryPink,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  applyBtnText: {
    color: WOW_COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
});

