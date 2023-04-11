import React from "react";
import { StyleSheet, View, Image, Text, ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateDestination() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.navBar}>
        <ImageBackground
          source={{
            uri: "https://cdn.pixabay.com/photo/2018/05/30/15/39/thunderstorm-3441687_960_720.jpg",
          }}
          style={styles.topView}
          resizeMode="cover"
        >
          <Text style={styles.imageText}>Where do you{"\n"}want to go?</Text>
        </ImageBackground>
      </View>
      {/* <View style={styles.bottomView}>
        <View style={styles.leftPart}>
          <Image
            style={styles.magnifyingGlass}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/482/482631.png",
            }}
          />
        </View>
        <View style={styles.rightPart}>
          <Text style={styles.nameText}>Rohini</Text>
        </View>
      </View> */}
      <View style={styles.bottomViewContainer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  navBar: {
    marginBottom: 16,
    height: "40%",
    overflow: "hidden",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: "red",
  },
  topView: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "red",
  },
  imageText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  bottomViewContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "red",
  },
  bottomView: {
    position: "absolute",
    bottom: 0,
    left: "10%",
    right: "10%",
    top: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 16,
    zIndex: 1,
    width: "50%",
    borderWidth: 1,
    borderColor: "red",
  },
  leftPart: {
    flex: 1,
    alignItems: "center",
  },
  rightPart: {
    flex: 4,
  },
  magnifyingGlass: {
    width: 24,
    height: 24,
  },
  nameText: {
    fontSize: 16,
  },
});
