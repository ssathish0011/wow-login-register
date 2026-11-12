import { useState, useEffect } from "react";

export type NotificationType =
  | "enquiry"
  | "review"
  | "deal"
  | "nearby"
  | "system";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  section: "Today" | "Earlier";
  read: boolean;
  targetRoute?: string;
  businessId?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "enquiry",
    title: "New Reply to Your Enquiry",
    message: "Aura Beauty Studio has responded to your service enquiry.",
    time: "10m ago",
    section: "Today",
    read: false,
    targetRoute: "/business/biz-1",
    businessId: "biz-1",
  },
  {
    id: "notif-2",
    type: "deal",
    title: "Weekend Festive Offer (25% Off)",
    message: "Ira Boutique announced a 25% discount on all Silk Sarees this weekend!",
    time: "2h ago",
    section: "Today",
    read: false,
    targetRoute: "/business/biz-2",
    businessId: "biz-2",
  },
  {
    id: "notif-3",
    type: "nearby",
    title: "New Business Near You",
    message: "Amma's Kitchen is now listed in Velachery. Explore authentic home dining.",
    time: "5h ago",
    section: "Today",
    read: false,
    targetRoute: "/business/biz-3",
    businessId: "biz-3",
  },
  {
    id: "notif-4",
    type: "review",
    title: "New Review on Maya Organics",
    message: "Priya S. left a 5-star rating: 'Exceptional handcrafted skincare!'",
    time: "Yesterday",
    section: "Earlier",
    read: true,
    targetRoute: "/business/biz-4",
    businessId: "biz-4",
  },
  {
    id: "notif-5",
    type: "system",
    title: "Welcome to WOW Business Directory",
    message: "Discover and support trusted women-led businesses across Tamil Nadu.",
    time: "3 days ago",
    section: "Earlier",
    read: true,
    targetRoute: "/home",
  },
];

let memoryNotifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
const listeners = new Set<(items: NotificationItem[]) => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener([...memoryNotifications]));
}

export const notificationService = {
  getAll(): NotificationItem[] {
    return [...memoryNotifications];
  },
  getUnreadCount(): number {
    return memoryNotifications.filter((n) => !n.read).length;
  },
  markAsRead(id: string): void {
    memoryNotifications = memoryNotifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    notifyListeners();
  },
  markAllAsRead(): void {
    memoryNotifications = memoryNotifications.map((n) => ({ ...n, read: true }));
    notifyListeners();
  },
  subscribe(listener: (items: NotificationItem[]) => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    notificationService.getAll()
  );

  useEffect(() => {
    return notificationService.subscribe(setNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead: notificationService.markAsRead,
    markAllAsRead: notificationService.markAllAsRead,
  };
}

