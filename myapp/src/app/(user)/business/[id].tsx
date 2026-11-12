import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/common/constants/colors";
import ScreenWrapper from "@/common/components/ScreenWrapper";
import { ALL_BUSINESS_LISTINGS } from "@/features/business/data/businessListingData";
import {
  BusinessListingItem,
  CustomerReview,
} from "@/features/business/types/business.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectSavedIds, toggleSave } from "@/features/saved/slices/savedSlice";
import EnquiryModal from "@/features/business/components/EnquiryModal";

type DetailTab = "overview" | "services" | "reviews" | "about";

export default function BusinessDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const savedIds = useAppSelector(selectSavedIds);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [enquiryVisible, setEnquiryVisible] = useState(false);

  // Find business by id
  const business: BusinessListingItem | null = useMemo(() => {
    if (!id) return null;
    return ALL_BUSINESS_LISTINGS.find((b) => b.id === id) || null;
  }, [id]);

  const isSaved = business ? savedIds.includes(business.id) : false;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/businesses");
    }
  };

  const handleCall = () => {
    if (!business) return;
    const cleanNumber = business.phone.replace(/[^0-9+]/g, "");
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {});
  };

  const handleWhatsApp = () => {
    if (!business) return;
    const cleanNumber = business.whatsapp.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello ${business.name}, I found your listing on WOW (Women of Wisdom) and would like to enquire about your services.`
    );
    Linking.openURL(`https://wa.me/${cleanNumber}?text=${msg}`).catch(() => {});
  };

  const handleDirections = () => {
    if (!business) return;
    const query = encodeURIComponent(
      `${business.name}, ${business.location}, ${business.city}`
    );
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${query}`
    ).catch(() => {});
  };

  const handleShare = async () => {
    if (!business) return;
    try {
      await Share.share({
        title: business.name,
        message: `Check out ${business.name} on the WOW Women Business Directory! Call ${business.phone}`,
      });
    } catch {}
  };

  if (!business) {
    return (
      <ScreenWrapper style={{ backgroundColor: WOW_COLORS.white }}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={WOW_COLORS.primaryText} />
          </Pressable>
          <Text style={styles.headerTitle}>Business Not Found</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.notFoundWrap}>
          <Text style={styles.notFoundText}>
            This business is no longer available or the link is expired.
          </Text>
          <Pressable
            style={styles.browseAllBtn}
            onPress={() => router.replace("/businesses" as any)}
          >
            <Text style={styles.browseAllBtnText}>Explore Businesses</Text>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  const photosList =
    business.photos && business.photos.length > 0
      ? business.photos
      : [business.imageUrl];

  const similarBusinesses = ALL_BUSINESS_LISTINGS.filter(
    (b) => b.category === business.category && b.id !== business.id
  ).slice(0, 4);

  return (
    <ScreenWrapper style={{ backgroundColor: WOW_COLORS.background }}>
      {/* 1. TOP HEADER */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={handleBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={WOW_COLORS.primaryText} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {business.name}
        </Text>

        <View style={styles.headerRightActions}>
          <Pressable
            style={styles.headerIconBtn}
            onPress={handleShare}
            hitSlop={8}
          >
            <Ionicons name="share-social-outline" size={21} color="#374151" />
          </Pressable>

          <Pressable
            style={styles.headerIconBtn}
            onPress={() => dispatch(toggleSave(business.id))}
            hitSlop={8}
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={23}
              color={isSaved ? WOW_COLORS.primaryPink : "#374151"}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. PHOTO GALLERY CAROUSEL */}
        <View style={styles.galleryContainer}>
          <Image
            source={{ uri: photosList[activePhotoIdx] }}
            style={styles.galleryImage}
            resizeMode="cover"
          />

          {business.isFeatured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>Featured</Text>
            </View>
          )}

          <View style={styles.photoCountBadge}>
            <Ionicons name="images-outline" size={13} color="#FFFFFF" />
            <Text style={styles.photoCountText}>
              {activePhotoIdx + 1}/{photosList.length} Photos
            </Text>
          </View>
        </View>

        {photosList.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailRow}
          >
            {photosList.map((uri, idx) => (
              <Pressable
                key={idx}
                onPress={() => setActivePhotoIdx(idx)}
                style={[
                  styles.thumbnailWrapper,
                  activePhotoIdx === idx && styles.thumbnailActive,
                ]}
              >
                <Image source={{ uri }} style={styles.thumbnailImage} />
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* 3. BUSINESS MAIN INFO CARD */}
        <View style={styles.mainInfoCard}>
          <View style={styles.titleRow}>
            <Text style={styles.businessName}>{business.name}</Text>
            {business.isVerified && (
              <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
            )}
          </View>

          <Text style={styles.categoryPath}>
            {business.category} › {business.subCategory}
          </Text>

          {/* Rating & Reviews */}
          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={13} color="#FFFFFF" />
              <Text style={styles.ratingBadgeText}>{business.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.reviewsCountText}>
              ({business.reviewsCount} verified reviews)
            </Text>
          </View>

          {/* Status & Timings */}
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusPill,
                business.isOpen ? styles.statusOpenPill : styles.statusClosedPill,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  business.isOpen ? styles.statusOpenDot : styles.statusClosedDot,
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  business.isOpen ? styles.statusOpenText : styles.statusClosedText,
                ]}
              >
                {business.isOpen ? "Open Now" : "Closed"}
              </Text>
            </View>
            <Text style={styles.timingsText}>{business.timings}</Text>
          </View>

          {/* Location & Distance */}
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text style={styles.locationText} numberOfLines={2}>
              {business.location}, {business.city} • {business.distance}
            </Text>
          </View>
        </View>

        {/* 4. QUICK ACTIONS ROW */}
        <View style={styles.quickActionsCard}>
          <Pressable style={styles.actionBtn} onPress={handleCall}>
            <View style={[styles.actionIconCircle, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="call" size={20} color="#2563EB" />
            </View>
            <Text style={styles.actionBtnLabel}>Call</Text>
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={handleWhatsApp}>
            <View style={[styles.actionIconCircle, { backgroundColor: "#ECFDF5" }]}>
              <Ionicons name="logo-whatsapp" size={20} color="#10B981" />
            </View>
            <Text style={styles.actionBtnLabel}>WhatsApp</Text>
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={handleDirections}>
            <View style={[styles.actionIconCircle, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="navigate" size={20} color="#D97706" />
            </View>
            <Text style={styles.actionBtnLabel}>Directions</Text>
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={handleShare}>
            <View style={[styles.actionIconCircle, { backgroundColor: "#F3F4F6" }]}>
              <Ionicons name="share-outline" size={20} color="#4B5563" />
            </View>
            <Text style={styles.actionBtnLabel}>Share</Text>
          </Pressable>

          <Pressable
            style={styles.actionBtn}
            onPress={() => dispatch(toggleSave(business.id))}
          >
            <View
              style={[
                styles.actionIconCircle,
                { backgroundColor: isSaved ? WOW_COLORS.softPink : "#F3F4F6" },
              ]}
            >
              <Ionicons
                name={isSaved ? "heart" : "heart-outline"}
                size={20}
                color={isSaved ? WOW_COLORS.primaryPink : "#4B5563"}
              />
            </View>
            <Text style={styles.actionBtnLabel}>Save</Text>
          </Pressable>
        </View>

        {/* 5. TABS ROW (OVERVIEW, SERVICES, REVIEWS, ABOUT) */}
        <View style={styles.tabsRow}>
          {(["overview", "services", "reviews", "about"] as DetailTab[]).map(
            (tab) => {
              const active = activeTab === tab;
              const titleMap: Record<DetailTab, string> = {
                overview: "Overview",
                services: "Services",
                reviews: `Reviews (${business.reviewsCount})`,
                about: "About",
              };
              return (
                <Pressable
                  key={tab}
                  style={[styles.tabItem, active && styles.tabItemActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[styles.tabItemText, active && styles.tabItemTextActive]}
                  >
                    {titleMap[tab]}
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <View style={styles.tabContentCard}>
            <Text style={styles.sectionHeaderTitle}>Business Overview</Text>
            <Text style={styles.descriptionText}>{business.description}</Text>

            <View style={styles.detailsDivider} />

            <Text style={styles.subSectionTitle}>Key Highlights</Text>
            <View style={styles.highlightsGrid}>
              {business.isWomenOwned && (
                <View style={styles.highlightPill}>
                  <Ionicons name="ribbon-outline" size={15} color={WOW_COLORS.primaryPink} />
                  <Text style={styles.highlightPillText}>100% Women-Owned</Text>
                </View>
              )}
              {business.establishedYear && (
                <View style={styles.highlightPill}>
                  <Ionicons name="calendar-outline" size={15} color="#4B5563" />
                  <Text style={styles.highlightPillText}>
                    Established {business.establishedYear}
                  </Text>
                </View>
              )}
              {business.isVerified && (
                <View style={styles.highlightPill}>
                  <Ionicons name="shield-checkmark-outline" size={15} color="#2563EB" />
                  <Text style={styles.highlightPillText}>Verified by WOW</Text>
                </View>
              )}
            </View>

            <View style={styles.detailsDivider} />

            <Text style={styles.subSectionTitle}>Address & Contact</Text>
            <Text style={styles.addressLine}>
              {business.location}, {business.city}, Tamil Nadu
            </Text>
            <Text style={styles.contactLine}>Phone: {business.phone}</Text>
          </View>
        )}

        {/* TAB 2: SERVICES */}
        {activeTab === "services" && (
          <View style={styles.tabContentCard}>
            <Text style={styles.sectionHeaderTitle}>Services Offered</Text>
            <View style={styles.servicesWrap}>
              {business.services.map((service, idx) => (
                <View key={idx} style={styles.serviceItem}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={17}
                    color={WOW_COLORS.primaryPink}
                  />
                  <Text style={styles.serviceItemText}>{service}</Text>
                </View>
              ))}
            </View>

            <View style={styles.detailsDivider} />

            <Text style={styles.subSectionTitle}>Specialities</Text>
            <View style={styles.specialitiesWrap}>
              {business.specialities.map((spec, idx) => (
                <View key={idx} style={styles.specialityPill}>
                  <Text style={styles.specialityText}>{spec}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 3: REVIEWS */}
        {activeTab === "reviews" && (
          <View style={styles.tabContentCard}>
            <View style={styles.reviewsSummaryRow}>
              <View style={styles.bigScoreBox}>
                <Text style={styles.bigScoreText}>
                  {business.rating.toFixed(1)}
                </Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Ionicons
                      key={s}
                      name={s <= Math.round(business.rating) ? "star" : "star-outline"}
                      size={14}
                      color="#F59E0B"
                    />
                  ))}
                </View>
                <Text style={styles.totalReviewsSub}>
                  {business.reviewsCount} reviews
                </Text>
              </View>

              <View style={styles.ratingBarsCol}>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const pct =
                    stars === 5 ? 78 : stars === 4 ? 16 : stars === 3 ? 4 : 2;
                  return (
                    <View key={stars} style={styles.barRow}>
                      <Text style={styles.barStarsLabel}>{stars} ★</Text>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { width: `${pct}%` }]} />
                      </View>
                      <Text style={styles.barPctLabel}>{pct}%</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.detailsDivider} />

            {/* Reviews List */}
            {business.reviewsList && business.reviewsList.length > 0 ? (
              business.reviewsList.map((rev) => (
                <View key={rev.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeaderRow}>
                    <Text style={styles.reviewAuthor}>{rev.author}</Text>
                    <Text style={styles.reviewDate}>{rev.date}</Text>
                  </View>
                  <View style={styles.reviewStars}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Ionicons
                        key={s}
                        name={s <= rev.rating ? "star" : "star-outline"}
                        size={13}
                        color="#F59E0B"
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewComment}>{rev.comment}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviewsText}>
                No written reviews yet. Be the first to share your experience!
              </Text>
            )}
          </View>
        )}

        {/* TAB 4: ABOUT */}
        {activeTab === "about" && (
          <View style={styles.tabContentCard}>
            <Text style={styles.sectionHeaderTitle}>About {business.name}</Text>
            <Text style={styles.descriptionText}>{business.description}</Text>

            {business.founderName && (
              <View style={styles.founderBox}>
                <Ionicons name="person-circle-outline" size={28} color={WOW_COLORS.primaryPink} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.founderTitle}>Founder & Entrepreneur</Text>
                  <Text style={styles.founderName}>{business.founderName}</Text>
                </View>
              </View>
            )}

            <View style={styles.detailsDivider} />

            <Text style={styles.subSectionTitle}>Business Hours</Text>
            <Text style={styles.timingsDetailLine}>
              Monday – Sunday: {business.timings}
            </Text>
          </View>
        )}

        {/* 6. SIMILAR BUSINESSES */}
        {similarBusinesses.length > 0 && (
          <View style={styles.similarSection}>
            <Text style={styles.similarSectionTitle}>
              Similar {business.category} Businesses
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {similarBusinesses.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.similarCard}
                  onPress={() => router.push(`/business/${item.id}` as any)}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.similarImage}
                  />
                  <View style={styles.similarContent}>
                    <Text style={styles.similarName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.similarSub} numberOfLines={1}>
                      {item.subCategory}
                    </Text>
                    <View style={styles.similarRatingRow}>
                      <Ionicons name="star" size={11} color="#F59E0B" />
                      <Text style={styles.similarRatingText}>
                        {item.rating.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* 7. STICKY BOTTOM CALL & ENQUIRE BAR */}
      <View style={styles.bottomStickyBar}>
        <Pressable style={styles.callNowBtn} onPress={handleCall}>
          <Ionicons name="call" size={18} color="#FFFFFF" />
          <Text style={styles.callNowBtnText}>Call Now</Text>
        </Pressable>

        <Pressable
          style={styles.sendEnquiryBtn}
          onPress={() => setEnquiryVisible(true)}
        >
          <Ionicons name="mail" size={18} color="#FFFFFF" />
          <Text style={styles.sendEnquiryBtnText}>Send Enquiry</Text>
        </Pressable>
      </View>

      {/* Enquiry Modal */}
      <EnquiryModal
        business={business}
        visible={enquiryVisible}
        onClose={() => setEnquiryVisible(false)}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: WOW_COLORS.border,
    backgroundColor: WOW_COLORS.white,
  },
  backBtn: {
    padding: 6,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
    flex: 1,
    marginHorizontal: 12,
  },
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIconBtn: {
    padding: 6,
  },
  scroll: {
    flex: 1,
  },
  galleryContainer: {
    width: "100%",
    height: 240,
    position: "relative",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  featuredBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: WOW_COLORS.primaryPink,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  photoCountBadge: {
    position: "absolute",
    bottom: 14,
    right: 14,
    backgroundColor: "rgba(0,0,0,0.65)",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  photoCountText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  thumbnailRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: WOW_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  thumbnailWrapper: {
    width: 54,
    height: 54,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  thumbnailActive: {
    borderColor: WOW_COLORS.primaryPink,
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  mainInfoCard: {
    backgroundColor: WOW_COLORS.white,
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: WOW_COLORS.border,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  businessName: {
    fontSize: 20,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
  },
  categoryPath: {
    fontSize: 12.5,
    color: "#6B7280",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#059669",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  reviewsCountText: {
    fontSize: 12,
    color: "#6B7280",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 5,
  },
  statusOpenPill: {
    backgroundColor: "#DCFCE7",
  },
  statusClosedPill: {
    backgroundColor: "#FEE2E2",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusOpenDot: {
    backgroundColor: "#16A34A",
  },
  statusClosedDot: {
    backgroundColor: "#DC2626",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusOpenText: {
    color: "#16A34A",
  },
  statusClosedText: {
    color: "#DC2626",
  },
  timingsText: {
    fontSize: 12,
    color: "#6B7280",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    fontSize: 12.5,
    color: "#4B5563",
    flex: 1,
  },
  quickActionsCard: {
    backgroundColor: WOW_COLORS.white,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: WOW_COLORS.border,
  },
  actionBtn: {
    alignItems: "center",
    gap: 5,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnLabel: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#374151",
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: WOW_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: WOW_COLORS.border,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2.5,
    borderBottomColor: "transparent",
  },
  tabItemActive: {
    borderBottomColor: WOW_COLORS.primaryPink,
  },
  tabItemText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabItemTextActive: {
    color: WOW_COLORS.primaryPink,
    fontWeight: "700",
  },
  tabContentCard: {
    backgroundColor: WOW_COLORS.white,
    padding: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: WOW_COLORS.border,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13.5,
    color: "#4B5563",
    lineHeight: 20,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 14,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
    marginBottom: 8,
  },
  highlightsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  highlightPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  highlightPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  addressLine: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 4,
  },
  contactLine: {
    fontSize: 13,
    fontWeight: "600",
    color: WOW_COLORS.primaryPink,
  },
  servicesWrap: {
    gap: 8,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  serviceItemText: {
    fontSize: 13,
    color: "#374151",
  },
  specialitiesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specialityPill: {
    backgroundColor: WOW_COLORS.softPink,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  specialityText: {
    fontSize: 12,
    fontWeight: "600",
    color: WOW_COLORS.primaryPink,
  },
  reviewsSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  bigScoreBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: "#F3F4F6",
  },
  bigScoreText: {
    fontSize: 32,
    fontWeight: "900",
    color: WOW_COLORS.primaryText,
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
    marginVertical: 4,
  },
  totalReviewsSub: {
    fontSize: 11,
    color: "#6B7280",
  },
  ratingBarsCol: {
    flex: 1,
    gap: 4,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  barStarsLabel: {
    fontSize: 11,
    color: "#6B7280",
    width: 22,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#F59E0B",
  },
  barPctLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    width: 26,
    textAlign: "right",
  },
  reviewItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  reviewHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  reviewAuthor: {
    fontSize: 13.5,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  reviewDate: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  reviewStars: {
    flexDirection: "row",
    gap: 2,
    marginBottom: 6,
  },
  reviewComment: {
    fontSize: 12.5,
    color: "#4B5563",
    lineHeight: 18,
  },
  noReviewsText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    paddingVertical: 14,
  },
  founderBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFF9FB",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
  },
  founderTitle: {
    fontSize: 11,
    color: "#6B7280",
    textTransform: "uppercase",
  },
  founderName: {
    fontSize: 13.5,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  timingsDetailLine: {
    fontSize: 13,
    color: "#4B5563",
  },
  similarSection: {
    backgroundColor: WOW_COLORS.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: WOW_COLORS.border,
  },
  similarSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
    marginBottom: 12,
  },
  similarCard: {
    width: 140,
    backgroundColor: WOW_COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    marginRight: 10,
  },
  similarImage: {
    width: "100%",
    height: 80,
  },
  similarContent: {
    padding: 8,
  },
  similarName: {
    fontSize: 12,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  similarSub: {
    fontSize: 10.5,
    color: "#6B7280",
    marginTop: 1,
  },
  similarRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 4,
  },
  similarRatingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#374151",
  },
  bottomStickyBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: WOW_COLORS.white,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: WOW_COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  callNowBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  callNowBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  sendEnquiryBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: WOW_COLORS.primaryPink,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  sendEnquiryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  notFoundWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  notFoundText: {
    fontSize: 15,
    color: "#4B5563",
    textAlign: "center",
  },
  browseAllBtn: {
    backgroundColor: WOW_COLORS.primaryPink,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  browseAllBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
});

