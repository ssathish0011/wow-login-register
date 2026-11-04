import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  onFilterPress,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchInner}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search for businesses, services..."
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
        />
        <Pressable style={styles.filterButton} onPress={onFilterPress}>
          {/* Stylized sliders filter icon */}
          <View style={styles.slidersContainer}>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderKnob, { top: 1 }]} />
            </View>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderKnob, { bottom: 2 }]} />
            </View>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderKnob, { top: 3 }]} />
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  searchInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: "#F3F4F6",
    paddingHorizontal: 16,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    paddingVertical: 8,
  },
  filterButton: {
    padding: 6,
    marginLeft: 6,
  },
  slidersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 18,
    gap: 3.5,
  },
  sliderTrack: {
    width: 2,
    height: 16,
    backgroundColor: "#FCE7F3",
    borderRadius: 1,
    position: "relative",
  },
  sliderKnob: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#D1006C",
    left: -1.5,
  },
});

