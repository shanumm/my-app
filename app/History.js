import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import React, { useEffect, useState, Component } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const History = ({ navigation }) => {
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

  const { width: viewportWidth } = Dimensions.get("window");

  const images = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
  ];

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
        <View style={styles.navTitle}>
          <Text style={{ fontSize: 25, fontWeight: 800 }}>My History List</Text>
          <TouchableOpacity onPress={handleBack}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/1828/1828778.png",
              }}
              style={{ width: 15, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.historycontainer}>
          <Text style={styles.historytitle}>Recent List</Text>
          <Carousel
            data={images}
            renderItem={this._renderItem}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth}
            layout={"default"}
            loop={true}
            autoplay={true}
          />
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
  historycontainer: {
    marginTop: 20,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  historytitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
});

export default History;
