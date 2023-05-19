import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Landing from "./Landing";
import Login from "./Login";
import Onboard from "./Onboard";
import LocationComponent from "./Location";
import AuthLoading from "./AuthLoading";
import ProfileView from "./ProfileView";
import FullScreenSearch from "./Screens/FullScreenSearch";
import CreateDestination from "./Screens/CreateDestination";
import History from "./History";
import InvitePeople from "./Screens/InvitePeople";
import OngoingJourney from "./OngoingJourney";
import AllRequests from "./Screens/AllRequests";

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
      <Stack.Screen name="Onboard" options={{ headerShown: false }}>
        {(props) => <Onboard {...props} />}
      </Stack.Screen>
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
      <Stack.Screen
        name="ProfileView"
        component={ProfileView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchComponent"
        component={FullScreenSearch}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateDestination"
        component={CreateDestination}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AllRequests"
        component={AllRequests}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OngoingJourney"
        component={OngoingJourney}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InvitePeople"
        component={InvitePeople}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Layout;
