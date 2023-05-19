import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

const LocationComponent = () => {
  const [searchInput, setSearchInput] = useState("");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [region, setRegion] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      let address = await Location.reverseGeocodeAsync(location.coords);
      setAddress(address[0]);

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    } catch (error) {
      console.error(error);
      setErrorMsg("Could not fetch location");
    }
  };

  const handleSearch = async () => {
    navigation.navigate("HomeNavigator");
  };

  const handleSuggestionPress = async (suggestion) => {
    const { latitude, longitude } = suggestion.location;
    setLocation({ coords: { latitude, longitude } });
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    // Animate region change
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }

    const [newAddress] = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    setAddress(newAddress);
  };

  const moveToCurrentLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      const { latitude, longitude } = currentLocation.coords;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      // Animate region change
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }

      const [newAddress] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      setAddress(newAddress);
    } catch (error) {
      setErrorMsg("Error moving to current location");
    }
  };
  const updateAddress = async (coords) => {
    const [newAddress] = await Location.reverseGeocodeAsync(coords);
    setAddress(newAddress);
  };

  const onRegionChangeComplete = async (newRegion) => {
    setLocation({
      coords: {
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      },
    });
    setRegion(newRegion);
    await updateAddress({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    });
  };

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!location || !region) {
    return <Text>Getting location...</Text>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        ref={mapRef} // Add the reference to the MapView
        onRegionChangeComplete={onRegionChangeComplete}
      >
        <Marker
          coordinate={location.coords}
          title="Selected Location"
          draggable
          description={
            address
              ? `${address.name ? address.name + ", " : ""}${
                  address.street ? address.street + ", " : ""
                }${address.city ? address.city + ", " : ""}${
                  address.region ? address.region + ", " : ""
                }${address.postalCode ? address.postalCode + ", " : ""}${
                  address.country ? address.country : ""
                }`
              : "Location"
          }
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/1301/1301421.png",
            }}
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
          />
        </Marker>
      </MapView>

      <View style={styles.infoContainer}>
        <Text style={styles.infoHeading}>Select Location</Text>
        <Text style={styles.addressText}>
          {address
            ? `${address.name ? address.name + ", " : ""}${
                address.street ? address.street + ", " : ""
              }${address.city ? address.city + ", " : ""}${
                address.region ? address.region + ", " : ""
              }${address.postalCode ? address.postalCode + ", " : ""}${
                address.country ? address.country : ""
              }`
            : "Location"}
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleSearch}
          >
            <Text style={styles.buttonText}>Proceed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonContainer, styles.currentLocationButton]}
            onPress={moveToCurrentLocation}
          >
            <Text style={styles.buttonText}>Current Location</Text>
          </TouchableOpacity>
        </View>
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item)}
              >
                <Text style={styles.suggestionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "white",
    paddingTop: 30,
  },
  map: {
    width: "100%",
    height: "80%",
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 10,
    borderRightWidth: 5,
    borderBottomWidth: 0,
    borderLeftWidth: 5,
    borderTopColor: "red",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
  infoContainer: {
    flex: 1,
    padding: 20,
  },
  infoHeading: {
    fontSize: 22,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 10,
    color: "grey",
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    shadowColor: "#64646F",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 29,
    elevation: 7,
    borderWidth: 0,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#02C08C",
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  currentLocationButton: {
    backgroundColor: "#0B69E9",
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  suggestionText: {
    fontSize: 16,
  },
});

export default LocationComponent;
