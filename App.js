import { NavigationContainer } from "@react-navigation/native";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Layout from "./app/_layout";
import { useState } from "react";

console.log("📱 App.js: Starting App component...");

const App = () => {
  console.log("📱 App.js: App component rendering...");

  try {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <MenuProvider>
            <Layout />
          </MenuProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  } catch (error) {
    console.error("📱 App.js: Error in App component:", error);
    throw error;
  }
};

export default App;
