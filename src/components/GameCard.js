// GameCard.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const GameCard = ({ game, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: game.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{game.title}</Text>
        <Text style={styles.description}>{game.description}</Text>
        <Text style={styles.steps}>{game.steps} Steps Challenge</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  steps: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});

export default GameCard;
