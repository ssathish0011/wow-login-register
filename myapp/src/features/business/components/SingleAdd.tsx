import React from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/theme/colors";

// ======================================
// TYPES
// ======================================

export interface BannerAd {
    id: string;
    businessName: string;
    tagline: string;
    offer?: string; // e.g. "20% OFF"
    buttonLabel?: string;
    imageUrl: string;
}

interface SingleAdBannerProps {
    ad?: BannerAd;
    title?: string;
    showAdvertiseStrip?: boolean;
    onAdPress?: (ad: BannerAd) => void;
    onAdvertisePress?: () => void;
}

// ======================================
// SAMPLE AD
// Replace with your own sponsored business
// ======================================

const SAMPLE_AD: BannerAd = {
    id: "ad1",
    businessName: "Glow Beauty Studio",
    tagline: "Bridal makeup, facials and hair care",
    offer: "20% OFF",
    buttonLabel: "Book Now",
    imageUrl:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&h=500&q=80",
};

// ======================================
// SIZE CONFIGURATION
// ======================================

const SIDE_PADDING = 15;
const CARD_HEIGHT = 180;
const CARD_RADIUS = 20;
const CTA_HEIGHT = 34;
const STRIP_ICON_SIZE = 40;

export default function SingleAdBanner({
    ad = SAMPLE_AD,
    title = "Special Offer",
    showAdvertiseStrip = true,
    onAdPress,
    onAdvertisePress,
}: SingleAdBannerProps) {
    const { width } = useWindowDimensions();
    const cardWidth = width - SIDE_PADDING * 2;

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>{title}</Text>
            </View>

            {/* AD BANNER */}
            <View style={styles.cardArea}>
                <Pressable
                    style={({ pressed }) => [
                        styles.cardShadow,
                        { width: cardWidth },
                        pressed && styles.cardPressed,
                    ]}
                    onPress={() => onAdPress?.(ad)}
                    accessibilityRole="button"
                    accessibilityLabel={`${ad.businessName}. ${ad.tagline}`}
                >
                    <View style={styles.card}>
                        <Image
                            source={{ uri: ad.imageUrl }}
                            style={styles.image}
                            resizeMode="cover"
                        />

                        {/* Layered bottom overlay (fake gradient, no extra library) */}
                        <View pointerEvents="none" style={styles.overlay}>
                            <View style={[styles.overlayLayer, { height: 130 }]} />
                            <View style={[styles.overlayLayer, { height: 96 }]} />
                            <View style={[styles.overlayLayer, { height: 64 }]} />
                            <View style={[styles.overlayLayer, { height: 34 }]} />
                        </View>

                        {/* AD tag (top left) */}
                        <View style={styles.adTag}>
                            <Text style={styles.adTagText}>Ad</Text>
                        </View>

                        {/* Offer pill (top right) */}
                        {ad.offer ? (
                            <View style={styles.offerPill}>
                                <Ionicons name="pricetag-outline" size={13} color="#FFFFFF" />
                                <Text style={styles.offerText}>{ad.offer}</Text>
                            </View>
                        ) : null}

                        {/* Bottom content */}
                        <View style={styles.cardContent}>
                            <View style={styles.cardTextWrap}>
                                <Text style={styles.businessName} numberOfLines={1}>
                                    {ad.businessName}
                                </Text>
                                <Text style={styles.tagline} numberOfLines={1}>
                                    {ad.tagline}
                                </Text>
                            </View>

                            <View style={styles.ctaButton}>
                                <Text style={styles.ctaText}>{ad.buttonLabel ?? "Visit"}</Text>
                                <Ionicons name="arrow-forward" size={14} color={COLORS.brand} />
                            </View>
                        </View>
                    </View>
                </Pressable>
            </View>

            {/* ADVERTISE WITH US STRIP */}
            {showAdvertiseStrip && (
                <Pressable
                    onPress={onAdvertisePress}
                    style={({ pressed }) => [styles.strip, pressed && styles.stripPressed]}
                    accessibilityRole="button"
                    accessibilityLabel="Advertise your business with us"
                >
                    <View style={styles.stripIcon}>
                        <Ionicons name="megaphone-outline" size={20} color="#FFFFFF" />
                    </View>

                    <View style={styles.stripText}>
                        <Text style={styles.stripTitle}>Want your business here?</Text>
                        <Text style={styles.stripSubtitle}>
                            Reach more customers across Tamil Nadu
                        </Text>
                    </View>

                    <Ionicons name="chevron-forward" size={24} color={COLORS.brand} />
                </Pressable>
            )}
        </View>
    );
}

// ======================================
// STYLES
// ======================================

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        marginBottom: 12,
    },
    headerRow: {
        paddingHorizontal: SIDE_PADDING,
        marginBottom: 4,
    },
    title: {
        fontSize: 20,
        lineHeight: 26,
        fontWeight: "700",
        fontFamily: "Georgia",
        color: "#211921",
        letterSpacing: -0.4,
    },

    // Extra vertical padding so the shadow is not clipped
    cardArea: {
        alignItems: "center",
        paddingTop: 12,
        paddingBottom: 16,
    },
    cardShadow: {
        height: CARD_HEIGHT,
        borderRadius: CARD_RADIUS,
        backgroundColor: "#FFFFFF",
        shadowColor: "#211921",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 5,
    },
    cardPressed: {
        opacity: 0.93,
        transform: [{ scale: 0.98 }],
    },
    card: {
        flex: 1,
        borderRadius: CARD_RADIUS,
        overflow: "hidden",
        backgroundColor: "#F3DCE5",
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: "100%",
        height: "100%",
    },
    overlay: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 130,
    },
    overlayLayer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(20, 12, 20, 0.22)",
    },
    adTag: {
        position: "absolute",
        top: 12,
        left: 12,
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: "rgba(255,255,255,0.92)",
    },
    adTagText: {
        fontSize: 11,
        lineHeight: 14,
        fontWeight: "700",
        color: "#5B535F",
    },
    offerPill: {
        position: "absolute",
        top: 12,
        right: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 11,
        paddingVertical: 5,
        borderRadius: 999,
        backgroundColor: COLORS.brand,
    },
    offerText: {
        fontSize: 12,
        lineHeight: 15,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    cardContent: {
        position: "absolute",
        left: 14,
        right: 14,
        bottom: 14,
        flexDirection: "row",
        alignItems: "flex-end",
    },
    cardTextWrap: {
        flex: 1,
        marginRight: 10,
    },
    businessName: {
        fontSize: 19,
        lineHeight: 24,
        fontWeight: "700",
        fontFamily: "Georgia",
        color: "#FFFFFF",
        letterSpacing: -0.3,
    },
    tagline: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: "500",
        color: "rgba(255,255,255,0.92)",
        marginTop: 2,
    },
    ctaButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        height: CTA_HEIGHT,
        paddingHorizontal: 14,
        borderRadius: 999,
        backgroundColor: "#FFFFFF",
    },
    ctaText: {
        fontSize: 12.5,
        fontWeight: "700",
        color: COLORS.brand,
    },

    strip: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: SIDE_PADDING,
        padding: 12,
        borderRadius: 18,
        backgroundColor: "#FFF6F9",
        borderWidth: 1,
        borderColor: "#F8D4E2",
    },
    stripPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    stripIcon: {
        width: STRIP_ICON_SIZE,
        height: STRIP_ICON_SIZE,
        borderRadius: STRIP_ICON_SIZE / 2,
        backgroundColor: COLORS.brand,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    stripText: {
        flex: 1,
        marginRight: 8,
    },
    stripTitle: {
        fontSize: 14,
        lineHeight: 19,
        fontWeight: "700",
        color: "#211921",
    },
    stripSubtitle: {
        fontSize: 12,
        lineHeight: 16,
        color: "#6B6470",
        marginTop: 1,
    },
});