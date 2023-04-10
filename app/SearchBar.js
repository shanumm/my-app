import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

// Define your styles here
const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginVertical: 8,
  },
  searchPlaceholder: {
    flex: 1,
    padding: 8,
    backgroundColor: "transparent",
    fontSize: 16,
    color: "gray",
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
});

const SearchBar = ({ fromLanding }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (fromLanding) {
      navigation.navigate("SearchComponent");
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.searchBarContainer}>
        <Text style={styles.searchPlaceholder}>Search</Text>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/482/482631.png",
          }}
          style={styles.searchIcon}
        />
      </View>
    </TouchableOpacity>
  );
};

export default SearchBar;
