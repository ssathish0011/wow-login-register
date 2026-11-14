import React from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/shared/theme/colors";
import { BusinessListingItem } from "../types/business.types";

interface FeaturedBusinessesSectionProps {
  businesses: BusinessListingItem[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenEnquiry: (business: BusinessListingItem) => void;
}

export default function FeaturedBusinessesSection({
  businesses,
  savedIds,
  onToggleSave,
  onOpenEnquiry,
}: FeaturedBusinessesSectionProps) {
  const featuredList = businesses.filter((b) => b.isFeatured);

  if (featuredList.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleWrap}>
          <View style={styles.sparkleIcon}>
            <Ionicons name="sparkles" size={16} color={WOW_COLORS.white} />
          </View>
          <View>
            <Text style={styles.title}>Featured & Sponsored Businesses</Text>
            <Text style={styles.subtitle}>
              Handpicked top-rated women entrepreneurs in Tamil Nadu
            </Text>
          </View>
        </View>
        <View style={styles.sponsoredBadge}>
          <Text style={styles.sponsoredText}>PROMOTED</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {featuredList.map((item) => {
          const isSaved = savedIds.includes(item.id);

          const handleCall = () => {
            const cleanNumber = item.phone.replace(/[^0-9+]/g, "");
            Linking.openURL(`tel:${cleanNumber}`).catch(() => { });
          };

          const handleWhatsApp = () => {
            const cleanNumber = item.whatsapp.replace(/[^0-9]/g, "");
            const msg = encodeURIComponent(
              `Hello ${item.name}, I saw your featured listing on WOW!`
            );
            Linking.openURL(`https://wa.me/${cleanNumber}?text=${msg}`).catch(() => { });
          };

          return (
            <View key={item.id} style={styles.featuredCard}>
              <View style={styles.cardImageWrap}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.featuredTagPill}>
                  <Ionicons name="sparkles" size={11} color={WOW_COLORS.white} />
                  <Text style={styles.featuredTagText}>Featured</Text>
                </View>
                <Pressable
                  style={[styles.heartBtn, isSaved && styles.heartBtnActive]}
                  onPress={() => onToggleSave(item.id)}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={isSaved ? "heart" : "heart-outline"}
                    size={16}
                    color={isSaved ? WOW_COLORS.primaryPink : "#4B5563"}
                  />
                </Pressable>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.bizName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={11} color={WOW_COLORS.white} />
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                  </View>
                </View>

                <Text style={styles.categoryText} numberOfLines={1}>
                  {item.category} • {item.city}
                </Text>

                <Text style={styles.descText} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.buttonRow}>
                  <Pressable
                    style={styles.actionBtnCall}
                    onPress={handleCall}
                    accessibilityRole="button"
                  >
                    <Ionicons name="call" size={13} color={WOW_COLORS.white} />
                    <Text style={styles.actionBtnText}>Call</Text>
                  </Pressable>

                  <Pressable
                    style={styles.actionBtnWhatsApp}
                    onPress={handleWhatsApp}
                    accessibilityRole="button"
                  >
                    <Ionicons name="logo-whatsapp" size={14} color={WOW_COLORS.white} />
                    <Text style={styles.actionBtnText}>Chat</Text>
                  </Pressable>

                  <Pressable
                    style={styles.actionBtnEnquiry}
                    onPress={() => onOpenEnquiry(item)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.actionBtnEnquiryText}>Enquiry</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: WOW_COLORS.softPink,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#FBCFE8",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  sparkleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WOW_COLORS.primaryPink,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
  },
  subtitle: {
    fontSize: 12,
    color: WOW_COLORS.secondaryText,
    marginTop: 2,
  },
  sponsoredBadge: {
    backgroundColor: WOW_COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
  },
  sponsoredText: {
    fontSize: 10,
    fontWeight: "800",
    color: WOW_COLORS.primaryPink,
    letterSpacing: 0.5,
  },
  scrollList: {
    gap: 14,
    paddingRight: 10,
  },
  featuredCard: {
    width: 270,
    backgroundColor: WOW_COLORS.white,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardImageWrap: {
    height: 130,
    width: "100%",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  featuredTagPill: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: WOW_COLORS.primaryPink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  featuredTagText: {
    color: WOW_COLORS.white,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: WOW_COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  heartBtnActive: {
    backgroundColor: WOW_COLORS.softPink,
  },
  cardBody: {
    padding: 12,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  bizName: {
    fontSize: 15,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: WOW_COLORS.green,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    color: WOW_COLORS.white,
    fontSize: 11,
    fontWeight: "800",
  },
  categoryText: {
    fontSize: 12,
    color: WOW_COLORS.primaryPink,
    fontWeight: "600",
    marginTop: 2,
  },
  descText: {
    fontSize: 11,
    lineHeight: 16,
    color: WOW_COLORS.secondaryText,
    marginTop: 6,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  actionBtnCall: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: WOW_COLORS.green,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionBtnWhatsApp: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#25D366",
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionBtnEnquiry: {
    flex: 1.2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WOW_COLORS.softPink,
    borderWidth: 1,
    borderColor: WOW_COLORS.primaryPink,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionBtnText: {
    color: WOW_COLORS.white,
    fontSize: 11,
    fontWeight: "700",
  },
  actionBtnEnquiryText: {
    color: WOW_COLORS.primaryPink,
    fontSize: 11,
    fontWeight: "700",
  },
});

