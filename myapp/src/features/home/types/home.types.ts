export type TabType = "home" | "categories" | "add" | "saved" | "profile";

export interface CategoryItem {
  id: string;
  name: string;
  iconType: "beauty" | "fashion" | "food" | "home" | "more";
  active?: boolean;
}

export interface BusinessItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  location: string;
  imageUrl: string;
  isSaved?: boolean;
}

