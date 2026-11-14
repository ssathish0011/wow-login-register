import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, WOW_COLORS } from "@/shared/theme/colors";
import ScreenWrapper from "@/shared/components/ScreenWrapper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCredentials, selectAuth } from "@/features/auth/slices/authSlice";
import { clearSession } from "@/_duplicates/utils/auth";

export default function AdminDashboardScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  const adminName = auth.user?.name || "System Admin";
  const adminEmail = auth.user?.email || "admin@wow.com";

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out from the Admin Portal?", [
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

  const handleApprove = (bizName: string) => {
    Alert.alert("Business Approved", `"${bizName}" is now verified and live on WOW Directory.`);
  };

  const handleReject = (bizName: string) => {
    Alert.alert("Reject Submission", `Do you want to request more documents for "${bizName}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Request Changes", style: "destructive", onPress: () => { } },
    ]);
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
            <Text style={styles.headerTitle}>Admin Control Center</Text>
            <Text style={styles.headerSubtitle}>Platform overview & moderation</Text>
          </View>
        </View>

        <View style={styles.adminBadge}>
          <Ionicons name="shield" size={14} color="#7C3AED" />
          <Text style={styles.adminBadgeText}>ADMIN</Text>
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
              {adminName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{adminName}</Text>
            <Text style={styles.profileEmail}>{adminEmail}</Text>
            <View style={styles.roleRow}>
              <Ionicons name="key" size={14} color="#7C3AED" />
              <Text style={styles.roleText}>Super Administrator Privilege</Text>
            </View>
          </View>
        </View>

        {/* Platform KPIs */}
        <Text style={styles.sectionTitle}>Platform Metrics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: "#FFE4EE" }]}>
              <Ionicons name="storefront" size={20} color={WOW_COLORS.primaryPink} />
            </View>
            <Text style={styles.statValue}>1,248</Text>
            <Text style={styles.statLabel}>Total Businesses</Text>
            <Text style={styles.statTrend}>+32 this month</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: "#E0F2FE" }]}>
              <Ionicons name="people" size={20} color="#0284C7" />
            </View>
            <Text style={styles.statValue}>48.2k</Text>
            <Text style={styles.statLabel}>Registered Users</Text>
            <Text style={styles.statTrend}>+1.2k new</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="hourglass" size={20} color="#D97706" />
            </View>
            <Text style={styles.statValue}>14</Text>
            <Text style={styles.statLabel}>Pending Approvals</Text>
            <Text style={[styles.statTrend, { color: "#D97706" }]}>Action Needed</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="pulse" size={20} color="#16A34A" />
            </View>
            <Text style={styles.statValue}>99.9%</Text>
            <Text style={styles.statLabel}>System Health</Text>
            <Text style={[styles.statTrend, { color: "#16A34A" }]}>All Systems Normal</Text>
          </View>
        </View>

        {/* Pending Approvals */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Pending Verification (14)</Text>
          <Pressable
            onPress={() => Alert.alert("Verification Queue", "Opening full moderation list...")}
          >
            <Text style={styles.sectionActionText}>View All</Text>
          </Pressable>
        </View>

        <View style={styles.approvalCard}>
          <View style={styles.approvalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.approvalBizName}>Kavya Silk & Boutiques</Text>
              <Text style={styles.approvalCategory}>Fashion & Boutique • T. Nagar, Chennai</Text>
              <Text style={styles.approvalSubmitted}>Submitted 4 hours ago by Kavya M.</Text>
            </View>
          </View>
          <View style={styles.approvalActions}>
            <Pressable
              style={styles.approvalBtnReject}
              onPress={() => handleReject("Kavya Silk & Boutiques")}
            >
              <Text style={styles.approvalBtnRejectText}>Request Changes</Text>
            </Pressable>
            <Pressable
              style={styles.approvalBtnApprove}
              onPress={() => handleApprove("Kavya Silk & Boutiques")}
            >
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              <Text style={styles.approvalBtnApproveText}>Approve</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.approvalCard}>
          <View style={styles.approvalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.approvalBizName}>Divine Henna & Bridal Mehendi</Text>
              <Text style={styles.approvalCategory}>Beauty & Wellness • Adyar, Chennai</Text>
              <Text style={styles.approvalSubmitted}>Submitted yesterday by Farida K.</Text>
            </View>
          </View>
          <View style={styles.approvalActions}>
            <Pressable
              style={styles.approvalBtnReject}
              onPress={() => handleReject("Divine Henna & Bridal Mehendi")}
            >
              <Text style={styles.approvalBtnRejectText}>Request Changes</Text>
            </Pressable>
            <Pressable
              style={styles.approvalBtnApprove}
              onPress={() => handleApprove("Divine Henna & Bridal Mehendi")}
            >
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              <Text style={styles.approvalBtnApproveText}>Approve</Text>
            </Pressable>
          </View>
        </View>

        {/* Management Quick Links */}
        <Text style={styles.sectionTitle}>Admin Operations</Text>
        <View style={styles.operationsCard}>
          <Pressable
            style={styles.operationRow}
            onPress={() => Alert.alert("Category Management", "Manage 12 main categories and 84 subcategories.")}
          >
            <View style={[styles.operationIconBox, { backgroundColor: "#FFE4EE" }]}>
              <Ionicons name="grid-outline" size={18} color={WOW_COLORS.primaryPink} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.operationTitle}>Category & Taxonomy</Text>
              <Text style={styles.operationSubtitle}>Edit categories, subcategories, and icons</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>

          <View style={styles.operationDivider} />

          <Pressable
            style={styles.operationRow}
            onPress={() => Alert.alert("User Management", "Search and manage user and owner accounts.")}
          >
            <View style={[styles.operationIconBox, { backgroundColor: "#EDE9FE" }]}>
              <Ionicons name="people-outline" size={18} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.operationTitle}>User & Role Management</Text>
              <Text style={styles.operationSubtitle}>Assign Owner/Admin roles, ban abusive accounts</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>

          <View style={styles.operationDivider} />

          <Pressable
            style={styles.operationRow}
            onPress={() => Alert.alert("Broadcast", "Send push notification to all users or owners.")}
          >
            <View style={[styles.operationIconBox, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="megaphone-outline" size={18} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.operationTitle}>System Announcements</Text>
              <Text style={styles.operationSubtitle}>Dispatch promotional banners & notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Footer Actions */}
        <View style={styles.footerSection}>
          <Pressable
            style={styles.viewAppBtn}
            onPress={() => router.push("/home")}
          >
            <Ionicons name="home-outline" size={18} color={WOW_COLORS.primaryPink} />
            <Text style={styles.viewAppText}>Open Customer App</Text>
          </Pressable>

          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#DC2626" />
            <Text style={styles.logoutText}>Sign Out from Admin Portal</Text>
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
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  adminBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#7C3AED",
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
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#7C3AED",
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
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7C3AED",
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
  approvalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  approvalHeader: {
    marginBottom: 12,
  },
  approvalBizName: {
    fontSize: 15,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  approvalCategory: {
    fontSize: 12,
    color: WOW_COLORS.secondaryText,
    marginTop: 2,
  },
  approvalSubmitted: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
  },
  approvalActions: {
    flexDirection: "row",
    gap: 10,
  },
  approvalBtnReject: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  approvalBtnRejectText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B5563",
  },
  approvalBtnApprove: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#16A34A",
  },
  approvalBtnApproveText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  operationsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 4,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  operationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  operationIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  operationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  operationSubtitle: {
    fontSize: 12,
    color: WOW_COLORS.secondaryText,
    marginTop: 2,
  },
  operationDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 64,
  },
  footerSection: {
    marginTop: 8,
    gap: 12,
  },
  viewAppBtn: {
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
  viewAppText: {
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
