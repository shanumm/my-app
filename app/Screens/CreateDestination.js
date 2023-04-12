import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CardComponent = ({ recentDetails }) => {
  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.cardText}>
        {recentDetails?.name || "Destination"}
      </Text>
      <Text style={cardStyles.timeText}>
        {recentDetails?.time || "11 April, 2023"}
      </Text>
      <View style={cardStyles.circleContainer}>
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <View
              key={index}
              style={[cardStyles.circle, index > 0 && cardStyles.circleOverlap]}
            >
              <Text style={cardStyles.circleText}>
                {recentDetails?.people[index].charAt(0).toUpperCase() || "S"}
              </Text>
            </View>
          ))}
        <Text style={cardStyles.peopleNumber}>{"+2"}</Text>
      </View>
    </View>
  );
};

export default function CreateDestination({ route, navigation }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recentDetails, setRecentDetails] = useState(null);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params?.fromLandingPage) {
      if (route.params?.searchLocation) {
        setSelectedLocation(route.params?.searchLocation);
      }
    } else if (route.params?.fromSearchScreen) {
      if (route.params?.selectedItem) {
        setSelectedLocation(route.params?.selectedItem);
      }
    }
  }, [route]);

  const handleClick = (locationExist) => {
    if (!locationExist) {
      navigation.navigate("SearchComponent", {
        fromDestination: "CreateDestination",
      });
    }
  };
  const handleInvitePeople = () => {
    navigation.navigate("InvitePeople", {
      fromDestination: "CreateDestination",
    });
  };

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
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => handleClick(selectedLocation ? true : false)}
        style={styles.bottomViewContainer}
      >
        <View style={styles.bottomView}>
          <View style={styles.leftPart}>
            <Image
              style={styles.magnifyingGlass}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/482/482631.png",
              }}
            />
          </View>
          <View style={styles.verticalDivider}></View>
          <View style={styles.rightPart}>
            <Text style={styles.nameHeading}>Selected Destination</Text>
            <Text style={styles.nameText}>
              {(selectedLocation && selectedLocation.display_name) ||
                "Please Select A Location First"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View>
        <Text style={[styles.recentHeading, { marginLeft: 10 }]}>Recents</Text>
        <View style={styles.cardContainer}>
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <CardComponent key={index} recentDetails={recentDetails} />
            ))}
        </View>
      </View>
      <View style={styles.invitePeopleContainer}>
        <View>
          <Text style={styles.recentHeading}>Invite People</Text>
        </View>
        <View style={styles.addPeopleContainer}>
          <Text style={styles.recentSubHeading}>
            Add people in this journey.
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleInvitePeople}
          >
            <Text style={styles.addButtonText}>Add People</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.horizontalDivider}></View> */}
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#393646",
    borderRadius: 10,
    flex: 1,
    height: 100,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
    shadowColor: "#3a3a3a",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: "#fafafa",
  },
  timeText: {
    fontSize: 14,
    color: "#dedbdb",
    flex: 1,
  },
  circleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  circle: {
    backgroundColor: "#4d4d4d",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  circleOverlap: {
    position: "absolute",
    backgroundColor: "#141414",
    left: 12, // Overlapping amount, you can adjust this as needed
    zIndex: 1,
  },
  circleText: {
    color: "white",
    fontSize: 14,
  },
  peopleNumber: {
    color: "white",
    marginLeft: 18,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: "#eeeeee",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row", // Added flexDirection
    flexWrap: "wrap", // Added flexWrap to handle multiple rows of cards
    justifyContent: "space-between",
  },
  invitePeopleContainer: {
    backgroundColor: "white",
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    padding: 10,
  },
  recentHeading: {
    fontSize: 16,
    fontWeight: 400,
    color: "#545454",
  },
  navBar: {
    height: "40%",
    overflow: "hidden",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  topView: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  imageText: {
    color: "white",
    fontSize: 48,
    fontWeight: "300",
    position: "absolute",
    bottom: 50,
    left: 20,
  },
  bottomViewContainer: {
    height: "8%",
    alignItems: "center",
  },
  bottomView: {
    position: "absolute",
    top: "-30%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    zIndex: 1,
    width: "80%",
  },
  verticalDivider: {
    height: "100%",
    borderRightWidth: 1,
    borderColor: "#ccccccae",
  },
  leftPart: {
    alignItems: "center",
    width: "10%",
  },
  rightPart: {
    width: "80%",
  },
  nameHeading: {
    color: "#F07A47",
  },
  magnifyingGlass: {
    width: 24,
    height: 24,
  },
  nameText: {
    fontSize: 16,
  },
  horizontalDivider: {
    borderBottomWidth: 1,
    flex: 1,
    borderColor: "#bababae9",
    marginHorizontal: 8,
  },
  addButton: {
    backgroundColor: "#e0e0e0", // Choose a background color for the button
    borderRadius: 10, // Adjust the border radius
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#000000", // Choose a color for the button text
    fontSize: 16,
    fontWeight: 500,
  },
  addPeopleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 10,
    paddingBottom: 4,
  },
});
