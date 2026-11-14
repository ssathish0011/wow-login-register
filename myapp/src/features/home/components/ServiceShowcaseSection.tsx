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
import { COLORS } from "@/common/constants/colors";

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

interface Ser9yMnTm4NSzvG9rrwjM2ec8xZgh1cafXH8 {
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

export default function ServiceShowcaseSection(props: Ser9yMnTm4NSzvG9rrwjM2ec8xZgh1cafXH8) {
  const { onSeeAll, onSelectItem, iconName, title, subtitle, items } = props;
  const { width } = useWindowDimensions();

  const cardWidth = Math.min(155, Math.max(125, width * 0.36));
  const imageHeight = cardWidth * 1.05;

  const sectionsToRender = items && title ? [
    {
      key: title.toLowerCase().replace(/\s+/g, "-"),
      iconName: (iconName || "home-outline") as IoniconName,
      title,
      subtitle: subtitle || "",
      items,
    }
  ] : SECTIONS;

  return (
    <View style={styles.container}>
      {sectionsToRender.map((section) => (
        <View key={section.key} style={styles.sectionBlock}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={1}>
                  {section.title}
                </Text>
              </View>
              <Text style={styles.subtitle} numberOfLines={1}>
                {section.subtitle}
              </Text>
            </View>

            <Pressable
              onPress={() => onSeeAll?.(section.key)}
              hitSlop={8}
              style={({ pressed }) => [
                styles.arrowButton,
                pressed && styles.arrowButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`View all ${section.title}`}
            >
              <Ionicons
                name="chevron-forward"
                size={19}
                color={COLORS.brand}
              />
            </Pressable>
          </View>

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
                      <View
                        pointerEvents="none"
                        style={styles.imageOverlay}
                      />
                      <View style={styles.imageBadge}>
                        <Ionicons
                          name="arrow-forward"
                          size={14}
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
// STYLES (unchanged)
// ======================================

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 6,
  },
  sectionBlock: {
    marginBottom: 18,
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleIcon: {
    marginRight: 6,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
    fontFamily: "Georgia",
    color: "#211921",
    letterSpacing: -0.4,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "500",
    color: "#88818A",
    marginTop: 2,
  },
  arrowButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FCE7EF",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.94 }],
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
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
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
    height: 45,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  imageBadge: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 27,
    height: 27,
    borderRadius: 14,
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
    paddingVertical: 11,
    minHeight: 48,
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