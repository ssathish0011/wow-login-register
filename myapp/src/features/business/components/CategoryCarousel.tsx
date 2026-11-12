import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/common/constants/colors";
import { BUSINESS_CATEGORIES } from "../data/businessListingData";

interface CategoryCarouselProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
}

export default function CategoryCarousel({
  selectedCategory,
  onSelectCategory,
}: CategoryCarouselProps) {
  const [viewAllVisible, setViewAllVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {/* All Categories Option */}
        <Pressable
          style={styles.categoryItem}
          onPress={() => onSelectCategory(null)}
          accessibilityRole="button"
          accessibilityLabel="All Categories"
        >
          <View
            style={[
              styles.iconBox,
              selectedCategory === null && styles.iconBoxActive,
            ]}
          >
            <Ionicons
              name="apps"
              size={20}
              color={selectedCategory === null ? WOW_COLORS.white : WOW_COLORS.primaryPink}
            />
          </View>
          <Text
            style={[
              styles.label,
              selectedCategory === null && styles.labelActive,
            ]}
            numberOfLines={1}
          >
            All
          </Text>
        </Pressable>

        {/* 10 Category Items */}
        {BUSINESS_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.name;
          const shortName = cat.name.split(" ")[0]; // e.g. "Beauty", "Fashion", "Food"

          return (
            <Pressable
              key={cat.id}
              style={styles.categoryItem}
              onPress={() => onSelectCategory(isActive ? null : cat.name)}
              accessibilityRole="button"
              accessibilityLabel={cat.name}
            >
              <View
                style={[
                  styles.iconBox,
                  isActive && styles.iconBoxActive,
                ]}
              >
                <Ionicons
                  name={cat.iconName}
                  size={20}
                  color={isActive ? WOW_COLORS.white : WOW_COLORS.primaryPink}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  isActive && styles.labelActive,
                ]}
                numberOfLines={1}
              >
                {shortName}
              </Text>
            </Pressable>
          );
        })}

        {/* View All Categories Pill */}
        <Pressable
          style={styles.categoryItem}
          onPress={() => setViewAllVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="View all categories"
        >
          <View style={styles.iconBoxViewAll}>
            <Ionicons name="grid-outline" size={18} color={WOW_COLORS.primaryPink} />
          </View>
          <Text style={styles.labelViewAll}>View All</Text>
        </Pressable>
      </ScrollView>

      {/* View All Categories Bottom Sheet Modal */}
      <Modal
        visible={viewAllVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setViewAllVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            style={styles.modalBackdropPressable}
            onPress={() => setViewAllVisible(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>All Categories</Text>
              <Pressable onPress={() => setViewAllVisible(false)}>
                <Ionicons name="close" size={22} color={WOW_COLORS.primaryText} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.categoryGrid}>
                {BUSINESS_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.name;
                  return (
                    <Pressable
                      key={cat.id}
                      style={[
                        styles.gridItem,
                        isActive && styles.gridItemActive,
                      ]}
                      onPress={() => {
                        onSelectCategory(isActive ? null : cat.name);
                        setViewAllVisible(false);
                      }}
                    >
                      <View
                        style={[
                          styles.gridIconWrap,
                          isActive && styles.gridIconWrapActive,
                        ]}
                      >
                        <Ionicons
                          name={cat.iconName}
                          size={22}
                          color={isActive ? WOW_COLORS.white : WOW_COLORS.primaryPink}
                        />
                      </View>
                      <Text
                        style={[
                          styles.gridLabel,
                          isActive && styles.gridLabelActive,
                        ]}
                        numberOfLines={2}
                      >
                        {cat.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WOW_COLORS.white,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: WOW_COLORS.border,
  },
  scrollList: {
    paddingHorizontal: 16,
    gap: 14,
    alignItems: "center",
  },
  categoryItem: {
    alignItems: "center",
    width: 60,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: WOW_COLORS.softPink,
    borderWidth: 1.5,
    borderColor: "#FBCFE8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  iconBoxActive: {
    backgroundColor: WOW_COLORS.primaryPink,
    borderColor: WOW_COLORS.primaryPink,
  },
  iconBoxViewAll: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1.5,
    borderColor: WOW_COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
    textAlign: "center",
  },
  labelActive: {
    color: WOW_COLORS.primaryPink,
    fontWeight: "800",
  },
  labelViewAll: {
    fontSize: 11,
    fontWeight: "700",
    color: WOW_COLORS.primaryPink,
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalBackdropPressable: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: WOW_COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 20,
    maxHeight: "80%",
  },
  modalHandle: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: WOW_COLORS.primaryText,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    borderRadius: 14,
    padding: 12,
  },
  gridItemActive: {
    backgroundColor: WOW_COLORS.softPink,
    borderColor: WOW_COLORS.primaryPink,
  },
  gridIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: WOW_COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
  },
  gridIconWrapActive: {
    backgroundColor: WOW_COLORS.primaryPink,
  },
  gridLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: WOW_COLORS.primaryText,
  },
  gridLabelActive: {
    color: WOW_COLORS.primaryPink,
    fontWeight: "800",
  },
});

