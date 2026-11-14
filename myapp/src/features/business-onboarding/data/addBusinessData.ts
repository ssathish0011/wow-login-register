import { CategoryItem, ListingPlanOption, StepConfig, AddBusinessStep } from "../types/addBusiness.types";

export const POPULAR_CATEGORIES: CategoryItem[] = [
  { id: "fashion", name: "Fashion", icon: "shirt-outline", popular: true },
  { id: "beauty", name: "Beauty & Spa", icon: "sparkles-outline", popular: true },
  { id: "salons", name: "Salons", icon: "cut-outline", popular: true },
  { id: "textiles", name: "Textiles", icon: "color-palette-outline", popular: true },
  { id: "jewellery", name: "Jewellery", icon: "diamond-outline", popular: true },
  { id: "food", name: "Food & Beverages", icon: "restaurant-outline", popular: true },
  { id: "home-decor", name: "Home Decor", icon: "bed-outline", popular: true },
  { id: "events", name: "Event Management", icon: "calendar-outline", popular: true },
];

export const EXTENDED_CATEGORIES: CategoryItem[] = [
  ...POPULAR_CATEGORIES,
  { id: "bakeries", name: "Bakeries & Cakes", icon: "nutrition-outline" },
  { id: "boutiques", name: "Boutiques & Tailoring", icon: "pencil-outline" },
  { id: "catering", name: "Catering Services", icon: "fast-food-outline" },
  { id: "childcare", name: "Childcare & Daycare", icon: "happy-outline" },
  { id: "fitness", name: "Fitness & Yoga", icon: "fitness-outline" },
  { id: "handicrafts", name: "Handicrafts & Gifts", icon: "gift-outline" },
  { id: "healthcare", name: "Healthcare & Wellness", icon: "medkit-outline" },
  { id: "makeup", name: "Mehndi & Makeup Art", icon: "brush-outline" },
  { id: "photography", name: "Photography & Studios", icon: "camera-outline" },
  { id: "tuition", name: "Tuition & Coaching", icon: "school-outline" },
  { id: "interiors", name: "Interior Design", icon: "home-outline" },
  { id: "cleaning", name: "Home & Cleaning Services", icon: "water-outline" },
];

export const TAMIL_NADU_CITIES: string[] = [
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Tiruchirappalli",
  "Salem",
  "Tirunelveli",
  "Erode",
  "Vellore",
  "Thanjavur",
  "Dindigul",
  "Kanchipuram",
  "Tiruppur",
  "Cuddalore",
  "Nagercoil",
  "Karur",
  "Hosur",
  "Kumbakonam",
  "Thoothukudi",
];

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const TIME_SLOTS: string[] = [
  "06:00 AM",
  "06:30 AM",
  "07:00 AM",
  "07:30 AM",
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
  "09:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
];

export const DEFAULT_HIGHLIGHTS: string[] = [
  "Home Delivery",
  "Online Payment",
  "Parking Available",
  "Wheelchair Friendly",
  "Air Conditioned",
  "By Appointment Only",
  "Women-Staffed",
  "Trial Room Available",
  "Free Wi-Fi",
];

export const LISTING_PLANS: ListingPlanOption[] = [
  {
    id: "Silver",
    name: "Silver Listing",
    price: "FREE",
    billingPeriod: "Forever",
    badge: "Basic",
    popular: false,
    features: [
      "Standard business profile",
      "Listed in search and category results",
      "Direct phone calls & WhatsApp enquiries",
      "Up to 3 portfolio photos",
    ],
  },
  {
    id: "Gold",
    name: "Gold Package",
    price: "₹1,499",
    billingPeriod: "/ year",
    badge: "Most Popular",
    popular: true,
    features: [
      "Top priority in category & search results",
      "Verified Women-Owned badge",
      "Full gallery with up to 10 photos + video",
      "Fast-track verification within 24 hours",
      "Dedicated WhatsApp lead support",
    ],
  },
];

export const STEP_CONFIGS: Record<AddBusinessStep, StepConfig | null> = {
  intro: null,
  details: {
    key: "details",
    index: 1,
    title: "Business Details",
    subtitle: "Tell customers about your business name and services",
    estimatedTime: "About 4 min left",
  },
  category: {
    key: "category",
    index: 2,
    title: "Select Category",
    subtitle: "Pick up to 3 categories that best describe what you do",
    estimatedTime: "About 3 min left",
  },
  location: {
    key: "location",
    index: 3,
    title: "Business Location",
    subtitle: "Help local customers find and visit your shop or studio",
    estimatedTime: "About 2.5 min left",
  },
  contact: {
    key: "contact",
    index: 4,
    title: "Contact Details",
    subtitle: "Where leads and customer calls should reach you",
    estimatedTime: "About 2 min left",
  },
  timings: {
    key: "timings",
    index: 5,
    title: "Hours & Amenities",
    subtitle: "Set working days, opening hours and highlights",
    estimatedTime: "About 1 min left",
  },
  media: {
    key: "media",
    index: 6,
    title: "Photos & Media",
    subtitle: "Add your logo and at least 3 photos of your work or store",
    estimatedTime: "Less than 1 min left",
  },
  review: {
    key: "review",
    index: 6,
    title: "Review & Choose Plan",
    subtitle: "Confirm your information and select your listing plan",
    estimatedTime: "Final Step",
  },
  success: null,
};

export const INTRO_BENEFITS = [
  {
    icon: "trending-up-outline" as const,
    title: "Reach 10,000+ Local Customers",
    description: "Get discovered by verified buyers looking for trusted services across Tamil Nadu.",
  },
  {
    icon: "shield-checkmark-outline" as const,
    title: "Build Trust as a Verified Business",
    description: "Display the WOW verified badge to prove authenticity and win customer confidence.",
  },
  {
    icon: "wallet-outline" as const,
    title: "Free to List with Zero Commission",
    description: "All customer enquiries and orders go directly to your phone and WhatsApp without platform cut.",
  },
];

