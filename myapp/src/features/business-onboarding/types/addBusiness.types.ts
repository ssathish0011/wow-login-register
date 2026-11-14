export type AddBusinessStep =
  | "intro"
  | "details"
  | "category"
  | "location"
  | "contact"
  | "timings"
  | "media"
  | "review"
  | "success";

export type ContactPersonTitle = "Mr." | "Ms." | "Mrs." | "Dr.";

export type ListingPlanType = "Silver" | "Gold";

export interface AddBusinessFormData {
  // Step 1: Business Details
  businessName: string;
  tagline: string;
  description: string;

  // Step 2: Category
  categories: string[];

  // Step 3: Location
  address: string;
  city: string;
  pincode: string;
  areaLocality: string;
  landmark: string;

  // Step 4: Contact
  contactPersonTitle: ContactPersonTitle;
  contactPerson: string;
  mobile: string;
  whatsapp: string;
  sameAsMobile: boolean;
  email: string;
  website: string;

  // Step 5: Timings & Highlights
  workingDays: string[];
  openTime: string;
  closeTime: string;
  extraSlotNote: string;
  highlights: string[];

  // Step 6: Media
  logoUri: string | null;
  photos: string[];
  videoUrl: string;

  // Step 7: Plan & Review
  selectedPlan: ListingPlanType;
  agreedToTerms: boolean;
}

export type FormErrors = Partial<Record<keyof AddBusinessFormData, string>>;

export interface StepConfig {
  key: AddBusinessStep;
  index: number; // 1 to 6
  title: string;
  subtitle: string;
  estimatedTime: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  popular?: boolean;
}

export interface ListingPlanOption {
  id: ListingPlanType;
  name: string;
  price: string;
  billingPeriod: string;
  badge?: string;
  popular?: boolean;
  features: string[];
}

