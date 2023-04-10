import { NavigationContainer } from "@react-navigation/native";
import { MenuProvider } from "react-native-popup-menu";
import Layout from "./app/_layout";
import { useState } from "react";

const App = () => {
  return (
    <NavigationContainer>
      <MenuProvider>
        <Layout />
      </MenuProvider>
    </NavigationContainer>
  );
};

export default App;
