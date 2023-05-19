import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  arrayRemove,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import OngoingJourneyMap from "./Components/OngoingJourneyMap";

const mockUp = [
  {
    firstName: "John Doe",
    phoneNumber: "1234567890",
    requestStatus: "Accepted",
  },
  {
    firstName: "Jane Smith",
    phoneNumber: "0987654321",
    requestStatus: "Rejected",
  },
  {
    firstName: "Alice Johnson",
    phoneNumber: "1122334455",
    requestStatus: "Pending",
  },
];

const OngoingJourney = ({ route }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [currentUserDetails, setCurrentUserDetails] = useState(null);
  const [invitedJourneyDetails, setInvitedJounetDetails] = useState(null);
  const [selectedJourneyDetails, setSelectedJounetDetails] = useState(null);
  const [alreadyTravellingPeople, setAlreadyTravellingPeople] = useState([]);
  const [mockUpData, setMockUpData] = useState(mockUp);
  const [journey_uuid, setJourney_uuid] = useState(null);
  const [fromAllRequests, setFromAllRequests] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const getRealTimeData = async () => {
    try {
      let user = await AsyncStorage.getItem("@storage_Key");
      if (user != null) {
        let email = JSON.parse(user)?.email;
        if (email) {
          getUserData(email);
        }
      }
    } catch (error) {
      console.error("Failed to get real time data", error);
    }
  };

  useEffect(() => {
    if (route.params?.fromAllRequestes) {
      setJourney_uuid(route.params?.journeyDetail?.main_uuid?.main_uuid);
      setFromAllRequests(route.params?.fromAllRequestes);
      getRealTimeData(route.params?.journeyDetail?.main_uuid?.main_uuid);
      setActiveStep(1);
      // getLocation();
    }

    if (route.params?.alreadyTravellingPeople?.length > 0) {
      setAlreadyTravellingPeople(route.params?.alreadyTravellingPeople);
    }

    if (
      route.params?.fromCreateDestinationPage ||
      route.params?.fromLandingPage
    ) {
      getRealTimeData(route.params?.main_uuid);
    }
  }, [route]);

  useEffect(() => {
    let locationSubscriber = null;
    const getLocation = async () => {
      const user = await AsyncStorage.getItem("@storage_Key");

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      locationSubscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 4000,
          distanceInterval: 0,
        },
        async (location, error) => {
          if (error) {
            console.error(error);
            return;
          }
          const { latitude, longitude } = location.coords;
          console.log(latitude, longitude);
          if (user != null) {
            const email = JSON.parse(user)?.email;
            if (email) {
              await updateLocation(email, latitude, longitude);
            }
          }
        }
      );
    };
    if (!invitedJourneyDetails) {
      return;
    } else {
      getLocation();
    }
    return () => {
      if (locationSubscriber != null) {
        locationSubscriber.remove();
      }
    };
  }, [invitedJourneyDetails]);

  const updateLocation = async (userEmail, latitude, longitude) => {
    if (!invitedJourneyDetails) {
      console.log("invitedJourneyDetails is null");
      return;
    }

    try {
      const journeyRef = doc(db, "journeys", invitedJourneyDetails.admin_email);
      const docSnap = await getDoc(journeyRef);

      if (docSnap.exists()) {
        const journeyData = docSnap.data();
        const invitedPeopleData = Object.values(journeyData)[0].invitedPeople;

        const updatedPeopleData = invitedPeopleData.map((person) => {
          if (person.phoneNumber === currentUserDetails.phoneNumber) {
            return { ...person, coords: { latitude, longitude } };
          } else {
            return person;
          }
        });

        let updatedPath = `${journey_uuid}.invitedPeople`;

        await updateDoc(journeyRef, { [updatedPath]: updatedPeopleData });
      } else {
        console.log("Document does not exist");
      }
    } catch (err) {
      console.log("Error caught in updateLocation:", err);
    }
  };

  useEffect(() => {
    if (invitedJourneyDetails) {
      const getData = onSnapshot(
        doc(db, "journeys", invitedJourneyDetails.admin_email),
        (doc) => {
          setSelectedJounetDetails(
            doc.data()[invitedJourneyDetails.main_uuid.main_uuid]
          );
        }
      );
    }
  }, [invitedJourneyDetails]);

  const getUserData = async (user) => {
    const docRef = doc(db, "users", user);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setCurrentUserDetails(docSnap.data());
      setInvitedJounetDetails(docSnap.data()?.invitedJourney);
      console.log(docSnap.data()?.invitedJourney, ">><<");
    }
  };

  const handleLongPress = (item) => {
    // fix deleting people

    return;

    if (mockUpData.length < 2) return;
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => deleteItem(item) },
      ],
      { cancelable: false }
    );
  };

  const deleteJourney = async (userEmail, journeyData) => {
    const userRef = doc(db, "users", userEmail);

    // Update the user's document
    await updateDoc(userRef, {
      invitedJourney: null,
      isOngoingJourney: false,
    });

    // Get the journey document reference
    const journeyRef = doc(db, "journeys", journeyData.admin_email);

    // Remove the user from the invited people list in the journey document
    await updateDoc(journeyRef, {
      [`invitedPeople`]: arrayRemove(journeyData),
    });
  };
  const deleteItem = async (item) => {
    // Delete the journey in Firestore
    const user = await AsyncStorage.getItem("@storage_Key");
    if (user != null) {
      const email = JSON.parse(user)?.email;
      if (email) {
        deleteJourney(email, item);
      }
    }

    // Then remove the item from your local state
    const newMockUpData = mockUpData.filter((data) => data !== item);
    setMockUpData(newMockUpData); // Assuming mockUpData is a state variable
  };

  const handleGoBack = () => {
    navigation.navigate("Home");
  };

  const InvitedPeopleComponent = ({ invitedPeopleList }) => {
    const [requestStatus, setRequestStatus] = useState("Pending");

    function getRandomLightColor() {
      const colors = [
        "BE5A83",
        "E06469",
        "F2B6A0",
        "DEDEA7",
        "146C94",
        "19A7CE",
        "617A55",
        "394867",
      ];
      return "#" + colors[Math.floor(Math.random() * colors.length)];
    }

    const { firstName, phoneNumber } = invitedPeopleList;

    useEffect(() => {
      const existingPerson = alreadyTravellingPeople.find(
        (person) => person.phoneNumber === phoneNumber
      );
      if (existingPerson) {
        setRequestStatus("In Other Journey");
      }
    }, [alreadyTravellingPeople]);
    return (
      <View style={styles.InvitedPeopleComponent}>
        <View
          style={[
            styles.InvitedPeopleComponentLeft,
            { backgroundColor: getRandomLightColor() },
          ]}
        >
          <Text style={styles.InvitedPeopleComponentLeftText}>
            {firstName.charAt(0)}
          </Text>
        </View>
        <View style={styles.InvitedPeopleComponentCenter}>
          <Text style={styles.InvitedPeopleComponentCenterTextFirst}>
            {firstName || "name"}
          </Text>
          <Text style={styles.InvitedPeopleComponentCenterTextSecond}>
            {phoneNumber || "0000000000"}
          </Text>
        </View>
        <Text
          style={[
            styles.InvitedPeopleComponentRight,
            {
              color:
                requestStatus === "Pending"
                  ? "#E58C39"
                  : requestStatus === "Rejected"
                  ? "#CD4D2D"
                  : requestStatus === "In Other Journey"
                  ? "#2F7885"
                  : "#2F7885",
            },
          ]}
        >
          {requestStatus}
        </Text>
      </View>
    );
  };

  return activeStep === 0 ? (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.navBar}>
        <ImageBackground
          source={{
            uri: "https://cdn.pixabay.com/photo/2018/05/30/15/39/thunderstorm-3441687_960_720.jpg",
          }}
          style={styles.topView}
          resizeMode="cover"
        >
          <Text style={styles.imageText}>{currentDate}</Text>
          <Text style={styles.imageText1}>{currentTime}</Text>
          <Text style={styles.imageText2}>
            {selectedJourneyDetails && selectedJourneyDetails.dest_details}
          </Text>
        </ImageBackground>
      </View>
      <Text style={styles.OngoingJourneyTitle}>Invited</Text>
      {selectedJourneyDetails?.invitedPeople?.length > 0 &&
        selectedJourneyDetails.invitedPeople.map((IP) => (
          <TouchableOpacity onLongPress={() => handleLongPress(IP)}>
            <InvitedPeopleComponent invitedPeopleList={IP || []} />
          </TouchableOpacity>
        ))}
      {/* {mockUpData.map((IP) => (
        <TouchableOpacity onLongPress={() => handleLongPress(IP)}>
          <InvitedPeopleComponent invitedPeopleList={IP} />
        </TouchableOpacity>
      ))} */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleGoBack} style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveStep(1)}
          style={styles.proceedButton}
        >
          <Text style={styles.buttonText}>Proceed</Text>
          {/* <AntDesign name="arrowright" size={24} color="white" /> */}
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {selectedJourneyDetails && (
        <OngoingJourneyMap
          selectedJourneyDetails={selectedJourneyDetails}
          invitedPeople={selectedJourneyDetails.invitedPeople}
          currentUserDetails={currentUserDetails}
        />
      )}
    </View>
  );
};

export default OngoingJourney;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: "#eeeeee",
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
    fontSize: 24,
    fontWeight: "300",
    position: "absolute",
    top: 10,
    left: "70%",
    width: "80%",
  },
  imageText1: {
    color: "white",
    fontSize: 24,
    fontWeight: "300",
    position: "absolute",
    top: 10,
    left: 20,
    width: "80%",
  },
  imageText2: {
    color: "white",
    fontSize: 24,
    fontWeight: "300",
    position: "absolute",
    bottom: 50,
    left: 20,
    width: "80%",
  },

  OngoingJourneyTitle: {
    textAlign: "center",
    fontSize: 24,
    marginTop: 10,
    textTransform: "capitalize",
  },

  InvitedPeopleComponent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 75,
    borderBottomWidth: 1,
    borderBottomColor: "#dfdfdf95",
  },
  InvitedPeopleComponentLeft: {
    marginLeft: 30,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 28,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#4fc4b3",
  },
  InvitedPeopleComponentLeftText: {
    fontSize: 24,
    color: "white",
  },
  InvitedPeopleComponentCenter: {
    flex: 1,
  },
  InvitedPeopleComponentCenterTextFirst: {
    fontSize: 18,
    fontWeight: 500,
  },
  InvitedPeopleComponentCenterTextSecond: {
    color: "#5f5f5f",
  },
  InvitedPeopleComponentRight: {
    width: 75,
  },
  buttonContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    marginBottom: 20,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: "space-between",
    marginHorizontal: 30,
    marginRight: 30,
  },
  cancelButton: {
    backgroundColor: "#cf3434",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginRight: 10,
  },
  proceedButton: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    marginRight: 10,
  },
});
