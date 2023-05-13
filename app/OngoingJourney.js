import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const OngoingJourney = ({ route }) => {
  // const getRealTimeData = onSnapshot(doc(db, "journeys"), (doc) => {
  //   console.log("Current data: ", doc.data());
  // });

  useEffect(() => {
    console.log(route.params);
  }, []);

  return (
    <View>
      <Text>OngoingJourney</Text>
    </View>
  );
};

export default OngoingJourney;

const styles = StyleSheet.create({});
