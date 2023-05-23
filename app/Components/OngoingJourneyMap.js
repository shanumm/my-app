import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker, Polyline } from "react-native-maps";
import { db } from "../../firebase";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const OngoingJourneyMap = ({
  selectedJourneyDetails,
  invitedPeople,
  currentUserDetails,
}) => {
  const destination = selectedJourneyDetails.dest_location;
  const [everyonesLocation, setEveryonesLocation] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [destinationDetails, setDestinationDetails] = useState(null);
  const [travellingPeoples, setTravellingPeoples] = useState(null);
  const [isShowMoreClosed, setIsShowMoreClosed] = useState(true);
  const [isJourneyPaused, setIsJourneyPaused] = useState(false);
  const [travellingMode, setTravellingMode] = useState("car");
  const [region, setRegion] = useState({
    latitude: destination.latitude,
    longitude: destination.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const walkingUrl = "https://cdn-icons-png.flaticon.com/512/4557/4557251.png";
  const carUrl = "https://cdn-icons-png.flaticon.com/512/3097/3097180.png";
  const bikeUrl = "https://cdn-icons-png.flaticon.com/512/3198/3198336.png";

  const [points, setPoints] = useState(null);
  useEffect(() => {
    const getDirections = async (pointA, pointB) => {
      try {
        console.log(
          `https://router.project-osrm.org/route/v1/${travellingMode}/${pointA.longitude},${pointA.latitude};${pointB.longitude},${pointB.latitude}?overview=full&geometries=geojson`
        );
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/${travellingMode}/${pointA.longitude},${pointA.latitude};${pointB.longitude},${pointB.latitude}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        if (data.code === "Ok") {
          setDestinationDetails(data);
          console.log(data);
          return data.routes[0].geometry.coordinates.map((point) => ({
            latitude: point[1],
            longitude: point[0],
          }));
        }
      } catch (error) {
        console.error(error);
      }
      return [];
    };

    const getMultipleDirections = async () => {
      if (!points) return;
      const polylineCoordinates = [];

      for (let i = 0; i < points.length - 1; i++) {
        const newCoordinates = await getDirections(points[i], destination);
        polylineCoordinates.push(newCoordinates);
      }

      setCoordinates(polylineCoordinates);

      if (polylineCoordinates.length > 0) {
        const [minLat, maxLat, minLng, maxLng] = polylineCoordinates.reduce(
          ([minLat, maxLat, minLng, maxLng], point) => [
            Math.min(minLat, ...point.map((p) => p.latitude)),
            Math.max(maxLat, ...point.map((p) => p.latitude)),
            Math.min(minLng, ...point.map((p) => p.longitude)),
            Math.max(maxLng, ...point.map((p) => p.longitude)),
          ],
          [Infinity, -Infinity, Infinity, -Infinity]
        );

        setRegion({
          latitude: (minLat + maxLat) / 2,
          longitude: (minLng + maxLng) / 2,
          latitudeDelta: (maxLat - minLat) * 1.2,
          longitudeDelta: (maxLng - minLng) * 1.2,
        });
      }
    };

    getMultipleDirections();
  }, [points, travellingMode]);

  const getCurrentLocations = () => {
    try {
      const journeyRef = doc(
        db,
        "journeys",
        selectedJourneyDetails.admin_email
      );

      const unsubscribe = onSnapshot(journeyRef, (docSnap) => {
        if (docSnap.exists()) {
          console.log("change");
          const invitedPeople =
            docSnap.data()[selectedJourneyDetails.main_uuid].invitedPeople;
          setEveryonesLocation(invitedPeople);

          // Filtering out only those users who have accepted and have coords
          const coords = invitedPeople
            .filter((person) => person.accepted && person.coords)
            .map((person) => person.coords);

          // Adding the destination to the end of the array
          coords.push(destination);
          setPoints(coords);
          const travellers = invitedPeople
            .filter((person) => person.accepted && person.coords)
            .map((person) => person);

          setTravellingPeoples(travellers);
        }
      });

      // return the unsubscribe function to clean up the listener when the component unmounts
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = getCurrentLocations();

    return () => {
      unsubscribe();
    };
  }, []);

  const handleTravelMethodChange = () => {
    if (travellingMode === "car") {
      setTravellingMode("bike");
    } else if (travellingMode === "bike") {
      setTravellingMode("foot");
    } else if (travellingMode === "foot") {
      setTravellingMode("car");
    }
  };

  const distanceInKM = (value) => {
    let result = value / 1000 || 1;
    return parseFloat(result.toFixed(1));
  };
  const timeInMinutes = (value) => {
    let result = value / 60 || 10;
    const formattedResult =
      result < 60
        ? `${Math.round(result)} min`
        : `${Math.floor(result / 60)} hr ${Math.round(result % 60)} min`;
    return formattedResult;
  };

  const MapPoints = () =>
    !points
      ? null
      : points.map((point, index) => {
          if (index < points.length - 1) {
            return (
              <Marker key={index} coordinate={point}>
                <View
                  style={[
                    styles.markerContainer,
                    isJourneyPaused ? { backgroundColor: "orange" } : null,
                  ]}
                >
                  <Text style={styles.markerText}>
                    {travellingPeoples &&
                      travellingPeoples[index] &&
                      travellingPeoples[index].firstName &&
                      travellingPeoples[index].firstName[0]}
                  </Text>
                </View>
                {travellingPeoples &&
                  travellingPeoples[index] &&
                  travellingPeoples[index].firstName && (
                    <Callout style={styles.calloutContainerWrapper}>
                      <View style={styles.calloutContainer}>
                        <Text style={styles.calloutText}>
                          {travellingPeoples[index].firstName}
                        </Text>
                        <Text style={styles.calloutText}>
                          Distance:{" "}
                          {distanceInKM(
                            destinationDetails?.routes[0]?.distance
                          ) || "NULL"}{" "}
                          K.M
                        </Text>
                        <Text style={styles.calloutText}>
                          Estimated time:{" "}
                          {timeInMinutes(
                            destinationDetails?.routes[0]?.duration
                          ) || "NULL"}
                        </Text>
                      </View>
                    </Callout>
                  )}
              </Marker>
            );
          } else {
            // This is the destination
            return (
              <Marker key={index} coordinate={point}>
                <Callout style={styles.calloutContainerWrapper}>
                  <View>
                    <Text>{selectedJourneyDetails.dest_details}</Text>
                  </View>
                </Callout>
              </Marker>
            );
          }
        });

  useEffect(() => {
    const handleJouenyPause = async () => {
      try {
        const journeyRef = doc(
          db,
          "journeys",
          selectedJourneyDetails.admin_email
        );
        const data = await getDoc(journeyRef);
        const invitedPeople =
          data.data()[[selectedJourneyDetails.main_uuid]].invitedPeople;

        const travellers = invitedPeople
          .filter((person) => person.accepted && person.coords)
          .map((person) => {
            if (person.phoneNumber === currentUserDetails.phoneNumber) {
              return { ...person, isPaused: isJourneyPaused };
            } else {
              return person;
            }
          });
        let updatedPath = `${selectedJourneyDetails.main_uuid}.invitedPeople`;

        await updateDoc(journeyRef, { [updatedPath]: travellers });
      } catch (err) {
        console.error(err);
      }
    };
    handleJouenyPause();
  }, [isJourneyPaused]);

  const animation = useSharedValue({ height: "20%", width: "100%" });

  const animationStyle = useAnimatedStyle(() => ({
    height: withTiming(animation.value.height, { duration: 800 }),
  }));

  return (
    <View style={styles.container}>
      {points && (
        <MapView style={styles.map} region={region}>
          <MapPoints />
          {coordinates.map((route, index) => (
            <Polyline
              key={index}
              coordinates={route}
              strokeColor="#226072"
              strokeWidth={3}
            />
          ))}
        </MapView>
      )}
      <Animated.View style={[styles.journeyDetailsContainer, animationStyle]}>
        <Text style={styles.journeyDetailHeading}>Details</Text>
        <View style={styles.journeyDetailContentContainer}>
          <View>
            <Text style={styles.journeyDetailContent}>
              Estimated Distance {" -> "}
              {distanceInKM(destinationDetails?.routes[0]?.distance) ||
                "NULL"}{" "}
              K.M
            </Text>
            <Text style={styles.journeyDetailContent}>
              Estimated Time {" -> "}
              {timeInMinutes(destinationDetails?.routes[0]?.duration) || "NULL"}
            </Text>
          </View>
          <View style={styles.journeyDetailTravelMethod}>
            <TouchableOpacity onPress={handleTravelMethodChange}>
              <Image
                source={{
                  uri:
                    travellingMode === "car"
                      ? carUrl
                      : travellingMode == "bike"
                      ? bikeUrl
                      : walkingUrl,
                }}
                style={{ width: 50, height: 50 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            style={styles.customButtonContainerWrapper}
            onPress={() => {
              setIsJourneyPaused(!isJourneyPaused);
            }}
          >
            <View style={styles.customButtonContainer}>
              <Text style={styles.customButtonText}>
                {isJourneyPaused ? "Resume" : "Pause"}
              </Text>
            </View>
          </TouchableOpacity>
          <Text
            style={{ flex: 1, textAlign: "right" }}
            onPress={() => {
              setIsShowMoreClosed(!isShowMoreClosed);
              animation.value = { height: isShowMoreClosed ? "40%" : "20%" };
            }}
          >
            {!isShowMoreClosed ? "Hide" : "Show More"} Details
          </Text>
        </View>
        {!isShowMoreClosed && (
          <ScrollView style={{ marginTop: 20 }}>
            {travellingPeoples.map((person) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 4,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.markerContainer1}>
                    <Text style={styles.markerText1}>
                      {person.firstName[0]}
                    </Text>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 20 }}>
                      {person.firstName} {"-->  "}{" "}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 16 }}>
                      {distanceInKM(destinationDetails?.routes[0]?.distance) ||
                        "NULL"}{" "}
                      K.M ,
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 16 }}>
                      {timeInMinutes(destinationDetails?.routes[0]?.duration) ||
                        "NULL"}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: "red" }}>
                  {/* {console.log(
                    selectedJourneyDetails,
                    "=====",
                    person.phoneNumber
                  )} */}
                  {/* {currentUserDetails.phoneNumber === person.phoneNumber
                    ? "Exit"
                    : selectedJourneyDetails.phoneNumber === person.phoneNumber
                    ? "Remove"
                    : null} */}
                  {person.isPaused ? "Stopped" : "Traveling"}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
};

export default OngoingJourneyMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    // width: "100%",
    // height: "80%",
  },
  markerContainer: {
    backgroundColor: "#2c2c2c", // Replace "darkcolor" with your preferred color
    borderRadius: 20, // This will make the marker circular
    // padding: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  markerContainer1: {
    backgroundColor: "#2c2c2c", // Replace "darkcolor" with your preferred color
    borderRadius: 20, // This will make the marker circular
    // padding: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  markerText: {
    color: "#fff",
    fontSize: 14,
  },
  markerText1: {
    color: "#fff",
    fontSize: 18,
  },
  journeyDetailsContainer: {
    backgroundColor: "white",
    // height: "20%",
    // width: "100%",
    marginTop: "auto",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  journeyDetailHeading: {
    fontSize: 28,
    marginBottom: 10,
  },
  journeyDetailContentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  journeyDetailContent: {
    fontSize: 16,
    marginBottom: 5,
  },
  journeyDetailTravelMethod: {
    paddingRight: 20,
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#EAF2FD",
    width: 50,
    height: 50,
  },
  calloutContainerWrapper: {
    width: 150,
  },

  customButtonContainer: {
    backgroundColor: "#007BFF", // change this to your preferred color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  customButtonText: {
    color: "#FFFFFF", // change this to your preferred color
    fontSize: 16,
    fontWeight: "bold",
  },
  customButtonContainerWrapper: {
    flex: 1,
  },
});
