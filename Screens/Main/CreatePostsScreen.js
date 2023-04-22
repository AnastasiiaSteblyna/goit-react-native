import React from "react";
import { useState, useEffect } from "react";
import { Camera, CameraType } from "expo-camera";
import * as Location from "expo-location";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Button,
  Image,
  KeyboardAvoidingView,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import { MaterialIcons } from "@expo/vector-icons";
import { useToast } from "react-native-toast-notifications";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

export const CreatePostScreen = ({ navigation }) => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [isPhoto, setIsPhoto] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState(null);
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [coords, setCoords] = useState(null);

  const toast = useToast();

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();

    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardShown(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardShown(false);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Потрібен доступ до вашої камери
        </Text>
        <Button onPress={requestPermission} title="Дозволити доступ" />
      </View>
    );
  }

  const getCoords = async () => {
    const location = await Location.getCurrentPositionAsync();
    setCoords(location);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setIsPhoto(true);
      setPhoto(result.assets[0].uri);
    }
  };
  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };
  const takePhoto = async () => {
    const photo = await cameraRef.takePictureAsync();
    setPhoto(photo.uri);
    setIsPhoto(true);
    getCoords();
  };

  const resetPhotoState = () => {
    setIsPhoto(false);
    setPhoto(null);
  };

  const onSubmit = () => {
    if (title === "" ?? photo) {
      return toast.show("Фото та заголовок обовʼязкові", {
        type: "warning",
        placement: "bottom",
        duration: 2000,
        offset: 30,
      });
    }

    navigation.navigate("DefaultScreen", {
      id: uuid.v4(),
      photo,
      title,
      location,
      coords,
    });
    resetPhotoState();
    setTitle("");
    setLocation("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={{ display: isKeyboardShown ? "none" : "flex" }}>
          {isPhoto ? (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                style={{
                  width: "100%",
                  height: 240,
                  backgroundColor: "#F6F6F6",
                  borderRadius: 8,
                }}
                source={{ uri: photo }}
              />
              <View
                style={{
                  ...styles.icnoBg,
                  position: "absolute",
                  backgroundColor: "rgba(255, 255, 255, 0.3);",
                }}
              >
                <TouchableOpacity onPress={resetPhotoState}>
                  <FontAwesome name="camera" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Camera
              style={styles.camera}
              type={type}
              ref={(ref) => setCameraRef(ref)}
            >
              <View style={styles.icnoBg}>
                <TouchableOpacity onPress={takePhoto}>
                  <FontAwesome name="camera" size={24} color="#BDBDBD" />
                </TouchableOpacity>
              </View>
              <View style={{ position: "absolute", right: 10, bottom: 10 }}>
                <TouchableOpacity onPress={toggleCameraType}>
                  <MaterialIcons
                    name="flip-camera-android"
                    size={24}
                    color="#BDBDBD"
                  />
                </TouchableOpacity>
              </View>
            </Camera>
          )}
        </View>
        <TouchableOpacity onPress={pickImage} style={{ width: 100 }}>
          <Text style={styles.loadBtnText}>
            {photo ? "Редагувати фото" : "Завантажити фото"}
          </Text>
        </TouchableOpacity>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""}>
          <View style={{ ...styles.inputContainer, marginBottom: 16 }}>
            <TextInput
              value={title}
              onChangeText={(text) => setTitle(text)}
              style={styles.inputTitle}
              placeholder="Заголовок..."
              placeholderTextColor="#BDBDBD"
            />
          </View>
          <View style={styles.inputContainer}>
            <Feather name="map-pin" size={24} color="#BDBDBD" />
            <TextInput
              value={location}
              onChangeText={(text) => setLocation(text)}
              style={{ ...styles.inputTitle, marginLeft: 4 }}
              placeholder="Локація..."
              placeholderTextColor="#BDBDBD"
            />
          </View>
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={{
            ...styles.submitBtn,
            backgroundColor: photo ? "#FF6C00" : "#F6F6F6",
            display: isKeyboardShown ? "none" : "flex",
          }}
          onPress={onSubmit}
        >
          <Text
            style={{
              ...styles.submitTitle,
              color: photo ? "#FFFFFF" : "#BDBDBD",
            }}
          >
            Опублікувати
          </Text>
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
  camera: {
    width: "100%",
    height: 240,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
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
  loadBtnText: {
    marginTop: 8,
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    color: "#BDBDBD",
    marginBottom: 32,
  },
  inputTitle: {
    width: "100%",
    fontFamily: "Roboto-Light",
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
    fontFamily: "Roboto-Light",
    fontSize: 16,
    color: "#BDBDBD",
  },
});
