import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Local images (put the files in assets/top-add/)
// If your "@/" alias points to the project root, use "@/assets/top-add/..."
// Otherwise use a relative path like "../../../assets/top-add/add-1.png"
import add1 from "@/../assets/top-add/add-1.png";
import add2 from "@/../assets/top-add/add-2.png";
import add3 from "@/../assets/top-add/add-3.png";

export interface BannerSlide {
  id: string;
  image: ImageSourcePropType; // local require/import OR { uri: "https://..." }
  titleLine1: string; // first heading line
  titleLine2: string; // second heading line
  subtitle: string;
  buttonLabel?: string;
  link?: string;
}

// ======================================
// BANNER SLIDES
// Every slide has its own two-line heading
// ======================================

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: "1",
    image: add1,
    titleLine1: "Discover Women-Led",
    titleLine2: "Businesses",
    subtitle:
      "Explore trusted services, products and local businesses by women entrepreneurs.",
    buttonLabel: "Explore Now",
  },
  {
    id: "2",
    image: add2,
    titleLine1: "Shop Local,",
    titleLine2: "Support Women",
    subtitle:
      "Find handmade, homemade and boutique products from women entrepreneurs near you.",
    buttonLabel: "Explore Now",
  },
  {
    id: "3",
    image: add3,
    titleLine1: "Grow Your",
    titleLine2: "Business Online",
    subtitle:
      "Join a community of women entrepreneurs and reach more customers every day.",
    buttonLabel: "Explore Now",
  },
];

const BRAND = "#D1006C";
const SIDE_PADDING = 10;

// Banner settings
const AUTO_SLIDE_DELAY = 5000;
const MANUAL_RESUME_DELAY = 1200;
const SLIDE_ASPECT_RATIO = 2.4;

interface HeroBannerProps {
  onBannerPress?: (slide: BannerSlide) => void;
  onExplorePress?: () => void;
}

export default function HeroBanner({
  onBannerPress,
  onExplorePress,
}: HeroBannerProps) {
  const { width: screenWidth } = useWindowDimensions();

  const slideWidth = screenWidth - SIDE_PADDING * 2;
  const slideHeight = slideWidth / SLIDE_ASPECT_RATIO;

  const listRef = useRef<FlatList<BannerSlide>>(null);
  const indexRef = useRef(0);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Clear pending manual resume timer
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

  // Pause while manually scrolling
  const handleScrollBegin = () => {
    clearResumeTimer();
    setPaused(true);
  };

  // Resume after scrolling finishes
  const handleScrollEnd = () => {
    clearResumeTimer();

    resumeTimer.current = setTimeout(() => {
      setPaused(false);
    }, MANUAL_RESUME_DELAY);
  };

  useEffect(() => {
    return () => clearResumeTimer();
  }, []);

  // Render slides
  const renderSlide = ({ item }: { item: BannerSlide }) => (
    <View
      style={[
        styles.slide,
        {
          width: slideWidth,
          height: slideHeight,
        },
      ]}
    >
      <Image source={item.image} style={styles.image} resizeMode="cover" />

      <View style={styles.copyPanel}>
        {/* Heading: always exactly two lines, shrinks slightly if too wide */}
        <Text
          style={styles.title}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {item.titleLine1}
          {"\n"}
          {item.titleLine2}
        </Text>

        <Text style={styles.subtitle} numberOfLines={2}>
          {item.subtitle}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.exploreButton,
            pressed && styles.exploreButtonPressed,
          ]}
          onPress={() => {
            onBannerPress?.(item);
            onExplorePress?.();
          }}
          accessibilityRole="button"
          accessibilityLabel={item.buttonLabel ?? "Explore Now"}
        >
          <Text style={styles.exploreButtonText}>
            {item.buttonLabel ?? "Explore Now"}
          </Text>
          <Ionicons name="chevron-forward" size={10} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
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

        {/* Modern pagination */}
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
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },

  slide: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#FCE7EF",
  },

  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
    right: 0,
    top: 0,
  },

  copyPanel: {
    width: "40%",
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    // backgroundColor: "rgba(255, 242, 248, 0.88)",
  },

  title: {
    color: BRAND,
    fontFamily: "Georgia",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 20,
    letterSpacing: -0.5,
  },

  subtitle: {
    color: "#33303A",
    fontSize: 10,
    lineHeight: 13,
    marginTop: 3,
  },

  exploreButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 6,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: BRAND,
  },

  exploreButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },

  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
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