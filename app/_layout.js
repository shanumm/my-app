// import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Landing from "./Landing";

const Stack = createStackNavigator();

const Layout = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Ekta" component={Landing} />

    </Stack.Navigator>
  );
};

export default Layout;
