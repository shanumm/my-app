import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, Image } from "react-native";
import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
  };

  return (
    <View style={styles.background}>
      <Image
        style={styles.backgroundImage}
        source={{
          uri: "https://cdn.pixabay.com/photo/2018/08/30/21/44/leaf-3643397_960_720.jpg",
        }}
      />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Hi!</Text>
        <View style={styles.transparentBox}>
          <Input
            placeholder="Email"
            leftIcon={<Icon name="user" size={24} color="white" />}
            onChangeText={(value) => setEmail(value)}
            value={email}
            inputStyle={styles.input}
            containerStyle={styles.inputContainer}
          />
          <Input
            placeholder="Password"
            leftIcon={<Icon name="lock" size={24} color="white" />}
            onChangeText={(value) => setPassword(value)}
            value={password}
            inputStyle={styles.input}
            containerStyle={styles.inputContainer}
            secureTextEntry
          />
          <Button
            title="Log In"
            onPress={handleLogin}
            buttonStyle={styles.loginButton}
          />
          <Text style={styles.or}>or</Text>
          <Button
            title="Login with Google"
            buttonStyle={styles.googleButton}
            titleStyle={styles.buttonText}
            icon={
              <Icon
                name="google"
                size={24}
                color="black"
                style={styles.socialIcon}
              />
            }
          />
          <Button
            title="Login with Facebook"
            buttonStyle={styles.facebookButton}
            titleStyle={styles.buttonText}
            icon={
              <Icon
                name="facebook"
                size={24}
                color="black"
                style={styles.socialIcon}
              />
            }
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#171214",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    width: 320,
  },
  or: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    width: 300,
  },
  input: {
    paddingLeft: 10,
    color: "white",
  },
  inputContainer: {
    width: 100,
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
    backgroundColor: "#FBFBFB",
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
  facebookButton: {
    backgroundColor: "#FBFBFB",
    paddingHorizontal: 55,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    color: "white",
  },
  transparentBox: {
    width: 340,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 20,
      height: 20,
    },
    backdropFilter: "blur(10px)", // Add this line for the frosted glass effect

    shadowOpacity: 0.9,
    shadowRadius: 50,
    elevation: 5,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  inputContainer: {
    marginBottom: 10,
    width: 300,
  },
});

export default Login;
