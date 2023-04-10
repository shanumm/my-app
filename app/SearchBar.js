import React from "react";
import { View, TextInput, Image, StyleSheet } from "react-native";

// Define your styles here
const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    backgroundColor: "transparent",
    fontSize: 16,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
});

const SearchBar = ({ searchQuery, fetchSearchResults }) => {
  return (
    <View style={styles.searchBarContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="gray"
        value={searchQuery}
        onChangeText={(text) => {
        //   fetchSearchResults(text);
        }}
      />
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/482/482631.png",
        }}
        style={styles.searchIcon}
      />
    </View>
  );
};

export default SearchBar;
