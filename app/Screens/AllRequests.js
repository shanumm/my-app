import { Button, ImageBackground, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigation } from "@react-navigation/native";

const AllRequests = () => {
  const insets = useSafeAreaInsets();
  const [adminEmail, setAdminEmail] = useState(null);
  const [ongoingJourneyList, setOngoingJourneyList] = useState(null);
  const [isJourneyAccepted, setIsJourneyAccepted] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getAdminEmail = async () => {
      const user = await AsyncStorage.getItem("@storage_Key");
      if (user === null) {
        return;
      }
      const admin_email = JSON.parse(user)?.email;
      setAdminEmail(admin_email);
    };
    getAdminEmail();
  });

  const handleAccept = async (data) => {
    try {
      const docRef = doc(db, "journeys", data.admin_email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const invitedPeople =
          docSnap.data()[data.main_uuid.main_uuid].invitedPeople;

        invitedPeople.forEach((person) => {
          if (person.phoneNumber === ongoingJourneyList.phoneNumber) {
            person.accepted = true;
          }
        });

        // Now, update the document with the new data
        let updatedPath = `${data.main_uuid.main_uuid}.invitedPeople`;
        setIsJourneyAccepted(true);
        await updateDoc(docRef, {
          [updatedPath]: invitedPeople,
        });
        const userRef = doc(db, "users", adminEmail);
        await setDoc(
          userRef,
          {
            isOngoingJourney: true,
            activeJourneyDetails: {
              admin_email: data.admin_email,
              activeJourneyUUID: data.main_uuid.main_uuid,
            },
          },
          { merge: true }
        );
        navigation.navigate("OngoingJourney", {
          fromAllRequestes: true,
          journeyDetail: data,
        });
      }
    } catch (error) {
      console.error("Failed to accept journey: ", error);
    }
  };

  useEffect(() => {
    console.log(ongoingJourneyList, ">>Test");
  }, [ongoingJourneyList]);

  useEffect(() => {
    const getUserData = async () => {
      if (adminEmail) {
        try {
          const docRef = doc(db, "users", adminEmail);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // if (docSnap.data().isOngoingJourney) {
            setOngoingJourneyList(docSnap.data());
            // }
          }
        } catch (error) {
          console.error("Failed to fetch user data: ", error);
        }
      }
    };
    getUserData();
  }, [adminEmail]);

  const InvitedList = ({ ongoingJourneyList }) => {
    // console.log(ongoingJourneyList);
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
    return (
      <View style={{ borderBottomWidth: 1, borderBottomColor: "#dfdfdf95" }}>
        <View style={styles.InvitedPeopleComponent}>
          <View
            style={[
              styles.InvitedPeopleComponentLeft,
              { backgroundColor: getRandomLightColor() },
            ]}
          >
            <Text style={styles.InvitedPeopleComponentLeftText}>
              {ongoingJourneyList.admin_email.charAt(0)}
            </Text>
          </View>
          <View style={styles.InvitedPeopleComponentCenter}>
            <Text style={styles.InvitedPeopleComponentCenterTextFirst}>
              {ongoingJourneyList.admin_email}
            </Text>
            <Text style={styles.InvitedPeopleComponentCenterTextSecond}>
              {ongoingJourneyList.main_uuid.dest_details}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Text
            style={styles.buttonText}
            onPress={() => handleAccept(ongoingJourneyList)}
          >
            {!isJourneyAccepted ? "Accept" : "Ongoing"}
          </Text>
          {!isJourneyAccepted && <Text style={styles.buttonText1}>Reject</Text>}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* <Text>AllRequests</Text> */}
      <View style={styles.navBar}>
        <ImageBackground
          source={{
            uri: "https://cdn.pixabay.com/photo/2018/05/30/15/39/thunderstorm-3441687_960_720.jpg",
          }}
          style={styles.topView}
          resizeMode="cover"
        >
          <Text style={styles.imageText}>All Requests</Text>
        </ImageBackground>
      </View>
      {ongoingJourneyList && ongoingJourneyList?.invitedJourney ? (
        ongoingJourneyList?.invitedJourney?.map((journey) => (
          <InvitedList ongoingJourneyList={journey} />
        ))
      ) : (
        <View
          style={{
            flex: 0.8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImageBackground
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/9841/9841553.png",
            }}
            style={{ width: "100%", height: "50%" }}
            resizeMode="contain"
          >
            <Text
              style={{
                position: "absolute",
                bottom: 60,
                fontSize: 24,
                textAlign: "center",
                width: "100%",
              }}
            >
              You have no requests
            </Text>
          </ImageBackground>
        </View>
      )}
    </View>
  );
};

export default AllRequests;

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
    fontSize: 48,
    fontWeight: "300",
    position: "absolute",
    bottom: 20,
    left: 20,
    width: "80%",
  },
  InvitedPeopleComponent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 75,

    width: "80%",
  },
  InvitedPeopleComponentLeft: {
    marginLeft: 10,
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
  buttonContainer: {
    flexDirection: "row",
    marginLeft: 10,
    marginBottom: 10,
  },
  buttonText: {
    backgroundColor: "#32d5e7",
    color: "#ffffff",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    fontWeight: 500,
  },
  buttonText1: {
    borderColor: "#f48282",
    borderWidth: 2,
    color: "#f48282",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    fontWeight: 500,
  },
});
