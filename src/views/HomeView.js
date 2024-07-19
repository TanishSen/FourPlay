import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import { db } from "../../firebaseConfig";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const ITEMS_PER_PAGE = 10;

const HomeView = ({ navigation }) => {
  const [games, setGames] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const gamesQuery = query(
        collection(db, "challenges"),
        orderBy("createdAt", "desc"),
        limit(ITEMS_PER_PAGE)
      );

      const snapshot = await getDocs(gamesQuery);
      const newGames = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setGames(newGames);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGames();
    setRefreshing(false);
  };

  const renderGameCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("GameDetail", { gameId: item.id })}
    >
      <Text style={styles.cardTitle}>{item.challengeName}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.appName}>ForPlay</Text>
      </View>
      <FlatList
        data={games}
        renderItem={renderGameCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No challenges available.</Text>
            </View>
          )
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateChallenge")}
      >
        <MaterialIcons name="add" size={24} color="white" />
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
  header: {
    height: 80,
    justifyContent: "center",
    alignItems: "start",
    paddingTop: 20, // space for the notification bar
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
  },
  list: {
    paddingBottom: 80, // Space for the FAB
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardDescription: {
    color: "#ffffff",
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#f39c12",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    color: "#ffffff",
    fontSize: 18,
  },
});

export default HomeView;
