// Justdial-style Business Details screen for WOW  -  ONE self-contained screen for the /business/[id] route.
//
// Use: save as  app/business/[id].tsx  (or save in your screens folder and re-export it from that route).
// It reads the id from the route, finds the business, and handles save / enquiry / similar businesses itself.
// Structure (top to bottom)
// 1. Top bar        : back | search | share | more. After you scroll, the small photo + business name
//                     slide into the bar (like Justdial) so you always know where you are.
// 2. Identity       : small photo + name (verified tick at the end) + rating + category + status + tags
// 3. Quick actions  : Call, WhatsApp, Ask Anything, Enquiry, Directions
// 4. Photo collage  : fixed-size tiles (cover) so any image size looks the same
// 5. Sticky tabs    : Overview | Services | Reviews (n) | Photos (n) | Videos (n)   [+ Menu if the business has one]
// 6. Tab content    : Overview = recommend, summary, info, hours, services, specialities, location,
//                     ratings & reviews, ask-a-question, similar businesses
// 7. Bottom bar     : Call Now | Enquire Now | WhatsApp
//
// Icons: Google Material Icons (MaterialCommunityIcons only for the WhatsApp logo).

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectSavedIds, toggleSave } from "@/features/saved/slices/savedSlice";
import { ALL_BUSINESS_LISTINGS } from "@/features/business/data/businessListingData";
import { BusinessListingItem, CustomerReview } from "@/features/business/types/business.types";
import EnquiryModal from "@/features/business/components/EnquiryModal";

type DetailTab = "overview" | "menu" | "services" | "reviews" | "photos" | "videos";
type Recommendation = "Yes" | "No" | "Maybe";
type PhotoSource = "owner" | "users";
type MIName = React.ComponentProps<typeof MaterialIcons>["name"];

// Optional extra fields. Add them to BusinessListingItem when your backend supports them.
type ExtendedBusiness = BusinessListingItem & {
  website?: string;
  email?: string;
  travelTime?: string;
  menuItems?: string[];
  userPhotos?: string[];
  videoUrls?: string[];
};


const C = {
  pink: "#D91B68",
  pinkSoft: "#FDECF3",
  pinkLine: "#F8CBDD",
  blue: "#1677D2",
  blueSoft: "#E8F2FC",
  blueLine: "#B9D8F4",
  green: "#14804A",
  greenBright: "#1FA463",
  greenSoft: "#E6F5EC",
  red: "#D93025",
  orange: "#F57C00",
  orangeSoft: "#FFF1E3",
  purple: "#7B3FD1",
  gold: "#F5A623",
  ink: "#14171C",
  text: "#3D444D",
  muted: "#78808A",
  line: "#E9ECEF",
  page: "#F4F5F7",
  white: "#FFFFFF",
};

const AVATAR_COLORS = ["#D91B68", "#7B3FD1", "#039BE5", "#F57C00", "#0F9D58", "#C2185B"];
const COMPACT_AT = 110; // scroll offset where the name + photo move into the top bar

const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);

/* ------------------------------ small parts ------------------------------ */
function MI({ name, color, size = 22 }: { name: MIName; color: string; size?: number }) {
  return <MaterialIcons name={name} size={size} color={color} />;
}

function SafeImage({
  uri,
  style,
  mode = "cover",
}: {
  uri?: string | null;
  style: any;
  mode?: "cover" | "contain";
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [uri]);
  if (!uri || failed) {
    return (
      <View style={[style, styles.imagePlaceholder]}>
        <MI name="storefront" size={26} color="#C3C9D0" />
      </View>
    );
  }
  return <Image source={{ uri }} style={style} resizeMode={mode} onError={() => setFailed(true)} />;
}

function Stars({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <MI key={n} name={n <= Math.round(value) ? "star" : "star-border"} size={size} color={C.gold} />
      ))}
    </View>
  );
}

function SectionHeading({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {!!action && (
        <Pressable onPress={onAction} style={styles.viewAll} hitSlop={8}>
          <Text style={styles.viewAllText}>{action}</Text>
          <MI name="chevron-right" size={20} color={C.pink} />
        </Pressable>
      )}
    </View>
  );
}

function Tag({ icon, label, color, bg }: { icon: MIName; label: string; color: string; bg: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: bg }]}>
      <MI name={icon} size={13} color={color} />
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

/* -------------------------------- screen --------------------------------- */
export default function BusinessDetailPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const savedIds = useAppSelector(selectSavedIds);
  const { id } = useLocalSearchParams<{ id: string }>();

  const [selectedId, setSelectedId] = useState<string | undefined>(id);
  const [enquiryBusiness, setEnquiryBusiness] = useState<BusinessListingItem | null>(null);

  const business = useMemo<BusinessListingItem | null>(
    () => ALL_BUSINESS_LISTINGS.find((b) => b.id === (selectedId ?? id)) ?? null,
    [selectedId, id]
  );

  const similarBusinesses = ALL_BUSINESS_LISTINGS;
  const isSaved = !!business && savedIds.includes(business.id);
  const onToggleSave = (bid: string) => dispatch(toggleSave(bid));
  const onOpenEnquiry = (b: BusinessListingItem) => setEnquiryBusiness(b);
  const onSelectSimilar = (b: BusinessListingItem) => setSelectedId(b.id);
  const onSearch = () => router.push("/search" as any);
  const onClose = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/categories" as any);
  };

  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [viewerIdx, setViewerIdx] = useState<number | null>(null);
  const [helpful, setHelpful] = useState<Record<string, boolean>>({});
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [hoursExpanded, setHoursExpanded] = useState(false);
  const [compact, setCompact] = useState(false);
  const [photoSource, setPhotoSource] = useState<PhotoSource>("owner");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const [writeReviewVisible, setWriteReviewVisible] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [localReviews, setLocalReviews] = useState<CustomerReview[]>([]);

  const mainScrollRef = useRef<ScrollView>(null);
  const compactRef = useRef(false);

  const businessId = business?.id;
  useEffect(() => {
    setActiveTab("overview");
    setViewerIdx(null);
    setLocalReviews([]);
    setHelpful({});
    setRecommendation(null);
    setAboutExpanded(false);
    setHoursExpanded(false);
    setMenuOpen(false);
    setPhotoSource("owner");
    setRatingFilter(null);
    compactRef.current = false;
    setCompact(false);
    mainScrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [businessId]);

  const allReviews: CustomerReview[] = useMemo(
    () => [...localReviews, ...(business?.reviewsList || [])],
    [localReviews, business?.reviewsList]
  );

  if (!business) {
    return (
      <View style={styles.notFound}>
        <MI name="storefront" size={44} color="#C3C9D0" />
        <Text style={styles.notFoundTitle}>Business not found</Text>
        <Text style={styles.notFoundSub}>This listing may have been removed.</Text>
        <Pressable style={styles.notFoundBtn} onPress={onClose} accessibilityRole="button">
          <Text style={styles.notFoundBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const item = business as ExtendedBusiness;
  const ownerPhotos = (item.photos || []).filter(Boolean);
  const gallery = ownerPhotos.length ? ownerPhotos : item.imageUrl ? [item.imageUrl] : [];
  const userPhotos = (item.userPhotos || []).filter(Boolean);
  const videoUrls = (item.videoUrls || []).filter(Boolean);
  const viewerList = [...gallery, ...userPhotos];
  const thumb = item.imageUrl || gallery[0];

  const phone = String(item.phone || "");
  const whatsapp = String(item.whatsapp || phone).replace(/[^0-9]/g, "");
  const rating = Number(item.rating || 0);
  const totalRatings = Number(item.reviewsCount || 0) + localReviews.length;
  const dedupe = (parts: (string | undefined)[]) =>
    Array.from(new Set(parts.filter(Boolean).map((p) => String(p).trim()))).join(", ");
  const address = dedupe([item.address, item.location, item.city]);
  const locationText = dedupe([item.location, item.city]);
  const about =
    item.about || item.description || "Explore this business, its services and how it can support your needs.";
  const services = item.services || [];
  const specialities = item.specialities || [];
  const workingHours = item.workingHours || [];
  const years = item.establishedYear ? new Date().getFullYear() - Number(item.establishedYear) : 0;
  const menuList = item.menuItems?.length ? item.menuItems : services;

  const tabs: { key: DetailTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "menu", label: "Menu" },
    { key: "reviews", label: `Reviews${allReviews.length ? ` (${allReviews.length})` : ""}` },
    { key: "services", label: "Services" },
    { key: "photos", label: `Photos${viewerList.length ? ` (${viewerList.length})` : ""}` },
    { key: "videos", label: `Videos${videoUrls.length ? ` (${videoUrls.length})` : ""}` },
  ];

  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = allReviews.filter((r) => Math.round(r.rating) === stars).length;
    return { stars, count, percent: allReviews.length ? Math.round((count / allReviews.length) * 100) : 0 };
  });

  const shownReviews = ratingFilter
    ? allReviews.filter((r) => Math.round(r.rating) === ratingFilter)
    : allReviews;

  /* ------------------------------- actions ------------------------------- */
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const should = e.nativeEvent.contentOffset.y > COMPACT_AT;
    if (should !== compactRef.current) {
      compactRef.current = should;
      setCompact(should);
    }
  };

  const handleCall = () => {
    if (!phone) return Alert.alert("Phone number unavailable", "This business has not added a number yet.");
    Linking.openURL(`tel:${phone.replace(/[^0-9+]/g, "")}`).catch(() =>
      Alert.alert("Unable to call", "Calling is not supported on this device.")
    );
  };

  const handleWhatsApp = () => {
    if (!whatsapp) return Alert.alert("WhatsApp unavailable", "This business has not added a WhatsApp number.");
    const msg = encodeURIComponent(
      `Hello ${item.name}, I found your business on WOW and would like to know more about your services.`
    );
    Linking.openURL(`https://wa.me/${whatsapp}?text=${msg}`).catch(() =>
      Alert.alert("Unable to open WhatsApp", "Please check that WhatsApp is installed.")
    );
  };

  const handleDirections = () => {
    const q = encodeURIComponent(`${item.name}, ${address}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`).catch(() =>
      Alert.alert("Unable to open maps", "Please try again.")
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: item.name,
        message: `Check out ${item.name} on the WOW Women Business Directory.${phone ? ` Contact: ${phone}` : ""}`,
      });
    } catch { }
  };

  const openVideo = (url: string) =>
    Linking.openURL(url).catch(() => Alert.alert("Unable to play video", "Please try again."));

  const openEnquiry = () => onOpenEnquiry(item);
  const openAsk = () => onOpenEnquiry(item);
  const openReview = (r = 5) => {
    setNewRating(r);
    setWriteReviewVisible(true);
  };

  const submitReview = () => {
    if (!newReviewComment.trim()) {
      return Alert.alert("Review required", "Please share a few words about your experience.");
    }
    const review: CustomerReview = {
      id: `local-${Date.now()}`,
      author: newReviewAuthor.trim() || "WOW Member",
      rating: newRating,
      date: "Just now",
      comment: newReviewComment.trim(),
    };
    setLocalReviews((c) => [review, ...c]);
    setNewReviewAuthor("");
    setNewReviewComment("");
    setWriteReviewVisible(false);
    setActiveTab("reviews");
    Alert.alert("Review added", "Thank you for sharing your experience.");
  };

  /* ------------------------------ renderers ------------------------------ */
  const renderQuickAction = (
    label: string,
    icon: React.ReactNode,
    boxStyle: any,
    onPress: () => void,
    fast = false
  ) => (
    <Pressable key={label} style={styles.quickAction} onPress={onPress} accessibilityRole="button">
      <View style={[styles.quickBox, boxStyle]}>
        {icon}
        {fast && (
          <View style={styles.fastBadge}>
            <MI name="bolt" size={10} color="#fff" />
            <Text style={styles.fastText}>FAST</Text>
          </View>
        )}
      </View>
      <Text style={styles.quickLabel} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );

  const renderInfoRow = (icon: MIName, color: string, label: string, value: string, onPress?: () => void) => (
    <Pressable key={label} style={styles.infoRow} onPress={onPress} disabled={!onPress}>
      <MI name={icon} size={21} color={color} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value || "Not provided"}
      </Text>
      {!!onPress && <MI name="chevron-right" size={20} color={C.muted} />}
    </Pressable>
  );

  const renderRatingSummary = () => (
    <View style={styles.ratingSummary}>
      <View style={styles.bigRatingCol}>
        <Text style={styles.bigRating}>
          {rating.toFixed(1)}
          <Text style={styles.bigRatingStar}> ★</Text>
        </Text>
        <Text style={styles.bigRatingCaption}>{totalRatings.toLocaleString()} ratings</Text>
      </View>
      <View style={styles.ratingBars}>
        {breakdown.map((row) => (
          <View key={row.stars} style={styles.barRow}>
            <Text style={styles.barStar}>{row.stars}</Text>
            <MI name="star" size={12} color={C.gold} />
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${row.percent}%`, backgroundColor: row.stars >= 4 ? C.greenBright : C.gold },
                ]}
              />
            </View>
            <Text style={styles.barPercent}>{row.percent}%</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderReviewCard = (review: CustomerReview) => {
    const on = !!helpful[review.id];
    const color = AVATAR_COLORS[(review.author?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
    return (
      <View key={review.id} style={styles.reviewCard}>
        <View style={styles.reviewTop}>
          <View style={[styles.avatar, { backgroundColor: color }]}>
            <Text style={styles.avatarText}>{(review.author || "W").charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.reviewerName}>{review.author}</Text>
            <View style={styles.reviewMeta}>
              <Stars value={review.rating} size={13} />
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          </View>
          <View style={styles.smallRating}>
            <Text style={styles.smallRatingText}>{Number(review.rating).toFixed(1)}</Text>
            <MI name="star" size={11} color="#fff" />
          </View>
        </View>
        <Text style={styles.reviewComment}>{review.comment}</Text>
        <Pressable
          style={styles.helpfulBtn}
          onPress={() => setHelpful((h) => ({ ...h, [review.id]: !h[review.id] }))}
        >
          <MI name={on ? "thumb-up" : "thumb-up-off-alt"} size={18} color={on ? C.pink : C.muted} />
          <Text style={[styles.helpfulText, on && { color: C.pink }]}>Helpful{on ? " · 1" : ""}</Text>
        </Pressable>
      </View>
    );
  };

  const chips = (list: string[]) => (
    <View style={styles.chipWrap}>
      {list.map((v, i) => (
        <View key={`${v}-${i}`} style={styles.chip}>
          <MI name="check-circle" size={15} color={C.pink} />
          <Text style={styles.chipText}>{v}</Text>
        </View>
      ))}
    </View>
  );

  const bullets = (list: string[]) =>
    list.map((v, i) => (
      <View key={`${v}-${i}`} style={styles.listRow}>
        <View style={styles.bullet} />
        <Text style={styles.listText}>{v}</Text>
      </View>
    ));

  const serviceIcons: { icon: MIName; color: string; bg: string }[] = [
    { icon: "groups", color: C.pink, bg: C.pinkSoft },
    { icon: "trending-up", color: C.blue, bg: C.blueSoft },
    { icon: "handshake", color: C.orange, bg: C.orangeSoft },
  ];

  const others = similarBusinesses.filter((b) => b.id !== item.id);
  const topPad = Math.max(insets.top, Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0);

  const hoursCard = workingHours.length > 0 && (
    <View style={styles.section}>
      <SectionHeading title="Business hours" />
      {workingHours.map((h) => (
        <View style={styles.hourRowLg} key={h.day}>
          <Text style={styles.hourDay}>{h.day}</Text>
          <Text style={[styles.hourTime, { color: h.isOpen ? C.green : C.muted }]}>{h.time}</Text>
        </View>
      ))}
    </View>
  );

  /* -------------------------------- render ------------------------------- */
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      {/* 1. TOP BAR (name + small photo appear after scrolling) */}
      <View style={[styles.topBar, { paddingTop: topPad + 2 }, compact && styles.topBarCompact]}>
        <Pressable style={styles.topBtn} onPress={onClose} accessibilityRole="button" accessibilityLabel="Go back">
          <MI name="arrow-back" size={25} color={C.ink} />
        </Pressable>

        {compact ? (
          <View style={styles.compactTitle}>
            <SafeImage uri={thumb} style={styles.compactImg} />
            <View style={{ flex: 1 }}>
              <View style={styles.compactNameRow}>
                <Text style={styles.compactName} numberOfLines={1}>
                  {item.name}
                </Text>
                {item.isVerified && <MI name="verified" size={16} color={C.blue} />}
              </View>
              <Text style={styles.compactSub} numberOfLines={1}>
                {rating.toFixed(1)} ★ · {item.category}
              </Text>
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <Pressable style={styles.topBtn} onPress={onSearch} accessibilityRole="button" accessibilityLabel="Search">
          <MI name="search" size={25} color={C.ink} />
        </Pressable>
        <Pressable style={styles.topBtn} onPress={handleShare} accessibilityRole="button" accessibilityLabel="Share">
          <MI name="share" size={23} color={C.ink} />
        </Pressable>
        <Pressable
          style={styles.topBtn}
          onPress={() => setMenuOpen((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel="More options"
        >
          <MI name="more-vert" size={25} color={C.ink} />
        </Pressable>
      </View>

      <ScrollView
        ref={mainScrollRef}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[gallery.length ? 3 : 2]}
        contentContainerStyle={{ paddingBottom: 100 + Math.max(insets.bottom, 8) }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => setMenuOpen(false)}
      >
        {/* [0] 2. IDENTITY (Justdial layout) */}
        <View style={styles.identity}>
          <View style={styles.nameLine}>
            {item.isVerified && (
              <View style={styles.trustBadge}>
                <MI name="thumb-up" size={15} color="#fff" />
              </View>
            )}
            <Text style={styles.businessName}>{item.name}</Text>
          </View>

          <View style={styles.ratingLine}>
            <View style={[styles.ratingBadge, rating < 4 && { backgroundColor: C.gold }]}>
              <Text style={styles.ratingBadgeText}>{rating.toFixed(1)}</Text>
              <MI name="star" size={16} color="#fff" />
            </View>
            <Text style={styles.ratingCount}>
              {totalRatings ? `${formatCount(totalRatings)} Ratings` : "Be the first to rate"}
            </Text>
          </View>

          <View style={styles.metaLine}>
            <Text style={styles.metaText} numberOfLines={1}>
              {locationText || "Location not added"}
            </Text>
            {!!item.distance && (
              <>
                <Text style={styles.metaDot}>•</Text>
                <MI name="directions-car" size={18} color={C.ink} />
                <Text style={styles.metaText}>{item.travelTime || "Nearby"}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{item.distance}</Text>
              </>
            )}
          </View>

          <View style={styles.metaLine}>
            <Text style={[styles.metaText, { color: C.ink, fontWeight: "500" }]}>
              {item.category}
              {item.subCategory ? ` › ${item.subCategory}` : ""}
            </Text>
            {years > 0 && (
              <>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{years} Years in Business</Text>
              </>
            )}
          </View>

          {(item.isFeatured || item.isWomenOwned || item.isPremium) && (
            <View style={styles.tagsRow}>
              {item.isFeatured && <Tag icon="local-fire-department" label="Trending" color={C.pink} bg={C.pinkSoft} />}
              {item.isWomenOwned && <Tag icon="woman" label="Women-owned" color={C.pink} bg={C.pinkSoft} />}
              {item.isPremium && <Tag icon="emoji-events" label="Premium" color={C.purple} bg="#F1E9FC" />}
            </View>
          )}

          <Pressable style={styles.openLine} onPress={() => setHoursExpanded((v) => !v)}>
            <Text style={[styles.openStatus, { color: item.isOpen ? C.green : C.red }]}>
              {item.isOpen ? "Open Now" : "Closed"}
              <Text style={styles.openTimings}>
                {": "}
                {item.timings || "View business hours"}
              </Text>
            </Text>
            <MI name={hoursExpanded ? "expand-less" : "expand-more"} size={22} color={C.ink} />
          </Pressable>

          {hoursExpanded && workingHours.length > 0 && (
            <View style={styles.hoursPanel}>
              {workingHours.map((h) => (
                <View style={styles.hourRow} key={h.day}>
                  <Text style={styles.hourDay}>{h.day}</Text>
                  <Text style={[styles.hourTime, { color: h.isOpen ? C.green : C.muted }]}>{h.time}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* [1] 3. QUICK ACTIONS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRow}
          style={{ backgroundColor: C.white }}
        >
          {renderQuickAction("Call", <MI name="call" size={32} color="#fff" />, { backgroundColor: C.blue }, handleCall)}
          {renderQuickAction(
            "WhatsApp",
            <MaterialCommunityIcons name="whatsapp" size={34} color="#fff" />,
            { backgroundColor: C.greenBright },
            handleWhatsApp
          )}
          {renderQuickAction("Ask Anything", <MI name="question-answer" size={30} color={C.blue} />, styles.askBox, openAsk)}
          {renderQuickAction(
            "Enquiry",
            <MI name="chat" size={30} color={C.blue} />,
            { backgroundColor: C.blueSoft, borderWidth: 1.5, borderColor: C.blueLine },
            openEnquiry,
            true
          )}
          {renderQuickAction(
            "Directions",
            <MI name="near-me" size={30} color={C.blue} />,
            { backgroundColor: C.blueSoft, borderWidth: 1.5, borderColor: C.blueLine },
            handleDirections
          )}
        </ScrollView>

        {/* [2] 4. PHOTO COLLAGE (fixed boxes, any image size) */}
        {gallery.length > 0 && (
          <View style={styles.galleryWrap}>
            <Pressable style={styles.galleryMain} onPress={() => setViewerIdx(0)}>
              <SafeImage uri={gallery[0]} style={styles.fill} />
              <View style={styles.pill}>
                <MI name="collections" size={16} color="#fff" />
                <Text style={styles.pillText}>By Owner ({gallery.length})</Text>
              </View>
            </Pressable>

            <View style={styles.gallerySide}>
              <Pressable
                style={styles.sideTile}
                onPress={() => setViewerIdx(userPhotos.length ? gallery.length : Math.min(1, gallery.length - 1))}
              >
                <SafeImage uri={userPhotos[0] || gallery[1]} style={styles.fill} />
                <View style={styles.pill}>
                  <MI name="collections" size={16} color="#fff" />
                  <Text style={styles.pillText}>
                    {userPhotos.length ? `By User (${userPhotos.length})` : `Photos (${gallery.length})`}
                  </Text>
                </View>
              </Pressable>

              <Pressable style={styles.sideTile} onPress={() => setActiveTab("videos")}>
                <SafeImage uri={gallery[2] || gallery[1] || gallery[0]} style={styles.fill} />
                <View style={styles.playOverlay}>
                  <MI name="play-circle-filled" size={38} color="rgba(255,255,255,0.92)" />
                </View>
                <View style={styles.pill}>
                  <MI name="videocam" size={16} color="#fff" />
                  <Text style={styles.pillText}>Videos ({videoUrls.length})</Text>
                </View>
              </Pressable>
            </View>
          </View>
        )}

        {/* [3] 5. STICKY TABS */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
            {tabs.map((t) => {
              const active = activeTab === t.key;
              return (
                <Pressable
                  key={t.key}
                  style={styles.tabItem}
                  onPress={() => setActiveTab(t.key)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
                  {active && <View style={styles.tabUnderline} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ============================ OVERVIEW ============================ */}
        {activeTab === "overview" && (
          <View style={styles.tabContent}>
            <View style={styles.recommendCard}>
              <Text style={styles.recommendTitle}>Do you recommend this business?</Text>
              <View style={styles.recommendRow}>
                {(["Yes", "No", "Maybe"] as Recommendation[]).map((c) => {
                  const sel = recommendation === c;
                  return (
                    <Pressable
                      key={c}
                      onPress={() => setRecommendation(c)}
                      style={[styles.recommendBtn, sel && styles.recommendBtnActive]}
                    >
                      <Text style={[styles.recommendText, sel && styles.recommendTextActive]}>{c}</Text>
                    </Pressable>
                  );
                })}
              </View>
              {recommendation && <Text style={styles.recommendThanks}>Thanks for sharing your feedback.</Text>}
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Business summary</Text>
              <Text style={styles.summaryText} numberOfLines={aboutExpanded ? undefined : 4}>
                {about}
              </Text>
              {about.length > 160 && (
                <Pressable onPress={() => setAboutExpanded((v) => !v)}>
                  <Text style={styles.readMore}>{aboutExpanded ? "Read less" : "Read more"}</Text>
                </Pressable>
              )}
              {!!item.founderName && (
                <View style={styles.founderRow}>
                  <MI name="person" size={18} color={C.pink} />
                  <Text style={styles.founderText}>
                    Founder: <Text style={styles.founderBold}>{item.founderName}</Text>
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.infoCard}>
              {renderInfoRow("location-on", C.red, "Address", address, handleDirections)}
              {renderInfoRow(
                "access-time",
                C.greenBright,
                "Timings",
                item.timings || (item.isOpen ? "Open now" : "Check availability"),
                () => setHoursExpanded(true)
              )}
              {renderInfoRow("category", C.purple, "Category", [item.category, item.subCategory].filter(Boolean).join(" / "))}
              {!!item.establishedYear && renderInfoRow("event", C.orange, "Established", String(item.establishedYear))}
              {!!phone && renderInfoRow("call", C.blue, "Contact", phone, handleCall)}
              {!!item.email && renderInfoRow("email", C.red, "Email", item.email, () => Linking.openURL(`mailto:${item.email}`))}
              {!!item.website &&
                renderInfoRow("language", C.blue, "Website", item.website, () =>
                  Linking.openURL(item.website!.startsWith("http") ? item.website! : `https://${item.website}`)
                )}
            </View>

            {hoursCard}

            {services.length > 0 && (
              <View style={styles.section}>
                <SectionHeading title="Our services" action="View all" onAction={() => setActiveTab("services")} />
                <View style={styles.serviceTiles}>
                  {services.slice(0, 3).map((s, i) => {
                    const si = serviceIcons[i % serviceIcons.length];
                    return (
                      <Pressable
                        key={`${s}-${i}`}
                        style={[styles.serviceTile, { backgroundColor: si.bg }]}
                        onPress={() => setActiveTab("services")}
                      >
                        <MI name={si.icon} size={28} color={si.color} />
                        <Text style={styles.serviceTileText} numberOfLines={3}>
                          {s}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {specialities.length > 0 && (
              <View style={styles.section}>
                <SectionHeading title="Specialities" />
                {chips(specialities)}
              </View>
            )}

            {/* Location */}
            <View style={styles.section}>
              <SectionHeading title="Location" />
              <View style={styles.locationCard}>
                <View style={styles.locationIcon}>
                  <MI name="map" size={28} color={C.pink} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.locationAddr} numberOfLines={3}>
                    {address || "Address not provided"}
                  </Text>
                </View>
              </View>
              <Pressable style={styles.outlineBtn} onPress={handleDirections} accessibilityRole="button">
                <MI name="near-me" size={19} color={C.blue} />
                <Text style={styles.outlineBtnText}>Get directions</Text>
              </Pressable>
            </View>

            {/* Ratings & reviews */}
            <View style={styles.section}>
              <SectionHeading title="Ratings & reviews" action="Write a review" onAction={() => openReview(5)} />
              {renderRatingSummary()}
              {allReviews.slice(0, 2).map(renderReviewCard)}
              {allReviews.length === 0 && (
                <Text style={styles.emptyText}>No written reviews yet. Be the first to share your experience.</Text>
              )}
              {allReviews.length > 2 && (
                <Pressable style={styles.allReviewsBtn} onPress={() => setActiveTab("reviews")}>
                  <Text style={styles.allReviewsText}>See all {allReviews.length} reviews</Text>
                  <MI name="chevron-right" size={20} color={C.pink} />
                </Pressable>
              )}
            </View>

            {/* Ask a question */}
            <View style={styles.askCard}>
              <View style={styles.askIcon}>
                <MI name="help-outline" size={26} color={C.pink} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.askTitle}>Have a question?</Text>
                <Text style={styles.askSub}>Ask {item.name} about prices, timings or availability.</Text>
              </View>
              <Pressable style={styles.askBtn} onPress={openAsk} accessibilityRole="button">
                <Text style={styles.askBtnText}>Ask</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ============================== MENU ============================== */}
        {activeTab === "menu" && (
          <View style={styles.section}>
            <SectionHeading title="Menu & offerings" />
            {menuList.length ? bullets(menuList) : <Text style={styles.emptyText}>Menu details have not been added yet.</Text>}
          </View>
        )}

        {/* ============================ SERVICES ============================ */}
        {activeTab === "services" && (
          <View style={styles.section}>
            <SectionHeading title="Services & specialities" />
            {specialities.length > 0 && chips(specialities)}
            {services.length ? (
              <View style={{ marginTop: specialities.length ? 8 : 0 }}>{bullets(services)}</View>
            ) : (
              <Text style={styles.emptyText}>Services have not been added yet.</Text>
            )}
          </View>
        )}

        {/* ============================= REVIEWS ============================ */}
        {activeTab === "reviews" && (
          <View style={styles.section}>
            <SectionHeading title="Ratings & reviews" action="Write a review" onAction={() => openReview(5)} />
            {renderRatingSummary()}

            <View style={styles.ratePrompt}>
              <Text style={styles.ratePromptTitle}>Rate this business</Text>
              <Text style={styles.ratePromptSub}>Tap a star to share your experience.</Text>
              <View style={styles.rateStars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Pressable key={s} onPress={() => openReview(s)} hitSlop={4}>
                    <MI name="star" size={36} color={C.gold} />
                  </Pressable>
                ))}
              </View>
            </View>

            {/* rating filter chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
              style={{ marginBottom: 4 }}
            >
              <Pressable
                style={[styles.filterChip, ratingFilter === null && styles.filterChipOn]}
                onPress={() => setRatingFilter(null)}
              >
                <Text style={[styles.filterChipText, ratingFilter === null && styles.filterChipTextOn]}>
                  All ({allReviews.length})
                </Text>
              </Pressable>
              {breakdown.map((row) => {
                const on = ratingFilter === row.stars;
                return (
                  <Pressable
                    key={row.stars}
                    style={[styles.filterChip, on && styles.filterChipOn]}
                    onPress={() => setRatingFilter(on ? null : row.stars)}
                  >
                    <MI name="star" size={13} color={on ? "#fff" : C.gold} />
                    <Text style={[styles.filterChipText, on && styles.filterChipTextOn]}>
                      {row.stars} ({row.count})
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {shownReviews.length ? (
              shownReviews.map(renderReviewCard)
            ) : (
              <Text style={styles.emptyText}>
                {allReviews.length
                  ? "No reviews with this rating."
                  : "No written reviews yet. Be the first to review this business."}
              </Text>
            )}
          </View>
        )}

        {/* ============================= PHOTOS ============================= */}
        {activeTab === "photos" && (
          <View style={styles.section}>
            <SectionHeading title="Photos" />
            <View style={styles.segment}>
              {(
                [
                  { key: "owner", label: `By owner (${gallery.length})` },
                  { key: "users", label: `By users (${userPhotos.length})` },
                ] as { key: PhotoSource; label: string }[]
              ).map((s) => {
                const on = photoSource === s.key;
                return (
                  <Pressable
                    key={s.key}
                    style={[styles.segmentBtn, on && styles.segmentBtnOn]}
                    onPress={() => setPhotoSource(s.key)}
                  >
                    <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{s.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {(photoSource === "owner" ? gallery : userPhotos).length ? (
              <View style={styles.photoGrid}>
                {(photoSource === "owner" ? gallery : userPhotos).map((p, i) => (
                  <Pressable
                    key={`${p}-${i}`}
                    onPress={() => setViewerIdx(photoSource === "owner" ? i : gallery.length + i)}
                    style={styles.photoCell}
                  >
                    <SafeImage uri={p} style={styles.fill} />
                  </Pressable>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>
                {photoSource === "owner" ? "The owner has not added photos yet." : "No customer photos yet."}
              </Text>
            )}
          </View>
        )}

        {/* ============================= VIDEOS ============================= */}
        {activeTab === "videos" && (
          <View style={styles.section}>
            <SectionHeading title={`Videos${videoUrls.length ? ` (${videoUrls.length})` : ""}`} />
            {videoUrls.length ? (
              <View style={styles.videoGrid}>
                {videoUrls.map((u, i) => (
                  <Pressable
                    key={`${u}-${i}`}
                    style={styles.videoCell}
                    onPress={() => openVideo(u)}
                    accessibilityRole="button"
                    accessibilityLabel={`Play video ${i + 1}`}
                  >
                    <SafeImage uri={gallery[i % Math.max(gallery.length, 1)]} style={styles.fill} />
                    <View style={styles.videoDim} />
                    <View style={styles.playOverlay}>
                      <MI name="play-circle-filled" size={46} color="rgba(255,255,255,0.95)" />
                    </View>
                    <View style={styles.pill}>
                      <MI name="videocam" size={15} color="#fff" />
                      <Text style={styles.pillText}>Video {i + 1}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={styles.emptyBox}>
                <MI name="videocam-off" size={34} color="#B8BFC7" />
                <Text style={styles.emptyBoxText}>No videos have been added yet.</Text>
              </View>
            )}
          </View>
        )}

        {/* ======================== SIMILAR BUSINESSES ====================== */}
        {others.length > 0 && (
          <View style={styles.section}>
            <SectionHeading title="Similar businesses" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {others.slice(0, 8).map((o) => (
                <Pressable key={o.id} style={styles.similarCard} onPress={() => onSelectSimilar?.(o)}>
                  <SafeImage uri={o.imageUrl} style={styles.similarImg} />
                  <Text style={styles.similarName} numberOfLines={2}>
                    {o.name}
                  </Text>
                  <View style={styles.smallRating}>
                    <Text style={styles.smallRatingText}>{Number(o.rating || 0).toFixed(1)}</Text>
                    <MI name="star" size={11} color="#fff" />
                  </View>
                  <Text style={styles.similarCat} numberOfLines={1}>
                    {o.category}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* 7. BOTTOM BAR */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 8) + 4 }]}>
        <Pressable style={[styles.bottomBtn, { backgroundColor: C.blue }]} onPress={handleCall} accessibilityRole="button">
          <MI name="call" size={20} color="#fff" />
          <Text style={styles.bottomText}>Call now</Text>
        </Pressable>
        <Pressable style={[styles.bottomBtn, { backgroundColor: C.pink }]} onPress={openEnquiry} accessibilityRole="button">
          <MI name="chat-bubble" size={18} color="#fff" />
          <Text style={styles.bottomText}>Enquire now</Text>
        </Pressable>
        <Pressable style={[styles.bottomBtn, { backgroundColor: C.greenBright }]} onPress={handleWhatsApp} accessibilityRole="button">
          <MaterialCommunityIcons name="whatsapp" size={21} color="#fff" />
          <Text style={styles.bottomText}>WhatsApp</Text>
        </Pressable>
      </View>

      {/* 3-DOT MENU */}
      {menuOpen && (
        <>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuOpen(false)} />
          <View style={[styles.menuPopup, { top: topPad + 52 }]}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                onToggleSave(item.id);
                setMenuOpen(false);
              }}
            >
              <MI name={isSaved ? "favorite" : "favorite-border"} size={21} color={C.pink} />
              <Text style={styles.menuText}>{isSaved ? "Saved" : "Save business"}</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                openReview(5);
              }}
            >
              <MI name="rate-review" size={21} color={C.orange} />
              <Text style={styles.menuText}>Write a review</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                handleDirections();
              }}
            >
              <MI name="near-me" size={21} color={C.blue} />
              <Text style={styles.menuText}>Get directions</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* FULL-SCREEN PHOTO VIEWER */}
      <Modal visible={viewerIdx !== null} transparent animationType="fade" onRequestClose={() => setViewerIdx(null)}>
        <View style={styles.viewerBackdrop}>
          <Pressable
            style={[styles.viewerClose, { top: Math.max(insets.top, 16) + 8 }]}
            onPress={() => setViewerIdx(null)}
            accessibilityRole="button"
            accessibilityLabel="Close photo"
          >
            <MI name="close" size={30} color="#fff" />
          </Pressable>
          {viewerIdx !== null && (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentOffset={{ x: viewerIdx * screenW, y: 0 }}
              onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
                setViewerIdx(Math.round(e.nativeEvent.contentOffset.x / screenW))
              }
            >
              {viewerList.map((p, i) => (
                <View key={`${p}-${i}`} style={{ width: screenW, justifyContent: "center" }}>
                  <SafeImage uri={p} mode="contain" style={{ width: screenW, height: screenW * 1.35 }} />
                </View>
              ))}
            </ScrollView>
          )}
          {viewerIdx !== null && (
            <Text style={styles.viewerCounter}>
              {viewerIdx + 1} / {viewerList.length}
            </Text>
          )}
        </View>
      </Modal>

      {/* WRITE REVIEW MODAL */}
      <Modal
        visible={writeReviewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWriteReviewVisible(false)}
      >
        <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.reviewModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rate & review</Text>
              <Pressable onPress={() => setWriteReviewVisible(false)} hitSlop={8}>
                <MI name="close" size={24} color={C.muted} />
              </Pressable>
            </View>
            <Text style={styles.modalBusiness}>{item.name}</Text>
            <View style={styles.starPicker}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Pressable key={s} onPress={() => setNewRating(s)} hitSlop={4}>
                  <MI name={s <= newRating ? "star" : "star-border"} size={38} color={C.gold} />
                </Pressable>
              ))}
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Your name"
              placeholderTextColor="#9AA1AA"
              value={newReviewAuthor}
              onChangeText={setNewReviewAuthor}
            />
            <TextInput
              style={[styles.textInput, styles.commentInput]}
              placeholder="Share details of your experience..."
              placeholderTextColor="#9AA1AA"
              multiline
              value={newReviewComment}
              onChangeText={setNewReviewComment}
            />
            <Pressable style={styles.submitBtn} onPress={submitReview}>
              <Text style={styles.submitText}>Submit review</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ENQUIRY */}
      <EnquiryModal
        business={enquiryBusiness}
        visible={!!enquiryBusiness}
        onClose={() => setEnquiryBusiness(null)}
      />
    </View>
  );
}

/* -------------------------------- styles --------------------------------- */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.white },
  fill: { width: "100%", height: "100%" },
  imagePlaceholder: { backgroundColor: "#EEF1F4", alignItems: "center", justifyContent: "center" },

  /* top bar */
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingBottom: 4,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  topBarCompact: { borderBottomColor: C.line },
  topBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  compactTitle: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 4 },
  compactImg: { width: 38, height: 38, borderRadius: 10, overflow: "hidden" },
  compactNameRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  compactName: { flexShrink: 1, color: C.ink, fontSize: 16, fontWeight: "800" },
  compactSub: { color: C.muted, fontSize: 12, marginTop: 1 },
  menuPopup: {
    position: "absolute",
    right: 12,
    minWidth: 190,
    backgroundColor: C.white,
    borderRadius: 12,
    paddingVertical: 6,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 13 },
  menuText: { fontSize: 14.5, color: C.ink, fontWeight: "500" },

  /* identity */
  identity: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 6, backgroundColor: C.white },
  identityTop: { flexDirection: "row", gap: 14 },
  logoBox: {
    width: 84,
    height: 84,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#EEF1F4",
    borderWidth: 1,
    borderColor: C.line,
  },
  identityMain: { flex: 1, justifyContent: "center" },
  nameLine: { flexDirection: "row", alignItems: "center", gap: 8 },
  trustBadge: { width: 26, height: 26, borderRadius: 7, backgroundColor: C.ink, alignItems: "center", justifyContent: "center" },
  businessName: { flexShrink: 1, fontSize: 25, lineHeight: 31, fontWeight: "800", color: C.ink, letterSpacing: -0.3 },
  ratingLine: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 10 },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: C.greenBright,
  },
  ratingBadgeText: { color: "#fff", fontSize: 17, fontWeight: "800" },
  ratingCount: { color: C.muted, fontSize: 16 },
  categoryText: { color: C.text, fontSize: 13.5, marginTop: 6 },

  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  tag: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 14 },
  tagText: { fontSize: 12, fontWeight: "700" },

  metaLine: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10, flexWrap: "wrap" },
  metaText: { color: C.text, fontSize: 15.5, flexShrink: 1 },
  metaDot: { color: "#A8AEB6", fontSize: 13 },
  openLine: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 10 },
  openStatus: { fontSize: 15.5, fontWeight: "600", flexShrink: 1 },
  openTimings: { color: C.text, fontWeight: "400" },
  hoursPanel: { marginTop: 10, padding: 12, backgroundColor: C.page, borderRadius: 10 },
  hourRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  hourRowLg: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },
  hourDay: { color: C.text, fontSize: 14 },
  hourTime: { fontSize: 14, fontWeight: "700" },

  /* quick actions */
  quickRow: { paddingHorizontal: 12, paddingTop: 14, paddingBottom: 18, gap: 8 },
  quickAction: { width: 90, alignItems: "center", gap: 8 },
  quickBox: { width: 68, height: 68, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  quickLabel: { color: C.ink, fontSize: 14, fontWeight: "500", textAlign: "center" },
  askBox: { backgroundColor: C.white, borderWidth: 2.5, borderTopColor: C.blue, borderRightColor: C.pink, borderBottomColor: C.orange, borderLeftColor: C.purple },
  fastBadge: {
    position: "absolute",
    top: -9,
    right: -8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: C.orange,
  },
  fastText: { color: "#fff", fontSize: 9, fontWeight: "900" },

  /* gallery */
  galleryWrap: { flexDirection: "row", height: 260, paddingHorizontal: 12, gap: 8, marginBottom: 14 },
  galleryMain: { flex: 1, borderRadius: 14, overflow: "hidden", backgroundColor: "#EEF1F4" },
  gallerySide: { flex: 1, gap: 8 },
  sideTile: { flex: 1, borderRadius: 14, overflow: "hidden", backgroundColor: "#EEF1F4" },
  pill: {
    position: "absolute",
    left: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.62)",
  },
  pillText: { color: "#fff", fontSize: 12.5, fontWeight: "600" },
  playOverlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },

  /* tabs */
  tabsContainer: { backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.line },
  tabsRow: { paddingHorizontal: 14, gap: 28 },
  tabItem: { minHeight: 58, justifyContent: "center", alignItems: "center", paddingHorizontal: 2 },
  tabText: { color: C.muted, fontSize: 17.5, fontWeight: "400" },
  tabTextActive: { color: C.ink, fontWeight: "600" },
  tabUnderline: { position: "absolute", bottom: 0, height: 3, left: 0, right: 0, borderRadius: 3, backgroundColor: C.ink },

  /* overview */
  tabContent: { backgroundColor: C.page },
  recommendCard: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 24, backgroundColor: C.white },
  recommendTitle: { color: C.ink, fontSize: 21, fontWeight: "500", marginBottom: 16 },
  recommendRow: { flexDirection: "row", gap: 12 },
  recommendBtn: {
    paddingHorizontal: 24,
    height: 46,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#CBD2DA",
    alignItems: "center",
    justifyContent: "center",
  },
  recommendBtnActive: { backgroundColor: C.ink, borderColor: C.ink },
  recommendText: { color: C.ink, fontSize: 16, fontWeight: "600" },
  recommendTextActive: { color: "#fff" },
  recommendThanks: { color: C.green, fontSize: 13, marginTop: 12 },
  summaryCard: { margin: 12, padding: 18, borderRadius: 16, backgroundColor: "#EEF3F7" },
  summaryTitle: { color: C.ink, fontSize: 21, fontWeight: "500", marginBottom: 8 },
  summaryText: { color: C.text, fontSize: 15, lineHeight: 22 },
  readMore: { color: C.pink, fontSize: 14.5, fontWeight: "800", marginTop: 8 },
  founderRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 },
  founderText: { fontSize: 14, color: C.text },
  founderBold: { fontWeight: "800", color: C.pink },
  infoCard: { backgroundColor: C.white, paddingHorizontal: 18, marginTop: 4 },
  infoRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },
  infoLabel: { width: 92, color: C.ink, fontSize: 14, fontWeight: "700" },
  infoValue: { flex: 1, color: C.text, fontSize: 14 },

  /* sections */
  section: { backgroundColor: C.white, marginTop: 8, paddingHorizontal: 18, paddingVertical: 20 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  sectionTitle: { color: C.ink, fontSize: 19, fontWeight: "800" },
  viewAll: { flexDirection: "row", alignItems: "center" },
  viewAllText: { color: C.pink, fontSize: 14, fontWeight: "800" },
  serviceTiles: { flexDirection: "row", gap: 10 },
  serviceTile: { flex: 1, minHeight: 100, borderRadius: 14, padding: 12, justifyContent: "space-between" },
  serviceTileText: { color: C.ink, fontSize: 12.5, lineHeight: 16, fontWeight: "700" },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.pinkSoft,
    borderWidth: 1,
    borderColor: C.pinkLine,
  },
  chipText: { color: "#8E1048", fontSize: 13, fontWeight: "600" },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },
  bullet: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.pink },
  listText: { flex: 1, color: C.text, fontSize: 15 },
  emptyText: { color: C.muted, fontSize: 14, lineHeight: 20, paddingVertical: 14 },
  emptyBox: { alignItems: "center", gap: 8, paddingVertical: 30, backgroundColor: C.page, borderRadius: 14 },
  emptyBoxText: { color: C.muted, fontSize: 14 },

  /* location */
  locationCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 14, backgroundColor: C.page },
  locationIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: C.pinkSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  locationName: { color: C.ink, fontSize: 15, fontWeight: "800" },
  locationAddr: { color: C.text, fontSize: 13.5, lineHeight: 19, marginTop: 3 },
  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 46,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.blueLine,
    backgroundColor: C.blueSoft,
  },
  outlineBtnText: { color: C.blue, fontSize: 14.5, fontWeight: "800" },

  /* ask card */
  askCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    margin: 12,
    marginTop: 8,
    padding: 14,
    borderRadius: 16,
    backgroundColor: C.pinkSoft,
    borderWidth: 1,
    borderColor: C.pinkLine,
  },
  askIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.white, alignItems: "center", justifyContent: "center" },
  askTitle: { color: C.ink, fontSize: 15.5, fontWeight: "800" },
  askSub: { color: C.text, fontSize: 12.5, lineHeight: 17, marginTop: 2 },
  askBtn: { paddingHorizontal: 18, height: 38, borderRadius: 19, backgroundColor: C.pink, alignItems: "center", justifyContent: "center" },
  askBtnText: { color: "#fff", fontSize: 14, fontWeight: "800" },

  /* photos / videos */
  segment: { flexDirection: "row", padding: 4, borderRadius: 12, backgroundColor: C.page, marginBottom: 14 },
  segmentBtn: { flex: 1, height: 38, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  segmentBtnOn: { backgroundColor: C.white, elevation: 1, shadowColor: "#101828", shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  segmentText: { color: C.muted, fontSize: 13.5, fontWeight: "600" },
  segmentTextOn: { color: C.ink, fontWeight: "800" },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  photoCell: { width: "31.8%", aspectRatio: 1, borderRadius: 10, overflow: "hidden", backgroundColor: "#EEF1F4" },
  videoGrid: { gap: 10 },
  videoCell: { width: "100%", aspectRatio: 16 / 9, borderRadius: 14, overflow: "hidden", backgroundColor: "#1B1F24" },
  videoDim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.28)" },

  /* ratings */
  ratingSummary: { flexDirection: "row", alignItems: "center", gap: 16, paddingVertical: 8 },
  bigRatingCol: { width: 112, alignItems: "center", borderRightWidth: 1, borderRightColor: C.line, paddingRight: 12 },
  bigRating: { color: C.ink, fontSize: 38, fontWeight: "800" },
  bigRatingStar: { color: C.gold, fontSize: 28 },
  bigRatingCaption: { color: C.muted, fontSize: 12, marginTop: 2 },
  ratingBars: { flex: 1, gap: 6 },
  barRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  barStar: { color: C.text, width: 10, fontSize: 12, fontWeight: "700" },
  barTrack: { flex: 1, height: 7, borderRadius: 8, backgroundColor: "#E6E9ED", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 8 },
  barPercent: { width: 34, textAlign: "right", color: C.muted, fontSize: 11 },
  ratePrompt: { paddingVertical: 16, borderTopWidth: 1, borderTopColor: C.line, marginTop: 6 },
  ratePromptTitle: { color: C.ink, fontSize: 17, fontWeight: "800" },
  ratePromptSub: { color: C.muted, fontSize: 13, marginTop: 4 },
  rateStars: { flexDirection: "row", gap: 10, marginTop: 12 },
  allReviewsBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 12 },
  allReviewsText: { color: C.pink, fontSize: 14.5, fontWeight: "800" },

  filterRow: { gap: 8, paddingVertical: 10 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 34,
    paddingHorizontal: 13,
    borderRadius: 17,
    backgroundColor: C.page,
    borderWidth: 1,
    borderColor: C.line,
  },
  filterChipOn: { backgroundColor: C.pink, borderColor: C.pink },
  filterChipText: { color: C.text, fontSize: 12.5, fontWeight: "600" },
  filterChipTextOn: { color: "#fff", fontWeight: "800" },

  /* review cards */
  reviewCard: { borderTopWidth: 1, borderTopColor: C.line, paddingTop: 14, paddingBottom: 12 },
  reviewTop: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 17, fontWeight: "800" },
  reviewerName: { color: C.ink, fontSize: 15, fontWeight: "700" },
  reviewMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 3 },
  reviewDate: { color: C.muted, fontSize: 12 },
  smallRating: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 2,
    backgroundColor: C.greenBright,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  smallRatingText: { color: "#fff", fontSize: 12, fontWeight: "800" },
  reviewComment: { color: C.text, fontSize: 14, lineHeight: 21 },
  helpfulBtn: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", marginTop: 10 },
  helpfulText: { color: C.muted, fontSize: 13, fontWeight: "600" },

  /* similar */
  similarCard: { width: 150, padding: 8, borderWidth: 1, borderColor: C.line, borderRadius: 14, backgroundColor: C.white },
  similarImg: { width: "100%", height: 92, borderRadius: 10, marginBottom: 8, overflow: "hidden" },
  similarName: { color: C.ink, fontSize: 13, fontWeight: "700", minHeight: 34 },
  similarCat: { color: C.muted, fontSize: 11.5, marginTop: 6 },

  /* bottom bar */
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.line,
    elevation: 16,
  },
  bottomBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  bottomText: { color: "#fff", fontSize: 14, fontWeight: "800" },

  /* viewer */
  viewerBackdrop: { flex: 1, backgroundColor: "#000", justifyContent: "center" },
  viewerClose: { position: "absolute", right: 16, zIndex: 5, width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  viewerCounter: { position: "absolute", bottom: 40, alignSelf: "center", color: "#fff", fontSize: 14, fontWeight: "700" },

  /* review modal */
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.48)", justifyContent: "center", alignItems: "center", padding: 20 },
  reviewModal: { width: "100%", maxWidth: 440, backgroundColor: C.white, borderRadius: 18, padding: 20 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  modalTitle: { color: C.ink, fontSize: 19, fontWeight: "800" },
  modalBusiness: { color: C.muted, fontSize: 13.5, marginTop: 4 },
  starPicker: { flexDirection: "row", justifyContent: "center", gap: 8, marginVertical: 16 },
  textInput: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: C.ink,
    fontSize: 14.5,
    marginBottom: 10,
    backgroundColor: "#FAFBFC",
  },
  commentInput: { minHeight: 100, paddingTop: 12, textAlignVertical: "top" },
  submitBtn: { height: 48, borderRadius: 12, backgroundColor: C.pink, alignItems: "center", justifyContent: "center" },
  submitText: { color: "#fff", fontSize: 15.5, fontWeight: "800" },

  /* not found */
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: C.white, padding: 24 },
  notFoundTitle: { color: C.ink, fontSize: 18, fontWeight: "800", marginTop: 6 },
  notFoundSub: { color: C.muted, fontSize: 14 },
  notFoundBtn: { marginTop: 14, paddingHorizontal: 22, height: 44, borderRadius: 22, backgroundColor: C.pink, alignItems: "center", justifyContent: "center" },
  notFoundBtnText: { color: "#fff", fontSize: 14.5, fontWeight: "800" },
});