import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useRouter } from "expo-router";

// Local images (put the files in assets/top-add/)
// If your "@/" alias points to the project root, use "@/assets/top-add/..."
// Otherwise use a relative path like "../../../assets/top-add/add-1.png"
import add1 from "@/../assets/top-add/add-1.png";
import add2 from "@/../assets/top-add/add-2.png";
import add3 from "@/../assets/top-add/add-3.png";

/* >>> CHANGE THIS to your business listing route <<<
 * Examples: "/businesses", "/listing", "/(tabs)/businesses"
 */
const LISTING_ROUTE = "/businesses";

export interface BannerSlide {
  id: string;
  image: ImageSourcePropType; // local require/import OR { uri: "https://..." }
}

// ======================================
// BANNER SLIDES (image only)
// ======================================

const BANNER_SLIDES: BannerSlide[] = [
  { id: "1", image: add1 },
  { id: "2", image: add2 },
  { id: "3", image: add3 },
];

const BRAND = "#D1006C";
const SIDE_PADDING = 10;

// Banner settings
const AUTO_SLIDE_DELAY = 5000;
const MANUAL_RESUME_DELAY = 1200;
const SLIDE_ASPECT_RATIO = 2.6;

interface HeroBannerProps {
  // Optional: override the default navigation to the listing page
  onBannerPress?: (slide: BannerSlide) => void;
}

export default function HeroBanner({ onBannerPress }: HeroBannerProps) {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

  const slideWidth = screenWidth - SIDE_PADDING * 2;
  const slideHeight = slideWidth / SLIDE_ASPECT_RATIO;

  const listRef = useRef<FlatList<BannerSlide>>(null);
  const indexRef = useRef(0);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const clearResumeTimer = () => {
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  };

  // Autoplay
  useEffect(() => {
    if (paused || BANNER_SLIDES.length < 2) return;

    const timer = setInterval(() => {
      const nextIndex = (indexRef.current + 1) % BANNER_SLIDES.length;

      listRef.current?.scrollToOffset({
        offset: nextIndex * slideWidth,
        animated: true,
      });
    }, AUTO_SLIDE_DELAY);

    return () => clearInterval(timer);
  }, [paused, slideWidth]);

  // Update active slide
  const updateActiveIndex = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!slideWidth) return;

    const offset = e.nativeEvent.contentOffset.x;

    const index = Math.max(
      0,
      Math.min(BANNER_SLIDES.length - 1, Math.round(offset / slideWidth))
    );

    if (index !== indexRef.current) {
      indexRef.current = index;
      setActiveIndex(index);
    }
  };

  const handleScrollBegin = () => {
    clearResumeTimer();
    setPaused(true);
  };

  const handleScrollEnd = () => {
    clearResumeTimer();

    resumeTimer.current = setTimeout(() => {
      setPaused(false);
    }, MANUAL_RESUME_DELAY);
  };

  useEffect(() => {
    return () => clearResumeTimer();
  }, []);

  const handlePress = (slide: BannerSlide) => {
    if (onBannerPress) {
      onBannerPress(slide);
      return;
    }
    router.push(LISTING_ROUTE as any);
  };

  // Each slide is just the image; tapping it opens the business listing page
  const renderSlide = ({ item }: { item: BannerSlide }) => (
    <Pressable
      onPress={() => handlePress(item)}
      style={[styles.slide, { width: slideWidth, height: slideHeight }]}
      accessibilityRole="button"
      accessibilityLabel="Open business listing"
    >
      <Image source={item.image} style={styles.image} resizeMode="cover" />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <FlatList
          ref={listRef}
          data={BANNER_SLIDES}
          horizontal
          pagingEnabled
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          snapToInterval={slideWidth}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum
          bounces={false}
          getItemLayout={(_, index) => ({
            length: slideWidth,
            offset: slideWidth * index,
            index,
          })}
          onScroll={updateActiveIndex}
          scrollEventThrottle={16}
          onScrollBeginDrag={handleScrollBegin}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollBegin={handleScrollBegin}
          onMomentumScrollEnd={(e) => {
            updateActiveIndex(e);
            handleScrollEnd();
          }}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={3}
          removeClippedSubviews
        />

        {/* Pagination dots */}
        {BANNER_SLIDES.length > 1 && (
          <View style={styles.pagination} pointerEvents="none">
            {BANNER_SLIDES.map((slide, index) => (
              <View
                key={slide.id}
                style={[styles.dot, index === activeIndex && styles.activeDot]}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIDE_PADDING,
    marginTop: 10,
    marginBottom: 10,
  },

  frame: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#FCE7EF",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },

  slide: {
    overflow: "hidden",
    backgroundColor: "#FCE7EF",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  pagination: {
    position: "absolute",
    bottom: 11,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.75)",
    marginHorizontal: 4,
  },

  activeDot: {
    width: 23,
    height: 7,
    borderRadius: 10,
    backgroundColor: BRAND,
  },
});