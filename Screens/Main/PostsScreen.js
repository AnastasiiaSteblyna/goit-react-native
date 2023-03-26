import React from "react";

import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";

export const PostsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View>
          <Image
            source={require("../../assets/images/bg.png")}
            style={styles.avatar}
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>Люблю Гори</Text>
          <Text style={styles.userEmail}>email@example.com</Text>
        </View>
      </View>
      <SafeAreaView style={{ flex: 1 }}></SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 32,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  userInfo: {
    marginLeft: 8,
  },
  username: {
    fontFamily: "Roboto-Medium",
    fontSize: 13,
    color: "#212121",
  },
  userEmail: {
    fontFamily: "Roboto-Light",
    fontSize: 11,
    color: "rgba(33, 33, 33, 0.8)",
  },
});
