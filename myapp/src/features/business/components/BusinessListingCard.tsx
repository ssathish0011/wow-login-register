import React, { useState } from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/common/constants/colors";
import { BusinessListingItem } from "../types/business.types";

interface BusinessListingCardProps {
  business: BusinessListingItem;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenEnquiry: (business: BusinessListingItem) => void;
  isDesktop: boolean;
  viewMode?: "list" | "grid";
}

export default function BusinessListingCard({
  business,
  isSaved,
  onToggleSave,
  onOpenEnquiry,
  isDesktop,
  viewMode = "list",
}: BusinessListingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleCall = () => {
    const cleanNumber = business.phone.replace(/[^0-9+]/g, "");
    Linking.openURL(`tel:${cleanNumber}`).catch(() => { });
  };

  const handleWhatsApp = () => {
    const cleanNumber = business.whatsapp.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello ${business.name}, I found your business on WOW (Women of Wisdom) Directory and would like to know more.`
    );
    Linking.openURL(`https://wa.me/${cleanNumber}?text=${msg}`).catch(() => { });
  };

  const isGrid = viewMode === "grid";

  return (
    <View
      style={[
        styles.cardContainer,
        isGrid && styles.cardContainerGrid,
        (!isDesktop && !isGrid) && styles.cardContainerMobile,
        isHovered && styles.cardHovered,
      ]}
      // @ts-ignore - web hover states
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LEFT / TOP SIDE: Image & Badges */}
      <View
        style={[
          styles.mediaColumn,
          isGrid && styles.mediaColumnGrid,
          (!isDesktop && !isGrid) && styles.mediaColumnMobile,
        ]}
      >
        <Image
          source={{ uri: business.imageUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />

        {/* Floating Badges */}
        <View style={styles.badgeOverlay}>
          {business.isFeatured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="sparkles" size={11} color={WOW_COLORS.white} />
              <Text style={styles.featuredBadgeText}>Featured</Text>
            </View>
          )}

          {business.isWomenOwned && (
            <View style={styles.womenOwnedBadge}>
              <Ionicons name="woman" size={11} color={WOW_COLORS.primaryPink} />
              <Text style={styles.womenOwnedBadgeText}>Women Owned</Text>
            </View>
          )}
        </View>

        {/* Favorite Heart Button (Absolute top-right of image) */}
        <Pressable
          style={[styles.favoriteBtn, isSaved && styles.favoriteBtnActive]}
          onPress={() => onToggleSave(business.id)}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? "Remove from saved" : "Save business"}
        >
          <Ionicons
            name={isSaved ? "heart" : "heart-outline"}
            size={18}
            color={isSaved ? WOW_COLORS.primaryPink : "#4B5563"}
          />
        </Pressable>
      </View>

      {/* RIGHT / MAIN SIDE: Business Information Hierarchy */}
      <View style={[styles.infoColumn, isGrid && styles.infoColumnGrid]}>
        {/* Row 1: Name, Verified Badge, Rating */}
        <View style={styles.topInfoRow}>
          <View style={styles.nameContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.businessName} numberOfLines={2}>
                {business.name}
              </Text>
              {business.isVerified && (
                <View style={styles.verifiedTag}>
                  <Ionicons name="checkmark-circle" size={16} color={WOW_COLORS.blue} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>

            {/* Category & Subcategory Tag */}
            <View style={styles.categoryPillRow}>
              <Text style={styles.categoryPillText}>{business.category}</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.subCategoryText}>{business.subCategory}</Text>
            </View>
          </View>

          {/* Rating Badge */}
          <View style={styles.ratingBadgeContainer}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingValue}>{business.rating.toFixed(1)}</Text>
              <Ionicons name="star" size={13} color={WOW_COLORS.white} />
            </View>
            <Text style={styles.reviewsCountText}>({business.reviewsCount} reviews)</Text>
          </View>
        </View>

        {/* Row 2: Location, Distance, and Open Status */}
        <View style={styles.metaRow}>
          <View style={styles.locationWrap}>
            <Ionicons name="location-sharp" size={14} color={WOW_COLORS.primaryPink} />
            <Text style={styles.locationText} numberOfLines={1}>
              {business.location} <Text style={styles.distanceText}>({business.distance})</Text>
            </Text>
          </View>

          <View style={styles.openStatusWrap}>
            <View
              style={[
                styles.openIndicatorDot,
                { backgroundColor: business.isOpen ? WOW_COLORS.green : "#9CA3AF" },
              ]}
            />
            <Text
              style={[
                styles.openStatusText,
                { color: business.isOpen ? WOW_COLORS.green : "#6B7280" },
              ]}
            >
              {business.isOpen ? "Open Now" : "Closed"}
            </Text>
            <Text style={styles.timingsText}>• {business.timings}</Text>
          </View>
        </View>

        {/* Row 3: Short Description */}
        <Text style={styles.description} numberOfLines={2}>
          {business.description}
        </Text>

        {/* Row 4: Speciality Tags */}
        <View style={styles.tagsContainer}>
          {business.specialities.map((item, index) => (
            <View key={index} style={styles.specialityChip}>
              <Text style={styles.specialityChipText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* Row 5: Contact & Action Buttons */}
        <View style={styles.actionRow}>
          {/* Phone Display */}
          <View style={styles.phoneDisplay}>
            <Ionicons name="call-outline" size={14} color={WOW_COLORS.secondaryText} />
            <Text style={styles.phoneDisplayText}>{business.phone}</Text>
          </View>

          {/* Action Buttons: Call Now, WhatsApp, Send Enquiry */}
          <View style={styles.buttonsGroup}>
            <Pressable
              style={styles.callBtn}
              onPress={handleCall}
              accessibilityRole="button"
              accessibilityLabel={`Call ${business.name}`}
            >
              <Ionicons name="call" size={14} color={WOW_COLORS.white} />
              <Text style={styles.callBtnText}>Call Now</Text>
            </Pressable>

            <Pressable
              style={styles.whatsAppBtn}
              onPress={handleWhatsApp}
              accessibilityRole="button"
              accessibilityLabel={`WhatsApp ${business.name}`}
            >
              <Ionicons name="logo-whatsapp" size={15} color={WOW_COLORS.white} />
              <Text style={styles.whatsAppBtnText}>WhatsApp</Text>
            </Pressable>

            <Pressable
              style={styles.enquiryBtn}
              onPress={() => onOpenEnquiry(business)}
              accessibilityRole="button"
              accessibilityLabel={`Send enquiry to ${business.name}`}
            >
              <Ionicons name="mail-outline" size={14} color={WOW_COLORS.primaryPink} />
              <Text style={styles.enquiryBtnText}>Enquiry</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: WOW_COLORS.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: WOW_COLORS.border,
    marginBottom: 16,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    ...(Platform.OS === "web" ? { transition: "all 0.2s ease" as any } : {}),
  },
  cardContainerGrid: {
    flexDirection: "column",
    flex: 1,
    minWidth: 280,
  },
  cardContainerMobile: {
    flexDirection: "column",
  },
  cardHovered: {
    borderColor: WOW_COLORS.primaryPink,
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  mediaColumn: {
    width: 240,
    minHeight: 200,
    position: "relative",
    backgroundColor: "#F3F4F6",
  },
  mediaColumnGrid: {
    width: "100%",
    height: 190,
  },
  mediaColumnMobile: {
    width: "100%",
    height: 200,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  badgeOverlay: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "column",
    gap: 6,
    alignItems: "flex-start",
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: WOW_COLORS.primaryPink,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featuredBadgeText: {
    color: WOW_COLORS.white,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  womenOwnedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: WOW_COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  womenOwnedBadgeText: {
    color: WOW_COLORS.primaryPink,
    fontSize: 10,
    fontWeight: "700",
  },
  favoriteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: WOW_COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteBtnActive: {
    backgroundColor: WOW_COLORS.softPink,
  },
  infoColumn: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between",
  },
  infoColumnGrid: {
    padding: 14,
  },
  topInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  nameContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 4,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
    letterSpacing: -0.2,
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: "700",
    color: WOW_COLORS.blue,
  },
  categoryPillRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 2,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: WOW_COLORS.primaryPink,
  },
  dotSeparator: {
    fontSize: 12,
    color: WOW_COLORS.secondaryText,
  },
  subCategoryText: {
    fontSize: 12,
    color: WOW_COLORS.secondaryText,
    fontWeight: "500",
  },
  ratingBadgeContainer: {
    alignItems: "flex-end",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: WOW_COLORS.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingValue: {
    color: WOW_COLORS.white,
    fontSize: 13,
    fontWeight: "800",
  },
  reviewsCountText: {
    fontSize: 11,
    color: WOW_COLORS.secondaryText,
    marginTop: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 8,
  },
  locationWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
  },
  distanceText: {
    fontWeight: "400",
    color: WOW_COLORS.secondaryText,
  },
  openStatusWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  openIndicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  openStatusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  timingsText: {
    fontSize: 11,
    color: WOW_COLORS.secondaryText,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: WOW_COLORS.secondaryText,
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  specialityChip: {
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  specialityChipText: {
    fontSize: 11,
    fontWeight: "500",
    color: WOW_COLORS.primaryText,
  },
  cardDivider: {
    height: 1,
    backgroundColor: WOW_COLORS.border,
    marginVertical: 12,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  phoneDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  phoneDisplayText: {
    fontSize: 12,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
  },
  buttonsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: WOW_COLORS.green,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  callBtnText: {
    color: WOW_COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
  whatsAppBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#25D366",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  whatsAppBtnText: {
    color: WOW_COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
  enquiryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: WOW_COLORS.softPink,
    borderWidth: 1,
    borderColor: WOW_COLORS.primaryPink,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  enquiryBtnText: {
    color: WOW_COLORS.primaryPink,
    fontSize: 12,
    fontWeight: "700",
  },
});

