import React, { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/shared/theme/colors";
import { BusinessListingItem } from "../types/business.types";

interface EnquiryModalProps {
  business: BusinessListingItem | null;
  visible: boolean;
  onClose: () => void;
}

export default function EnquiryModal({
  business,
  visible,
  onClose,
}: EnquiryModalProps) {
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!business) return null;

  const handleSubmit = () => {
    if (!userName.trim() || !userPhone.trim()) {
      if (Platform.OS === "web") {
        window.alert("Please provide your name and phone number so the business can contact you.");
      } else {
        Alert.alert("Required Fields", "Please enter your name and contact phone number.");
      }
      return;
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setUserName("");
      setUserPhone("");
      setMessage("");
      onClose();
      if (Platform.OS === "web") {
        window.alert(`Thank you! Your enquiry has been sent to ${business.name}. They will reach out shortly.`);
      } else {
        Alert.alert("Enquiry Sent", `Your message was delivered to ${business.name}.`);
      }
    }, 1200);
  };

  const handleDirectWhatsApp = () => {
    const cleanNumber = business.whatsapp.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello ${business.name}, I am ${userName || "interested customer"}. I would like to enquire about your services listed on WOW.`
    );
    Linking.openURL(`https://wa.me/${cleanNumber}?text=${msg}`).catch(() => { });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleWrap}>
              <Ionicons name="chatbubble-ellipses" size={20} color={WOW_COLORS.primaryPink} />
              <Text style={styles.title}>Send Enquiry</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={WOW_COLORS.primaryText} />
            </Pressable>
          </View>

          {/* Business Summary Header */}
          <View style={styles.bizPreview}>
            <Image source={{ uri: business.imageUrl }} style={styles.bizThumb} />
            <View style={styles.bizMeta}>
              <Text style={styles.bizName} numberOfLines={1}>
                {business.name}
              </Text>
              <Text style={styles.bizSub}>{business.category} • {business.city}</Text>
              <View style={styles.bizPhoneRow}>
                <Ionicons name="call" size={12} color={WOW_COLORS.green} />
                <Text style={styles.bizPhone}>{business.phone}</Text>
              </View>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Your Full Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Priya Sundaram"
              placeholderTextColor="#9CA3AF"
              value={userName}
              onChangeText={setUserName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Contact Phone / WhatsApp *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="+91 98765 43210"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={userPhone}
              onChangeText={setUserPhone}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>What are you looking for?</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe your requirement, preferred dates, or query..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              value={message}
              onChangeText={setMessage}
            />
          </View>

          {/* Submit Button */}
          <Pressable
            style={[styles.submitBtn, isSubmitted && styles.submitBtnDone]}
            onPress={handleSubmit}
            accessibilityRole="button"
          >
            <Ionicons
              name={isSubmitted ? "checkmark-circle" : "send"}
              size={16}
              color={WOW_COLORS.white}
            />
            <Text style={styles.submitBtnText}>
              {isSubmitted ? "Sending Enquiry..." : "Send Free Enquiry"}
            </Text>
          </Pressable>

          {/* Or WhatsApp option */}
          <Pressable
            style={styles.whatsAppAlternative}
            onPress={handleDirectWhatsApp}
            accessibilityRole="button"
          >
            <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
            <Text style={styles.whatsAppText}>Chat Directly on WhatsApp</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: WOW_COLORS.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
  },
  closeBtn: {
    padding: 4,
  },
  bizPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  bizThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  bizMeta: {
    flex: 1,
  },
  bizName: {
    fontSize: 14,
    fontWeight: "700",
    color: WOW_COLORS.primaryText,
  },
  bizSub: {
    fontSize: 11,
    color: WOW_COLORS.secondaryText,
    marginTop: 1,
  },
  bizPhoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  bizPhone: {
    fontSize: 11,
    color: WOW_COLORS.green,
    fontWeight: "600",
  },
  formGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: WOW_COLORS.primaryText,
    backgroundColor: WOW_COLORS.background,
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: WOW_COLORS.primaryPink,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 6,
  },
  submitBtnDone: {
    backgroundColor: WOW_COLORS.green,
  },
  submitBtnText: {
    color: WOW_COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
  whatsAppAlternative: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    marginTop: 8,
  },
  whatsAppText: {
    color: "#16A34A",
    fontSize: 12,
    fontWeight: "700",
  },
});

