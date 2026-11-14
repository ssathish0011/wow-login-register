import React, { useEffect, useRef } from "react";
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import type { ScrollView as ScrollViewType } from "react-native";
import { useRouter } from "expo-router";
import { ONBOARDING_THEME } from "../theme/onboardingTheme";
import { useAddBusinessForm } from "../hooks/useAddBusinessForm";
import { OnboardingHeader } from "../components/OnboardingHeader";
import { IntroStep } from "../components/IntroStep";
import { BusinessDetailsStep } from "../components/BusinessDetailsStep";
import { CategoryStep } from "../components/CategoryStep";
import { LocationStep } from "../components/LocationStep";
import { ContactStep } from "../components/ContactStep";
import { TimingsStep } from "../components/TimingsStep";
import { MediaStep } from "../components/MediaStep";
import { ReviewStep } from "../components/ReviewStep";
import { SuccessStep } from "../components/SuccessStep";
import { StickyFooter } from "../components/ui/StickyFooter";

// The screen adds the padding for form steps, so the step components
// should NOT add their own padding.
const SCREEN_PADDING_X = 20;
const SCREEN_PADDING_TOP = 16;
const SCREEN_PADDING_BOTTOM = 32;
const SECTION_GAP = 20;

export const AddBusinessScreen = React.memo(function AddBusinessScreen() {
  const router = useRouter();
  // typed as any to avoid RN 58 ScrollView ref typing mismatch
  const scrollRef = useRef<any>(null);

  const {
    currentStep,
    formData,
    errors,
    isSubmitting,
    isDirty,
    updateField,
    goNext,
    goBack,
    jumpToStep,
    submitForm,
  } = useAddBusinessForm();

  const isIntro = currentStep === "intro";
  const isSuccess = currentStep === "success";
  const isFormStep = !isIntro && !isSuccess;

  // Intro handles its own insets. Form steps need the top inset only.
  const safeEdges: Edge[] = isIntro
    ? []
    : isFormStep
      ? ["top"]
      : ["top", "bottom"];

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentStep]);

  const handleBackNavigation = () => {
    if (currentStep === "intro") {
      router.back();
      return;
    }

    if (currentStep === "success") {
      router.replace("/(user)/(tabs)/home" as any);
      return;
    }

    if (currentStep === "details" && isDirty) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved information. Are you sure you want to leave?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => router.back(),
          },
        ]
      );
      return;
    }

    goBack();
  };

  useEffect(() => {
    const onBackPress = () => {
      handleBackNavigation();
      return true;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isDirty]);

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        // Form steps: the status bar area matches the white header.
        // Intro and success keep the normal background.
        isFormStep && styles.safeAreaForm,
      ]}
      edges={safeEdges}
    >
      <StatusBar barStyle="dark-content" />

      {isIntro && <IntroStep onStart={goNext} onClose={() => router.back()} />}

      {isSuccess && (
        <SuccessStep
          businessName={formData.businessName}
          onHomePress={() => router.replace("/(user)/(tabs)/home" as any)}
        />
      )}

      {isFormStep && (
        <>
          <OnboardingHeader
            currentStep={currentStep}
            onBack={handleBackNavigation}
          />

          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              ref={scrollRef}
              style={styles.scrollView}
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {currentStep === "details" && (
                <BusinessDetailsStep
                  formData={formData}
                  errors={errors}
                  onChangeField={updateField}
                />
              )}

              {currentStep === "category" && (
                <CategoryStep
                  formData={formData}
                  errors={errors}
                  onChangeField={updateField}
                />
              )}

              {currentStep === "location" && (
                <LocationStep
                  formData={formData}
                  errors={errors}
                  onChangeField={updateField}
                />
              )}

              {currentStep === "contact" && (
                <ContactStep
                  formData={formData}
                  errors={errors}
                  onChangeField={updateField}
                />
              )}

              {currentStep === "timings" && (
                <TimingsStep
                  formData={formData}
                  errors={errors}
                  onChangeField={updateField}
                />
              )}

              {currentStep === "media" && (
                <MediaStep
                  formData={formData}
                  errors={errors}
                  onChangeField={updateField}
                />
              )}

              {currentStep === "review" && (
                <ReviewStep
                  formData={formData}
                  errors={errors}
                  onEditSection={jumpToStep}
                  onSelectPlan={(plan) => updateField("selectedPlan", plan)}
                  onToggleTerms={(agreed) =>
                    updateField("agreedToTerms", agreed)
                  }
                />
              )}
            </ScrollView>

            <StickyFooter
              primaryTitle={
                currentStep === "review"
                  ? "Submit for Review"
                  : "Save & Continue"
              }
              onPrimaryPress={currentStep === "review" ? submitForm : goNext}
              isLoading={isSubmitting}
              secondaryTitle={currentStep === "details" ? "Cancel" : "Back"}
              onSecondaryPress={handleBackNavigation}
            />
          </KeyboardAvoidingView>
        </>
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ONBOARDING_THEME.colors.bg,
  },
  safeAreaForm: {
    backgroundColor: ONBOARDING_THEME.colors.surface,
  },
  keyboardView: {
    flex: 1,
    backgroundColor: ONBOARDING_THEME.colors.bg,
  },
  scrollView: {
    flex: 1,
    backgroundColor: ONBOARDING_THEME.colors.bg,
  },
  formContent: {
    flexGrow: 1,
    paddingHorizontal: SCREEN_PADDING_X,
    paddingTop: SCREEN_PADDING_TOP,
    paddingBottom: SCREEN_PADDING_BOTTOM,
    gap: SECTION_GAP,
  },
});