import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import SearchImage from "../../assets/searchpage/search.png";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";

const SearchContainer = ({ navigation }) => {
  const [inputValue, setInputValue] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (inputValue.length > 3) {
      searchLocations(inputValue);
    } else {
      setLocations([]);
    }
  }, [inputValue]);

  const searchLocations = async (query) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}*+India&countrycodes=in&limit=10`
      );

      console.log(response.data);
      setLocations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
  };
  useEffect(() => {
    if (selectedItem) {
      navigation.navigate("Home", {
        selectedItem,
        key: selectedItem.place_id,
        fromSearchScreen: true,
      });
    }
  }, [selectedItem]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleItemPress(item)}>
        <View style={styles.locationItem}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>{item.display_name}</Text>
            <Text style={styles.locationAddress}>
              {item.address?.city}, {item.address?.state},{" "}
              {item.address?.country}
            </Text>
          </View>
          <Text style={styles.locationDistance}>{item.distance} km</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="gray"
          onChangeText={handleInputChange}
          value={inputValue}
          autoFocus={true}
        />
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/482/482631.png",
          }}
          style={styles.searchIcon}
        />
      </View>
      <View style={{ zIndex: 2 }}>
        <FlatList
          style={styles.listContainer}
          data={locations}
          renderItem={renderItem}
          keyExtractor={(item) => item.place_id}
        />
      </View>
      <Image style={styles.ImageContainer} source={SearchImage} />
    </View>
  );
};

export default function FullScreenSearch({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <SearchContainer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
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
  searchContainer: {
    flex: 1,
  },
  ImageContainer: {
    resizeMode: "contain",
    width: "90%",
    height: "100%",
    marginHorizontal: 20,
    position: "absolute",
    bottom: 0,
    zIndex: 1,
  },
  locationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  locationInfo: {
    flex: 1,
    marginRight: 16,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: "#999",
  },
  locationDistance: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    backgroundColor: "white",
    zIndex: 3,
  },
});
