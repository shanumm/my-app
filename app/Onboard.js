import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import Image1 from "../assets/onboardingscreens/map.png";

const Onboard = (props) => {
  const [screenIndex, setScreenIndex] = useState(0);
  const [bgColorAnim] = useState(new Animated.Value(0));

  const handleContinue = () => {
    if (screenIndex < 2) {
      setScreenIndex(screenIndex + 1);
    }
  };

  useEffect(() => {
    Animated.timing(bgColorAnim, {
      toValue: screenIndex,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [screenIndex]);

  const backgroundColor = bgColorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["#F5AE4D", "#F6C8AA", "#4DB092"],
  });

  const renderStepper = () => {
    return (
      <View style={styles.stepperContainer}>
        {Array.from({ length: 3 }, (_, i) => (
          <View
            key={i}
            style={[
              styles.stepperCircle,
              screenIndex === i ? styles.stepperActive : {},
            ]}
          />
        ))}
      </View>
    );
  };

  const renderNextButton = () => {
    if (screenIndex < 2) {
      return (
        <TouchableOpacity onPress={handleContinue}>
          <Text style={styles.nextButton}>Next</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => props.navigation.navigate("Login")}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <View style={styles.container}>
        <Image style={styles.backgroundImage} source={Image1} />
        {screenIndex === 0 && (
          <View style={styles.titleContainer}>
            <Text style={styles.titleOnboard}>CREATE JOURNEYS & CONNECT</Text>
            <Text style={styles.subtitleOnboard}>
              Start your adventure by creating a journey and inviting your
              friends
            </Text>
          </View>
        )}
        {screenIndex === 1 && (
          <View style={styles.titleContainer}>
            <Text style={styles.titleOnboard}>TRACK & STAY UPDATED</Text>
            <Text style={styles.subtitleOnboard}>
              Keep track of each other's location and get real-time updates
            </Text>
          </View>
        )}
        {screenIndex === 2 && (
          <View style={styles.titleContainer}>
            <Text style={styles.titleOnboard}>REACH DESTINATIONS TOGETHER</Text>
            <Text style={styles.subtitleOnboard}>
              Monitor the distance to your destination and enjoy shared
              experiences
            </Text>
          </View>
        )}

        {renderStepper()}

        <View style={styles.navigationButtons}>
          {screenIndex < 2 && (
            <TouchableOpacity onPress={() => setScreenIndex(0)}>
              <Text style={styles.skipButton}>Skip</Text>
            </TouchableOpacity>
          )}
          {renderNextButton()}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 2,
    resizeMode: "contain",
    width: "90%",
    height: "100%",
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  titleOnboard: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
  subtitleOnboard: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "400",
    paddingTop: 5,
    color: "white",
  },
  stepperContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  stepperCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "white",
    margin: 5,
  },
  stepperActive: {
    width: 20,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  skipButton: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  nextButton: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  getStartedButton: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  getStartedText: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default Onboard;
