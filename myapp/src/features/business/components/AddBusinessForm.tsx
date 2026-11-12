import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { COLORS } from "@/common/constants/colors";

export interface NewBusinessData {
  businessName: string;
  category: string;
  location: string;
  contact: string;
}

interface AddBusinessFormProps {
  onSubmitSuccess?: (data: NewBusinessData) => void;
}

export default function AddBusinessForm({
  onSubmitSuccess,
}: AddBusinessFormProps) {
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = () => {
    if (!businessName.trim() || !category.trim()) {
      Alert.alert(
        "Required Fields",
        "Please provide at least a Business Name and Category."
      );
      return;
    }

    const payload: NewBusinessData = {
      businessName: businessName.trim(),
      category: category.trim(),
      location: location.trim(),
      contact: contact.trim(),
    };

    Alert.alert(
      "Submission Received!",
      "Thank you for listing your business on WOW. Our team will verify and feature it shortly.",
      [
        {
          text: "OK",
          onPress: () => {
            if (onSubmitSuccess) onSubmitSuccess(payload);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.formCard}>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Business Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Blossom Cakes & Treats"
          placeholderTextColor={COLORS.placeholder}
          value={businessName}
          onChangeText={setBusinessName}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Category *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Food / Fashion / Beauty"
          placeholderTextColor={COLORS.placeholder}
          value={category}
          onChangeText={setCategory}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>City & State</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Chennai, Tamil Nadu"
          placeholderTextColor={COLORS.placeholder}
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Phone or WhatsApp</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. +91 98765 43210"
          placeholderTextColor={COLORS.placeholder}
          keyboardType="phone-pad"
          value={contact}
          onChangeText={setContact}
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          pressed && styles.submitButtonPressed,
        ]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Submit Listing</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.2,
    borderColor: COLORS.borderLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.2,
    borderColor: COLORS.borderMedium,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: COLORS.ink,
    backgroundColor: COLORS.bgLight,
  },
  submitButton: {
    backgroundColor: COLORS.brand,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  submitButtonPressed: {
    backgroundColor: COLORS.brandDark,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
});

