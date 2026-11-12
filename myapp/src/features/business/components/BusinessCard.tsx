// Business listing card for WOW (Women of Wisdom) Directory
//
// Design logic
// - ONE brand colour (WOW pink) for the primary action + save + chips -> clear hierarchy
// - Semantic colours only where they carry meaning:
//     green = good rating / open / WhatsApp, red = closed, blue = verified
// - Photo is a fixed 108x128 (cover) with overlays: Featured badge (top-left), heart (top-right)
// - Verified tick sits at the END of the name and never gets pushed out by long names
// - Actions: two soft/tinted buttons (Call, WhatsApp) + one solid brand button (Enquire)

import React, { memo, useEffect, useState } from "react";
import { Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/common/constants/colors";
import { BusinessListingItem } from "../types/business.types";

interface BusinessCardProps {
  business: BusinessListingItem;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenEnquiry: (business: BusinessListingItem) => void;
  onPressCard: (business: BusinessListingItem) => void;
}

type MIName = React.ComponentProps<typeof MaterialIcons>["name"];

const PINK = WOW_COLORS?.primaryPink ?? "#D91B68";

const C = {
  pink: PINK,
  pinkSoft: "#FDECF3",
  pinkLine: "#F8CBDD",

  blue: "#1677D2",
  blueSoft: "#E8F2FC",

  green: "#14804A",
  greenSoft: "#E6F5EC",
  greenBright: "#1FA463",

  amber: "#B26A00",
  amberSoft: "#FFF3DC",

  red: "#C62828",
  redSoft: "#FDECEC",

  ink: "#14171C",
  text: "#3D444D",
  muted: "#78808A",
  line: "#ECEEF1",
  surface: "#FFFFFF",
  surfaceAlt: "#F6F7F9",
};

const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);

// Rating colour follows quality: 4+ green, 3+ amber, below that red
const ratingTone = (r: number) => {
  if (r >= 4) return { bg: C.greenBright, fg: "#fff" };
  if (r >= 3) return { bg: "#F5A623", fg: "#fff" };
  return { bg: C.red, fg: "#fff" };
};

/* ---------- small building blocks ---------- */

function Thumb({ uri }: { uri?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [uri]);

  if (!uri || failed) {
    return (
      <View style={[styles.fill, styles.placeholder]}>
        <MaterialIcons name="storefront" size={30} color="#C3C9D0" />
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      style={styles.fill}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}

function InfoRow({
  icon,
  color = C.muted,
  children,
}: {
  icon: MIName;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.infoRow}>
      <MaterialIcons name={icon} size={15} color={color} />
      {children}
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  a11y,
  style,
  textStyle,
  icon,
}: {
  label: string;
  onPress: () => void;
  a11y: string;
  style: object;
  textStyle: object;
  icon: React.ReactNode;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.btn, style, pressed && styles.btnPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
    >
      {icon}
      <Text style={textStyle} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------- main card ---------- */

function BusinessCard({
  business,
  isSaved,
  onToggleSave,
  onOpenEnquiry,
  onPressCard,
}: BusinessCardProps) {
  const handleCall = () => {
    const n = String(business.phone || "").replace(/[^0-9+]/g, "");
    if (n) Linking.openURL(`tel:${n}`).catch(() => { });
  };

  const handleWhatsApp = () => {
    const n = String(business.whatsapp || business.phone || "").replace(/[^0-9]/g, "");
    if (!n) return;
    const msg = encodeURIComponent(
      `Hello ${business.name}, I found your business on WOW (Women of Wisdom) Directory and would like to enquire.`
    );
    Linking.openURL(`https://wa.me/${n}?text=${msg}`).catch(() => { });
  };

  const rating = Number(business.rating || 0);
  const reviews = Number(business.reviewsCount || 0);
  const tone = ratingTone(rating);
  const specs = (business.specialities || []).slice(0, 3);
  const open = !!business.isOpen;

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => onPressCard(business)}
        style={({ pressed }) => [styles.topRow, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`View ${business.name}`}
      >
        {/* PHOTO */}
        <View style={styles.imageCol}>
          <Thumb uri={business.imageUrl} />

          {business.isFeatured && (
            <View style={styles.featuredBadge}>
              <MaterialIcons name="local-fire-department" size={12} color="#fff" />
              <Text style={styles.featuredText}>Trending</Text>
            </View>
          )}

          <Pressable
            style={[styles.heartBtn, isSaved && styles.heartBtnActive]}
            onPress={() => onToggleSave(business.id)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={isSaved ? "Remove from saved" : "Save business"}
          >
            <MaterialIcons
              name={isSaved ? "favorite" : "favorite-border"}
              size={16}
              color={isSaved ? C.pink : "#fff"}
            />
          </Pressable>
        </View>

        {/* DETAILS */}
        <View style={styles.details}>
          {/* Name + verified tick at the end */}
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {business.name}
            </Text>
            {business.isVerified && (
              <MaterialIcons name="verified" size={17} color={C.blue} style={styles.tick} />
            )}
          </View>

          {/* Rating + category */}
          <View style={styles.ratingRow}>
            {reviews > 0 ? (
              <>
                <View style={[styles.ratingBadge, { backgroundColor: tone.bg }]}>
                  <Text style={[styles.ratingText, { color: tone.fg }]}>{rating.toFixed(1)}</Text>
                  <MaterialIcons name="star" size={11} color={tone.fg} />
                </View>
                <Text style={styles.ratingCount}>{formatCount(reviews)} ratings</Text>
              </>
            ) : (
              <View style={styles.newBadge}>
                <Text style={styles.newText}>New</Text>
              </View>
            )}
          </View>

          <InfoRow icon="storefront">
            <Text style={styles.infoText} numberOfLines={1}>
              {business.category}
              {business.subCategory ? `  ›  ${business.subCategory}` : ""}
            </Text>
          </InfoRow>

          <InfoRow icon="place">
            <Text style={styles.infoText} numberOfLines={1}>
              {business.location}
            </Text>
            {!!business.distance && (
              <View style={styles.distancePill}>
                <Text style={styles.distanceText}>{business.distance}</Text>
              </View>
            )}
          </InfoRow>

          <InfoRow icon="schedule" color={open ? C.green : C.red}>
            <Text style={[styles.statusText, { color: open ? C.green : C.red }]}>
              {open ? "Open now" : "Closed"}
            </Text>
            <Text style={styles.timings} numberOfLines={1}>
              {business.timings || "10:00 AM – 8:00 PM"}
            </Text>
          </InfoRow>
        </View>
      </Pressable>

      {/* SPECIALITY CHIPS */}
      {specs.length > 0 && (
        <View style={styles.chips}>
          {specs.map((s, i) => (
            <View key={`${s}-${i}`} style={styles.chip}>
              <MaterialIcons name="check" size={12} color={C.pink} />
              <Text style={styles.chipText} numberOfLines={1}>
                {s}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* ACTIONS */}
      <View style={styles.actionBar}>
        <ActionButton
          label="Call"
          onPress={handleCall}
          a11y={`Call ${business.name}`}
          style={styles.callBtn}
          textStyle={styles.callText}
          icon={<MaterialIcons name="call" size={17} color={C.blue} />}
        />
        <ActionButton
          label="WhatsApp"
          onPress={handleWhatsApp}
          a11y={`WhatsApp ${business.name}`}
          style={styles.waBtn}
          textStyle={styles.waText}
          icon={<MaterialCommunityIcons name="whatsapp" size={19} color={C.green} />}
        />
        <ActionButton
          label="Enquire"
          onPress={() => onOpenEnquiry(business)}
          a11y={`Enquire with ${business.name}`}
          style={styles.enquireBtn}
          textStyle={styles.enquireText}
          icon={<MaterialIcons name="chat-bubble" size={16} color="#fff" />}
        />
      </View>
    </View>
  );
}

export default memo(BusinessCard);

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.line,
    marginHorizontal: 14,
    marginBottom: 14,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#101828",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },
  pressed: { backgroundColor: "#FAFAFB" },
  fill: { width: "100%", height: "100%" },
  placeholder: { backgroundColor: C.surfaceAlt, alignItems: "center", justifyContent: "center" },

  /* top section */
  topRow: { flexDirection: "row", padding: 12, gap: 12 },

  imageCol: {
    width: 108,
    height: 128,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: C.surfaceAlt,
  },
  featuredBadge: {
    position: "absolute",
    left: 0,
    top: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingLeft: 6,
    paddingRight: 8,
    paddingVertical: 3,
    backgroundColor: C.pink,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  featuredText: { color: "#fff", fontSize: 10.5, fontWeight: "800" },
  heartBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.38)",
    alignItems: "center",
    justifyContent: "center",
  },
  heartBtnActive: { backgroundColor: "#fff" },

  /* details */
  details: { flex: 1, justifyContent: "space-between", gap: 4 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  name: { flexShrink: 1, fontSize: 17, fontWeight: "800", color: C.ink, letterSpacing: -0.2 },
  tick: { marginLeft: 4, flexShrink: 0 },

  ratingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  ratingText: { fontSize: 13, fontWeight: "800" },
  ratingCount: { color: C.muted, fontSize: 12.5 },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    backgroundColor: C.blueSoft,
  },
  newText: { color: C.blue, fontSize: 12, fontWeight: "800" },

  infoRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  infoText: { color: C.text, fontSize: 12.5, flexShrink: 1 },
  distancePill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 5,
    backgroundColor: C.surfaceAlt,
  },
  distanceText: { color: C.muted, fontSize: 11, fontWeight: "700" },
  statusText: { fontSize: 12.5, fontWeight: "800" },
  timings: { color: C.text, fontSize: 12.5, flexShrink: 1 },

  /* chips */
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: C.pinkSoft,
    borderWidth: 1,
    borderColor: C.pinkLine,
    maxWidth: "100%",
  },
  chipText: { color: "#8E1048", fontSize: 11.5, fontWeight: "600", flexShrink: 1 },

  /* actions */
  actionBar: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: C.line,
    backgroundColor: "#FCFCFD",
  },
  btn: {
    flex: 1,
    minWidth: 0,
    height: 44,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  btnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },

  callBtn: { backgroundColor: C.blueSoft },
  callText: { color: C.blue, fontSize: 13, fontWeight: "800" },

  waBtn: { backgroundColor: C.greenSoft },
  waText: { color: C.green, fontSize: 13, fontWeight: "800" },

  enquireBtn: {
    backgroundColor: C.pink,
    elevation: 2,
    shadowColor: C.pink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
  },
  enquireText: { color: "#fff", fontSize: 13, fontWeight: "800" },
});