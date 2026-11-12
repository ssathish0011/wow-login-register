import React from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, WOW_COLORS } from "@/common/constants/colors";
import ScreenWrapper from "@/common/components/ScreenWrapper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCredentials, selectAuth } from "@/features/auth/slices/authSlice";
import { clearSession } from "@/utils/auth";

export default function OwnerDashboardScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  const ownerName = auth.user?.name || "Business Owner";
  const ownerEmail = auth.user?.email || "owner@wow.com";

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out from the Owner Portal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await clearSession();
          dispatch(clearCredentials());
          router.replace("/login");
        },
      },
    ]);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert("Error", `Cannot open phone dialer for ${phone}`);
    });
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const cleanNumber = phone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(`Hi ${name}, thank you for your enquiry on WOW! How can we assist you?`);
    Linking.openURL(`whatsapp://send?phone=${cleanNumber}&text=${msg}`).catch(() => {
      Linking.openURL(`https://wa.me/${cleanNumber}?text=${msg}`).catch(() => {
        Alert.alert("Error", "WhatsApp is not installed on this device.");
      });
    });
  };

  return (
    <ScreenWrapper style={{ backgroundColor: "#F9FAFB" }}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable
            style={styles.headerBackBtn}
            onPress={() => router.push("/home")}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={22} color={WOW_COLORS.primaryText} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Owner Portal</Text>
            <Text style={styles.headerSubtitle}>Manage your listings & leads</Text>
          </View>
        </View>

        <View style={styles.ownerBadge}>
          <Ionicons name="shield-checkmark" size={14} color={WOW_COLORS.primaryPink} />
          <Text style={styles.ownerBadgeText}>OWNER</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {ownerName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{ownerName}</Text>
            <Text style={styles.profileEmail}>{ownerEmail}</Text>
            <View style={styles.verifiedRow}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.verifiedText}>Verified Business Partner</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Overview & Analytics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: "#FFE4EE" }]}>
              <Ionicons name="chatbubbles" size={20} color={WOW_COLORS.primaryPink} />
            </View>
            <Text style={styles.statValue}>48</Text>
            <Text style={styles.statLabel}>Total Enquiries</Text>
            <Text style={styles.statTrend}>+12% this week</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: "#E0F2FE" }]}>
              <Ionicons name="eye" size={20} color="#0284C7" />
            </View>
            <Text style={styles.statValue}>2,840</Text>
            <Text style={styles.statLabel}>Profile Views</Text>
            <Text style={styles.statTrend}>+24% this month</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="star" size={20} color="#D97706" />
            </View>
            <Text style={styles.statValue}>4.8 ★</Text>
            <Text style={styles.statLabel}>Average Rating</Text>
            <Text style={styles.statTrend}>326 reviews</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="storefront" size={20} color="#16A34A" />
            </View>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Active Listings</Text>
            <Text style={[styles.statTrend, { color: "#16A34A" }]}>Both Live</Text>
          </View>
        </View>

        {/* My Listings */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>My Businesses</Text>
          <Pressable
            onPress={() => Alert.alert("Add Listing", "Add Business flow for owners")}
          >
            <Text style={styles.sectionActionText}>+ Add New</Text>
          </Pressable>
        </View>

        <View style={styles.bizCard}>
          <View style={styles.bizHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.bizNameRow}>
                <Text style={styles.bizName}>Aura Beauty Studio</Text>
                <Ionicons name="checkmark-circle" size={16} color="#3B82F6" />
              </View>
              <Text style={styles.bizCategory}>Beauty & Wellness • Anna Nagar</Text>
            </View>
            <View style={styles.openPill}>
              <Text style={styles.openPillText}>OPEN</Text>
            </View>
          </View>

          <View style={styles.bizDivider} />

          <View style={styles.bizFooter}>
            <Pressable
              style={styles.bizBtnSecondary}
              onPress={() => router.push("/business/1" as any)}
            >
              <Ionicons name="eye-outline" size={16} color={WOW_COLORS.primaryPink} />
              <Text style={styles.bizBtnSecondaryText}>View on App</Text>
            </Pressable>

            <Pressable
              style={styles.bizBtnPrimary}
              onPress={() => Alert.alert("Edit Business", "Update photos, timings, and services")}
            >
              <Ionicons name="create-outline" size={16} color="#FFFFFF" />
              <Text style={styles.bizBtnPrimaryText}>Edit Listing</Text>
            </Pressable>
          </View>
        </View>

        {/* Recent Enquiries */}
        <Text style={styles.sectionTitle}>Recent Customer Leads</Text>
        <View style={styles.leadCard}>
          <View style={styles.leadTop}>
            <View>
              <Text style={styles.leadName}>Kavitha R.</Text>
              <Text style={styles.leadService}>Bridal Makeup & Hair Styling</Text>
            </View>
            <Text style={styles.leadTime}>10 min ago</Text>
          </View>
          <Text style={styles.leadMessage}>
            "Looking for bridal package on Dec 18th in Anna Nagar. Please share price quote."
          </Text>
          <View style={styles.leadActions}>
            <Pressable
              style={[styles.leadBtn, styles.leadBtnCall]}
              onPress={() => handleCall("+919876543210")}
            >
              <Ionicons name="call" size={14} color="#16A34A" />
              <Text style={styles.leadBtnCallText}>Call Lead</Text>
            </Pressable>
            <Pressable
              style={[styles.leadBtn, styles.leadBtnWa]}
              onPress={() => handleWhatsApp("+919876543210", "Kavitha")}
            >
              <Ionicons name="logo-whatsapp" size={14} color="#FFFFFF" />
              <Text style={styles.leadBtnWaText}>WhatsApp</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.leadCard}>
          <View style={styles.leadTop}>
            <View>
              <Text style={styles.leadName}>Sneha Narayanan</Text>
              <Text style={styles.leadService}>Hydra Facial & Skin Care</Text>
            </View>
            <Text style={styles.leadTime}>2 hours ago</Text>
          </View>
          <Text style={styles.leadMessage}>
            "Is slot available this Saturday afternoon for 2 persons?"
          </Text>
          <View style={styles.leadActions}>
            <Pressable
              style={[styles.leadBtn, styles.leadBtnCall]}
              onPress={() => handleCall("+919840123456")}
            >
              <Ionicons name="call" size={14} color="#16A34A" />
              <Text style={styles.leadBtnCallText}>Call Lead</Text>
            </Pressable>
            <Pressable
              style={[styles.leadBtn, styles.leadBtnWa]}
              onPress={() => handleWhatsApp("+919840123456", "Sneha")}
            >
              <Ionicons name="logo-whatsapp" size={14} color="#FFFFFF" />
              <Text style={styles.leadBtnWaText}>WhatsApp</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footerSection}>
          <Pressable
            style={styles.switchModeBtn}
            onPress={() => router.push("/home")}
          >
            <Ionicons name="home-outline" size={18} color={WOW_COLORS.primaryPink} />
            <Text style={styles.switchModeText}>Browse App as Customer</Text>
          </Pressable>

          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#DC2626" />
            <Text style={styles.logoutText}>Sign Out from Owner Portal</Text>
          </Pressable>
        </View>
      </ScrollView>
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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
  },
  headerSubtitle: {
    fontSize: 12,
    color: WOW_COLORS.secondaryText,
    marginTop: 1,
  },
  ownerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFE4EE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  ownerBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: WOW_COLORS.primaryPink,
    letterSpacing: 0.5,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: WOW_COLORS.primaryPink,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  profileEmail: {
    fontSize: 13,
    color: WOW_COLORS.secondaryText,
    marginTop: 2,
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  sectionActionText: {
    fontSize: 14,
    fontWeight: "700",
    color: WOW_COLORS.primaryPink,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: "46%",
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  statIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
  },
  statLabel: {
    fontSize: 12,
    color: WOW_COLORS.secondaryText,
    marginTop: 2,
  },
  statTrend: {
    fontSize: 11,
    fontWeight: "600",
    color: WOW_COLORS.primaryPink,
    marginTop: 4,
  },
  bizCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  bizHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  bizNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bizName: {
    fontSize: 16,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  bizCategory: {
    fontSize: 13,
    color: WOW_COLORS.secondaryText,
    marginTop: 3,
  },
  openPill: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  openPillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#16A34A",
  },
  bizDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 14,
  },
  bizFooter: {
    flexDirection: "row",
    gap: 10,
  },
  bizBtnSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FFE4EE",
  },
  bizBtnSecondaryText: {
    fontSize: 13,
    fontWeight: "700",
    color: WOW_COLORS.primaryPink,
  },
  bizBtnPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: WOW_COLORS.primaryPink,
  },
  bizBtnPrimaryText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.white,
  },
  leadCard: {
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: WOW_COLORS.primaryPink,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  leadTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leadName: {
    fontSize: 15,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  leadService: {
    fontSize: 12,
    color: WOW_COLORS.secondaryText,
    marginTop: 2,
  },
  leadTime: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  leadMessage: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
    marginVertical: 8,
    fontStyle: "italic",
  },
  leadActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  leadBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  leadBtnCall: {
    backgroundColor: "#DCFCE7",
  },
  leadBtnCallText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16A34A",
  },
  leadBtnWa: {
    backgroundColor: "#25D366",
  },
  leadBtnWaText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  footerSection: {
    marginTop: 16,
    gap: 12,
  },
  switchModeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: WOW_COLORS.primaryPink,
  },
  switchModeText: {
    fontSize: 14,
    fontWeight: "700",
    color: WOW_COLORS.primaryPink,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
  },
});
