export type TabType = "home" | "categories" | "add" | "saved" | "profile";

export interface CategoryItem {
  id: string;
  name: string;
  icon?: string;
  iconType?: string;
  active?: boolean;
}

export interface ExploreCategoryItem {
  id: string;
  name: string;
  iconName: string;
  imageUrl?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  name?: string;
  imageUrl: string;
}

export interface PopularCategoryItem {
  id: string;
  name: string;
  iconName: string;
}

export interface VideoStoryItem {
  id: string;
  title: string;
  duration: string;
  imageUrl: string;
}

export interface TrendingItem {
  id: string;
  title: string;
  imageUrl: string;
}

export interface BusinessItem {
  id: string;
  name: string;
  category: string;
  categoryType?: string;
  rating: number | string;
  reviews?: string | number;
  reviewsCount?: number;
  location: string;
  image: string;
  imageUrl?: string;
  isSaved?: boolean;
}
