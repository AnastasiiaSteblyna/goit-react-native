import React from "react";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  SafeAreaView,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const imageBg = require("../../assets/images/bg.png");

export const ProfileScreen = ({ navigation }) => {
  const [avatar, setAvatar] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      console.log(avatar);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={imageBg} style={styles.imageBg}>
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Image source={{ uri: avatar }} style={styles.avatarImg} />
            {avatar ? (
              <Pressable
                onPress={() => {
                  setAvatar(null);
                }}
              >
                <View style={styles.removeAvatarIcon}>
                  <AntDesign name="closecircleo" size={25} color="#E8E8E8" />
                </View>
              </Pressable>
            ) : (
              <Pressable onPress={pickImage}>
                <View style={styles.addAvatarIcon}>
                  <AntDesign name="pluscircleo" size={25} color="#FF6C00" />
                </View>
              </Pressable>
            )}
          </View>
          <Pressable
            style={styles.logoutIcon}
            onPress={() => navigation.navigate("Login")}
          >
            <MaterialIcons name="logout" size={24} color="#BDBDBD" />
          </Pressable>
          <Text style={styles.username}>Love Mountains</Text>
          <SafeAreaView style={{ flex: 1 }}></SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageBg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  profileContainer: {
    paddingHorizontal: 16,
    width: "100%",
    height: 580,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
  },
  avatar: {
    position: "absolute",
    flexDirection: "row",
    top: -60,
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    alignItems: "flex-end",
  },
  avatarImg: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  addAvatarIcon: {
    position: "absolute",
    right: -13,
    bottom: 14,
  },
  removeAvatarIcon: {
    position: "absolute",
    right: -13,
    bottom: 14,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  logoutIcon: {
    position: "absolute",
    right: 16,
    top: 22,
  },
  username: {
    marginTop: 94,
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    color: "#212121",
    marginBottom: 33,
  },
});
