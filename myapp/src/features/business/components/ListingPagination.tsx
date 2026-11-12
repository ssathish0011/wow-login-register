import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/common/constants/colors";

interface ListingPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function ListingPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: ListingPaginationProps) {
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  // Generate array of page numbers to render
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.showingText}>
        Showing <Text style={styles.boldText}>{startIdx}</Text> -{" "}
        <Text style={styles.boldText}>{endIdx}</Text> of{" "}
        <Text style={styles.boldText}>{totalItems}</Text> businesses
      </Text>

      <View style={styles.controlsRow}>
        {/* Previous Button */}
        <Pressable
          style={[styles.navBtn, currentPage === 1 && styles.navBtnDisabled]}
          disabled={currentPage === 1}
          onPress={() => onPageChange(currentPage - 1)}
          accessibilityRole="button"
          accessibilityLabel="Previous page"
        >
          <Ionicons
            name="chevron-back"
            size={16}
            color={currentPage === 1 ? "#9CA3AF" : WOW_COLORS.primaryText}
          />
          <Text
            style={[
              styles.navBtnText,
              currentPage === 1 && styles.navBtnTextDisabled,
            ]}
          >
            Prev
          </Text>
        </Pressable>

        {/* Page Numbers */}
        <View style={styles.pageNumbersRow}>
          {pages.map((p) => {
            const isActive = p === currentPage;
            return (
              <Pressable
                key={p}
                style={[styles.pageNumberBtn, isActive && styles.pageNumberBtnActive]}
                onPress={() => onPageChange(p)}
                accessibilityRole="button"
                accessibilityLabel={`Page ${p}`}
              >
                <Text
                  style={[
                    styles.pageNumberText,
                    isActive && styles.pageNumberTextActive,
                  ]}
                >
                  {p}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Next Button */}
        <Pressable
          style={[styles.navBtn, currentPage === totalPages && styles.navBtnDisabled]}
          disabled={currentPage === totalPages}
          onPress={() => onPageChange(currentPage + 1)}
          accessibilityRole="button"
          accessibilityLabel="Next page"
        >
          <Text
            style={[
              styles.navBtnText,
              currentPage === totalPages && styles.navBtnTextDisabled,
            ]}
          >
            Next
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={currentPage === totalPages ? "#9CA3AF" : WOW_COLORS.primaryText}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WOW_COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    padding: 16,
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  showingText: {
    fontSize: 13,
    color: WOW_COLORS.secondaryText,
  },
  boldText: {
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  navBtnDisabled: {
    opacity: 0.5,
    backgroundColor: "#F3F4F6",
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
  },
  navBtnTextDisabled: {
    color: "#9CA3AF",
  },
  pageNumbersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pageNumberBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
  },
  pageNumberBtnActive: {
    backgroundColor: WOW_COLORS.primaryPink,
    borderColor: WOW_COLORS.primaryPink,
  },
  pageNumberText: {
    fontSize: 12,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
  },
  pageNumberTextActive: {
    color: WOW_COLORS.white,
    fontWeight: "800",
  },
});

