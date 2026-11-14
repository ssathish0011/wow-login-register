// import React from "react";
// import { Pressable, StyleSheet, Text, View } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { COLORS } from "@/shared/theme/colors";
// import { CategoryItem } from "../../home/types/home.types";

// interface CategoryRowProps {
//   category: CategoryItem;
//   onPress: (category: CategoryItem) => void;
// }

// export default function CategoryRow({ category, onPress }: CategoryRowProps) {
//   const getIcon = () => {
//     switch (category.iconType) {
//       case "beauty":
//         return <Ionicons name="sparkles" size={22} color={COLORS.brand} />;
//       case "fashion":
//         return <Ionicons name="shirt-outline" size={22} color={COLORS.brand} />;
//       case "food":
//         return <Ionicons name="cafe-outline" size={22} color={COLORS.brand} />;
//       case "home":
//         return <Ionicons name="home-outline" size={22} color={COLORS.brand} />;
//       case "more":
//         return <Ionicons name="grid-outline" size={22} color={COLORS.brand} />;
//       default:
//         return <Ionicons name="sparkles" size={22} color={COLORS.brand} />;
//     }
//   };

//   return (
//     <Pressable
//       style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
//       onPress={() => onPress(category)}
//     >
//       <View style={styles.iconCircle}>{getIcon()}</View>
//       <View style={styles.textContainer}>
//         <Text style={styles.title}>{category.name}</Text>
//         <Text style={styles.subtitle}>
//           Browse verified women entrepreneurs in {category.name.toLowerCase()}
//         </Text>
//       </View>
//       <Ionicons name="chevron-forward" size={20} color={COLORS.brand} />
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "transparent",
//     borderRadius: 16,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: COLORS.brand,
//     marginBottom: 10,
//   },
//   rowPressed: {
//     opacity: 0.6,
//   },
//   iconCircle: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     backgroundColor: "transparent",
//     borderWidth: 1,
//     borderColor: COLORS.brand,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 14,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: COLORS.ink,
//   },
//   subtitle: {
//     fontSize: 12,
//     color: COLORS.textMuted,
//     marginTop: 2,
//   },
// });




import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/theme/colors";
import { CategoryItem } from "../../home/types/home.types";

interface CategoryScreenProps {
  categories: CategoryItem[];
  onPress: (category: CategoryItem) => void;
}

export default function CategoryScreen({
  categories,
  onPress,
}: CategoryScreenProps) {
  const [search, setSearch] = React.useState("");

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderCategory = ({ item }: { item: CategoryItem }) => (
    <Pressable
      style={styles.categoryItem}
      onPress={() => onPress(item)}
    >
      <Text style={styles.categoryName}>{item.name}</Text>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={COLORS.textMuted}
      />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={21}
          color={COLORS.textMuted}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />

        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={COLORS.textMuted}
            />
          </Pressable>
        )}
      </View>

      {/* Category List */}
      {/* <FlatList
        data={filteredCategories}
        keyExtractor={(item, index) =>
          `${item.name}-${index}`
        }
        renderItem={renderCategory}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No categories found
          </Text>
        }
        /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white || "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.ink,
    marginLeft: 10,
    paddingVertical: 0,
  },

  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  categoryName: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.ink,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 14,
    color: COLORS.textMuted,
  },
});
