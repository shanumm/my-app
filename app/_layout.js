import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Landing from "./Landing";
import Login from "./Login";
import Onboard from "./Onboard";
import LocationComponent from "./Location";
import AuthLoading from "./AuthLoading";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        options={{ headerShown: false }}
        name="Home"
        component={Landing}
      />
      {/* Add other drawer screens here */}
    </Drawer.Navigator>
  );
};

const Layout = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AuthLoading"
        component={AuthLoading}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboard"
        component={(props) => <Onboard {...props} />}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Location"
        component={LocationComponent}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Layout;
