import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, WOW_COLORS } from "@/shared/theme/colors";
import ScreenWrapper from "@/shared/components/ScreenWrapper";
import AddBusinessForm from "@/features/business/components/AddBusinessForm";

export default function AddRoute() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={WOW_COLORS.primaryText} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Business</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AddBusinessForm onSubmitSuccess={() => router.push("/businesses")} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: COLORS.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  scroll: {
    padding: 16,
    paddingBottom: 120,
  },
});

