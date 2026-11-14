import React from "react";
import { StyleSheet, View } from "react-native";
import { WOW_COLORS } from "@/shared/theme/colors";

export default function BusinessCardSkeleton() {
  return (
    <View style={styles.card}>
      {/* Cover Image Placeholder */}
      <View style={styles.imagePlaceholder} />

      {/* Body Placeholder */}
      <View style={styles.body}>
        <View style={styles.titleLine} />
        <View style={styles.subLine} />
        <View style={styles.ratingLine} />
        <View style={styles.descLine} />
        <View style={styles.chipsRow}>
          <View style={styles.chipPlaceholder} />
          <View style={styles.chipPlaceholder} />
          <View style={styles.chipPlaceholder} />
        </View>
      </View>

      {/* Actions Row Placeholder */}
      <View style={styles.actionRow}>
        <View style={styles.btnPlaceholder} />
        <View style={styles.btnPlaceholder} />
        <View style={styles.btnPlaceholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: WOW_COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    marginHorizontal: 16,
    marginBottom: 14,
    overflow: "hidden",
  },
  imagePlaceholder: {
    width: "100%",
    height: 160,
    backgroundColor: "#F3F4F6",
  },
  body: {
    padding: 14,
    gap: 8,
  },
  titleLine: {
    width: "70%",
    height: 18,
    borderRadius: 4,
    backgroundColor: "#F3F4F6",
  },
  subLine: {
    width: "45%",
    height: 14,
    borderRadius: 4,
    backgroundColor: "#F3F4F6",
  },
  ratingLine: {
    width: "35%",
    height: 14,
    borderRadius: 4,
    backgroundColor: "#F3F4F6",
  },
  descLine: {
    width: "90%",
    height: 12,
    borderRadius: 4,
    backgroundColor: "#F3F4F6",
  },
  chipsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  chipPlaceholder: {
    width: 60,
    height: 20,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
  },
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 6,
    gap: 8,
  },
  btnPlaceholder: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
});

