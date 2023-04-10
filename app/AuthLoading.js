import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthLoading = () => {
  const [authLoading, setAuthLoading] = useState(true);
  const navigation = useNavigation();

  const isTokenAvailable = async () => {
    try {
      const value = await AsyncStorage.getItem("@storage_Key");
      if (value !== null) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  useEffect(() => {
    const checkTokenAndNavigate = async () => {
      if (await isTokenAvailable()) {
        navigation.navigate("HomeNavigator");
      } else {
        navigation.navigate("Onboard");
      }
      setAuthLoading(false);
    };

    checkTokenAndNavigate();
  }, [navigation]);

  if (authLoading) {
    return <ActivityIndicator size="large" />;
  }

  return null;
};

export default AuthLoading;
