import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { authSignUpUser } from "../../redux/auth/operations";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config";

import { AntDesign } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import {
  View,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

const imageBg = require("../../assets/images/bg.png");

export const RegistrationScreen = ({ navigation }) => {
  const [avatar, setAvatar] = useState(null);
  const [isSecureText, setIsSecureText] = useState(true);
  const [login, setLogin] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
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

  const handleSetLogin = (text) => setLogin(text);
  const handleSetEmail = (text) => setMail(text);
  const handleSetPassword = (text) => setPassword(text);

  const formReset = () => {
    setLogin("");
    setAvatar(null);
    setMail("");
    setPassword("");
  };

  const uploadPhoto = async () => {
    try {
      // Uploading photo
      const response = await fetch(avatar);
      const file = await response.blob();
      await uploadBytes(ref(storage, `avatars/${file._data.blobId}`), file);
      // get photo url
      const photoUrl = await getDownloadURL(
        ref(storage, `avatars/${file._data.blobId}`)
      );
      return photoUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (mail === "" && password === "" && login === "") {
      return Toast.show({ type: "error", text1: "Fill in all fields" });
    }
    const avatar = await uploadPhoto();
    dispatch(authSignUpUser({ mail, password, login, avatar }));
    formReset();
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
      setAvatar(result.assets[0].uri);
      console.log(avatar);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground source={imageBg} style={styles.imageBg}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
          >
            <View
              style={{
                ...styles.form,
                paddingBottom: isKeyboardShown ? 16 : 77,
              }}
            >
              {/* ---------------------- Блок Аватар ---------------------- */}
              <View style={styles.avatar}>
                <Image source={{ uri: avatar }} style={styles.avatarImg} />
                {avatar ? (
                  <Pressable
                    onPress={() => {
                      setAvatar(null);
                    }}
                  >
                    <View style={styles.removeAvatarIcon}>
                      <AntDesign
                        name="closecircleo"
                        size={25}
                        color="#E8E8E8"
                      />
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
              {/* --------------------------------------------------------- */}

              <Text style={styles.title}>Registration</Text>

              {/* ------------- Блок инпутов и подтверждения -------------- */}
              <View width="100%">
                <TextInput
                  value={login}
                  onChangeText={handleSetLogin}
                  style={{
                    ...styles.input,
                    marginBottom: 16,
                    borderColor: login ? "#FF6C00" : "#E8E8E8",
                    backgroundColor: login ? "#FFFFFF" : "#F6F6F6",
                  }}
                  placeholder="Login"
                  placeholderTextColor="#BDBDBD"
                />
                <TextInput
                  value={mail}
                  onChangeText={handleSetEmail}
                  style={{
                    ...styles.input,
                    marginBottom: 16,
                    borderColor: mail ? "#FF6C00" : "#E8E8E8",
                    backgroundColor: mail ? "#FFFFFF" : "#F6F6F6",
                  }}
                  placeholder="E-mail address"
                  placeholderTextColor="#BDBDBD"
                />
                <View style={styles.passwordContainer}>
                  <TextInput
                    value={password}
                    onChangeText={handleSetPassword}
                    style={{
                      ...styles.input,
                      borderColor: password ? "#FF6C00" : "#E8E8E8",
                      backgroundColor: password ? "#FFFFFF" : "#F6F6F6",
                    }}
                    placeholder="Password"
                    placeholderTextColor="#BDBDBD"
                    secureTextEntry={isSecureText}
                  />
                  <Pressable
                    onPress={() => setIsSecureText((prevState) => !prevState)}
                  >
                    <Text style={styles.showText}>
                      {isSecureText ? "Show" : "Hide"}
                    </Text>
                  </Pressable>
                </View>
                <View style={{ display: isKeyboardShown ? "none" : "flex" }}>
                  <TouchableOpacity
                    style={styles.submitBtn}
                    activeOpacity={0.9}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitBtnText}>Sing up</Text>
                  </TouchableOpacity>

                  <Pressable onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.afterSubmitText}>
                      Already have an account? Sign in
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
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
  form: {
    position: "relative",
    paddingHorizontal: 16,
    width: "100%",
    // height: 549,
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
  title: {
    fontSize: 30,
    fontFamily: "Roboto-Medium",
    marginTop: 92,
    marginBottom: 32,
    textAlign: "center",
    color: "#212121",
  },
  input: {
    padding: 16,
    height: 50,
    width: "100%",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    fontFamily: "Roboto-Light",
    fontSize: 16,
    color: "#212121",
  },
  passwordContainer: {
    flexDirection: "row",
  },
  showText: {
    position: "absolute",
    right: 16,
    top: 16,
    fontFamily: "Roboto-Light",
    fontSize: 16,
    color: "#1B4371",
  },
  submitBtn: {
    marginTop: 43,
    marginBottom: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#FF6C00",
    borderRadius: 100,
  },
  submitBtnText: {
    fontFamily: "Roboto-Light",
    fontSize: 16,
    color: "#FFFFFF",
  },
  afterSubmitText: {
    fontFamily: "Roboto-Light",
    fontSize: 16,
    color: "#1B4371",
    textAlign: "center",
  },
});
