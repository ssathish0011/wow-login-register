import React, { useState } from "react";
import {
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
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

export interface AdItem {
    id: string;
    businessName: string;
    tagline: string;
    offer?: string; // e.g. "20% OFF"
    buttonLabel?: string;
    imageUrl: string;
}

interface AdvertisementSectionProps {
    ads?: AdItem[];
    onAdPress?: (ad: AdItem) => void;
    onAdvertisePress?: () => void;
}

// ======================================
// SAMPLE ADS
// Replace with your own sponsored businesses
// ======================================

const SAMPLE_ADS: AdItem[] = [
    {
        id: "ad1",
        businessName: "Glow Beauty Studio",
        tagline: "Bridal makeup, facials and hair care",
        offer: "20% OFF",
        buttonLabel: "Book Now",
        imageUrl:
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&h=500&q=80",
    },
    {
        id: "ad2",
        businessName: "Amma's Kitchen",
        tagline: "Fresh homemade meals delivered daily",
        offer: "Free Delivery",
        buttonLabel: "Order Now",
        imageUrl:
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&h=500&q=80",
    },
    {
        id: "ad3",
        businessName: "Kanchi Silks & Sarees",
        tagline: "Handpicked silks for every occasion",
        offer: "New Arrivals",
        buttonLabel: "Shop Now",
        imageUrl:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&h=500&q=80",
    },
];

// ======================================
// SIZE CONFIGURATION
// ======================================

const SIDE_PADDING = 15;
const CARD_GAP = 15;
const PEEK = 16; // how much of the next card shows
const CARD_HEIGHT = 178;
const CARD_RADIUS = 20;

export default function HomeAddSection({
    ads = SAMPLE_ADS,
    onAdPress,
    onAdvertisePress,
}: AdvertisementSectionProps) {
    const { width } = useWindowDimensions();
    const [activeIndex, setActiveIndex] = useState(0);

    const cardWidth = width - SIDE_PADDING * 2 - PEEK;
    const snap = cardWidth + CARD_GAP;

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / snap);
        const clamped = Math.max(0, Math.min(ads.length - 1, index));
        if (clamped !== activeIndex) setActiveIndex(clamped);
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.title}>Special Offers</Text>
                    <Text style={styles.subtitle}>Sponsored by women-led businesses</Text>
                </View>
            </View>

            {/* AD CARDS */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={snap}
                snapToAlignment="start"
                decelerationRate="fast"
                disableIntervalMomentum
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={styles.cardsRow}
            >
                {ads.map((ad) => (
                    <Pressable
                        key={ad.id}
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
                                <Text style={styles.adTagText}>AD</Text>
                            </View>

                            {/* Offer pill (top right) */}
                            {ad.offer ? (
                                <View style={styles.offerPill}>
                                    <Ionicons name="pricetag" size={11} color="#FFFFFF" />
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
                                    <Text style={styles.ctaText}>
                                        {ad.buttonLabel ?? "Visit"}
                                    </Text>
                                    <Ionicons
                                        name="arrow-forward"
                                        size={13}
                                        color={COLORS.brand}
                                    />
                                </View>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>

            {/* DOTS */}
            {ads.length > 1 && (
                <View style={styles.dots} pointerEvents="none">
                    {ads.map((ad, index) => (
                        <View
                            key={ad.id}
                            style={[styles.dot, index === activeIndex && styles.dotActive]}
                        />
                    ))}
                </View>
            )}

            {/* ADVERTISE WITH US STRIP */}
            <Pressable
                onPress={onAdvertisePress}
                style={({ pressed }) => [styles.strip, pressed && styles.stripPressed]}
                accessibilityRole="button"
                accessibilityLabel="Advertise your business with us"
            >
                <View style={styles.stripIcon}>
                    <Ionicons name="megaphone" size={18} color="#FFFFFF" />
                </View>

                <View style={styles.stripText}>
                    <Text style={styles.stripTitle}>Want your business here?</Text>
                    <Text style={styles.stripSubtitle}>
                        Reach more customers across Tamil Nadu
                    </Text>
                </View>

                <View style={styles.stripArrow}>
                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={COLORS.brand}
                        style={styles.stripArrowIcon}
                    />
                </View>
            </Pressable>
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

    subtitle: {
        fontSize: 11,
        fontWeight: "500",
        color: "#88818A",
        marginTop: 1,
    },

    // Extra vertical padding so shadows are not clipped by the ScrollView
    cardsRow: {
        paddingHorizontal: SIDE_PADDING,
        paddingTop: 12,
        paddingBottom: 16,
        gap: CARD_GAP,
    },

    // Outer view carries the shadow; inner card clips the rounded corners
    cardShadow: {
        height: CARD_HEIGHT,
        borderRadius: CARD_RADIUS,
        backgroundColor: "#FFFFFF",
        shadowColor: "#211921",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 14,
        elevation: 6,
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
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
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
        backgroundColor: "rgba(20, 12, 20, 0.2)",
    },

    adTag: {
        position: "absolute",
        top: 12,
        left: 12,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        backgroundColor: "rgba(255,255,255,0.92)",
    },

    adTagText: {
        fontSize: 9.5,
        fontWeight: "800",
        letterSpacing: 0.8,
        color: "#5B535F",
    },

    offerPill: {
        position: "absolute",
        top: 12,
        right: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        backgroundColor: COLORS.brand,
    },

    offerText: {
        fontSize: 11,
        fontWeight: "800",
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
        fontSize: 18,
        lineHeight: 23,
        fontWeight: "700",
        fontFamily: "Georgia",
        color: "#FFFFFF",
        letterSpacing: -0.3,
    },

    tagline: {
        fontSize: 11.5,
        color: "rgba(255,255,255,0.9)",
        marginTop: 2,
    },

    ctaButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: "#FFFFFF",
    },

    ctaText: {
        fontSize: 11.5,
        fontWeight: "700",
        color: COLORS.brand,
    },

    dots: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },

    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#E4D3DB",
        marginHorizontal: 3,
    },

    dotActive: {
        width: 20,
        backgroundColor: COLORS.brand,
    },

    strip: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: SIDE_PADDING,
        padding: 12,
        borderRadius: 18,
        backgroundColor: "#FFF2F8",
        borderWidth: 1,
        borderColor: "#F6CFDF",
    },

    stripPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },

    stripIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: COLORS.brand,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    stripText: {
        flex: 1,
        marginRight: 10,
    },

    stripTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#211921",
    },

    stripSubtitle: {
        fontSize: 11,
        color: "#6B6470",
        marginTop: 1,
    },

    stripArrow: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },

    stripArrowIcon: {
        marginLeft: 2,
    },
});