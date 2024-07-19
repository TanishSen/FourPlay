import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { db } from "../../firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

const CreateChallengeView = ({ navigation }) => {
  const [challengeName, setChallengeName] = useState("");
  const [stepGoal, setStepGoal] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersQuerySnapshot = await getDocs(collection(db, "users"));
      const fetchedUsers = usersQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleCreate = async () => {
    if (!challengeName || !stepGoal || !description) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const newChallenge = {
        challengeName,
        stepGoal,
        description,
        users: selectedUsers,
        createdAt: new Date(),
        status: "active",
      };
      await addDoc(collection(db, "challenges"), newChallenge);
      navigation.goBack();
    } catch (error) {
      console.error("Error creating challenge:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.container}
    >
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Challenge Name"
          placeholderTextColor="#b3b3b3"
          value={challengeName}
          onChangeText={setChallengeName}
        />
        <TextInput
          style={styles.input}
          placeholder="Step Goal"
          placeholderTextColor="#b3b3b3"
          value={stepGoal}
          onChangeText={setStepGoal}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#b3b3b3"
          value={description}
          onChangeText={setDescription}
        />
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <Text style={styles.userText}>{item.email}</Text>
                <TouchableOpacity
                  style={[
                    styles.userButton,
                    selectedUsers.includes(item.id) &&
                      styles.userButtonSelected,
                  ]}
                  onPress={() => toggleUserSelection(item.id)}
                >
                  <Text style={styles.userButtonText}>
                    {selectedUsers.includes(item.id) ? "Remove" : "Add"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCreate}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  form: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 16,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    color: "#ffffff",
    fontSize: 16,
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userText: {
    color: "#ffffff",
  },
  userButton: {
    padding: 10,
    backgroundColor: "#6200ee",
    borderRadius: 5,
  },
  userButtonSelected: {
    backgroundColor: "#03dac6",
  },
  userButtonText: {
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    flex: 1,
    margin: 5,
  },
  buttonText: {
    color: "#3b5998",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ff3b30",
  },
  cancelButtonText: {
    color: "#ffffff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreateChallengeView;
