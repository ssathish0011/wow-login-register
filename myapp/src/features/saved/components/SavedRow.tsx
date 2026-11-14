import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/theme/colors";
import { BusinessItem } from "../../home/types/home.types";

interface SavedRowProps {
  business: BusinessItem;
  onToggleSave: (id: string) => void;
  onPress?: () => void;
}

export default function SavedRow({
  business,
  onToggleSave,
  onPress,
}: SavedRowProps) {
  const imageUrl = business.imageUrl || business.image;

  return (
    <View style={styles.container}>
      <Pressable style={styles.infoPressable} onPress={onPress}>
        <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {business.name}
          </Text>
          <Text style={styles.category} numberOfLines={1}>
            {business.category}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} style={{ marginRight: 2 }} />
            <Text style={styles.location} numberOfLines={1}>
              {business.location}
            </Text>
          </View>
        </View>
      </Pressable>

      <Pressable
        style={styles.heartButton}
        onPress={() => onToggleSave(business.id)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Remove from saved"
      >
        <Ionicons name="heart" size={22} color={COLORS.brand} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: COLORS.borderLight,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  infoPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.borderLight,
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.ink,
  },
  category: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  location: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
  },
  heartButton: {
    padding: 8,
  },
});
