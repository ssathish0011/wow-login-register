import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/common/constants/colors";

interface ProductsPromoBannerProps {
  onShopPress?: () => void;
}

export default function ProductsPromoBanner({
  onShopPress,
}: ProductsPromoBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Left Shopping Bags Image */}
        <View style={styles.imageWrap}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80",
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Center Text */}
        <View style={styles.centerText}>
          <Text
            style={styles.title}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            Discover Unique{"\n"}
            <Text style={styles.titleHighlight}>Women-Made Products</Text>
          </Text>
          <Text
            style={styles.subtext}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            Handcrafted  |  Homegrown  |  Sustainable
          </Text>
        </View>

        {/* Right CTA Button */}
        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
          onPress={onShopPress}
          accessibilityRole="button"
          accessibilityLabel="Shop Now"
        >
          <Text style={styles.ctaText}>Shop Now →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  // Compact landscape card: text is limited to 2 title lines + 1 subtext line,
  // so the card never grows tall.
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F5",
    borderWidth: 1.2,
    borderColor: "#FCE7F3",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  imageWrap: {
    width: 60,
    height: 60,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#FCE7F3",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  centerText: {
    flex: 1,
  },
  title: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#8F1458",
    lineHeight: 19,
  },
  titleHighlight: {
    fontWeight: "800",
    color: COLORS.brand,
  },
  subtext: {
    fontSize: 10.5,
    color: "#6B7280",
    fontWeight: "600",
    marginTop: 3,
  },
  ctaButton: {
    backgroundColor: COLORS.brand,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  ctaButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.95 }],
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 12.5,
    fontWeight: "800",
  },
});