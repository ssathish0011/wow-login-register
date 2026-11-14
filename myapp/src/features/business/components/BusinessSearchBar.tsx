import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WOW_COLORS } from "@/shared/theme/colors";
import { POPULAR_SEARCH_TERMS } from "../data/businessListingData";

interface BusinessSearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onOpenFilterSheet: () => void;
  activeFilterCount?: number;
}

export default function BusinessSearchBar({
  searchQuery,
  onSearchChange,
  onOpenFilterSheet,
  activeFilterCount = 0,
}: BusinessSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Bridal Makeup",
    "Silk Sarees",
    "Homemade Tiffin",
  ]);

  const handleSelectTerm = (term: string) => {
    onSearchChange(term);
    setIsFocused(false);
    Keyboard.dismiss();
    if (!recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev.slice(0, 4)]);
    }
  };

  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={[styles.inputBox, isFocused && styles.inputBoxFocused]}>
        <Ionicons
          name="search-outline"
          size={18}
          color={isFocused ? WOW_COLORS.primaryPink : WOW_COLORS.secondaryText}
          style={styles.searchIcon}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Search businesses, services..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={onSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          returnKeyType="search"
          onSubmitEditing={() => {
            if (searchQuery.trim()) {
              handleSelectTerm(searchQuery.trim());
            }
          }}
        />

        {searchQuery.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearBtn} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </Pressable>
        )}

        {/* Filter Trigger Button */}
        <Pressable
          style={[
            styles.filterIconBtn,
            activeFilterCount > 0 && styles.filterIconBtnActive,
          ]}
          onPress={onOpenFilterSheet}
          accessibilityRole="button"
          accessibilityLabel="Open Filters"
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={activeFilterCount > 0 ? WOW_COLORS.white : WOW_COLORS.primaryPink}
          />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Suggestion Dropdown: Recent & Popular Searches */}
      {isFocused && (
        <View style={styles.suggestionsBox}>
          {recentSearches.length > 0 && (
            <View style={styles.suggestionSection}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="time-outline" size={14} color={WOW_COLORS.secondaryText} />
                <Text style={styles.sectionTitle}>Recent Searches</Text>
              </View>
              <View style={styles.chipsWrap}>
                {recentSearches.map((term) => (
                  <Pressable
                    key={term}
                    style={styles.recentChip}
                    onPress={() => handleSelectTerm(term)}
                  >
                    <Text style={styles.recentChipText}>{term}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={styles.suggestionSection}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="trending-up" size={14} color={WOW_COLORS.primaryPink} />
              <Text style={styles.sectionTitle}>Popular Searches</Text>
            </View>
            <View style={styles.chipsWrap}>
              {POPULAR_SEARCH_TERMS.map((term) => (
                <Pressable
                  key={term}
                  style={styles.popularChip}
                  onPress={() => handleSelectTerm(term)}
                >
                  <Text style={styles.popularChipText}>{term}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: WOW_COLORS.white,
    zIndex: 15,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WOW_COLORS.background,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: WOW_COLORS.border,
    paddingLeft: 12,
    paddingRight: 6,
    height: 46,
  },
  inputBoxFocused: {
    borderColor: WOW_COLORS.primaryPink,
    backgroundColor: WOW_COLORS.white,
    shadowColor: WOW_COLORS.primaryPink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: WOW_COLORS.primaryText,
    height: "100%",
  },
  clearBtn: {
    padding: 6,
  },
  filterIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: WOW_COLORS.softPink,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  filterIconBtnActive: {
    backgroundColor: WOW_COLORS.primaryPink,
  },
  filterBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: WOW_COLORS.primaryText,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  filterBadgeText: {
    color: WOW_COLORS.white,
    fontSize: 9,
    fontWeight: "800",
  },
  suggestionsBox: {
    backgroundColor: WOW_COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    padding: 14,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  suggestionSection: {
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: WOW_COLORS.secondaryText,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  recentChip: {
    backgroundColor: WOW_COLORS.background,
    borderWidth: 1,
    borderColor: WOW_COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  recentChipText: {
    fontSize: 12,
    color: WOW_COLORS.primaryText,
    fontWeight: "500",
  },
  popularChip: {
    backgroundColor: WOW_COLORS.softPink,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  popularChipText: {
    fontSize: 12,
    color: WOW_COLORS.primaryPink,
    fontWeight: "700",
  },
});

