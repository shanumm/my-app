import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ProfileView = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const isUserLoggedIn = async () => {
      const user = await AsyncStorage.getItem("@storage_Key");
      if (user != null) {
        const email = JSON.parse(user)?.email;
        setEmail(email);
        if (email) {
          getUserData(email);
        }
      } else {
        navigation.navigate("Login");
      }
    };
    isUserLoggedIn();
  }, []);
  const getUserData = async (user) => {
    const docRef = doc(db, "users", user);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setName(docSnap.data().name);
    } else {
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        AsyncStorage.removeItem("@storage_Key");
        navigation.navigate("Login");
      })
      .catch((error) => {});
  };
  const handleBack = () => {
    navigation.navigate("Home");
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
        <View style={styles.navTitle}>
          <TouchableOpacity onPress={handleBack}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/2985/2985161.png",
              }}
              style={{ width: 25, height: 30 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 500 }}>Profile</Text>
          <TouchableOpacity>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/512/512142.png",
              }}
              style={{ width: 30, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 20,
            marginBottom: 10,

            borderColor: "orange",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={styles.profileCircleOuter}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitial}>
                {name && name.length > 0 ? name[0].toUpperCase() : ""}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 25, fontWeight: 500 }}>
            {name && name.length > 0 ? name : ""}
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 400, color: "gray" }}>
            {email && email.length > 0 ? email : ""}
          </Text>
        </View>

        <View style={styles.settingContainer}>
          <TouchableOpacity>
            <View style={styles.settingBox}>
              <View style={styles.settingBoxInner}>
                <View
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 15,
                    backgroundColor: "hsl(240, 5%, 97%)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/128/484/484613.png",
                    }}
                    style={{ width: 35, height: 25 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.settingInnerBoxText}>Settings</Text>
              </View>
              <View>
                <TouchableOpacity>
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/128/271/271228.png",
                    }}
                    style={{ width: 15, height: 15 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.settingBox}>
              <View style={styles.settingBoxInner}>
                <View
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 15,
                    backgroundColor: "hsl(240, 5%, 97%)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/128/484/484613.png",
                    }}
                    style={{ width: 35, height: 25 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.settingInnerBoxText}>Billing Details</Text>
              </View>
              <View>
                <TouchableOpacity>
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/128/271/271228.png",
                    }}
                    style={{ width: 15, height: 15 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.settingBox}>
              <View style={styles.settingBoxInner}>
                <View
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 15,
                    backgroundColor: "hsl(240, 5%, 97%)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/128/456/456212.png",
                    }}
                    style={{ width: 35, height: 25 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.settingInnerBoxText}>User Management</Text>
              </View>
              <View>
                <TouchableOpacity>
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/128/271/271228.png",
                    }}
                    style={{ width: 15, height: 15 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.settingBox}>
              <View style={styles.settingBoxInner}>
                <View
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 15,
                    backgroundColor: "hsl(240, 5%, 97%)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/128/545/545674.png",
                    }}
                    style={{ width: 35, height: 25 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.settingInnerBoxText}>Information</Text>
              </View>
              <View>
                <TouchableOpacity>
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/128/271/271228.png",
                    }}
                    style={{ width: 15, height: 15 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <View style={styles.settingBox}>
              <View style={styles.settingBoxInner}>
                <View
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 15,
                    backgroundColor: "hsl(240, 5%, 97%)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/128/8944/8944313.png",
                    }}
                    style={{ width: 35, height: 25 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.settingInnerBoxText}>Log Out</Text>
              </View>
              <View>
                <TouchableOpacity>
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/128/271/271228.png",
                    }}
                    style={{ width: 15, height: 15 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            Privacy & Policy
          </Text>
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            Terms Of Use
          </Text>
          <Text style={{ textAlign: "center", marginTop: 10 }}>Contact Us</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    padding: 25,
    backgroundColor: "hsl(240, 5%, 97%)",
  },
  navTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileCircle: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: "#3C3C3C",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    lineHeight: 60,
  },
  profileCircleOuter: {
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#EFEEF6",
    alignItems: "center",
    justifyContent: "center",
  },
  settingContainer: {
    marginTop: 30,
    height: 500,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  settingBox: {
    paddingLeft: 20,
    paddingRight: 20,
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingBoxInner: {
    width: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingInnerBoxText: {
    paddingLeft: 15,
    fontSize: 16,
    fontWeight: 600,
    width: 150,
    textAlign: "left",
  },
});

export default ProfileView;
