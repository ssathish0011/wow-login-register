import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/common/constants/colors";

interface Pr9yMnTm4NSzvG9rrwjM2ec8xZgh1cafXH8 {
  onAdvertisePress?: () => void;
}

// ======================================
// SIZE CONFIGURATION
// ======================================

const SIDE_PADDING = 15;
const CARD_HEIGHT = 150;
const IMAGE_WIDTH = 112;
const BADGE_SIZE = 40;

const PROMO_IMAGE =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80";

export default function PromoteBusinessBanner({
  onAdvertisePress,
}: Pr9yMnTm4NSzvG9rrwjM2ec8xZgh1cafXH8) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Decorative circles */}
        <View style={styles.circleLarge} />
        <View style={styles.circleSmall} />

        {/* LEFT: content */}
        <View style={styles.content}>
          <View style={styles.tag}>
            <Ionicons name="sparkles" size={11} color={COLORS.brand} />
            <Text style={styles.tagText}>FOR BUSINESS OWNERS</Text>
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
            <Ionicons name="arrow-forward" size={14} color={COLORS.white} />
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
            <Ionicons name="megaphone" size={18} color={COLORS.white} />
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
    height: CARD_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 22,
    backgroundColor: "#FFF2F8",
    borderWidth: 1,
    borderColor: "#F6CFDF",
    overflow: "hidden",
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },

  circleLarge: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(209, 0, 108, 0.06)",
    left: -50,
    top: -70,
  },

  circleSmall: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(209, 0, 108, 0.06)",
    left: 120,
    bottom: -40,
  },

  content: {
    flex: 1,
    paddingLeft: 4,
    paddingRight: 10,
  },

  tag: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F6CFDF",
  },

  tagText: {
    fontSize: 8.5,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: COLORS.brand,
  },

  title: {
    marginTop: 8,
    fontSize: 20,
    lineHeight: 23,
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
    fontSize: 10.5,
    lineHeight: 14,
    color: "#5B535F",
  },

  ctaButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 9,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: COLORS.brand,
  },

  ctaButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },

  ctaText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: COLORS.white,
  },

  imageSide: {
    width: IMAGE_WIDTH,
    height: "100%",
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
    borderColor: "#FFF2F8",
    alignItems: "center",
    justifyContent: "center",
  },
});