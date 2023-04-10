import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
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
          <Text>{item.display_name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
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
      <FlatList
        data={locations}
        renderItem={renderItem}
        keyExtractor={(item) => item.place_id}
      />
    </View>
  );
};

export default function FullScreenSearch({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <SearchContainer navigation={navigation} />
      <Image style={styles.ImageContainer} source={SearchImage} />
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
  ImageContainer: {
    resizeMode: "contain",
    width: "90%",
    height: "100%",
    marginHorizontal: 20,
  },
  locationItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});

// const SettingsScreen = () => {
//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Settings</Text>
//         <View />
//       </View>

//       {/* Profile Picture */}
//       <View style={styles.profilePictureContainer}>
//         <Image
//           source={require("./path/to/profile/picture.png")}
//           style={styles.profilePicture}
//         />
//       </View>

//       {/* Options */}
//       <View style={styles.optionsContainer}>
//         <TouchableOpacity style={styles.option}>
//           <Ionicons name="log-out" size={24} color="black" />
//           <Text style={styles.optionTitle}>Logout</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.option}>
//           <Ionicons name="information-circle" size={24} color="black" />
//           <Text style={styles.optionTitle}>Info</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.option}>
//           <Ionicons name="person" size={24} color="black" />
//           <Text style={styles.optionTitle}>Profile</Text>
//         </TouchableOpacity>
//         {/* Add more options here */}
//       </View>
//     </View>
//   );
// };

// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
// import { Ionicons } from "@expo/vector-icons"; // assuming you're using Expo

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     flex: 1,
//     marginLeft: -24,
//   },
//   profilePictureContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 32,
//   },
//   profilePicture: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//   },
//   optionsContainer: {
//     marginTop: 32,
//   },
//   option: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   optionTitle: {
//     marginLeft: 16,
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });
