import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDoc, setDoc, doc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

const LoginView = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loadSavedEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("userEmail");
        if (savedEmail) setEmail(savedEmail);
      } catch (error) {
        console.error("Error loading saved email:", error);
      }
    };

    loadSavedEmail();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, check if the user is already stored in Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists) {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
          });
        }
        // Navigate to Home screen
        navigation.replace("Home");
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await AsyncStorage.setItem("userEmail", email);
      // Check if the user is already stored in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
        });
      }
      navigation.replace("Home");
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (error.code === "auth/invalid-email") {
        errorMessage = "The email address is badly formatted.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "The password is incorrect.";
      }
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.container}
    >
      <Text style={styles.title}>Welcome Back</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#b3b3b3"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#b3b3b3"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 32,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    color: "#ffffff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#3b5998",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpText: {
    color: "#ffffff",
    marginTop: 20,
    textAlign: "center",
  },
});

export default LoginView;
