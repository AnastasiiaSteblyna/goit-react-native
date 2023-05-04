import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Camera, CameraType } from "expo-camera";
import * as Location from "expo-location";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { storage, db } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
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
import Toast from "react-native-toast-message";

import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export const CreatePostScreen = ({ navigation }) => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState(null);
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [coords, setCoords] = useState(null);
  const [country, setCountry] = useState(null);

  const { userId, nickname } = useSelector((state) => state.auth);

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
    (async () => {
      const location = await Location.getCurrentPositionAsync();
      setCoords(location);
    })();

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

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const getAddress = async () => {
    try {
      const { latitude, longitude } = coords.coords;
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      setLocation(`${address[0].city}, ${address[0].country}`);
      setCountry(address[0].country);
    } catch (error) {
      console.log(error);
    }
  };

  const takePhoto = async () => {
    try {
      const photo = await cameraRef.takePictureAsync();
      setPhoto(photo.uri);
      getAddress();
    } catch (error) {
      console.log(error);
    }
  };

  const resetPhotoState = () => {
    setPhoto(null);
    setLocation("");
  };

  const uploadPhoto = async () => {
    try {
      // Uploading photo
      const response = await fetch(photo);
      const file = await response.blob();
      await uploadBytes(ref(storage, `photos/${file._data.blobId}`), file);
      // get photo url
      const photoUrl = await getDownloadURL(
        ref(storage, `photos/${file._data.blobId}`)
      );
      return photoUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const uploadPost = async () => {
    try {
      const photo = await uploadPhoto();
      console.log(photo);
      await addDoc(collection(db, "posts"), {
        userId,
        nickname,
        photo,
        title,
        location,
        coords: coords.coords,
        date: Date.now().toString(),
        country,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = () => {
    if (photo === null && location === "") {
      Toast.show({
        type: "error",
        text1: "Відсутнє фото або заголовок",
      });
      return;
    }
    uploadPost();
    navigation.navigate("DefaultScreen");
    resetPhotoState();
    setTitle("");
    setLocation("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={{ display: isKeyboardShown ? "none" : "flex" }}>
          {photo ? (
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
                  ...styles.iconBg,
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
              <View style={styles.iconBg}>
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
            {photo ? "Edit a photo" : "Load a photo"}
          </Text>
        </TouchableOpacity>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""}>
          <View style={{ ...styles.inputContainer, marginBottom: 16 }}>
            <TextInput
              value={title}
              onChangeText={(text) => setTitle(text)}
              style={styles.inputTitle}
              placeholder="Title..."
              placeholderTextColor="#BDBDBD"
            />
          </View>
          <View style={styles.inputContainer}>
            <Feather name="map-pin" size={24} color="#BDBDBD" />
            <TextInput
              value={location}
              onChangeText={(text) => setLocation(text)}
              style={{ ...styles.inputTitle, marginLeft: 4 }}
              placeholder="Location..."
              placeholderTextColor="#BDBDBD"
            />
          </View>
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={{
            ...styles.submitBtn,
            backgroundColor: photo ? "#FF6C00" : "#F6F6F6",
          }}
          onPress={onSubmit}
        >
          <Text
            style={{
              ...styles.submitTitle,
              color: photo ? "#FFFFFF" : "#BDBDBD",
            }}
          >
            Post
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
