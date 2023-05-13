import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import LoginBG from "../assets/loginbg.jpg";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
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
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
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
              <Input
                placeholder="Name"
                leftIcon={<Icon name="user" size={18} color="grey" />}
                onChangeText={(value) => setName(value)}
                value={name}
                inputStyle={styles.input}
                containerStyle={styles.inputContainer}
                inputContainerStyle={{
                  borderBottomWidth: 0,
                  marginBottom: 0,
                  backgroundColor: "white",
                  paddingHorizontal: 10,
                  borderRadius: 10,
                }}
                errorMessage={
                  name.length > 0 && name.length < 4
                    ? "Name must be at least 4 characters"
                    : null
                }
              />
            )}
            {!isLogin && (
              <Input
                placeholder="Phone Number"
                leftIcon={<Icon name="phone" size={18} color="grey" />}
                onChangeText={(value) => setPhoneNumber(value)}
                value={phoneNumber}
                inputStyle={styles.input}
                textContentType="telephoneNumber"
                maxLength={10}
                containerStyle={styles.inputContainer}
                inputContainerStyle={{
                  borderBottomWidth: 0,
                  marginBottom: 0,
                  backgroundColor: "white",
                  paddingHorizontal: 10,
                  borderRadius: 10,
                }}
                errorMessage={
                  phoneNumber.length > 0 && !/^\d+$/.test(phoneNumber)
                    ? "Invalid phone number"
                    : null
                }
              />
            )}
            <Input
              placeholder="Email"
              leftIcon={<Icon name="user" size={18} color="gray" />}
              onChangeText={(value) => setEmail(value)}
              value={email}
              inputStyle={styles.input}
              containerStyle={styles.inputContainer}
              inputContainerStyle={{
                borderBottomWidth: 0,
                marginBottom: 0,
                backgroundColor: "white",
                paddingHorizontal: 10,
                borderRadius: 10,
              }}
              errorMessage={
                isLogin
                  ? null
                  : email === ""
                  ? null
                  : /\S+@\S+\.\S+/.test(email)
                  ? null
                  : "Invalid email format"
              }
            />
            <Input
              placeholder="Password"
              leftIcon={<Icon name="lock" size={18} color="gray" />}
              onChangeText={(value) => setPassword(value)}
              value={password}
              inputStyle={styles.input}
              containerStyle={styles.inputContainer}
              inputContainerStyle={{
                borderBottomWidth: 0,
                marginBottom: 0,
                backgroundColor: "white",
                paddingHorizontal: 10,
                borderRadius: 10,
              }}
              secureTextEntry
              errorMessage={
                isLogin
                  ? null
                  : password === ""
                  ? null
                  : /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(password) &&
                    password.length >= 8
                  ? null
                  : "Password must be at least 8 characters and contain both letters and numbers"
              }
            />
            <Button
              title={isLogin ? "Log In" : "Create Account"}
              onPress={handleLogin}
              disabled={isDisabled}
              buttonStyle={styles.loginButton}
              loading={isLoading}
            />

            <TouchableOpacity onPress={handleToggleForm}>
              <Text style={styles.toggleForm}>
                {isLogin ? "Create Account" : "Log In"} Instead
              </Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <Button
              title="Log in with Google"
              buttonStyle={styles.googleButton}
              titleStyle={styles.buttonText}
              onPress={handleGoogleLogin}
              icon={
                <Icon
                  name="google"
                  size={24}
                  color="#D14735"
                  style={styles.socialIcon}
                />
              }
            />
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
    marginBottom: -5,
  },
  input: {
    paddingLeft: 10,
    color: "black",
    borderRadius: 10,
  },
  inputContainer: {
    width: 350,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  loginButton: {
    backgroundColor: "#02C08C",
    paddingHorizontal: 110,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
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
  },
  buttonText: {
    color: "black",
    fontWeight: "400",
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
