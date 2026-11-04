import { BusinessItem, CategoryItem } from "../types/home.types";

export const CATEGORIES_DATA: CategoryItem[] = [
  { id: "1", name: "Beauty", iconType: "beauty", active: true },
  { id: "2", name: "Fashion", iconType: "fashion", active: false },
  { id: "3", name: "Food", iconType: "food", active: false },
  { id: "4", name: "Home", iconType: "home", active: false },
  { id: "5", name: "More", iconType: "more", active: false },
];

export const FEATURED_BUSINESSES_DATA: BusinessItem[] = [
  {
    id: "1",
    name: "The Pink Brew",
    category: "Café & Bakery",
    rating: 4.8,
    reviewsCount: 120,
    location: "Chennai",
    imageUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=500&q=80",
    isSaved: true,
  },
  {
    id: "2",
    name: "Stitch & Style",
    category: "Boutique",
    rating: 4.7,
    reviewsCount: 98,
    location: "Mumbai",
    imageUrl:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=500&q=80",
    isSaved: true,
  },
  {
    id: "3",
    name: "The Pink Brew",
    category: "Café & Bakery",
    rating: 4.8,
    reviewsCount: 120,
    location: "Chennai",
    imageUrl:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=500&q=80",
    isSaved: true,
  },
  {
    id: "4",
    name: "Stitch & Style",
    category: "Boutique",
    rating: 4.7,
    reviewsCount: 98,
    location: "Mumbai",
    imageUrl:
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=500&q=80",
    isSaved: true,
  },
];

