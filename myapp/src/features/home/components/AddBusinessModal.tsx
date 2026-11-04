import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface AddBusinessModalProps {
  onSuccess: () => void;
}

export default function AddBusinessModal({ onSuccess }: AddBusinessModalProps) {
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = () => {
    if (!businessName.trim() || !category.trim()) {
      Alert.alert("Required", "Please provide at least a Business Name and Category.");
      return;
    }
    Alert.alert(
      "Submission Received!",
      "Thank you for listing your business on WOW. Our team will verify and feature it shortly.",
      [{ text: "OK", onPress: onSuccess }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Your Business</Text>
      <Text style={styles.subheading}>
        Showcase your venture to thousands of women supporters and customers.
      </Text>

      <View style={styles.formCard}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Business Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Blossom Cakes & Treats"
            placeholderTextColor="#9CA3AF"
            value={businessName}
            onChangeText={setBusinessName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Category *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Food / Fashion / Beauty"
            placeholderTextColor="#9CA3AF"
            value={category}
            onChangeText={setCategory}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>City & State</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Chennai, Tamil Nadu"
            placeholderTextColor="#9CA3AF"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Phone or WhatsApp</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. +91 98765 43210"
            placeholderTextColor="#9CA3AF"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#D1006C",
    textAlign: "center",
  },
  subheading: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.2,
    borderColor: "#F3F4F6",
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
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: "#1F2937",
    backgroundColor: "#F9FAFB",
  },
  submitButton: {
    backgroundColor: "#D1006C",
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#D1006C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  submitButtonPressed: {
    backgroundColor: "#A80056",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});

