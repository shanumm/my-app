import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const Location = () => {
  const [inputValue, setInputValue] = useState("");

  const handleContinue = () => {
    console.log(`Input value: ${inputValue}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Common Destination</Text>
      </View>
      <Text style={styles.subtitle}>Lorem ipsum dolor sit amet.</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Set your location"
          value={inputValue}
          onChangeText={setInputValue}
        />
      </View>

      <TouchableOpacity style={styles.buttonContainer} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "white",
    paddingTop: 30,
  },
  titleContainer: {
    height: 450,
    backgroundColor: "#171214",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid red",
    borderBottomLeftRadius: 50, 
    borderBottomRightRadius: 50, 
  },

  title: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 60,
    textAlign: "left",
    marginLeft: 20,
  },
  inputContainer: {
    marginTop: 60,
    marginBottom: 48,
    marginLeft: 20,
    marginRight: 20,
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

  buttonContainer: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#02C08C",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Location;
