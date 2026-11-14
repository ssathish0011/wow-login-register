import { useCallback, useState } from "react";
import { Alert } from "react-native";
import API from "@/_duplicates/api/api";
import {
  AddBusinessFormData,
  AddBusinessStep,
  FormErrors,
} from "../types/addBusiness.types";

const INITIAL_FORM_DATA: AddBusinessFormData = {
  businessName: "",
  tagline: "",
  description: "",
  categories: [],
  address: "",
  city: "Chennai",
  pincode: "",
  areaLocality: "",
  landmark: "",
  contactPersonTitle: "Ms.",
  contactPerson: "",
  mobile: "",
  whatsapp: "",
  sameAsMobile: true,
  email: "",
  website: "",
  workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  openTime: "09:00 AM",
  closeTime: "09:00 PM",
  extraSlotNote: "",
  highlights: ["Online Payment", "Parking Available"],
  logoUri: null,
  photos: [],
  videoUrl: "",
  selectedPlan: "Gold",
  agreedToTerms: false,
};

const STEP_ORDER: AddBusinessStep[] = [
  "intro",
  "details",
  "category",
  "location",
  "contact",
  "timings",
  "media",
  "review",
  "success",
];

export function useAddBusinessForm() {
  const [currentStep, setCurrentStep] = useState<AddBusinessStep>("intro");
  const [formData, setFormData] = useState<AddBusinessFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update a single field and clear its error
  const updateField = useCallback(
    <K extends keyof AddBusinessFormData>(key: K, value: AddBusinessFormData[K]) => {
      setFormData((prev) => {
        const next = { ...prev, [key]: value };
        // Sync whatsapp with mobile if sameAsMobile is checked
        if (key === "mobile" && prev.sameAsMobile) {
          next.whatsapp = value as string;
        }
        if (key === "sameAsMobile" && Boolean(value)) {
          next.whatsapp = prev.mobile;
        }
        return next;
      });

      setErrors((prev) => {
        if (!prev[key]) return prev;
        const nextErrors = { ...prev };
        delete nextErrors[key];
        return nextErrors;
      });
    },
    []
  );

  // Validate current step
  const validateStep = useCallback(
    (step: AddBusinessStep): boolean => {
      const stepErrors: FormErrors = {};

      if (step === "details") {
        if (!formData.businessName.trim()) {
          stepErrors.businessName = "Business name is required";
        } else if (formData.businessName.trim().length < 2) {
          stepErrors.businessName = "Name must be at least 2 characters";
        }

        if (!formData.description.trim()) {
          stepErrors.description = "Business description is required";
        } else if (formData.description.trim().length < 10) {
          stepErrors.description = "Description should be at least 10 characters";
        }
      }

      if (step === "category") {
        if (formData.categories.length === 0) {
          stepErrors.categories = "Please select at least 1 category";
        } else if (formData.categories.length > 3) {
          stepErrors.categories = "You can select up to 3 categories";
        }
      }

      if (step === "location") {
        if (!formData.address.trim()) {
          stepErrors.address = "Street address is required";
        } else if (formData.address.trim().length < 5) {
          stepErrors.address = "Please enter a complete address";
        }

        if (!formData.city.trim()) {
          stepErrors.city = "City is required";
        }

        const cleanPin = formData.pincode.replace(/\D/g, "");
        if (!cleanPin) {
          stepErrors.pincode = "Pincode is required";
        } else if (cleanPin.length !== 6) {
          stepErrors.pincode = "Pincode must be exactly 6 digits";
        }

        if (!formData.areaLocality.trim()) {
          stepErrors.areaLocality = "Area / Locality is required";
        }
      }

      if (step === "contact") {
        if (!formData.contactPerson.trim()) {
          stepErrors.contactPerson = "Contact person name is required";
        }

        const cleanMobile = formData.mobile.replace(/\D/g, "");
        if (!cleanMobile) {
          stepErrors.mobile = "Mobile number is required";
        } else if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
          stepErrors.mobile = "Please enter a valid 10-digit mobile number (starts with 6-9)";
        }

        if (!formData.sameAsMobile && formData.whatsapp.trim()) {
          const cleanWa = formData.whatsapp.replace(/\D/g, "");
          if (!/^[6-9]\d{9}$/.test(cleanWa)) {
            stepErrors.whatsapp = "WhatsApp number must be a valid 10-digit mobile number";
          }
        }

        if (!formData.email.trim()) {
          stepErrors.email = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          stepErrors.email = "Please enter a valid email address";
        }
      }

      if (step === "timings") {
        if (formData.workingDays.length === 0) {
          stepErrors.workingDays = "Select at least one operating day";
        }
      }

      if (step === "media") {
        if (!formData.logoUri) {
          stepErrors.logoUri = "Please upload a business logo";
        }
        if (formData.photos.length < 3) {
          stepErrors.photos = `Please upload at least 3 photos (${formData.photos.length}/3 uploaded)`;
        }
      }

      if (step === "review") {
        if (!formData.agreedToTerms) {
          stepErrors.agreedToTerms = "You must agree to the Terms & Privacy Policy to continue";
        }
      }

      setErrors(stepErrors);
      return Object.keys(stepErrors).length === 0;
    },
    [formData]
  );

  // Navigate to the next step
  const goNext = useCallback(() => {
    if (currentStep === "intro") {
      setCurrentStep("details");
      return;
    }

    const isValid = validateStep(currentStep);
    if (!isValid) return;

    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      setCurrentStep(STEP_ORDER[currentIndex + 1]);
    }
  }, [currentStep, validateStep]);

  // Navigate to the previous step
  const goBack = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
    }
  }, [currentStep]);

  // Jump to specific step (used by Review step Edit links)
  const jumpToStep = useCallback((step: AddBusinessStep) => {
    setCurrentStep(step);
  }, []);

  // Submit form payload – wired to POST /api/business/register
  const submitForm = useCallback(async () => {
    const isValid = validateStep("review");
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      // Map form data exactly to the backend Business model fields
      const payload = {
        // Step 1 – Basic Info (Business model: businessName, contactPerson, phone, whatsapp, email)
        businessName:  formData.businessName.trim(),
        contactPerson: `${formData.contactPersonTitle} ${formData.contactPerson.trim()}`.trim(),
        phone:         formData.mobile.trim(),
        whatsapp:      formData.sameAsMobile
                         ? formData.mobile.trim()
                         : (formData.whatsapp || formData.mobile).trim(),
        email:         formData.email.trim(),

        // Step 2 – Category & Description (Business model: category, subCategory, description)
        category:     formData.categories[0] || "General",
        subCategory:  formData.categories.slice(1).join(", "),
        description:  formData.description.trim(),

        // Step 3 – Location (Business model: address, city, pincode, landmark)
        address:  formData.address.trim(),
        city:     formData.city.trim(),
        pincode:  formData.pincode.trim(),
        landmark: formData.landmark.trim(),

        // Step 4 – Timings & Operational (Business model: timing, paymentMethods)
        timing: {
          days:      formData.workingDays,
          openTime:  formData.openTime,
          closeTime: formData.closeTime,
          slots:     [],
        },
        // highlights reused as amenity tags – sent as paymentMethods array
        paymentMethods: formData.highlights.length > 0
          ? formData.highlights
          : ["Cash", "UPI / GPay"],

        // Step 5 – Media (Business model: images, videoUrl)
        images:   formData.photos,          // local URIs for now; swap with upload URLs later
        videoUrl: formData.videoUrl.trim(),

        // Step 6 – Package (Business model: package, packagePrice, paymentStatus)
        package:       formData.selectedPlan,                              // "Silver" | "Gold"
        packagePrice:  formData.selectedPlan === "Gold" ? 1499 : 0,
        paymentStatus: formData.selectedPlan === "Gold" ? "pending" : "free",
      };

      console.log("📤 Calling POST /api/business/register with payload:", payload);

      const response = await API.post("/business/register", payload);

      console.log("✅ Business registration success:", response.data);

      setCurrentStep("success");
    } catch (err: any) {
      console.error("❌ Business registration error:", err);

      const serverMessage =
        err?.response?.data?.message ||
        "Something went wrong while submitting your business. Please try again.";

      Alert.alert("Submission Failed", serverMessage, [
        { text: "OK", style: "cancel" },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateStep]);

  // Check if user has started editing
  const isDirty =
    Boolean(formData.businessName) ||
    Boolean(formData.description) ||
    formData.categories.length > 0 ||
    Boolean(formData.address);

  return {
    currentStep,
    formData,
    errors,
    isSubmitting,
    isDirty,
    updateField,
    validateStep,
    goNext,
    goBack,
    jumpToStep,
    submitForm,
  };
}

