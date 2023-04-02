// import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Landing from "./Landing";
import Login from "./Login";
import Location from "./Location";
import Onboard from "./Onboard";

const Stack = createStackNavigator();

const Layout = () => {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="Log In"
        component={Login}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen name="Ekta" component={Landing} /> */}
      {/* <Stack.Screen
        name="Ektaa"
        component={Location}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="Ektaa"
        component={Onboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Layout;
