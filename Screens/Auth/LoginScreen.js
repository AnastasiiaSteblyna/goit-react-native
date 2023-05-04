import { useState, useEffect } from "react";
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
import { useDispatch } from "react-redux";
import { authSignInUser } from "../../redux/auth/operations";
const imageBg = require("../../assets/images/bg.png");

export const LoginScreen = ({ navigation }) => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [isSecureText, setIsSecureText] = useState(true);
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

  const handleSetEmail = (text) => setMail(text);
  const handleSetPassword = (text) => setPassword(text);

  const handleSubmit = () => {
    if (mail === "" && password === "") {
      return Toast.show({ type: "error", text1: "Fill in all fields" });
    }
    dispatch(authSignInUser({ mail, password }));
    setMail("");
    setPassword("");
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
                paddingBottom: isKeyboardShown ? 32 : 144,
              }}
            >
              <Text style={styles.title}>Login</Text>

              <View width="100%">
                <TextInput
                  value={mail}
                  onChangeText={handleSetEmail}
                  placeholder="E-mail address"
                  placeholderTextColor="#BDBDBD"
                  style={{
                    ...styles.input,
                    marginBottom: 16,
                    borderColor: mail ? "#FF6C00" : "#E8E8E8",
                    backgroundColor: mail ? "#FFFFFF" : "#F6F6F6",
                  }}
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
                    <Text style={styles.submitBtnText}>Log in</Text>
                  </TouchableOpacity>
                  <Pressable onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.afterSubmitText}>
                      You don't have an account? Sign up
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
    paddingHorizontal: 16,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontFamily: "Roboto-Medium",
    marginTop: 32,
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
