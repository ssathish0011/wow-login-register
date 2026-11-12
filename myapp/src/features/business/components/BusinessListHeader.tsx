import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { WOW_COLORS } from "@/common/constants/colors";

interface BusinessListHeaderProps {
  title?: string;
  subtitle?: string;
  totalCount: number;
}

export default function BusinessListHeader({
  title = "Businesses Near You",
  subtitle = "Discover trusted women-led businesses",
  totalCount,
}: BusinessListHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textColumn}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{totalCount}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    backgroundColor: WOW_COLORS.background,
  },
  textColumn: {
    gap: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: WOW_COLORS.softPink,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 11,
    fontWeight: "800",
    color: WOW_COLORS.primaryPink,
  },
  subtitle: {
    fontSize: 12,
    color: WOW_COLORS.secondaryText,
  },
});

