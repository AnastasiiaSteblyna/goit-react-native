import React from "react";
import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";

import { Feather } from "@expo/vector-icons";

export const PostsScreenCard = ({
  photo,
  title,
  location,
  navigation,
  coords,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: photo }} style={styles.postImage} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.bottomContainer}>
        <View style={styles.comments}>
          <TouchableOpacity onPress={() => navigation.navigate("Comments")}>
            <Feather name="message-circle" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          <Text style={styles.commentsQuantity}> 0</Text>
        </View>
        <View style={styles.location}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Map", { coords, title, location })
            }
          >
            <Feather name="map-pin" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          <Text style={styles.locationTitle}>{location}</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  imageContainer: {
    width: "100%",
    height: 240,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#212121",
  },
  postImage: {
    width: "100%",
    resizeMode: "cover",
    borderRadius: 8,
  },
  title: {
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    color: "#212121",
    marginBottom: 8,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  comments: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentsQuantity: {
    fontFamily: "Roboto-Light",
    fontSize: 16,
    color: "#BDBDBD",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationTitle: {
    marginLeft: 4,
    fontFamily: "Roboto-Light",
    fontSize: 16,
    color: "#212121",
    textDecorationLine: "underline",
  },
});
