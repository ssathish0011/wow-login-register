import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/shared/theme/colors";
import ScreenWrapper from "@/common/components/ScreenWrapper";
import {
  NotificationItem,
  NotificationType,
  useNotifications,
} from "@/features/notifications/services/notificationService";

function getNotificationIcon(type: NotificationType): {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  bgColor: string;
} {
  switch (type) {
    case "enquiry":
      return {
        name: "chatbubble-ellipses-outline",
        color: WOW_COLORS.primaryPink,
        bgColor: WOW_COLORS.softPink,
      };
    case "deal":
      return {
        name: "pricetag-outline",
        color: "#D97706",
        bgColor: "#FEF3C7",
      };
    case "nearby":
      return {
        name: "location-outline",
        color: "#2563EB",
        bgColor: "#DBEAFE",
      };
    case "review":
      return {
        name: "star-outline",
        color: "#059669",
        bgColor: "#D1FAE5",
      };
    case "system":
    default:
      return {
        name: "notifications-outline",
        color: "#4B5563",
        bgColor: "#F3F4F6",
      };
  }
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home" as any);
    }
  };

  const handleNotificationPress = (item: NotificationItem) => {
    markAsRead(item.id);
    if (item.targetRoute) {
      router.push(item.targetRoute as any);
    }
  };

  // Group notifications into Today and Earlier
  const todayItems = notifications.filter((n) => n.section === "Today");
  const earlierItems = notifications.filter((n) => n.section === "Earlier");

  const sections: { title: string; data: NotificationItem[] }[] = [];
  if (todayItems.length > 0) sections.push({ title: "Today", data: todayItems });
  if (earlierItems.length > 0)
    sections.push({ title: "Earlier", data: earlierItems });

  return (
    <ScreenWrapper style={{ backgroundColor: WOW_COLORS.white }}>
      {/* Top Header */}
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

        <Text style={styles.headerTitle}>Notifications</Text>

        {unreadCount > 0 ? (
          <Pressable
            style={styles.markAllBtn}
            onPress={markAllAsRead}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Text style={styles.markAllText}>Mark all as read</Text>
          </Pressable>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons
              name="notifications-off-outline"
              size={48}
              color="#9CA3AF"
            />
          </View>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptySubtitle}>
            We will let you know when there are new enquiry responses, deals, or updates.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.title}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item: section }) => (
            <View style={styles.sectionWrap}>
              <Text style={styles.sectionHeader}>{section.title}</Text>
              {section.data.map((item) => {
                const iconInfo = getNotificationIcon(item.type);
                return (
                  <Pressable
                    key={item.id}
                    style={[
                      styles.card,
                      !item.read && styles.cardUnread,
                    ]}
                    onPress={() => handleNotificationPress(item)}
                    accessibilityRole="button"
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: iconInfo.bgColor },
                      ]}
                    >
                      <Ionicons
                        name={iconInfo.name}
                        size={20}
                        color={iconInfo.color}
                      />
                    </View>

                    <View style={styles.cardContent}>
                      <View style={styles.cardHeaderRow}>
                        <Text
                          style={[
                            styles.itemTitle,
                            !item.read && styles.itemTitleUnread,
                          ]}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        <Text style={styles.itemTime}>{item.time}</Text>
                      </View>

                      <Text
                        style={[
                          styles.itemMessage,
                          !item.read && styles.itemMessageUnread,
                        ]}
                        numberOfLines={2}
                      >
                        {item.message}
                      </Text>
                    </View>

                    {!item.read && <View style={styles.unreadDot} />}
                  </Pressable>
                );
              })}
            </View>
          )}
        />
      )}
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
    fontSize: 18,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  markAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: WOW_COLORS.primaryPink,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingBottom: 40,
  },
  sectionWrap: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WOW_COLORS.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardUnread: {
    backgroundColor: "#FFF5F8",
    borderColor: WOW_COLORS.border,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
    marginRight: 6,
  },
  itemTitleUnread: {
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  itemTime: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  itemMessage: {
    fontSize: 12.5,
    color: "#6B7280",
    lineHeight: 18,
  },
  itemMessageUnread: {
    color: "#374151",
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: WOW_COLORS.primaryPink,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});

