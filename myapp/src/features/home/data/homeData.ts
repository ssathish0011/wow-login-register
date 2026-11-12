
import {
  BusinessItem,
  CategoryItem,
  ExploreCategoryItem,
  PopularCategoryItem,
  ServiceItem,
  TrendingItem,
  VideoStoryItem,
} from "../types/home.types";

// ======================================
// MAIN CATEGORIES
// ======================================

export const CATEGORIES_DATA: CategoryItem[] = [
  { id: "1", name: "Beauty & Salon", iconType: "beauty", active: true },
  { id: "2", name: "Sarees & Fashion", iconType: "fashion", active: false },
  { id: "3", name: "Jewellery", iconType: "jewellery", active: false },
  { id: "4", name: "Boutique & Tailoring", iconType: "boutique", active: false },
  { id: "5", name: "Handmade Crafts", iconType: "handmade", active: false },
  { id: "6", name: "Homemade Food", iconType: "food", active: false },
  { id: "7", name: "Health & Wellness", iconType: "health", active: false },
  { id: "8", name: "Home Decor", iconType: "home", active: false },
  { id: "9", name: "Gifts & Hampers", iconType: "gifts", active: false },
  { id: "10", name: "More", iconType: "more", active: false },
];

// ======================================
// EXPLORE CATEGORIES WITH IMAGES
// ======================================

export const EXPLORE_CATEGORIES_DATA: ExploreCategoryItem[] = [
  {
    id: "1",
    name: "Beauty & Salon",
    iconName: "flower-outline",
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500",
  },
  {
    id: "2",
    name: "Sarees & Fashion",
    iconName: "shirt-outline",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
  },
  {
    id: "3",
    name: "Jewellery",
    iconName: "diamond-outline",
    imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500",
  },
  {
    id: "4",
    name: "Boutique & Tailoring",
    iconName: "cut-outline",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
  },
  {
    id: "5",
    name: "Handmade Crafts",
    iconName: "color-palette-outline",
    imageUrl: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500",
  },
  {
    id: "6",
    name: "Homemade Food",
    iconName: "restaurant-outline",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500",
  },
  {
    id: "7",
    name: "Health & Wellness",
    iconName: "fitness-outline",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500",
  },
  {
    id: "8",
    name: "Home Decor",
    iconName: "home-outline",
    imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500",
  },
  {
    id: "9",
    name: "Gifts & Hampers",
    iconName: "gift-outline",
    imageUrl: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=500",
  },
  {
    id: "10",
    name: "Bridal & Events",
    iconName: "calendar-outline",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500",
  },
];


// ======================================
// HOME SERVICES & BEAUTY DATA
// ======================================

export const HOME_SERVICES_DATA: ServiceItem[] = [
  {
    id: "hs-1",
    title: "Home\nCleaning",
    imageUrl:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "hs-2",
    title: "Home\nDecor",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "hs-3",
    title: "Painting\nServices",
    imageUrl:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "hs-4",
    title: "Interior\nDesign",
    imageUrl:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "hs-5",
    title: "Pest\nControl",
    imageUrl:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "hs-6",
    title: "Home\nRepair",
    imageUrl:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=85",
  },
];

export const BEAUTY_WELLNESS_DATA: ServiceItem[] = [
  {
    id: "bw-1",
    title: "Makeup\nServices",
    imageUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "bw-2",
    title: "Hair Care\n& Styling",
    imageUrl:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "bw-3",
    title: "Spa &\nWellness",
    imageUrl:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "bw-4",
    title: "Salon\nServices",
    imageUrl:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "bw-5",
    title: "Skin Care\nTreatments",
    imageUrl:
      "https://images.unsplash.com/photo-1512290900672-1f4176cf9e24?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "bw-6",
    title: "Yoga &\nFitness",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=80",
  },
];

// ======================================
// POPULAR CATEGORIES
// ======================================

export const POPULAR_CATEGORIES_DATA: PopularCategoryItem[] = [
  { id: "pop-1", name: "Boutique", iconName: "shirt-outline" },
  { id: "pop-2", name: "Tiffin & Catering", iconName: "restaurant-outline" },
  { id: "pop-3", name: "Tailoring", iconName: "cut-outline" },
  { id: "pop-4", name: "Handicrafts", iconName: "color-palette-outline" },
  { id: "pop-5", name: "Tuition & Coaching", iconName: "book-outline" },
  { id: "pop-6", name: "Event Planners", iconName: "calendar-outline" },
  { id: "pop-7", name: "Home Organizing", iconName: "file-tray-full-outline" },
  { id: "pop-8", name: "Organic Products", iconName: "leaf-outline" },
];

// ======================================
// STORIES & VIDEOS - INDIAN WOMEN
// ======================================

export const STORIES_VIDEOS_DATA: VideoStoryItem[] = [
  {
    id: "vid-1",
    title: "மெட்ராஸ் சாரீஸ் ரம்யா",  // Madras Sarees Ramya
    duration: "4:36",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=85",
  },
  {
    id: "vid-2",
    title: "கோயம்புத்தூர் ஷோபனா",  // Coimbatore Shobana
    duration: "5:12",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=85",
  },
  {
    id: "vid-3",
    title: "சென்னை சங்கரி",  // Chennai Sankari
    duration: "3:58",
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=85",
  },
];


// ======================================
// TRENDING NOW
// ======================================

export const TRENDING_NOW_DATA: TrendingItem[] = [
  {
    id: "tr-1",
    title: "Saree\nBoutiques",
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=85",
  },
  {
    id: "tr-2",
    title: "Homemade\nFood",
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=85",
  },
  {
    id: "tr-3",
    title: "Custom\nGifting",
    imageUrl:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=500&q=85",
  },
  {
    id: "tr-4",
    title: "Handicrafts",
    imageUrl:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=500&q=85",
  },
  {
    id: "tr-5",
    title: "Event\nDecorators",
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=85",
  },
  {
    id: "tr-6",
    title: "Fitness\nTrainers",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=85",
  },
];


// ======================================
// FEATURED BUSINESS IMAGES
// ======================================


const IMG_CAFE =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=500&q=80";

const IMG_BOUTIQUE =
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=500&q=80";

const IMG_SALON =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=500&q=80";

const IMG_HOME =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=80";

// ======================================
// FEATURED BUSINESSES
// ======================================

// ======================================
// FEATURED BUSINESSES
// ======================================

export const FEATURED_BUSINESSES_DATA: BusinessItem[] = [
  {
    id: "1",
    name: "The Pink Brew",
    category: "Cafe & Bakery",
    categoryType: "food",
    rating: 4.8,
    reviews: "120",
    reviewsCount: 120,
    location: "Chennai",
    image: IMG_CAFE,
    imageUrl: IMG_CAFE,
    isSaved: true,
  },
  {
    id: "2",
    name: "Stitch & Style",
    category: "Boutique",
    categoryType: "fashion",
    rating: 4.7,
    reviews: "98",
    reviewsCount: 98,
    location: "Mumbai",
    image: IMG_BOUTIQUE,
    imageUrl: IMG_BOUTIQUE,
    isSaved: true,
  },
  {
    id: "3",
    name: "Bloom & Glow",
    category: "Salon & Spa",
    categoryType: "beauty",
    rating: 4.9,
    reviews: "210",
    reviewsCount: 210,
    location: "Bangalore",
    image: IMG_SALON,
    imageUrl: IMG_SALON,
    isSaved: true,
  },
  {
    id: "4",
    name: "Aura Living",
    category: "Home & Decor",
    categoryType: "home",
    rating: 4.6,
    reviews: "85",
    reviewsCount: 85,
    location: "Hyderabad",
    image: IMG_HOME,
    imageUrl: IMG_HOME,
    isSaved: true,
  },
  {
    id: "5",
    name: "Glam Studio",
    category: "Makeup Studio",
    categoryType: "beauty",
    rating: 4.5,
    reviews: "64",
    reviewsCount: 64,
    location: "Chennai",
    image: IMG_SALON,
    imageUrl: IMG_SALON,
    isSaved: false,
  },
  {
    id: "6",
    name: "Urban Threads",
    category: "Clothing Store",
    categoryType: "fashion",
    rating: 4.4,
    reviews: "73",
    reviewsCount: 73,
    location: "Delhi",
    image: IMG_BOUTIQUE,
    imageUrl: IMG_BOUTIQUE,
    isSaved: false,
  },
];
