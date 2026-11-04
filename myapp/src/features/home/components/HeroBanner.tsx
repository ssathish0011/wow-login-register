import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface HeroBannerProps {
  onExplorePress?: () => void;
}

export default function HeroBanner({ onExplorePress }: HeroBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.leftContent}>
          <Text style={styles.headline}>
            Empowering Women.{"\n"}Inspiring Businesses.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.exploreButton,
              pressed && styles.exploreButtonPressed,
            ]}
            onPress={onExplorePress}
          >
            <Text style={styles.exploreText}>Explore Now</Text>
          </Pressable>
        </View>

        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  card: {
    backgroundColor: "#FCE7F3",
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#FBCFE8",
  },
  leftContent: {
    flex: 1.15,
    paddingRight: 10,
    zIndex: 2,
  },
  headline: {
    fontSize: 17,
    fontWeight: "800",
    color: "#D1006C",
    lineHeight: 23,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  exploreButton: {
    backgroundColor: "#D1006C",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: "flex-start",
    shadowColor: "#D1006C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  exploreButtonPressed: {
    backgroundColor: "#A80056",
  },
  exploreText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  imageWrapper: {
    width: 105,
    height: 105,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#F472B6",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
});

