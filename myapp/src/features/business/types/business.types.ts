import { Ionicons } from "@expo/vector-icons";

export type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface WorkingHour {
  day: string;
  time: string;
  isOpen: boolean;
}

export interface BusinessListingItem {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  rating: number;
  reviewsCount: number;
  location: string;
  address: string;
  city: string;
  distance: string;
  description: string;
  about: string;
  isOpen: boolean;
  timings: string;
  specialities: string[];
  phone: string;
  whatsapp: string;
  isVerified: boolean;
  isFeatured: boolean;
  isWomenOwned: boolean;
  isPremium: boolean;
  services: string[];
  imageUrl: string;
  photos: string[];
  priceLevel?: string;
  establishedYear?: number;
  founderName?: string;
  workingHours?: WorkingHour[];
  reviewsList?: CustomerReview[];
}

export interface BusinessCategory {
  id: string;
  name: string;
  iconName: IoniconName;
  subcategories: string[];
}

export type SortOption =
  | "recommended"
  | "popular"
  | "rating"
  | "recent"
  | "nearest";

export interface QuickFilterOption {
  id: string;
  label: string;
  icon?: IoniconName;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedCity: string;
  minRating: number | null;
  womenOwnedOnly: boolean;
  verifiedOnly: boolean;
  premiumOnly: boolean;
  openNowOnly: boolean;
  selectedServices: string[];
  sortBy: SortOption;
}
