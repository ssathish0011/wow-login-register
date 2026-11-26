import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/shared/theme/colors";
import ScreenWrapper from "@/shared/components/ScreenWrapper";
import { ALL_BUSINESS_LISTINGS } from "@/features/business/data/businessListingData";
import { BusinessListingItem } from "@/features/business/types/business.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectSavedIds, toggleSave } from "@/features/saved/slices/savedSlice";
import EnquiryModal from "@/features/business/components/EnquiryModal";

type DetailTab = "overview" | "services" | "reviews" | "about";

// Justdial-style palette
const JD = {
  blue: "#0076D7",
  blueSoft: "#E6F2FC",
  green: "#00A650",
  greenDark: "#008A43",
  greenSoft: "#E3F6EC",
  orange: "#FF8A00",
  yellow: "#FFC107",
  red: "#E53935",
  text: "#1F2937",
  muted: "#6B7280",
  border: "#E5E7EB",
  bg: "#F2F4F7",
  white: "#FFFFFF",
};

export default function BusinessDetailScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const savedIds = useAppSelector(selectSavedIds);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [enquiryVisible, setEnquiryVisible] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const business: BusinessListingItem | null = useMemo(() => {
    if (!id) return null;
    return ALL_BUSINESS_LISTINGS.find((b) => b.id === id) || null;
  }, [id]);

  const isSaved = business ? savedIds.includes(business.id) : false;

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/businesses");
  };

  const handleCall = () => {
    if (!business) return;
    const cleanNumber = business.phone.replace(/[^0-9+]/g, "");
    Linking.openURL(`tel:${cleanNumber}`).catch(() => { });
  };

  const handleShowNumber = () => {
    if (!showNumber) {
      setShowNumber(true);
      return;
    }
    handleCall();
  };

  const handleWhatsApp = () => {
    if (!business) return;
    const cleanNumber = business.whatsapp.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello ${business.name}, I found your listing on WOW (Women of Wisdom) and would like to enquire about your services.`
    );
    Linking.openURL(`https://wa.me/${cleanNumber}?text=${msg}`).catch(() => { });
  };

  const handleDirections = () => {
    if (!business) return;
    const query = encodeURIComponent(
      `${business.name}, ${business.location}, ${business.city}`
    );
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${query}`
    ).catch(() => { });
  };

  const handleShare = async () => {
    if (!business) return;
    try {
      await Share.share({
        title: business.name,
        message: `Check out ${business.name} on the WOW Women Business Directory! Call ${business.phone}`,
      });
    } catch { }
  };

  const handleRate = (stars: number) => {
    setUserRating(stars);
    Alert.alert("Thank you!", `You rated ${business?.name} ${stars} star${stars > 1 ? "s" : ""}.`);
  };

  if (!business) {
    return (
      <ScreenWrapper style={{ backgroundColor: JD.white }}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={JD.text} />
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

  const maskedPhone = business.phone.replace(/[0-9](?=[0-9\s-]{0,3}$)/g, "x");
  const tabTitles: Record<DetailTab, string> = {
    overview: "Overview",
    services: "Services",
    reviews: "Reviews",
    about: "About",
  };

  return (
    <ScreenWrapper style={{ backgroundColor: JD.bg }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={handleBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color={JD.text} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {business.name}
        </Text>

        <View style={styles.headerRightActions}>
          <Pressable style={styles.headerIconBtn} onPress={handleShare} hitSlop={8}>
            <Ionicons name="share-social-outline" size={22} color={JD.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* PHOTO MOSAIC (Justdial style, centered with rounded corners) */}
        <View style={styles.mosaicWrap}>
          {photosList.length === 1 ? (
            <Pressable style={styles.mosaicSingle} onPress={() => { setActivePhotoIdx(0); setGalleryOpen(true); }}>
              <Image source={{ uri: photosList[0] }} style={styles.mosaicImg} resizeMode="cover" />
            </Pressable>
          ) : photosList.length === 2 ? (
            <View style={styles.mosaicRow}>
              {photosList.map((uri, idx) => (
                <Pressable
                  key={idx}
                  style={[styles.mosaicHalf, idx === 0 && { marginRight: 6 }]}
                  onPress={() => { setActivePhotoIdx(idx); setGalleryOpen(true); }}
                >
                  <Image source={{ uri }} style={styles.mosaicImg} resizeMode="cover" />
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.mosaicRow}>
              <Pressable
                style={styles.mosaicBig}
                onPress={() => { setActivePhotoIdx(0); setGalleryOpen(true); }}
              >
                <Image source={{ uri: photosList[0] }} style={styles.mosaicImg} resizeMode="cover" />
              </Pressable>
              <View style={styles.mosaicCol}>
                <Pressable
                  style={[styles.mosaicSmall, { marginBottom: 6 }]}
                  onPress={() => { setActivePhotoIdx(1); setGalleryOpen(true); }}
                >
                  <Image source={{ uri: photosList[1] }} style={styles.mosaicImg} resizeMode="cover" />
                </Pressable>
                <Pressable
                  style={styles.mosaicSmall}
                  onPress={() => { setActivePhotoIdx(2); setGalleryOpen(true); }}
                >
                  <Image source={{ uri: photosList[2] }} style={styles.mosaicImg} resizeMode="cover" />
                  {photosList.length > 3 && (
                    <View style={styles.moreOverlay}>
                      <Text style={styles.moreOverlayText}>+{photosList.length - 3}</Text>
                      <Text style={styles.moreOverlaySub}>Photos</Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          )}

          {business.isFeatured && (
            <View style={styles.sponsoredBadge}>
              <Text style={styles.sponsoredText}>Featured</Text>
            </View>
          )}

          <Pressable
            style={styles.photoCountBadge}
            onPress={() => { setActivePhotoIdx(0); setGalleryOpen(true); }}
          >
            <Ionicons name="images-outline" size={13} color="#FFFFFF" />
            <Text style={styles.photoCountText}>{photosList.length} Photos</Text>
          </Pressable>
        </View>

        {/* MAIN INFO */}
        <View style={styles.mainInfoCard}>
          <Text style={styles.businessName}>{business.name}</Text>

          <View style={styles.badgesRow}>
            {business.isVerified && (
              <View style={styles.jdVerified}>
                <Ionicons name="checkmark-circle" size={14} color={JD.blue} />
                <Text style={styles.jdVerifiedText}>WOW Verified</Text>
              </View>
            )}
            {business.isWomenOwned && (
              <View style={styles.trustBadge}>
                <Ionicons name="ribbon" size={13} color={JD.orange} />
                <Text style={styles.trustText}>Women-Owned</Text>
              </View>
            )}
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>{business.rating.toFixed(1)}</Text>
              <Ionicons name="star" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.reviewsCountText}>
              {business.reviewsCount} Ratings
            </Text>
            <Text style={styles.dotSep}>•</Text>
            <Text style={styles.categoryText} numberOfLines={1}>
              {business.subCategory}
            </Text>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={16} color={JD.muted} />
            <Text style={styles.locationText} numberOfLines={2}>
              {business.location}, {business.city}
              {business.distance ? `  •  ${business.distance}` : ""}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text
              style={[
                styles.statusText,
                { color: business.isOpen ? JD.green : JD.red },
              ]}
            >
              {business.isOpen ? "Open Now" : "Closed"}
            </Text>
            <Text style={styles.timingsText}> • {business.timings}</Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.quickActionsCard}>
          <Pressable style={styles.actionBtn} onPress={handleCall}>
            <View style={[styles.actionIconCircle, { borderColor: JD.green }]}>
              <Ionicons name="call" size={20} color={JD.green} />
            </View>
            <Text style={styles.actionBtnLabel}>Call</Text>
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={handleWhatsApp}>
            <View style={[styles.actionIconCircle, { borderColor: "#25D366" }]}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            </View>
            <Text style={styles.actionBtnLabel}>WhatsApp</Text>
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={handleDirections}>
            <View style={[styles.actionIconCircle, { borderColor: JD.blue }]}>
              <Ionicons name="navigate" size={20} color={JD.blue} />
            </View>
            <Text style={styles.actionBtnLabel}>Directions</Text>
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={handleShare}>
            <View style={[styles.actionIconCircle, { borderColor: JD.muted }]}>
              <Ionicons name="share-social-outline" size={20} color={JD.muted} />
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
                { borderColor: isSaved ? JD.red : JD.muted },
              ]}
            >
              <Ionicons
                name={isSaved ? "heart" : "heart-outline"}
                size={20}
                color={isSaved ? JD.red : JD.muted}
              />
            </View>
            <Text style={styles.actionBtnLabel}>{isSaved ? "Saved" : "Save"}</Text>
          </Pressable>
        </View>

        {/* GET BEST DEAL STRIP */}
        <Pressable style={styles.dealStrip} onPress={() => setEnquiryVisible(true)}>
          <View style={{ flex: 1 }}>
            <Text style={styles.dealTitle}>Looking for the best price?</Text>
            <Text style={styles.dealSub}>Get quotes directly from {business.name}</Text>
          </View>
          <View style={styles.dealBtn}>
            <Text style={styles.dealBtnText}>Get Best Deal</Text>
          </View>
        </Pressable>

        {/* TABS */}
        <View style={styles.tabsRow}>
          {(Object.keys(tabTitles) as DetailTab[]).map((tab) => {
            const active = activeTab === tab;
            return (
              <Pressable
                key={tab}
                style={[styles.tabItem, active && styles.tabItemActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabItemText, active && styles.tabItemTextActive]}>
                  {tabTitles[tab]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <View style={styles.tabContentCard}>
            <Text style={styles.sectionHeaderTitle}>Quick Information</Text>
            <Text style={styles.descriptionText}>{business.description}</Text>

            <View style={styles.detailsDivider} />

            <View style={styles.highlightsGrid}>
              {business.isWomenOwned && (
                <View style={styles.highlightPill}>
                  <Ionicons name="ribbon-outline" size={15} color={JD.orange} />
                  <Text style={styles.highlightPillText}>100% Women-Owned</Text>
                </View>
              )}
              {business.establishedYear && (
                <View style={styles.highlightPill}>
                  <Ionicons name="calendar-outline" size={15} color={JD.muted} />
                  <Text style={styles.highlightPillText}>
                    Est. {business.establishedYear}
                  </Text>
                </View>
              )}
              {business.isVerified && (
                <View style={styles.highlightPill}>
                  <Ionicons name="shield-checkmark-outline" size={15} color={JD.blue} />
                  <Text style={styles.highlightPillText}>Verified by WOW</Text>
                </View>
              )}
            </View>

            <View style={styles.detailsDivider} />

            <Text style={styles.subSectionTitle}>Address</Text>
            <View style={styles.infoLine}>
              <Ionicons name="location-outline" size={17} color={JD.blue} />
              <Text style={styles.infoLineText}>
                {business.location}, {business.city}, Tamil Nadu
              </Text>
            </View>
            <Pressable style={styles.infoLine} onPress={handleShowNumber}>
              <Ionicons name="call-outline" size={17} color={JD.green} />
              <Text style={[styles.infoLineText, { color: JD.green, fontWeight: "700" }]}>
                {showNumber ? business.phone : maskedPhone}
              </Text>
              {!showNumber && <Text style={styles.showNumberLink}>Show Number</Text>}
            </Pressable>
            <View style={styles.infoLine}>
              <Ionicons name="time-outline" size={17} color={JD.muted} />
              <Text style={styles.infoLineText}>{business.timings}</Text>
            </View>
          </View>
        )}

        {/* SERVICES */}
        {/* {activeTab === "services" && (
          <View style={styles.tabContentCard}>
            <Text style={styles.sectionHeaderTitle}>Services Offered</Text>
            <View style={styles.servicesWrap}>
              {business.services.map((service, idx) => (
                <View key={idx} style={styles.serviceItem}>
                  <Ionicons name="checkmark-circle" size={17} color={JD.green} />
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
        )} */}

        {/* REVIEWS */}
        {/* {activeTab === "reviews" && (
          <View style={styles.tabContentCard}>
            <Text style={styles.sectionHeaderTitle}>Ratings & Reviews</Text>

            <View style={styles.reviewsSummaryRow}>
              <View style={styles.bigScoreBox}>
                <View style={styles.bigScoreBadge}>
                  <Text style={styles.bigScoreText}>{business.rating.toFixed(1)}</Text>
                  <Ionicons name="star" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.totalReviewsSub}>{business.reviewsCount} Ratings</Text>
              </View>

              <View style={styles.ratingBarsCol}>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const pct = stars === 5 ? 78 : stars === 4 ? 16 : stars === 3 ? 4 : 2;
                  return (
                    <View key={stars} style={styles.barRow}>
                      <Text style={styles.barStarsLabel}>{stars} ★</Text>
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              width: `${pct}%`,
                              backgroundColor: stars >= 4 ? JD.green : stars === 3 ? JD.yellow : JD.red,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.barPctLabel}>{pct}%</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.rateBox}>
              <Text style={styles.rateTitle}>Rate this business</Text>
              <View style={styles.rateStars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Pressable key={s} onPress={() => handleRate(s)} hitSlop={4}>
                    <Ionicons
                      name={s <= userRating ? "star" : "star-outline"}
                      size={32}
                      color={s <= userRating ? JD.yellow : "#9CA3AF"}
                    />
                  </Pressable>
                ))}
              </View>
            </View>

            {business.reviewsList && business.reviewsList.length > 0 ? (
              business.reviewsList.map((rev) => (
                <View key={rev.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeaderRow}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {rev.author.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewAuthor}>{rev.author}</Text>
                      <Text style={styles.reviewDate}>{rev.date}</Text>
                    </View>
                    <View
                      style={[
                        styles.smallRating,
                        { backgroundColor: rev.rating >= 4 ? JD.green : rev.rating === 3 ? JD.orange : JD.red },
                      ]}
                    >
                      <Text style={styles.smallRatingText}>{rev.rating}</Text>
                      <Ionicons name="star" size={10} color="#FFFFFF" />
                    </View>
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
        )} */}

        {/* ABOUT */}
        {/* {activeTab === "about" && (
          <View style={styles.tabContentCard}>
            <Text style={styles.sectionHeaderTitle}>About {business.name}</Text>
            <Text style={styles.descriptionText}>{business.description}</Text>

            {business.founderName && (
              <View style={styles.founderBox}>
                <Ionicons name="person-circle-outline" size={30} color={JD.blue} />
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
        )} */}

        {/* SIMILAR */}
        {/* {similarBusinesses.length > 0 && (
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
                  <Image source={{ uri: item.imageUrl }} style={styles.similarImage} />
                  <View style={styles.similarContent}>
                    <Text style={styles.similarName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.similarSub} numberOfLines={1}>
                      {item.subCategory}
                    </Text>
                    <View style={styles.similarRatingBadge}>
                      <Text style={styles.similarRatingText}>{item.rating.toFixed(1)}</Text>
                      <Ionicons name="star" size={9} color="#FFFFFF" />
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )} */}
      </ScrollView>

      {/* STICKY BOTTOM BAR */}
      <View style={styles.bottomStickyBar}>
        <Pressable style={styles.callNowBtn} onPress={handleShowNumber}>
          <Ionicons name="call" size={18} color="#FFFFFF" />
          <Text style={styles.callNowBtnText}>
            {showNumber ? business.phone : "Show Number"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.sendEnquiryBtn}
          onPress={() => setEnquiryVisible(true)}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={JD.blue} />
          <Text style={styles.sendEnquiryBtnText}>Send Enquiry</Text>
        </Pressable>
      </View>

      {/* FULL-SCREEN PHOTO VIEWER */}
      <Modal visible={galleryOpen} animationType="fade" onRequestClose={() => setGalleryOpen(false)}>
        <View style={styles.viewerBg}>
          <View style={styles.viewerHeader}>
            <Pressable onPress={() => setGalleryOpen(false)} hitSlop={10}>
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.viewerCount}>
              {activePhotoIdx + 1} / {photosList.length}
            </Text>
            <View style={{ width: 28 }} />
          </View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: activePhotoIdx * width, y: 0 }}
            onMomentumScrollEnd={(e) =>
              setActivePhotoIdx(Math.round(e.nativeEvent.contentOffset.x / width))
            }
          >
            {photosList.map((uri, idx) => (
              <View key={idx} style={{ width, justifyContent: "center" }}>
                <Image source={{ uri }} style={{ width, height: width * 0.9 }} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

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
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: JD.border,
    backgroundColor: JD.white,
  },
  backBtn: { padding: 6, borderRadius: 20 },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: JD.text,
    flex: 1,
    marginHorizontal: 10,
  },
  headerRightActions: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerIconBtn: { padding: 6 },
  scroll: { flex: 1 },

  mosaicWrap: {
    backgroundColor: JD.white,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
  mosaicRow: { flexDirection: "row", height: 220 },
  mosaicSingle: { height: 220, borderRadius: 12, overflow: "hidden" },
  mosaicHalf: { flex: 1, borderRadius: 12, overflow: "hidden" },
  mosaicBig: { flex: 1.6, borderRadius: 12, overflow: "hidden", marginRight: 6 },
  mosaicCol: { flex: 1 },
  mosaicSmall: { flex: 1, borderRadius: 12, overflow: "hidden" },
  mosaicImg: { width: "100%", height: "100%" },
  moreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  moreOverlayText: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" },
  moreOverlaySub: { color: "#FFFFFF", fontSize: 11, fontWeight: "600" },
  viewerBg: { flex: 1, backgroundColor: "#000000", justifyContent: "center" },
  viewerHeader: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewerCount: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },

  sponsoredBadge: {
    position: "absolute",
    top: 24,
    left: 24,
    backgroundColor: JD.orange,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sponsoredText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  photoCountBadge: {
    position: "absolute",
    bottom: 24,
    left: 24,
    backgroundColor: "rgba(0,0,0,0.65)",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  photoCountText: { color: "#FFFFFF", fontSize: 11, fontWeight: "600" },
  dotsRow: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  dotActive: { backgroundColor: "#FFFFFF", width: 16 },

  mainInfoCard: {
    backgroundColor: JD.white,
    padding: 16,
    marginBottom: 8,
  },
  businessName: {
    fontSize: 21,
    fontWeight: "800",
    color: JD.text,
    marginBottom: 6,
  },
  badgesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  jdVerified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: JD.blueSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  jdVerifiedText: { fontSize: 11.5, fontWeight: "700", color: JD.blue },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  trustText: { fontSize: 11.5, fontWeight: "700", color: JD.orange },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: JD.green,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  ratingBadgeText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  reviewsCountText: { fontSize: 12.5, color: JD.muted },
  dotSep: { color: JD.muted, fontSize: 12 },
  categoryText: { fontSize: 12.5, color: JD.muted, flex: 1 },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 8,
  },
  locationText: { fontSize: 13, color: JD.text, flex: 1, lineHeight: 18 },
  statusRow: { flexDirection: "row", alignItems: "center" },
  statusText: { fontSize: 13, fontWeight: "700" },
  timingsText: { fontSize: 13, color: JD.muted },

  quickActionsCard: {
    backgroundColor: JD.white,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    marginBottom: 8,
  },
  actionBtn: { alignItems: "center", gap: 6 },
  actionIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    backgroundColor: JD.white,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnLabel: { fontSize: 11.5, fontWeight: "600", color: JD.text },

  dealStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFF8E1",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#FFE082",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  dealTitle: { fontSize: 13.5, fontWeight: "700", color: JD.text },
  dealSub: { fontSize: 11.5, color: JD.muted, marginTop: 2 },
  dealBtn: {
    backgroundColor: JD.yellow,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  dealBtnText: { fontSize: 12.5, fontWeight: "800", color: "#1F2937" },

  tabsRow: {
    flexDirection: "row",
    backgroundColor: JD.white,
    borderBottomWidth: 1,
    borderBottomColor: JD.border,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 13,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabItemActive: { borderBottomColor: JD.blue },
  tabItemText: { fontSize: 13, fontWeight: "600", color: JD.muted },
  tabItemTextActive: { color: JD.blue, fontWeight: "800" },

  tabContentCard: {
    backgroundColor: JD.white,
    padding: 16,
    marginBottom: 8,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: JD.text,
    marginBottom: 10,
  },
  descriptionText: { fontSize: 13.5, color: "#4B5563", lineHeight: 21 },
  detailsDivider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 14 },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: JD.text,
    marginBottom: 10,
  },
  highlightsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  highlightPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: JD.border,
  },
  highlightPillText: { fontSize: 12, fontWeight: "600", color: "#374151" },
  infoLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  infoLineText: { fontSize: 13.5, color: "#374151", flex: 1, lineHeight: 19 },
  showNumberLink: { fontSize: 12.5, fontWeight: "700", color: JD.blue },

  servicesWrap: { gap: 12 },
  serviceItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  serviceItemText: { fontSize: 13.5, color: "#374151" },
  specialitiesWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  specialityPill: {
    backgroundColor: JD.blueSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialityText: { fontSize: 12, fontWeight: "600", color: JD.blue },

  reviewsSummaryRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  bigScoreBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: "#F3F4F6",
    gap: 6,
  },
  bigScoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: JD.green,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bigScoreText: { fontSize: 24, fontWeight: "900", color: "#FFFFFF" },
  totalReviewsSub: { fontSize: 11.5, color: JD.muted },
  ratingBarsCol: { flex: 1, gap: 5 },
  barRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  barStarsLabel: { fontSize: 11, color: JD.muted, width: 24 },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
  },
  barFill: { height: "100%" },
  barPctLabel: { fontSize: 10, color: "#9CA3AF", width: 28, textAlign: "right" },

  rateBox: {
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingVertical: 14,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: JD.border,
  },
  rateTitle: { fontSize: 14, fontWeight: "700", color: JD.text, marginBottom: 8 },
  rateStars: { flexDirection: "row", gap: 8 },

  reviewItem: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  reviewHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: JD.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
  reviewAuthor: { fontSize: 13.5, fontWeight: "700", color: JD.text },
  reviewDate: { fontSize: 11, color: "#9CA3AF", marginTop: 1 },
  smallRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  smallRatingText: { color: "#FFFFFF", fontSize: 11.5, fontWeight: "800" },
  reviewComment: { fontSize: 13, color: "#4B5563", lineHeight: 19 },
  noReviewsText: {
    fontSize: 13,
    color: JD.muted,
    textAlign: "center",
    paddingVertical: 14,
  },

  founderBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: JD.blueSoft,
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  founderTitle: { fontSize: 11, color: JD.muted, textTransform: "uppercase" },
  founderName: { fontSize: 14, fontWeight: "700", color: JD.text },
  timingsDetailLine: { fontSize: 13.5, color: "#4B5563" },

  similarSection: { backgroundColor: JD.white, padding: 16, marginBottom: 8 },
  similarSectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: JD.text,
    marginBottom: 12,
  },
  similarCard: {
    width: 150,
    backgroundColor: JD.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: JD.border,
    overflow: "hidden",
    marginRight: 10,
  },
  similarImage: { width: "100%", height: 90 },
  similarContent: { padding: 8 },
  similarName: { fontSize: 12.5, fontWeight: "700", color: JD.text },
  similarSub: { fontSize: 10.5, color: JD.muted, marginTop: 1 },
  similarRatingBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 3,
    backgroundColor: JD.green,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  similarRatingText: { fontSize: 11, fontWeight: "800", color: "#FFFFFF" },

  bottomStickyBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: JD.white,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: JD.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  callNowBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: JD.green,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  callNowBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  sendEnquiryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: JD.white,
    borderWidth: 1.5,
    borderColor: JD.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  sendEnquiryBtnText: { color: JD.blue, fontSize: 15, fontWeight: "800" },

  notFoundWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  notFoundText: { fontSize: 15, color: "#4B5563", textAlign: "center" },
  browseAllBtn: {
    backgroundColor: JD.blue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  browseAllBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
});