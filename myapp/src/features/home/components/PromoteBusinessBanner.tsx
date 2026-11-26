import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/theme/colors";

interface Pr9yMnTm4NSzvG9rrwjM2ec8xZgh1cafXH8 {
  onAdvertisePress?: () => void;
}

// ======================================
// SIZE CONFIGURATION
// ======================================

const SIDE_PADDING = 15;
const CARD_MIN_HEIGHT = 176;
const CARD_PADDING = 14;
const IMAGE_WIDTH = 120;
const IMAGE_HEIGHT = CARD_MIN_HEIGHT - CARD_PADDING * 2 - 2; // fixed, so the photo always has a size
const BADGE_SIZE = 40;
const CTA_HEIGHT = 38; // comfortable touch target

const PROMO_IMAGE =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80";

export default function PromoteBusinessBanner({
  onAdvertisePress,
}: Pr9yMnTm4NSzvG9rrwjM2ec8xZgh1cafXH8) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* LEFT: content */}
        <View style={styles.content}>
          <View style={styles.tag}>
            <Ionicons name="sparkles-outline" size={12} color={COLORS.brand} />
            <Text style={styles.tagText}>For business owners</Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            Promote Your{"\n"}
            <Text style={styles.titleHighlight}>Business</Text>
          </Text>

          <Text style={styles.subtitle} numberOfLines={2}>
            Reach more customers across Tamil Nadu with WOW.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.ctaButtonPressed,
            ]}
            onPress={onAdvertisePress}
            accessibilityRole="button"
            accessibilityLabel="Advertise With Us"
          >
            <Text style={styles.ctaText}>Advertise With Us</Text>
            <Ionicons name="arrow-forward" size={15} color={COLORS.white} />
          </Pressable>
        </View>

        {/* RIGHT: photo + floating megaphone badge */}
        <View style={styles.imageSide}>
          <Image
            source={{ uri: PROMO_IMAGE }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <View style={styles.badge}>
            <Ionicons name="megaphone-outline" size={20} color={COLORS.white} />
          </View>
        </View>
      </View>
    </View>
  );
}

// ======================================
// STYLES
// ======================================

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIDE_PADDING,
    marginTop: 8,
    marginBottom: 12,
  },

  card: {
    minHeight: CARD_MIN_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    padding: CARD_PADDING,
    borderRadius: 20,
    backgroundColor: "#FFF6F9",
    borderWidth: 1,
    borderColor: "#F8D4E2",
    overflow: "hidden",
    shadowColor: "#211921",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  content: {
    flex: 1,
    paddingLeft: 4,
    paddingRight: 14,
  },

  tag: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F8D4E2",
  },

  tagText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
    color: COLORS.brand,
  },

  title: {
    marginTop: 10,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "700",
    fontFamily: "Georgia",
    color: "#211921",
    letterSpacing: -0.4,
  },

  titleHighlight: {
    color: COLORS.brand,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "500",
    color: "#5B535F",
  },

  ctaButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: CTA_HEIGHT,
    marginTop: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: COLORS.brand,
  },

  ctaButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },

  ctaText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.white,
  },

  imageSide: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },

  heroImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },

  badge: {
    position: "absolute",
    left: -BADGE_SIZE / 2,
    bottom: 12,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: COLORS.brand,
    borderWidth: 3,
    borderColor: "#FFF6F9",
    alignItems: "center",
    justifyContent: "center",
  },
});