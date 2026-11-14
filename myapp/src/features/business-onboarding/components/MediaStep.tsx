import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { FormField } from "./ui/FormField";
import { AddBusinessFormData, FormErrors } from "../types/addBusiness.types";
import { ONBOARDING_THEME } from "../theme/onboardingTheme";

interface MediaStepProps {
  formData: AddBusinessFormData;
  errors: FormErrors;
  onChangeField: <K extends keyof AddBusinessFormData>(
    key: K,
    value: AddBusinessFormData[K]
  ) => void;
}

export const MediaStep = React.memo(function MediaStep({
  formData,
  errors,
  onChangeField,
}: MediaStepProps) {
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant photo library access to upload your business logo and photos."
        );
        return false;
      }
      return true;
    } catch {
      return true;
    }
  };

  const handlePickLogo = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      setLoadingLogo(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onChangeField("logoUri", result.assets[0].uri);
      }
    } catch {
      Alert.alert("Error", "Could not pick image. Please try again.");
    } finally {
      setLoadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    onChangeField("logoUri", null);
  };

  const handlePickPhotos = async () => {
    const currentCount = formData.photos.length;
    if (currentCount >= 10) {
      Alert.alert("Maximum Limit", "You can upload up to 10 photos.");
      return;
    }

    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      setLoadingPhotos(true);
      const remainingSlots = 10 - currentCount;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newUris = result.assets.map((asset) => asset.uri);
        const merged = [...formData.photos, ...newUris].slice(0, 10);
        onChangeField("photos", merged);
      }
    } catch {
      Alert.alert("Error", "Could not pick photos. Please try again.");
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleRemovePhoto = (targetIndex: number) => {
    const filtered = formData.photos.filter((_, idx: number) => idx !== targetIndex);
    onChangeField("photos", filtered);
  };

  return (
    <View style={styles.container}>
      {/* Business Logo Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Business Logo <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.sectionSubtitle}>
          Square logo or shop icon displayed on search results and your profile
        </Text>
      </View>

      {formData.logoUri ? (
        <View style={styles.logoCard}>
          <Image source={{ uri: formData.logoUri }} style={styles.logoImage} />
          <View style={styles.logoInfo}>
            <View style={styles.logoBadge}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={ONBOARDING_THEME.colors.success}
              />
              <Text style={styles.logoBadgeText}>Logo Uploaded</Text>
            </View>
            <View style={styles.logoActions}>
              <Pressable
                style={styles.logoActionBtn}
                onPress={handlePickLogo}
                disabled={loadingLogo}
              >
                <Ionicons
                  name="camera-outline"
                  size={14}
                  color={ONBOARDING_THEME.colors.primary}
                />
                <Text style={styles.logoActionText}>Change</Text>
              </Pressable>
              <Pressable
                style={[styles.logoActionBtn, styles.logoDeleteBtn]}
                onPress={handleRemoveLogo}
              >
                <Ionicons
                  name="trash-outline"
                  size={14}
                  color={ONBOARDING_THEME.colors.error}
                />
                <Text style={styles.logoDeleteText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <Pressable
          style={styles.uploadDashedBox}
          onPress={handlePickLogo}
          disabled={loadingLogo}
        >
          {loadingLogo ? (
            <ActivityIndicator color={ONBOARDING_THEME.colors.primary} />
          ) : (
            <>
              <View style={styles.uploadIconCircle}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={24}
                  color={ONBOARDING_THEME.colors.primary}
                />
              </View>
              <Text style={styles.uploadTitle}>Upload Business Logo</Text>
              <Text style={styles.uploadSubtitle}>
                PNG, JPG or WEBP (Square 1:1, up to 5 MB)
              </Text>
            </>
          )}
        </Pressable>
      )}
      {errors.logoUri && (
        <View style={styles.errorRow}>
          <Ionicons
            name="alert-circle"
            size={14}
            color={ONBOARDING_THEME.colors.error}
          />
          <Text style={styles.errorText}>{errors.logoUri}</Text>
        </View>
      )}

      {/* Business Photos Gallery */}
      <View
        style={[
          styles.sectionHeader,
          { marginTop: ONBOARDING_THEME.spacing.lg },
        ]}
      >
        <View style={styles.photosTitleRow}>
          <Text style={styles.sectionTitle}>
            Business Photos <Text style={styles.required}>*</Text>
          </Text>
          <View
            style={[
              styles.countPill,
              formData.photos.length >= 3 && styles.countPillActive,
            ]}
          >
            <Text
              style={[
                styles.countPillText,
                formData.photos.length >= 3 && styles.countPillTextActive,
              ]}
            >
              {formData.photos.length}/10 (Min 3)
            </Text>
          </View>
        </View>
        <Text style={styles.sectionSubtitle}>
          Showcase your storefront, interior, product shelves, and work samples
        </Text>
      </View>

      <View style={styles.photosGrid}>
        {formData.photos.map((uri: string, index: number) => (
          <View key={`${uri}-${index}`} style={styles.photoItem}>
            <Image source={{ uri }} style={styles.photoThumb} />
            <Pressable
              style={styles.deletePhotoBtn}
              onPress={() => handleRemovePhoto(index)}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={`Delete photo ${index + 1}`}
            >
              <Ionicons name="close" size={13} color="#FFFFFF" />
            </Pressable>
            {index === 0 && (
              <View style={styles.coverBadge}>
                <Text style={styles.coverBadgeText}>Cover</Text>
              </View>
            )}
          </View>
        ))}

        {formData.photos.length < 10 && (
          <Pressable
            style={styles.addPhotoCard}
            onPress={handlePickPhotos}
            disabled={loadingPhotos}
          >
            {loadingPhotos ? (
              <ActivityIndicator color={ONBOARDING_THEME.colors.primary} />
            ) : (
              <>
                <Ionicons
                  name="add-circle"
                  size={26}
                  color={ONBOARDING_THEME.colors.primary}
                />
                <Text style={styles.addPhotoText}>Add Photo</Text>
                <Text style={styles.addPhotoSub}>
                  {10 - formData.photos.length} left
                </Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      {errors.photos && (
        <View style={styles.errorRow}>
          <Ionicons
            name="alert-circle"
            size={14}
            color={ONBOARDING_THEME.colors.error}
          />
          <Text style={styles.errorText}>{errors.photos}</Text>
        </View>
      )}

      {/* Promotional Video */}
      <View style={{ marginTop: ONBOARDING_THEME.spacing.lg }}>
        <FormField
          label="Promotional Video URL (Optional)"
          value={formData.videoUrl}
          onChangeText={(text) => onChangeField("videoUrl", text)}
          placeholder="https://www.youtube.com/watch?v=..."
          helperText="YouTube or Vimeo video link showcasing your services"
          autoCapitalize="none"
          keyboardType="url"
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ONBOARDING_THEME.spacing.screen,
    paddingTop: ONBOARDING_THEME.spacing.base,
    paddingBottom: ONBOARDING_THEME.spacing.xxl,
  },
  sectionHeader: {
    marginBottom: ONBOARDING_THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: ONBOARDING_THEME.typography.section.fontSize,
    fontWeight: "600",
    color: ONBOARDING_THEME.colors.textPrimary,
  },
  required: {
    color: ONBOARDING_THEME.colors.error,
  },
  sectionSubtitle: {
    fontSize: ONBOARDING_THEME.typography.caption.fontSize,
    color: ONBOARDING_THEME.colors.textMuted,
    marginTop: 2,
  },
  photosTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  countPill: {
    paddingHorizontal: ONBOARDING_THEME.spacing.sm,
    paddingVertical: 2,
    borderRadius: ONBOARDING_THEME.radius.full,
    backgroundColor: ONBOARDING_THEME.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.border,
  },
  countPillActive: {
    backgroundColor: ONBOARDING_THEME.colors.successLight,
    borderColor: ONBOARDING_THEME.colors.success,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: ONBOARDING_THEME.colors.textMuted,
  },
  countPillTextActive: {
    color: ONBOARDING_THEME.colors.success,
  },
  uploadDashedBox: {
    height: 120,
    borderRadius: ONBOARDING_THEME.radius.md,
    borderWidth: 1.5,
    borderColor: ONBOARDING_THEME.colors.primaryBorder,
    borderStyle: "dashed",
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  uploadIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  uploadTitle: {
    fontSize: ONBOARDING_THEME.typography.body.fontSize,
    fontWeight: "600",
    color: ONBOARDING_THEME.colors.primary,
  },
  uploadSubtitle: {
    fontSize: ONBOARDING_THEME.typography.caption.fontSize,
    color: ONBOARDING_THEME.colors.textMuted,
  },
  logoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ONBOARDING_THEME.colors.surface,
    borderRadius: ONBOARDING_THEME.radius.md,
    borderWidth: 1,
    borderColor: ONBOARDING_THEME.colors.border,
    padding: ONBOARDING_THEME.spacing.md,
    gap: ONBOARDING_THEME.spacing.md,
  },
  logoImage: {
    width: 68,
    height: 68,
    borderRadius: ONBOARDING_THEME.radius.sm,
    backgroundColor: ONBOARDING_THEME.colors.surfaceSecondary,
  },
  logoInfo: {
    flex: 1,
    gap: 6,
  },
  logoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  logoBadgeText: {
    fontSize: ONBOARDING_THEME.typography.caption.fontSize,
    color: ONBOARDING_THEME.colors.success,
    fontWeight: "600",
  },
  logoActions: {
    flexDirection: "row",
    gap: ONBOARDING_THEME.spacing.sm,
  },
  logoActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: ONBOARDING_THEME.spacing.sm,
    paddingVertical: 5,
    borderRadius: ONBOARDING_THEME.radius.sm,
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
  },
  logoActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: ONBOARDING_THEME.colors.primary,
  },
  logoDeleteBtn: {
    backgroundColor: ONBOARDING_THEME.colors.errorLight,
  },
  logoDeleteText: {
    fontSize: 12,
    fontWeight: "600",
    color: ONBOARDING_THEME.colors.error,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  photoItem: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: ONBOARDING_THEME.radius.md,
    overflow: "hidden",
    position: "relative",
  },
  photoThumb: {
    width: "100%",
    height: "100%",
    borderRadius: ONBOARDING_THEME.radius.md,
  },
  deletePhotoBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  coverBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: ONBOARDING_THEME.colors.primary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  coverBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  addPhotoCard: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: ONBOARDING_THEME.radius.md,
    borderWidth: 1.5,
    borderColor: ONBOARDING_THEME.colors.primaryBorder,
    borderStyle: "dashed",
    backgroundColor: ONBOARDING_THEME.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  addPhotoText: {
    fontSize: 11,
    fontWeight: "600",
    color: ONBOARDING_THEME.colors.primary,
  },
  addPhotoSub: {
    fontSize: 9,
    color: ONBOARDING_THEME.colors.textMuted,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: ONBOARDING_THEME.spacing.sm,
  },
  errorText: {
    fontSize: ONBOARDING_THEME.typography.caption.fontSize,
    color: ONBOARDING_THEME.colors.error,
  },
});
