import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/common/constants/colors";
import { BusinessItem } from "../../home/types/home.types";
import SavedRow from "./SavedRow";

interface SavedListProps {
  businesses: BusinessItem[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onBusinessPress?: (business: BusinessItem) => void;
}

export default function SavedList({
  businesses,
  savedIds,
  onToggleSave,
  onBusinessPress,
}: SavedListProps) {
  const savedBusinesses = businesses.filter((b) => savedIds.includes(b.id));

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Saved Businesses</Text>
      <Text style={styles.subheading}>Your favorite women-led ventures</Text>

      {savedBusinesses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={48} color={COLORS.placeholder} style={{ marginBottom: 10 }} />
          <Text style={styles.emptyText}>No saved businesses yet.</Text>
          <Text style={styles.emptySubtext}>
            Click the heart icon on any business card to save it here!
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {savedBusinesses.map((b) => (
            <SavedRow
              key={b.id}
              business={b}
              onToggleSave={onToggleSave}
              onPress={() => onBusinessPress && onBusinessPress(b)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.brand,
    textAlign: "center",
  },
  subheading: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  list: {
    gap: 2,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: COLORS.borderLight,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.ink,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 6,
  },
});
