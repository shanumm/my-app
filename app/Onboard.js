import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";

const Onboard = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={{
          uri: "https://media.istockphoto.com/id/1131550530/vector/happy-business-people-on-white-background.jpg?b=1&s=170667a&w=0&k=20&c=o_C-6iN3QG_JYxUbjKKObhxGnJylunxhBnjVMNIcUIM=",
        }}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.titleOnboard}>SEARCH DISCOVER CELEBRATE ENJOY</Text>
        <Text style={styles.subtitleOnboard}>Lorem ipsum dolor sit amet</Text>
      </View>
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonOnboard}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: 60,
    border: "1px solid red",
  },
  container: {
    flex: 1,
    paddingTop: 20,
    border: "1px solid red",
    backgroundColor: "#FFFFFF",
  },
  titleContainer: {
    height: 300,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    border: "1px solid red",
    paddingLeft: 10,
  },

  titleOnboard: {
    fontSize: 45,
    textAlign: "left",
    fontWeight: "bold",
    width: 350,
  },
  subtitleOnboard: {
    fontSize: 20,
    textAlign: "left",
    fontWeight: "400",
    paddingTop: 5,
    color: "grey",
  },

  buttonContainer: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#02C08C",
    borderRadius: 8,
    width: 120,
    marginLeft: 220,
    marginBottom: 15,
  },
  buttonOnboard: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default Onboard;
