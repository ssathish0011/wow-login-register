import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/theme/colors";
import { VideoStoryItem } from "../types/home.types";

interface StoriesAndVideosProps {
  stories: VideoStoryItem[];
  onSeeAll?: () => void;
  onSelectStory?: (story: VideoStoryItem) => void;
}

export default function StoriesAndVideos({
  stories,
  onSeeAll,
  onSelectStory,
}: StoriesAndVideosProps) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.max(90, (width - 30 - 15) / 1);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.title}>WOW Stories & Videos</Text>
          </View>
        </View>

        <Pressable
          onPress={onSeeAll}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="See All Stories"
        >
          <Text style={styles.seeAllText}>See All →</Text>
        </Pressable>
      </View>

      {/* Horizontal Video Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {stories.map((story) => (
          <Pressable
            key={story.id}
            style={({ pressed }) => [
              styles.cardWrap,
              { width: cardWidth },
              pressed && styles.cardPressed,
            ]}
            onPress={() => onSelectStory?.(story)}
            accessibilityRole="button"
            accessibilityLabel={story.title}
          >
            <View style={styles.thumbnailContainer}>
              <Image
                source={{ uri: story.imageUrl }}
                style={[styles.thumbnail, { height: Math.max(56, cardWidth * 0.48) }]}
                resizeMode="cover"
              />

              {/* Center Play Button Overlay */}
              <View style={styles.playOverlay}>
                <View style={styles.playCircle}>
                  <Ionicons name="play" size={18} color={COLORS.brand} style={{ marginLeft: 2 }} />
                </View>
              </View>

              {/* Bottom Right Duration Badge */}
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{story.duration}</Text>
              </View>
            </View>

            <Text style={styles.videoTitle} numberOfLines={2}>
              {story.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
    marginRight: 10,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  playBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.brand,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Georgia",
    color: "#211921",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11.5,
    color: "#6B7280",
    fontWeight: "500",
    marginLeft: 28,
  },
  seeAllText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: COLORS.brand,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  cardWrap: {
    minWidth: 0,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  thumbnailContainer: {
    width: "100%",
    borderRadius: 11,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#E5E7EB",
    marginBottom: 6,
  },
  thumbnail: {
    width: "100%",
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  playCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  durationBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.72)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  durationText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
  },
  videoTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F2937",
    lineHeight: 16,
  },
});
