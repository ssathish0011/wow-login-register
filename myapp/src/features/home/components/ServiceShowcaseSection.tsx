import React from "react";
import type { ComponentProps } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/theme/colors";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

// Beauty images retain local require
const IMG_BEAUTY = require("../../../../assets/service-card/1.png");
const IMG_HAIR = require("../../../../assets/service-card/2.png");
const IMG_SPA = require("../../../../assets/service-card/3.png");
const IMG_SALON = require("../../../../assets/service-card/4.png");
const IMG_SKIN = require("../../../../assets/service-card/5.png");
const IMG_YOGA = require("../../../../assets/service-card/1.png");

// ======================================
// TYPES
// ======================================

type ImageSource = string | ImageSourcePropType;

interface ServiceItem {
  id: string;
  title: string;
  imageUrl: ImageSource;
}

interface SectionConfig {
  key: string;
  iconName: IoniconName;
  title: string;
  subtitle: string;
  items: ServiceItem[];
}

// ======================================
// HOME SERVICES (6 items) — online images
// ======================================

const HOME_SERVICES_DATA: ServiceItem[] = [
  {
    id: "hs-1",
    title: "Home\nCleaning",
    imageUrl:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "hs-2",
    title: "Home\nDecor",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "hs-3",
    title: "Painting\nServices",
    imageUrl:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "hs-4",
    title: "Interior\nDesign",
    imageUrl:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "hs-5",
    title: "Pest\nControl",
    imageUrl:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "hs-6",
    title: "Home\nRepair",
    imageUrl:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=85",
  },
];

// ======================================
// BEAUTY & WELLNESS (6 items) — unchanged
// ======================================

const BEAUTY_WELLNESS_DATA: ServiceItem[] = [
  { id: "bw-1", title: "Makeup\nServices", imageUrl: IMG_BEAUTY },
  { id: "bw-2", title: "Hair Care\n& Styling", imageUrl: IMG_HAIR },
  { id: "bw-3", title: "Spa &\nWellness", imageUrl: IMG_SPA },
  { id: "bw-4", title: "Salon\nServices", imageUrl: IMG_SALON },
  { id: "bw-5", title: "Skin Care\nTreatments", imageUrl: IMG_SKIN },
  { id: "bw-6", title: "Yoga &\nFitness", imageUrl: IMG_YOGA },
];

// ======================================
// SECTIONS CONFIG
// ======================================

const SECTIONS: SectionConfig[] = [
  {
    key: "beauty",
    iconName: "flower-outline",
    title: "Beauty & Wellness",
    subtitle: "Personal care, grooming and wellness services",
    items: BEAUTY_WELLNESS_DATA,
  },
  {
    key: "home",
    iconName: "home-outline",
    title: "Home Services",
    subtitle: "Trusted home solutions by women entrepreneurs",
    items: HOME_SERVICES_DATA,
  },
];

// ======================================
// PROPS
// ======================================

interface SerahJ91ZuNL8Y2px8iYciYeHN8sfSh5eXH8 {
  iconName?: string;
  title?: string;
  subtitle?: string;
  items?: any[];
  onSeeAll?: (sectionKey?: string) => void;
  onSelectItem?: (item: any) => void;
}

// ======================================
// SIZE CONFIG
// ======================================

const SIDE_PADDING = 15;
const CARD_GAP = 12;
const CARD_RADIUS = 16;

const ARROW_ICON_SIZE = 18; // header arrow icon size (change this to resize)
const BADGE_SIZE = 28;
const BADGE_ICON_SIZE = 15;

// ======================================
// HELPERS
// ======================================

const getItemLabel = (item: any) =>
  (item.title || item.name || "").replace(/\n/g, " ").trim();

const getImageSource = (imageUrl: ImageSource): ImageSourcePropType =>
  typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl;

// ======================================
// MAIN COMPONENT
// ======================================

export default function ServiceShowcaseSection(
  props: SerahJ91ZuNL8Y2px8iYciYeHN8sfSh5eXH8
) {
  const { onSeeAll, onSelectItem, iconName, title, subtitle, items } = props;
  const { width } = useWindowDimensions();

  // Card is ~38% of the screen so 2.5 cards are visible (hints at scrolling)
  const cardWidth = Math.min(160, Math.max(128, width * 0.38));
  const imageHeight = cardWidth * 1.1;

  const sectionsToRender =
    items && title
      ? [
        {
          key: title.toLowerCase().replace(/\s+/g, "-"),
          iconName: (iconName || "home-outline") as IoniconName,
          title,
          subtitle: subtitle || "",
          items,
        },
      ]
      : SECTIONS;

  return (
    <View style={styles.container}>
      {sectionsToRender.map((section) => (
        <View key={section.key} style={styles.sectionBlock}>
          {/* HEADER: heading only + See more on the top right */}
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.title} numberOfLines={1}>
                {section.title}
              </Text>
            </View>

            <Pressable
              onPress={() => onSeeAll?.(section.key)}
              hitSlop={8}
              style={({ pressed }) => [
                styles.seeMoreButton,
                pressed && styles.seeMoreButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`See more ${section.title}`}
            >
              <Text style={styles.seeMoreText}>See more</Text>
              <Ionicons
                name="chevron-forward"
                size={ARROW_ICON_SIZE}
                color={COLORS.brand}
              />
            </Pressable>
          </View>

          {/* CARDS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {section.items.map((item) => {
              const label = getItemLabel(item);
              return (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.cardShadow,
                    { width: cardWidth },
                    pressed && styles.cardPressed,
                  ]}
                  onPress={() => onSelectItem?.(item)}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                >
                  <View style={styles.card}>
                    <View style={[styles.imageWrap, { height: imageHeight }]}>
                      <Image
                        source={getImageSource(item.imageUrl)}
                        style={styles.image}
                        resizeMode="cover"
                      />
                      <View pointerEvents="none" style={styles.imageOverlay} />
                      <View style={styles.imageBadge}>
                        <Ionicons
                          name="chevron-forward"
                          size={BADGE_ICON_SIZE}
                          color={COLORS.brand}
                        />
                      </View>
                    </View>

                    <View style={styles.nameWrap}>
                      <Text style={styles.name} numberOfLines={2}>
                        {label}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}

// ======================================
// STYLES
// ======================================

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 6,
  },
  sectionBlock: {
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIDE_PADDING,
    marginBottom: 6,
  },
  headerText: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
    fontFamily: "Georgia",
    color: "#211921",
    letterSpacing: -0.4,
  },

  // See more: text only, top right
  seeMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    justifyContent: "center",
    paddingVertical: 4,
  },
  seeMoreButtonPressed: {
    opacity: 0.5,
  },
  seeMoreText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brand,
  },

  scrollContent: {
    paddingHorizontal: SIDE_PADDING,
    paddingTop: 10,
    paddingBottom: 16,
    gap: CARD_GAP,
  },
  cardShadow: {
    borderRadius: CARD_RADIUS,
    backgroundColor: "#FFFFFF",
    shadowColor: "#211921",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  card: {
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F3EAEE",
  },
  imageWrap: {
    width: "100%",
    backgroundColor: "#FCE7EF",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: "rgba(0,0,0,0.10)",
  },
  imageBadge: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  nameWrap: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    minHeight: 50,
    justifyContent: "center",
  },
  name: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: "#29232B",
    letterSpacing: -0.2,
  },
});