import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

export const CreatePostScreen = () => {
  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <View style={styles.iconBg}>
            <FontAwesome name="camera" size={24} color="#BDBDBD" />
          </View>
        </View>
        <Text style={styles.loadBtn}>Додати фото</Text>
        <View style={{ ...styles.inputContainer, marginBottom: 16 }}>
          <TextInput
            style={styles.inputTitle}
            placeholder="Заголовок..."
            placeholderTextColor="#BDBDBD"
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather name="map-pin" size={24} color="#BDBDBD" />
          <TextInput
            style={{ ...styles.inputTitle, marginLeft: 4 }}
            placeholder="Локація..."
            placeholderTextColor="#BDBDBD"
          />
        </View>
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitTitle}>Опублікувати</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 240,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    marginBottom: 8,
  },
  iconBg: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
  },
  loadBtn: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#BDBDBD",
    marginBottom: 32,
  },
  inputTitle: {
    width: "100%",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#212121",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  submitBtn: {
    marginTop: 32,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#F6F6F6",
    borderRadius: 100,
  },
  submitTitle: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#BDBDBD",
  },
});
