import { registerRootComponent } from "expo";
import App from "./App";

console.log("🎯 index.js: Starting app registration...");

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
try {
  console.log("🎯 index.js: Registering root component...");
  registerRootComponent(App);
  console.log("🎯 index.js: Root component registered successfully");
} catch (error) {
  console.error("🎯 index.js: Error registering root component:", error);
  throw error;
}
