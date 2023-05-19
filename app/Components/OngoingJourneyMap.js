import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker, Polyline } from "react-native-maps";
import { db } from "../../firebase";

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
  const [region, setRegion] = useState({
    latitude: destination.latitude,
    longitude: destination.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [points, setPoints] = useState(null);
  useEffect(() => {
    const getDirections = async (pointA, pointB) => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pointA.longitude},${pointA.latitude};${pointB.longitude},${pointB.latitude}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        if (data.code === "Ok") {
          setDestinationDetails(data);
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
  }, [points]);

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

  // useEffect(() => {
  //   console.log("destinationDetails", destinationDetails);
  // }, [destinationDetails]);

  useEffect(() => {
    const unsubscribe = getCurrentLocations();

    return () => {
      unsubscribe();
    };
    // const getCurrentLocations = async () => {
    //   try {
    //     const journeyRef = doc(
    //       db,
    //       "journeys",
    //       selectedJourneyDetails.admin_email
    //     );
    //     const docSnap = await getDoc(journeyRef);
    //     if (docSnap.exists()) {
    //       const invitedPeople =
    //         docSnap.data()[selectedJourneyDetails.main_uuid].invitedPeople;
    //       setEveryonesLocation(invitedPeople);

    //       // Filtering out only those users who have accepted and have coords
    //       const coords = invitedPeople
    //         .filter((person) => person.accepted && person.coords)
    //         .map((person) => person.coords);

    //       // Adding the destination to the end of the array
    //       coords.push(destination);
    //       setPoints(coords);

    //       const travellers = invitedPeople
    //         .filter((person) => person.accepted && person.coords)
    //         .map((person) => person);
    //       setTravellingPeoples(travellers);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // getCurrentLocations();
  }, []);

  const MapPoints = () =>
    !points
      ? null
      : points.map((point, index) => {
          if (index < points.length - 1) {
            return (
              <Marker key={index} coordinate={point}>
                <View style={styles.markerContainer}>
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
                    <Callout>
                      <View style={styles.calloutContainer}>
                        <Text style={styles.calloutText}>
                          Estimated time to distance:{" "}
                          {destinationDetails?.routes[0]?.distance || "NULL"}
                        </Text>
                        <Text style={styles.calloutText}>
                          Estimated time to destination:{" "}
                          {destinationDetails?.routes[0]?.duration || "NULL"}
                        </Text>
                      </View>
                    </Callout>
                  )}
              </Marker>
            );
          } else {
            // This is the destination
            return (
              <Marker key={index} coordinate={point} title="Destination" />
            );
          }
        });

  return (
    <View style={styles.container}>
      {points && (
        <MapView style={styles.map} region={region}>
          <MapPoints />
          {coordinates.map((route, index) => (
            <Polyline
              key={index}
              coordinates={route}
              strokeColor="#000"
              strokeWidth={3}
            />
          ))}
        </MapView>
      )}
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
  },
  markerContainer: {
    backgroundColor: "#2c2c2c", // Replace "darkcolor" with your preferred color
    borderRadius: 20, // This will make the marker circular
    // padding: 10,
    borderWidth: 2,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  markerText: {
    color: "#fff",
    fontSize: 14,
  },
});
