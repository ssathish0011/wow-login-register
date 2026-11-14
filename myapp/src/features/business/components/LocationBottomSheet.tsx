import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/shared/theme/colors";
import { CITIES_LIST } from "../data/businessListingData";

interface LocationBottomSheetProps {
  visible: boolean;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onClose: () => void;
  onDetectCurrentLocation?: () => void;
  isDetecting?: boolean;
}

export default function LocationBottomSheet({
  visible,
  selectedCity,
  onSelectCity,
  onClose,
  onDetectCurrentLocation,
  isDetecting = false,
}: LocationBottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
        <View style={styles.sheetContainer}>
          {/* Drag Handle Bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleGroup}>
              <Ionicons name="location-sharp" size={18} color={WOW_COLORS.primaryPink} />
              <Text style={styles.title}>Select Location</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={WOW_COLORS.primaryText} />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Explore trusted women-led businesses and services near you
          </Text>

          {/* Auto-Detect GPS Button */}
          {onDetectCurrentLocation && (
            <Pressable
              style={styles.detectLocationBtn}
              onPress={() => {
                onDetectCurrentLocation();
                onClose();
              }}
              accessibilityRole="button"
            >
              <View style={styles.gpsIconWrap}>
                <Ionicons name="locate" size={18} color={WOW_COLORS.white} />
              </View>
              <View style={styles.detectMeta}>
                <Text style={styles.detectTitle}>Use My Current Location</Text>
                <Text style={styles.detectSubtitle}>
                  {isDetecting ? "Detecting via GPS..." : "Auto-detect area using GPS"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={WOW_COLORS.primaryPink} />
            </Pressable>
          )}

          {/* Cities List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cityList}
          >
            {CITIES_LIST.map((city) => {
              const isSelected = selectedCity === city;
              return (
                <Pressable
                  key={city}
                  style={[styles.cityRow, isSelected && styles.cityRowSelected]}
                  onPress={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.cityInfo}>
                    <View
                      style={[
                        styles.iconWrap,
                        isSelected && styles.iconWrapSelected,
                      ]}
                    >
                      <Ionicons
                        name={city === "All Locations" ? "globe-outline" : "business-outline"}
                        size={16}
                        color={isSelected ? WOW_COLORS.white : WOW_COLORS.primaryPink}
                      />
                    </View>
                    <Text
                      style={[
                        styles.cityName,
                        isSelected && styles.cityNameSelected,
                      ]}
                    >
                      {city}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color={WOW_COLORS.white} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  backdropPressable: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: WOW_COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
    maxHeight: "75%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handleBar: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    fontSize: 12,
    color: WOW_COLORS.secondaryText,
    marginBottom: 14,
  },
  detectLocationBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WOW_COLORS.softPink,
    borderWidth: 1.5,
    borderColor: WOW_COLORS.primaryPink,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 14,
    gap: 12,
  },
  gpsIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WOW_COLORS.primaryPink,
    alignItems: "center",
    justifyContent: "center",
  },
  detectMeta: {
    flex: 1,
  },
  detectTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: WOW_COLORS.primaryPink,
  },
  detectSubtitle: {
    fontSize: 11,
    color: WOW_COLORS.secondaryText,
    marginTop: 1,
  },
  cityList: {
    gap: 8,
    paddingBottom: 10,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
  },
  cityRowSelected: {
    backgroundColor: WOW_COLORS.softPink,
    borderColor: WOW_COLORS.primaryPink,
  },
  cityInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WOW_COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapSelected: {
    backgroundColor: WOW_COLORS.primaryPink,
  },
  cityName: {
    fontSize: 14,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
  },
  cityNameSelected: {
    color: WOW_COLORS.primaryPink,
    fontWeight: "800",
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    backgroundColor: WOW_COLORS.primaryPink,
    borderColor: WOW_COLORS.primaryPink,
  },
});

