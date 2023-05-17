import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const OngoingJourneyMap = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [points, setPoints] = useState([
    {
      latitude: 37.78825,
      longitude: -122.4324,
    },
    {
      latitude: 37.79025,
      longitude: -122.4344,
    },
    {
      latitude: 37.76825,
      longitude: -122.4524,
    },
  ]);

  useEffect(() => {
    const getDirections = async (pointA, pointB) => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pointA.longitude},${pointA.latitude};${pointB.longitude},${pointB.latitude}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        if (data.code === "Ok") {
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
      const destination = points[points.length - 1];
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
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {points.map((point, index) => (
          <Marker
            key={index}
            coordinate={point}
            title={
              index < points.length - 1 ? `Point ${index + 1}` : "Destination"
            }
          />
        ))}
        {coordinates.map((route, index) => (
          <Polyline
            key={index}
            coordinates={route}
            strokeColor="#000"
            strokeWidth={3}
          />
        ))}
      </MapView>
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
});
