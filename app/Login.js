import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LoginBG from "../assets/loginbg.jpg";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsloading] = useState(false);

  const navigation = useNavigation();

  const saveUserData = async (user) => {
    try {
      await AsyncStorage.setItem(
        "@storage_Key",
        JSON.stringify({
          user: user._tokenResponse.idToken,
          email,
        })
      );
    } catch (e) {
      console.log(e, "something went wrong");
    }
  };

  const handleLogin = () => {
    setIsloading(true);
    if (isLogin) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in

          saveUserData(userCredential);
          const user = userCredential.user;
          setIsloading(false);
          navigation.navigate("Location");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Login error:", errorCode, errorMessage);
          setIsloading(false);
        });
    } else {
      // Create account with email and password
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          await setDoc(doc(db, "users", email), {
            name,
            email,
            phoneNumber,
            isOngoingJourney: false,
          });
          const registeredUsers = doc(db, "registeredUsers", "Numbers");
          await setDoc(
            registeredUsers,
            { numbers: arrayUnion(phoneNumber) },
            { merge: true }
          );
          saveUserData(userCredential);
          const user = userCredential.user;
          setIsloading(false);
          console.log("User signed up:", user);
          navigation.navigate("Location");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Signup error:", errorCode, errorMessage);
          setIsloading(false);
        });
    }
  };

  const handleGoogleLogin = () => {
    // Google login is not available in React Native with current Firebase setup
    // This would require additional configuration with expo-auth-session
    console.log("Google login not implemented for React Native");
  };
  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       // User is signed in, see docs for a list of available properties
  //       // https://firebase.google.com/docs/reference/js/firebase.User
  //       const uid = user.uid;
  //       console.log("shanu,", uid);
  //       // ...
  //     } else {
  //       // User is signed out
  //       // ...
  //     }
  //   });
  // }, []);

  useEffect(() => {
    const nameValid = name.length >= 4;
    const emailValid = /\S+@\S+\.\S+/.test(email);
    const phoneValid = phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);
    const passwordValid =
      /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(password) && password.length >= 8;

    if (isLogin) {
      if (emailValid && passwordValid) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    } else {
      if (nameValid && emailValid && passwordValid && phoneValid) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }
  }, [name, email, password, phoneNumber, isLogin]);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <View style={styles.background}>
      <Image style={styles.backgroundImage} source={LoginBG} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SafeAreaView style={styles.container}>
          <View>
            <Text style={styles.heading}>
              {isLogin ? "Log In" : "Create Account"}
            </Text>
          </View>
          <View>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person"
                    size={18}
                    color="grey"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Name"
                    onChangeText={(value) => setName(value)}
                    value={name}
                    style={styles.input}
                    placeholderTextColor="grey"
                  />
                </View>
                {name.length > 0 && name.length < 4 && (
                  <Text style={styles.errorText}>
                    Name must be at least 4 characters
                  </Text>
                )}
              </View>
            )}
            {!isLogin && (
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="call"
                    size={18}
                    color="grey"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Phone Number"
                    onChangeText={(value) => setPhoneNumber(value)}
                    value={phoneNumber}
                    style={styles.input}
                    textContentType="telephoneNumber"
                    maxLength={10}
                    keyboardType="phone-pad"
                    placeholderTextColor="grey"
                  />
                </View>
                {phoneNumber.length > 0 && !/^\d+$/.test(phoneNumber) && (
                  <Text style={styles.errorText}>Invalid phone number</Text>
                )}
              </View>
            )}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail"
                  size={18}
                  color="gray"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Email"
                  onChangeText={(value) => setEmail(value)}
                  value={email}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="grey"
                />
              </View>
              {!isLogin && email !== "" && !/\S+@\S+\.\S+/.test(email) && (
                <Text style={styles.errorText}>Invalid email format</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed"
                  size={18}
                  color="gray"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Password"
                  onChangeText={(value) => setPassword(value)}
                  value={password}
                  style={styles.input}
                  secureTextEntry
                  placeholderTextColor="grey"
                />
              </View>
              {!isLogin &&
                password !== "" &&
                !(
                  /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(password) &&
                  password.length >= 8
                ) && (
                  <Text style={styles.errorText}>
                    Password must be at least 8 characters and contain both
                    letters and numbers
                  </Text>
                )}
            </View>
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isDisabled}
              style={[styles.loginButton, isDisabled && styles.disabledButton]}
            >
              {isLoading ? (
                <Text style={styles.buttonText}>Loading...</Text>
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? "Log In" : "Create Account"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleToggleForm}>
              <Text style={styles.toggleForm}>
                {isLogin ? "Create Account" : "Log In"} Instead
              </Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
            >
              <Ionicons
                name="logo-google"
                size={24}
                color="#D14735"
                style={styles.socialIcon}
              />
              <Text style={styles.buttonText}>Log in with Google</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#F6F5FD",
  },
  heading: {
    fontSize: 24,
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
  },

  toggleForm: {
    color: "blue",
    textAlign: "center",
    marginTop: 10,
  },
  backgroundImage: {
    width: "100%",
    height: "40%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
  },
  or: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    width: 300,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: "black",
    fontSize: 16,
  },
  inputContainer: {
    width: 350,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: "#02C08C",
    paddingHorizontal: 110,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  socialIcon: {
    marginRight: 12,
  },
  googleButton: {
    backgroundColor: "white",
    paddingHorizontal: 60,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  switchContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  switchText: {
    fontSize: 16,
    marginRight: 10,
  },
  switchButton: {
    backgroundColor: "#F6F5FD",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  switchButtonText: {
    color: "#02C08C",
    fontWeight: "bold",
  },
});

export default Login;
