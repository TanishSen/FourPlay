// HomeScreen.js
import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import GameCard from "../components/GameCard";

const ITEMS_PER_PAGE = 10;

const HomeScreen = ({ navigation }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    try {
      let gamesQuery = query(
        collection(db, "games"),
        orderBy("createdAt", "desc"),
        limit(ITEMS_PER_PAGE)
      );

      if (lastVisible) {
        gamesQuery = query(
          collection(db, "games"),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(ITEMS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(gamesQuery);
      const newGames = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setGames((prevGames) => [...prevGames, ...newGames]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
    setLoading(false);
  };

  const renderGameCard = ({ item }) => (
    <GameCard
      game={item}
      onPress={() => navigation.navigate("GameDetail", { gameId: item.id })}
    />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        renderItem={renderGameCard}
        keyExtractor={(item) => item.id}
        onEndReached={fetchGames}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    marginVertical: 16,
    alignItems: "center",
  },
});

export default HomeScreen;
