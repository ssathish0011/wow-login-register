import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthUser, clearSession, getToken, getUser } from "../utils/auth";

type TabType = "home" | "categories" | "add" | "saved" | "profile";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>(["1"]);
  const [loggingOut, setLoggingOut] = useState(false);

  // Load authenticated user
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (!token) {
          if (isMounted) router.replace("/login");
          return;
        }
        const savedUser = await getUser();
        if (isMounted) {
          setUser(savedUser);
        }
      } catch {
        if (isMounted) router.replace("/login");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const performLogout = async () => {
    try {
      setLoggingOut(true);
      await clearSession();
    } finally {
      router.replace("/login");
    }
  };

  const handleLogout = () => {
    if (loggingOut) return;
    if (Platform.OS === "web") {
      const confirmed =
        typeof window !== "undefined"
          ? window.confirm("Are you sure you want to logout?")
          : true;
      if (confirmed) performLogout();
      return;
    }
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: performLogout },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D1006C" />
      </View>
    );
  }

  const categories = [
    { id: "1", name: "Beauty", icon: "✨", active: true },
    { id: "2", name: "Fashion", icon: "👗", active: false },
    { id: "3", name: "Food", icon: "☕", active: false },
    { id: "4", name: "Home", icon: "🏠", active: false },
    { id: "5", name: "More", icon: "➕", active: false },
  ];

  const businesses = [
    {
      id: "1",
      name: "The Pink Brew",
      category: "Cafe & Bakery",
      rating: "4.8",
      reviews: "120",
      location: "Chennai",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "2",
      name: "Stitch & Style",
      category: "Boutique",
      rating: "4.7",
      reviews: "98",
      location: "Mumbai",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "3",
      name: "Bloom & Glow",
      category: "Salon & Spa",
      rating: "4.9",
      reviews: "210",
      location: "Bangalore",
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "4",
      name: "Aura Living",
      category: "Home & Decor",
      rating: "4.6",
      reviews: "85",
      location: "Hyderabad",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const filteredBusinesses = businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      {/* Main Content Area */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 12, paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <Pressable style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>

          <View style={styles.greetingWrapper}>
            <Text style={styles.greetingText}>
              Hello, {user?.name || "Priya"} 👋
            </Text>
          </View>

          <Pressable style={styles.notificationButton}>
            <Text style={styles.bellIcon}>🔔</Text>
            <View style={styles.notificationBadge} />
          </Pressable>
        </View>

        {activeTab === "home" && (
          <>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for businesses, services..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Pressable style={styles.filterButton}>
                <Text style={styles.filterIcon}>⚙️</Text>
              </Pressable>
            </View>

            {/* Hero Banner */}
            <View style={styles.bannerCard}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>Empowering Women.</Text>
                <Text style={styles.bannerSubtitle}>Inspiring Businesses.</Text>
                <Pressable style={styles.exploreButton}>
                  <Text style={styles.exploreButtonText}>Explore Now</Text>
                </Pressable>
              </View>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
                }}
                style={styles.bannerImage}
              />
            </View>

            {/* Top Categories Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Categories</Text>
              <Pressable onPress={() => setActiveTab("categories")}>
                <Text style={styles.viewAllText}>View All</Text>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesRow}
            >
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={styles.categoryItem}
                  onPress={() => setSearchQuery(cat.name === "More" ? "" : cat.name)}
                >
                  <View
                    style={[
                      styles.categoryCircle,
                      cat.active && styles.categoryCircleActive,
                    ]}
                  >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  </View>
                  <Text
                    style={[
                      styles.categoryName,
                      cat.active && styles.categoryNameActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Featured Businesses Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Businesses</Text>
              <Pressable>
                <Text style={styles.viewAllText}>View All</Text>
              </Pressable>
            </View>

            <View style={styles.businessGrid}>
              {filteredBusinesses.map((item) => {
                const isSaved = savedIds.includes(item.id);
                return (
                  <View key={item.id} style={styles.businessCard}>
                    <View style={styles.cardImageWrapper}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.cardImage}
                      />
                      <Pressable
                        style={styles.saveIconButton}
                        onPress={() => toggleSave(item.id)}
                      >
                        <Text style={styles.heartIcon}>
                          {isSaved ? "💖" : "🤍"}
                        </Text>
                      </Pressable>
                    </View>

                    <View style={styles.cardDetails}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.cardCategory}>{item.category}</Text>

                      <View style={styles.cardMetaRow}>
                        <Text style={styles.cardRating}>
                          ⭐ {item.rating}{" "}
                          <Text style={styles.cardReviews}>({item.reviews})</Text>
                        </Text>
                      </View>

                      <View style={styles.cardLocationRow}>
                        <Text style={styles.cardLocation}>
                          📍 {item.location}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Categories Tab View */}
        {activeTab === "categories" && (
          <View style={styles.tabContentCard}>
            <Text style={styles.tabHeading}>Explore All Categories</Text>
            <View style={styles.categoriesFullList}>
              {categories.map((c) => (
                <Pressable
                  key={c.id}
                  style={styles.categoryCardRow}
                  onPress={() => {
                    setSearchQuery(c.name === "More" ? "" : c.name);
                    setActiveTab("home");
                  }}
                >
                  <View style={styles.categoryCircleActive}>
                    <Text style={styles.categoryIcon}>{c.icon}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={styles.categoryRowTitle}>{c.name}</Text>
                    <Text style={styles.categoryRowSubtitle}>
                      Find women-led {c.name.toLowerCase()} businesses
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Add Business Tab View */}
        {activeTab === "add" && (
          <View style={styles.tabContentCard}>
            <Text style={styles.tabHeading}>Add Your Business</Text>
            <Text style={styles.tabSubheading}>
              Empower your journey and connect with customers
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Business Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Blossom Studio"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Beauty / Fashion"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>City / Location</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Chennai, Tamil Nadu"
              />
            </View>

            <Pressable
              style={styles.primaryButton}
              onPress={() => {
                Alert.alert(
                  "Success",
                  "Business submitted for review! We will notify you once published."
                );
                setActiveTab("home");
              }}
            >
              <Text style={styles.primaryButtonText}>Submit Business</Text>
            </Pressable>
          </View>
        )}

        {/* Saved Tab View */}
        {activeTab === "saved" && (
          <View style={styles.tabContentCard}>
            <Text style={styles.tabHeading}>Saved Businesses</Text>
            <Text style={styles.tabSubheading}>
              Your favorite women-led ventures
            </Text>

            {businesses
              .filter((b) => savedIds.includes(b.id))
              .map((b) => (
                <View key={b.id} style={styles.savedRow}>
                  <Image source={{ uri: b.image }} style={styles.savedThumb} />
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.cardTitle}>{b.name}</Text>
                    <Text style={styles.cardCategory}>{b.category}</Text>
                    <Text style={styles.cardLocation}>📍 {b.location}</Text>
                  </View>
                  <Pressable onPress={() => toggleSave(b.id)}>
                    <Text style={{ fontSize: 20 }}>💖</Text>
                  </Pressable>
                </View>
              ))}
          </View>
        )}

        {/* Profile Tab View */}
        {activeTab === "profile" && (
          <View style={styles.tabContentCard}>
            <View style={styles.profileAvatarWrapper}>
              <Text style={styles.profileAvatarText}>
                {user?.name ? user.name[0].toUpperCase() : "P"}
              </Text>
            </View>
            <Text style={styles.profileName}>{user?.name || "Priya"}</Text>
            <Text style={styles.profileEmail}>
              {user?.email || "priya@example.com"}
            </Text>

            <View style={styles.profileInfoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Role</Text>
                <Text style={styles.infoValue}>Member</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Account Status</Text>
                <Text style={styles.infoValueGreen}>Active</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Community</Text>
                <Text style={styles.infoValue}>Women of Wisdom</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.logoutButtonPressed,
                loggingOut && { opacity: 0.6 },
              ]}
              onPress={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.logoutButtonText}>Log Out</Text>
              )}
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View
        style={[
          styles.bottomNavContainer,
          { paddingBottom: Math.max(insets.bottom, 10) },
        ]}
      >
        {/* Tab 1: Home */}
        <Pressable
          style={styles.navTab}
          onPress={() => setActiveTab("home")}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "home" && styles.navIconActive,
            ]}
          >
            🏠
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "home" && styles.navLabelActive,
            ]}
          >
            Home
          </Text>
        </Pressable>

        {/* Tab 2: Categories */}
        <Pressable
          style={styles.navTab}
          onPress={() => setActiveTab("categories")}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "categories" && styles.navIconActive,
            ]}
          >
            ⊞
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "categories" && styles.navLabelActive,
            ]}
          >
            Categories
          </Text>
        </Pressable>

        {/* Tab 3: Central Add Business */}
        <Pressable
          style={styles.navTabCenter}
          onPress={() => setActiveTab("add")}
        >
          <View style={styles.addBusinessCircle}>
            <Text style={styles.plusIcon}>＋</Text>
          </View>
          <Text style={styles.addBusinessLabel}>Add Business</Text>
        </Pressable>

        {/* Tab 4: Saved */}
        <Pressable
          style={styles.navTab}
          onPress={() => setActiveTab("saved")}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "saved" && styles.navIconActive,
            ]}
          >
            ♡
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "saved" && styles.navLabelActive,
            ]}
          >
            Saved
          </Text>
        </Pressable>

        {/* Tab 5: Profile */}
        <Pressable
          style={styles.navTab}
          onPress={() => setActiveTab("profile")}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "profile" && styles.navIconActive,
            ]}
          >
            👤
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "profile" && styles.navLabelActive,
            ]}
          >
            Profile
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE4EE",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  menuButton: {
    padding: 6,
  },
  menuIcon: {
    fontSize: 22,
    color: "#1f2937",
    fontWeight: "bold",
  },
  greetingWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
  },
  notificationButton: {
    padding: 6,
    position: "relative",
  },
  bellIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1006C",
  },

  /* Search */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.2,
    borderColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1f2937",
  },
  filterButton: {
    padding: 4,
  },
  filterIcon: {
    fontSize: 16,
  },

  /* Hero Banner */
  bannerCard: {
    backgroundColor: "#FCE7F3",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
    overflow: "hidden",
  },
  bannerContent: {
    flex: 1,
    paddingRight: 12,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#D1006C",
    lineHeight: 24,
  },
  bannerSubtitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#D1006C",
    lineHeight: 24,
    marginBottom: 14,
  },
  exploreButton: {
    backgroundColor: "#D1006C",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  bannerImage: {
    width: 105,
    height: 110,
    borderRadius: 18,
  },

  /* Sections */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#D1006C",
  },

  /* Categories Row */
  categoriesRow: {
    paddingBottom: 24,
    gap: 16,
  },
  categoryItem: {
    alignItems: "center",
    width: 62,
  },
  categoryCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF1F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryCircleActive: {
    backgroundColor: "#D1006C",
  },
  categoryIcon: {
    fontSize: 22,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4B5563",
    textAlign: "center",
  },
  categoryNameActive: {
    color: "#D1006C",
    fontWeight: "700",
  },

  /* Business Grid */
  businessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
  businessCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 8,
  },
  cardImageWrapper: {
    position: "relative",
    width: "100%",
    height: 120,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  saveIconButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  heartIcon: {
    fontSize: 13,
  },
  cardDetails: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  cardCategory: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  cardMetaRow: {
    marginTop: 6,
  },
  cardRating: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  cardReviews: {
    color: "#9CA3AF",
    fontWeight: "400",
  },
  cardLocationRow: {
    marginTop: 4,
  },
  cardLocation: {
    fontSize: 11,
    color: "#6B7280",
  },

  /* Tab View Content Cards */
  tabContentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  tabHeading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#D1006C",
    textAlign: "center",
  },
  tabSubheading: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  categoriesFullList: {
    gap: 12,
  },
  categoryCardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFF5F8",
    borderRadius: 14,
  },
  categoryRowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  categoryRowSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: "#D1006C",
  },
  formGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    backgroundColor: "#F9FAFB",
  },
  primaryButton: {
    backgroundColor: "#D1006C",
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  savedRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  savedThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },

  /* Profile View */
  profileAvatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D1006C",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  profileAvatarText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  profileEmail: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 2,
    marginBottom: 20,
  },
  profileInfoBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  infoValueGreen: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10B981",
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonPressed: {
    backgroundColor: "#DC2626",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  /* Bottom Navigation */
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  navTab: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navIcon: {
    fontSize: 20,
    color: "#9CA3AF",
  },
  navIconActive: {
    color: "#D1006C",
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#9CA3AF",
    marginTop: 3,
  },
  navLabelActive: {
    color: "#D1006C",
    fontWeight: "700",
  },
  navTabCenter: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1.2,
    marginTop: -20,
  },
  addBusinessCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D1006C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D1006C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  plusIcon: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: -2,
  },
  addBusinessLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#D1006C",
    marginTop: 4,
  },
});

