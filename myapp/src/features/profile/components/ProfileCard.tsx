import React, { ReactNode, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WOW_COLORS } from "@/shared/theme/colors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCredentials, selectAuth } from "@/features/auth/slices/authSlice";
import { clearSession } from "@/_duplicates/utils/auth";
import { useLocation } from "@/shared/context/LocationContext";
import { useNotifications } from "@/features/notifications/services/notificationService";

/* ------------------------------------------------------------------ */
/* Placeholder data – replace with API data                            */
/* ------------------------------------------------------------------ */

type EnquiryStatus = "Replied" | "Pending";

const ENQUIRIES: {
  id: string;
  business: string;
  message: string;
  status: EnquiryStatus;
  when: string;
}[] = [
    {
      id: "1",
      business: "Aura Beauty Studio",
      message:
        "Hi, I would like to book a bridal hair and makeup appointment for next month.",
      status: "Replied",
      when: "2 days ago",
    },
    {
      id: "2",
      business: "Ira Boutique",
      message: "Do you do custom bridal blouse stitching with Aari embroidery?",
      status: "Pending",
      when: "4 days ago",
    },
  ];

const REVIEWS: {
  id: string;
  business: string;
  rating: number;
  message: string;
  when: string;
}[] = [
    {
      id: "1",
      business: "Amma's Kitchen",
      rating: 5,
      message:
        "The home meals are heavenly! Traditional South Indian flavours made with pure ghee and love.",
      when: "5 Nov 2026",
    },
  ];

/* ------------------------------------------------------------------ */
/* Small reusable pieces (defined OUTSIDE the screen so they don't     */
/* remount on every render)                                            */
/* ------------------------------------------------------------------ */

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  badge,
  danger = false,
  right,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  badge?: number;
  danger?: boolean;
  right?: ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      android_ripple={{ color: "#F3F4F6" }}
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Ionicons
          name={icon}
          size={19}
          color={danger ? "#DC2626" : WOW_COLORS.primaryPink}
        />
      </View>

      <View style={styles.menuTextWrap}>
        <Text
          style={[styles.menuTitle, danger && { color: "#DC2626" }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {!!subtitle && (
          <Text style={styles.menuSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {right ?? (
        <View style={styles.menuRight}>
          {!!badge && (
            <View style={styles.badgePill}>
              <Text style={styles.badgePillText}>
                {badge > 99 ? "99+" : badge}
              </Text>
            </View>
          )}
          {!danger && (
            <Ionicons name="chevron-forward" size={16} color="#C4C8CF" />
          )}
        </View>
      )}
    </Pressable>
  );
}

const Divider = () => <View style={styles.divider} />;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionHeader}>{title}</Text>
      <View style={styles.cardGroup}>{children}</View>
    </View>
  );
}

function BottomSheet({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalOverlay}>
          {/* Tap outside to dismiss */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessibilityLabel="Close"
          />
          <View
            style={[
              styles.modalSheet,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
          >
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <Pressable
                onPress={onClose}
                hitSlop={10}
                style={styles.closeBtn}
                accessibilityLabel="Close"
              >
                <Ionicons name="close" size={18} color="#374151" />
              </Pressable>
            </View>
            {children}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={28} color={WOW_COLORS.primaryPink} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={n <= value ? "star" : "star-outline"}
          size={14}
          color="#F59E0B"
        />
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export default function ProfileCard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const { userLocation, setLocationSheetVisible } = useLocation();

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/home");
  };
  const { unreadCount } = useNotifications();

  const [enquiriesVisible, setEnquiriesVisible] = useState(false);
  const [reviewsVisible, setReviewsVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  const isLoggedIn = Boolean(auth.token);
  const userName = auth.user?.name || "Priya Sharma";
  const userEmail = auth.user?.email || "priya.sharma@example.com";

  // Edit-profile form state
  const [nameInput, setNameInput] = useState(userName);
  const [emailInput, setEmailInput] = useState(userEmail);

  const openEdit = () => {
    setNameInput(userName);
    setEmailInput(userEmail);
    setEditVisible(true);
  };

  const saveProfile = () => {
    if (!nameInput.trim()) {
      Alert.alert("Name required", "Please enter your full name.");
      return;
    }
    // TODO: dispatch(updateProfile({ name: nameInput, email: emailInput }))
    setEditVisible(false);
    Alert.alert("Profile updated", "Your profile details are saved.");
  };

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await clearSession();
          dispatch(clearCredentials());
          router.replace("/home");
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      {/* ---------------- TOP BAR (fixed, stays while content scrolls) ---------------- */}
      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
          hitSlop={10}
          style={({ pressed }) => [
            styles.backBtn,
            pressed && { opacity: 0.6 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </Pressable>
        <Text style={styles.topBarTitle}>Profile</Text>
        {/* Spacer keeps the title perfectly centred */}
        <View style={{ width: 36, height: 36 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ---------------- HERO ---------------- */}
        {isLoggedIn ? (
          <View style={styles.heroCard}>
            <View style={styles.heroBand}>
              <View style={[styles.bubble, styles.bubbleLg]} />
              <View style={[styles.bubble, styles.bubbleSm]} />
              <View style={styles.memberChip}>
                <Ionicons name="ribbon" size={12} color="#FFFFFF" />
                <Text style={styles.memberChipText}>WOW Member</Text>
              </View>
            </View>

            <View style={styles.heroBody}>
              <View style={styles.avatarRow}>
                <View style={styles.avatarRing}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarInitial}>
                      {userName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.editBtn,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={openEdit}
                  accessibilityRole="button"
                  accessibilityLabel="Edit profile"
                >
                  <Ionicons
                    name="create-outline"
                    size={15}
                    color={WOW_COLORS.primaryPink}
                  />
                  <Text style={styles.editBtnText}>Edit profile</Text>
                </Pressable>
              </View>

              <Text style={styles.nameText} numberOfLines={1}>
                {userName}
              </Text>
              <Text style={styles.emailText} numberOfLines={1}>
                {userEmail}
              </Text>
            </View>

            {/* Quick stats – tappable shortcuts */}
            <View style={styles.statsRow}>
              <Pressable
                style={styles.stat}
                onPress={() => setEnquiriesVisible(true)}
              >
                <Text style={styles.statValue}>{ENQUIRIES.length}</Text>
                <Text style={styles.statLabel}>Enquiries</Text>
              </Pressable>
              <View style={styles.statDivider} />
              <Pressable
                style={styles.stat}
                onPress={() => setReviewsVisible(true)}
              >
                <Text style={styles.statValue}>{REVIEWS.length}</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </Pressable>
              <View style={styles.statDivider} />
              <Pressable
                style={styles.stat}
                onPress={() => router.push("/notifications")}
              >
                <Text style={styles.statValue}>{unreadCount}</Text>
                <Text style={styles.statLabel}>Unread alerts</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.heroCard}>
            <View style={[styles.heroBand, { height: 96 }]}>
              <View style={[styles.bubble, styles.bubbleLg]} />
              <View style={[styles.bubble, styles.bubbleSm]} />
            </View>
            <View style={styles.guestBody}>
              <View style={styles.guestIcon}>
                <Ionicons
                  name="person"
                  size={30}
                  color={WOW_COLORS.primaryPink}
                />
              </View>
              <Text style={styles.guestTitle}>Join Women of Wisdom</Text>
              <Text style={styles.guestSubtitle}>
                Sign in to save businesses, send enquiries, write reviews and get
                offers from women-led businesses.
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={() => router.push("/login")}
                accessibilityRole="button"
              >
                <Text style={styles.primaryBtnText}>Sign in or sign up</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ---------------- ACTIVITY ---------------- */}
        <Section title="Your activity">
          <MenuItem
            icon="heart-outline"
            title="Saved businesses"
            subtitle="Your bookmarked women-led enterprises"
            onPress={() => router.push("/saved")}
          />
          <Divider />
          <MenuItem
            icon="chatbubbles-outline"
            title="My enquiries"
            subtitle="Replies from business owners"
            onPress={() => setEnquiriesVisible(true)}
          />
          <Divider />
          <MenuItem
            icon="star-outline"
            title="My reviews"
            subtitle="Your ratings and testimonials"
            onPress={() => setReviewsVisible(true)}
          />
        </Section>

        {/* ---------------- PREFERENCES ---------------- */}
        <Section title="Preferences">
          <MenuItem
            icon="location-outline"
            title="Location"
            subtitle={userLocation.displayName}
            onPress={() => setLocationSheetVisible(true)}
          />
          <Divider />
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Alerts, updates and offers"
            onPress={() => router.push("/notifications")}
            badge={unreadCount}
          />
          <Divider />
          <MenuItem
            icon="phone-portrait-outline"
            title="Push notifications"
            subtitle={pushEnabled ? "On" : "Off"}
            right={
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: "#E5E7EB", true: WOW_COLORS.primaryPink }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E7EB"
              />
            }
          />
        </Section>

        {/* ---------------- SUPPORT ---------------- */}
        <Section title="Support and info">
          <MenuItem
            icon="help-circle-outline"
            title="Help and support"
            subtitle="FAQs, contact us and feedback"
            onPress={() =>
              Alert.alert(
                "WOW support",
                "Need help or want to contact us?\nEmail: support@womenofwisdom.org\nPhone: +91 44 2836 1000"
              )
            }
          />
          <Divider />
          <MenuItem
            icon="information-circle-outline"
            title="About WOW"
            subtitle="Business directory v1.0.0"
            onPress={() => setAboutVisible(true)}
          />
        </Section>

        {isLoggedIn && (
          <View style={styles.sectionWrap}>
            <View style={styles.cardGroup}>
              <MenuItem
                icon="log-out-outline"
                title="Log out"
                subtitle="Sign out from this device"
                onPress={handleLogout}
                danger
              />
            </View>
          </View>
        )}

        {/* ---------------- SHEETS ---------------- */}
        <BottomSheet
          visible={enquiriesVisible}
          title="My enquiries"
          onClose={() => setEnquiriesVisible(false)}
        >
          <ScrollView
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            {ENQUIRIES.length === 0 ? (
              <EmptyState
                icon="chatbubbles-outline"
                title="No enquiries yet"
                text="Message a business from its page and their reply will show up here."
              />
            ) : (
              ENQUIRIES.map((e) => {
                const replied = e.status === "Replied";
                return (
                  <View key={e.id} style={styles.listCard}>
                    <View style={styles.listCardTop}>
                      <Text style={styles.listCardTitle} numberOfLines={1}>
                        {e.business}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: replied ? "#DCFCE7" : "#FEF3C7" },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: replied ? "#16A34A" : "#D97706" },
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusText,
                            { color: replied ? "#16A34A" : "#D97706" },
                          ]}
                        >
                          {e.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.listCardMsg}>{e.message}</Text>
                    <Text style={styles.listCardMeta}>Sent {e.when}</Text>
                  </View>
                );
              })
            )}
          </ScrollView>
        </BottomSheet>

        <BottomSheet
          visible={reviewsVisible}
          title="My reviews"
          onClose={() => setReviewsVisible(false)}
        >
          <ScrollView
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            {REVIEWS.length === 0 ? (
              <EmptyState
                icon="star-outline"
                title="No reviews yet"
                text="Share your experience with a business to help others choose."
              />
            ) : (
              REVIEWS.map((r) => (
                <View key={r.id} style={styles.listCard}>
                  <View style={styles.listCardTop}>
                    <Text style={styles.listCardTitle} numberOfLines={1}>
                      {r.business}
                    </Text>
                    <Stars value={r.rating} />
                  </View>
                  <Text style={styles.listCardMsg}>{r.message}</Text>
                  <Text style={styles.listCardMeta}>Reviewed on {r.when}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </BottomSheet>

        <BottomSheet
          visible={aboutVisible}
          title="About WOW"
          onClose={() => setAboutVisible(false)}
        >
          <View style={styles.sheetContent}>
            <View style={styles.aboutLogo}>
              <Ionicons name="flower" size={30} color={WOW_COLORS.primaryPink} />
            </View>
            <Text style={styles.aboutHeading}>Women of Wisdom (WOW)</Text>
            <Text style={styles.aboutParagraph}>
              WOW is India's community and business discovery network for women
              entrepreneurs, home-based ventures and certified professionals.
            </Text>
            <Text style={styles.aboutParagraph}>
              From beauty and boutiques to education, food and home services —
              discover, support and connect directly with verified women leaders.
            </Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
          </View>
        </BottomSheet>

        <BottomSheet
          visible={editVisible}
          title="Edit profile"
          onClose={() => setEditVisible(false)}
        >
          <View style={[styles.sheetContent, { gap: 6 }]}>
            <Text style={styles.inputLabel}>Full name</Text>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              style={styles.input}
              placeholder="Your full name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              returnKeyType="next"
            />

            <Text style={[styles.inputLabel, { marginTop: 10 }]}>
              Email address
            </Text>
            <TextInput
              value={emailInput}
              onChangeText={setEmailInput}
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />

            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                { marginTop: 18, alignSelf: "stretch" },
                pressed && { opacity: 0.85 },
              ]}
              onPress={saveProfile}
              accessibilityRole="button"
            >
              <Text style={styles.primaryBtnText}>Save changes</Text>
            </Pressable>
          </View>
        </BottomSheet>
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const AVATAR = 72;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },

  /* Top bar */
  screen: {
    flex: 1,
    backgroundColor: "#FFF7FA",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: WOW_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    zIndex: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
  },

  /* Hero */
  heroCard: {
    backgroundColor: WOW_COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  heroBand: {
    height: 88,
    backgroundColor: WOW_COLORS.primaryPink,
    overflow: "hidden",
  },
  bubble: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  bubbleLg: { width: 150, height: 150, right: -40, top: -70 },
  bubbleSm: { width: 70, height: 70, left: -20, bottom: -35 },
  memberChip: {
    position: "absolute",
    top: 12,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  memberChipText: { color: "#FFFFFF", fontSize: 11.5, fontWeight: "700" },
  heroBody: {
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: -(AVATAR / 2),
    marginBottom: 10,
  },
  avatarRing: {
    width: AVATAR + 8,
    height: AVATAR + 8,
    borderRadius: (AVATAR + 8) / 2,
    backgroundColor: WOW_COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    backgroundColor: WOW_COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 30,
    fontWeight: "800",
    color: WOW_COLORS.primaryPink,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: WOW_COLORS.primaryPink,
    marginBottom: 4,
  },
  editBtnText: {
    color: WOW_COLORS.primaryPink,
    fontSize: 13,
    fontWeight: "700",
  },
  nameText: {
    fontSize: 21,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
    letterSpacing: -0.3,
  },
  emailText: { fontSize: 13.5, color: "#6B7280", marginTop: 2 },

  /* Stats */
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  stat: { flex: 1, alignItems: "center", paddingVertical: 14 },
  statValue: {
    fontSize: 19,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
  },
  statLabel: { fontSize: 11.5, color: "#6B7280", marginTop: 2 },
  statDivider: { width: 1, backgroundColor: "#F3F4F6", marginVertical: 12 },

  /* Guest */
  guestBody: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  guestIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: WOW_COLORS.softPink,
    borderWidth: 4,
    borderColor: WOW_COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -32,
    marginBottom: 12,
  },
  guestTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
    marginBottom: 6,
  },
  guestSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 18,
  },
  primaryBtn: {
    backgroundColor: WOW_COLORS.primaryPink,
    height: 48,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 14.5, fontWeight: "700" },

  /* Sections */
  sectionWrap: { marginBottom: 22 },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B5563",
    marginBottom: 8,
    marginLeft: 4,
  },
  cardGroup: {
    backgroundColor: WOW_COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
    minHeight: 64,
  },
  menuItemPressed: { backgroundColor: "#FAFAFB" },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: WOW_COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconDanger: { backgroundColor: "#FEE2E2" },
  menuTextWrap: { flex: 1 },
  menuTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  menuSubtitle: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  menuRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  badgePill: {
    backgroundColor: WOW_COLORS.primaryPink,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgePillText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginLeft: 66 },

  /* Bottom sheet */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17,24,39,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: WOW_COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "85%",
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    marginTop: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetContent: { paddingHorizontal: 20, paddingBottom: 8, paddingTop: 4 },

  /* List cards (enquiries / reviews) */
  listCard: {
    backgroundColor: "#FAFAFB",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEF0F3",
    marginBottom: 10,
  },
  listCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  listCardTitle: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  listCardMsg: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
    marginBottom: 8,
  },
  listCardMeta: { fontSize: 11.5, color: "#9CA3AF" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11.5, fontWeight: "700" },

  /* Empty state */
  emptyWrap: { alignItems: "center", paddingVertical: 32, paddingHorizontal: 12 },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: WOW_COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15.5,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 19,
  },

  /* About */
  aboutLogo: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: WOW_COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  aboutHeading: {
    fontSize: 17,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
    marginBottom: 8,
  },
  aboutParagraph: {
    fontSize: 13.5,
    color: "#4B5563",
    lineHeight: 21,
    marginBottom: 10,
  },
  aboutVersion: { fontSize: 12, color: "#9CA3AF", marginTop: 6 },

  /* Edit profile */
  inputLabel: { fontSize: 13, fontWeight: "700", color: "#374151" },
  input: {
    height: 48,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 14.5,
    color: WOW_COLORS.primaryText,
  },
});