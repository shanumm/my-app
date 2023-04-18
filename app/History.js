import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
// import Carousel from "react-native-snap-carousel";
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
    "https://cdn.pixabay.com/photo/2019/04/26/17/47/color-4158152_960_720.jpg",
    "https://cdn.pixabay.com/photo/2019/04/26/17/47/color-4158152_960_720.jpg",
    "https://cdn.pixabay.com/photo/2019/04/26/17/47/color-4158152_960_720.jpg",
  ];

  const _renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <Image source={{ uri: item }} style={styles.image} />
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
        <View style={styles.navTitle}>
          <Text style={{ fontSize: 25, fontWeight: 700 }}>History</Text>
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
          <View style={styles.recentListContainer}>
            {/* <Carousel
              data={images}
              renderItem={_renderItem}
              sliderWidth={viewportWidth}
              itemWidth={viewportWidth}
              layout={"default"}
              loop={true}
              autoplay={true}
            /> */}
          </View>
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
                      uri: "https://cdn-icons-png.flaticon.com/512/2831/2831972.png",
                    }}
                    style={{ width: 45, height: 35 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.settingInnerBoxText}>Journey</Text>
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
                      uri: "https://cdn-icons-png.flaticon.com/512/2831/2831972.png",
                    }}
                    style={{ width: 45, height: 35 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.settingInnerBoxText}>Journey</Text>
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
                      uri: "https://cdn-icons-png.flaticon.com/512/2831/2831972.png",
                    }}
                    style={{ width: 45, height: 35 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.settingInnerBoxText}>Journey</Text>
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
                      uri: "https://cdn-icons-png.flaticon.com/512/2831/2831972.png",
                    }}
                    style={{ width: 45, height: 35 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.settingInnerBoxText}>Journey</Text>
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
                      uri: "https://cdn-icons-png.flaticon.com/512/2831/2831972.png",
                    }}
                    style={{ width: 45, height: 35 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.settingInnerBoxText}>Journey</Text>
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

  historytitle: {
    fontSize: 18,
    fontWeight: 400,
    marginBottom: 16,
    marginTop: 32,
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
    borderRadius: 10,
  },
  recentListContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default History;
