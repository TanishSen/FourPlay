import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginView from "./src/views/LoginView";
import HomeView from "./src/views/HomeView";
import SignUpView from "./src/views/SignupView";
import CreateChallengeView from "./src/views/CreateChallengeView";
import useStepCounter from "./src/hooks/StepCounter";

const Stack = createStackNavigator();

const App = () => {
  const { isPedometerAvailable, stepCount, currentUser } = useStepCounter();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginView} />
        <Stack.Screen name="SignUp" component={SignUpView} />
        <Stack.Screen name="Home" component={HomeView} />
        <Stack.Screen
          name="CreateChallenge"
          component={CreateChallengeView}
          options={{ title: "Create Challenge" }}
        />
      </Stack.Navigator>
      {currentUser && (
        <View style={styles.pedometerContainer}>
          <Text>Pedometer is {isPedometerAvailable}</Text>
          <Text>Steps: {stepCount}</Text>
        </View>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  pedometerContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    alignItems: "center",
  },
});

export default App;
