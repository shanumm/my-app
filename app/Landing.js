import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from "react-native";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { signOut } from "firebase/auth";
import * as Location from "expo-location";
import { getDistanceFromLatLonInKm } from "./Helper Functions/distanceCalc";
import SearchBar from "./SearchBar";
import LandingCardImg from "../assets/landingpage/landing_card.png";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Landing = ({ route }) => {
  const [name, setName] = useState("");
  const [navBarHeight, setNavBarHeight] = useState(0);
  const navigation = useNavigation();
  const [region, setRegion] = useState(null);
  const [radius, setRadius] = useState(20000); // Set default radius to 1000 meters
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [location, setLocation] = useState(null);
  const [fromSearchScreen, setFromSearchScreen] = useState(false);
  const [searchLocation, setSearchLocation] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);
  const [initialTripDetails, setInitialTripDetails] = useState(null);

  const insets = useSafeAreaInsets();

  const imgUrl =
    "https://img.freepik.com/free-vector/geometric-pattern-navy-background_78370-653.jpg?w=900&t=st=1681144442~exp=1681145042~hmac=5ad96dca74ab893328a8b0cea168990715f1ee19e57a33e310fbc27e63406cc6";

  useEffect(() => {
    const isUserLoggedIn = async () => {
      const user = await AsyncStorage.getItem("@storage_Key");
      if (user != null) {
        const email = JSON.parse(user)?.email;
        if (email) {
          getUserData(email);
          getNearByPlaces();
        }
      } else {
        navigation.navigate("Login");
      }
    };
    isUserLoggedIn();
  }, []);

  useEffect(() => {
    if (route.params?.fromSearchScreen) {
      setFromSearchScreen(route.params.fromSearchScreen);
      setSearchLocation(route.params?.selectedItem);
    }
  }, [route]);
  useEffect(() => {
    const getDirections = async () => {
      const origin = {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      };

      const destination = {
        latitude: parseFloat(searchLocation.lat),
        longitude: parseFloat(searchLocation.lon),
      };
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        if (data.code === "Ok") {
          setInitialTripDetails(data);
          const polylinePoints = data.routes[0].geometry.coordinates.map(
            (point) => ({
              latitude: point[1],
              longitude: point[0],
            })
          );
          setPolylineCoordinates(polylinePoints);

          const minLat = Math.min(
            origin.latitude,
            destination.latitude,
            ...polylinePoints.map((point) => point.latitude)
          );
          const maxLat = Math.max(
            origin.latitude,
            destination.latitude,
            ...polylinePoints.map((point) => point.latitude)
          );
          const minLng = Math.min(
            origin.longitude,
            destination.longitude,
            ...polylinePoints.map((point) => point.longitude)
          );
          const maxLng = Math.max(
            origin.longitude,
            destination.longitude,
            ...polylinePoints.map((point) => point.longitude)
          );

          setRegion({
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: (maxLat - minLat) * 1.2,
            longitudeDelta: (maxLng - minLng) * 1.2,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (searchLocation && fromSearchScreen) {
      getDirections();
    }
  }, [location, searchLocation]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        AsyncStorage.removeItem("@storage_Key");
        navigation.navigate("Login");
      })
      .catch((error) => {});
  };

  const setMapRegionWithRadius = (latitude, longitude, radiusInMeters) => {
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
    const oneDegreeOfLongitudeInMeters =
      111.32 * 1000 * Math.cos(latitude * (Math.PI / 180));

    const latitudeDelta = radiusInMeters / oneDegreeOfLatitudeInMeters;
    const longitudeDelta = radiusInMeters / oneDegreeOfLongitudeInMeters;

    setRegion({
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    });
  };

  const updateRadius = (newRadius) => {
    setRadius(newRadius);
    if (region) {
      setMapRegionWithRadius(region.latitude, region.longitude, newRadius);
      getNearByPlaces(newRadius);
    }
    setFromSearchScreen(false);
    setSearchLocation(null);
  };

  const getNearByPlaces = async (newRadius) => {
    const currentRadius = newRadius || radius; // Use newRadius if provided, otherwise use the state value
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    const { latitude, longitude } = location.coords;
    setMapRegionWithRadius(latitude, longitude, currentRadius);

    fetchPopularPlaces(latitude, longitude, currentRadius)
      .then((places) => {
        setPopularPlaces(places);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchPopularPlaces = async (latitude, longitude, radiusInMeters) => {
    const overpassApiUrl = "https://overpass-api.de/api/interpreter";
    const query = `[out:json][timeout:25];
        (
          node["tourism"="attraction"](around:${radiusInMeters},${latitude},${longitude});
          way["tourism"="attraction"](around:${radiusInMeters},${latitude},${longitude});
          relation["tourism"="attraction"](around:${radiusInMeters},${latitude},${longitude});
        );
        out center;`;

    const response = await fetch(overpassApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (response.ok) {
      const data = await response.json();

      const popularPlaces = data.elements.map((element) => {
        return {
          id: element.id,
          type: element.type,
          lat: element.lat || element.center.lat,
          lon: element.lon || element.center.lon,
          tags: element.tags,
        };
      });
      return popularPlaces;
    } else {
      throw new Error("Error fetching popular places from Overpass API");
    }
  };

  const getUserData = async (user) => {
    const docRef = doc(db, "users", user);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setName(docSnap.data().name);
    } else {
    }
  };

  const PopularPlacesList = () => {
    const colors = ["#159895", "#19376D", "#576CBC", "#A5D7E8"];
    const { latitude, longitude } = (location && location?.coords) || {
      latitude: 40.7128,
      longitude: -74.006,
    };

    return (
      <View style={styles.popularPlacesListContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularPlacesList}
        >
          {popularPlaces.slice(0, 10).map((place, index) => (
            <View
              key={place.id}
              style={[
                styles.placeCard,
                {
                  backgroundColor: colors[index % colors.length],
                  width: 150,
                },
              ]}
            >
              <Text style={styles.placeName}>{place.tags.name}</Text>
              <Text style={styles.placeDistance}>
                {getDistanceFromLatLonInKm(
                  latitude,
                  longitude,
                  place.lat,
                  place.lon
                )}{" "}
                km
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const handleCardClick = (url) => {
    if (url === "CreateDestination")
      navigation.navigate(url, { searchLocation, fromLandingPage: true });
    // {searchLocation.display_name || "Test"}
  };

  const DetailsCard = () => {
    if (initialTripDetails) {
      const distanceInKm = initialTripDetails?.routes[0]?.distance / 1000 || 1;
      const durationInMinutes =
        initialTripDetails?.routes[0]?.duration / 60 || 10;

      const durationString =
        durationInMinutes < 60
          ? `${Math.round(durationInMinutes)} min`
          : `${Math.floor(durationInMinutes / 60)} hr ${Math.round(
              durationInMinutes % 60
            )} min`;

      return (
        <View style={styles.card}>
          <ImageBackground
            source={{
              uri: "https://cdn.pixabay.com/photo/2022/07/09/07/14/abstract-7310312_960_720.png",
            }}
            style={styles.bgImage}
            resizeMode="cover"
          >
            <View style={styles.cardContent}>
              <Text style={styles.title}>
                {searchLocation.display_name || "Test"}
              </Text>
              <Text style={styles.details}>
                {distanceInKm.toFixed(1)} km, {durationString}
              </Text>
            </View>
          </ImageBackground>
        </View>
      );
    } else return null;
  };

  const HomeScreen = () => (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View
        style={styles.navBar}
        onLayout={(event) => {
          setNavBarHeight(event.nativeEvent.layout.height);
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={styles.menuIcon}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/9091/9091429.png",
            }}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
        <View style={styles.navContent}>
          <Text style={styles.navTitle}>Ready to travel?</Text>
          <Text style={styles.navSubtitle}>{name}</Text>
        </View>
        {/* <Menu>
          <MenuTrigger> */}
        <TouchableOpacity
          onPress={() => navigation.navigate("ProfileView")}
          style={styles.menuIcon}
        >
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitial}>
              {name && name.length > 0 ? name[0].toUpperCase() : ""}
            </Text>
          </View>
        </TouchableOpacity>

        {/* </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={handleLogout}>
              <Text style={styles.menuOptionText}>Logout</Text>
            </MenuOption>
          </MenuOptions>
        </Menu> */}
      </View>
      <SearchBar fromLanding={true} />
      <View style={styles.radiusPickerContainer}>
        <Text style={styles.radiusPickerLabel}>Radius:</Text>
        <Picker
          selectedValue={radius}
          style={styles.radiusPicker}
          onValueChange={(itemValue) => updateRadius(itemValue)}
        >
          <Picker.Item label="1km" value={1000} />
          <Picker.Item label="5km" value={5000} />
          <Picker.Item label="10km" value={10000} />
          <Picker.Item label="20km" value={20000} />
          <Picker.Item label="50km" value={50000} />
          <Picker.Item label="100km" value={100000} />
          <Picker.Item label="500km" value={500000} />
        </Picker>
      </View>
      <View style={styles.mapContainer}>
        <MapView style={styles.map} region={region} ref={mapRef}>
          {location && (
            <Marker coordinate={location.coords} title="Selected Location">
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/1301/1301421.png",
                }}
                style={{ width: 30, height: 30 }}
                resizeMode="contain"
              />
            </Marker>
          )}
          {fromSearchScreen && searchLocation && (
            <Marker
              coordinate={{
                latitude: parseFloat(searchLocation.lat),
                longitude: parseFloat(searchLocation.lon),
              }}
              title={searchLocation.name}
            >
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                }}
                style={{ width: 30, height: 30 }}
                resizeMode="contain"
              />
            </Marker>
          )}
          {!searchLocation &&
            popularPlaces.map((place) => (
              <Marker
                key={place.id}
                coordinate={{
                  latitude: place.lat,
                  longitude: place.lon,
                }}
                title={place.tags.name}
              >
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/6153/6153497.png",
                  }}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              </Marker>
            ))}
          {fromSearchScreen &&
            searchLocation &&
            polylineCoordinates.length > 0 && (
              <Polyline
                coordinates={polylineCoordinates}
                strokeWidth={3}
                strokeColor="#E16434"
              />
            )}
        </MapView>
      </View>
      {!fromSearchScreen && !searchLocation && (
        <View>
          <Text style={styles.popularPlacesTitle}>
            {" "}
            {popularPlaces.length === 0
              ? "No popular places nearby. Please increase the radius or search."
              : "Popular Places"}
          </Text>
        </View>
      )}
      {!fromSearchScreen && !searchLocation && <PopularPlacesList />}
      {fromSearchScreen && searchLocation && <DetailsCard />}
      <View style={styles.createCardsContainer}>
        <TouchableOpacity
          style={styles.createCard1}
          onPress={() => handleCardClick("CreateDestination")}
        >
          <Image
            source={LandingCardImg}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
          <Text style={styles.createCardText}>Create Destination</Text>
          <Text style={styles.createCardSubText}>
            Choose a location and invite people to join
          </Text>
        </TouchableOpacity>
        <ImageBackground
          source={{
            uri: imgUrl,
          }}
          style={styles.createCard2}
          resizeMode="cover"
        >
          <Text style={styles.createCardText}>All Requests</Text>
          <Text style={styles.createCardSubText}>
            See all invitations from other travelers
          </Text>
        </ImageBackground>
      </View>

      <View style={styles.createCardsContainer}>
        <ImageBackground
          source={{
            uri: imgUrl,
          }}
          style={styles.createCard1}
          resizeMode="cover"
        >
          <Text style={styles.createCardText}>History</Text>
          <Text style={styles.createCardSubText}>
            {" "}
            Review your past travel experiences
          </Text>
        </ImageBackground>
        <View style={styles.createCard1}>
          <Image
            source={LandingCardImg}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          <View style={styles.overlay} />

          <Text style={styles.createCardText}>Ongoing Journey</Text>
          <Text style={styles.createCardSubText}>
            Keep track of your current group travels
          </Text>
        </View>
      </View>
    </View>
  );

  return <HomeScreen />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  mapContainer: {
    width: "100%",
    height: "30%",
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  radiusPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radiusPickerLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  radiusPicker: {
    width: 120,
    height: 40,
  },
  popularPlacesTitle: {
    marginVertical: 10,
    fontSize: 18,
  },
  popularPlacesListContainer: {
    height: "10%",
  },
  popularPlacesList: {
    flexDirection: "row",
  },
  placeCard: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  placeDistance: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  menuOptionText: {
    fontSize: 16,
    padding: 8,
  },

  navContent: {
    justifyContent: "center",
  },
  navSubtitle: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
  },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3C3C3C",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  card: {
    marginTop: 10,
    borderRadius: 20,
    height: 150,
    overflow: "hidden",
  },
  bgImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    backgroundColor: "#16b1e9e1",
    padding: 20,
    borderRadius: 20,
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  details: {
    fontSize: 18,
    color: "white",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.812)",
  },
  createCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    flex: 1,
  },
  createCard1: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    position: "absolute",
    width: "110%",
    height: "110%",
    transform: [{ rotate: "10deg" }],
  },
  createCard2: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    marginLeft: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  createCardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },

  createCardSubText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#afafaf",
    marginTop: 8,
    textAlign: "center",
  },
});

export default Landing;
