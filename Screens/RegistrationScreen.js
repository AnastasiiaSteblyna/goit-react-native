import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
  Platform,
} from "react-native";

const initialState = {
  login: "",
  email: "",
  password: "",
};

export default function RegistrationScreen({ navigation }) {
  const [state, setState] = useState(initialState);
  const [dimensions, setDimansions] = useState(
    Dimensions.get("window").width - 16 * 2
  );

  const keyboardHide = () => {
    Keyboard.dismiss();
    console.log(state);
    setState(initialState);
  };

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width - 16 * 2;
      setDimansions(width);
    };
    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, []);

  return (
    <ImageBackground
      style={styles.image}
      source={require("../assets/images/bg.png")}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <View style={{ ...styles.form, width: dimensions }}>
              <Text style={styles.title}>Реєстрація</Text>
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Логін"
                  value={state.login}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, login: value }))
                  }
                />
              </View>
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Адреса електронної пошти"
                  value={state.email}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, email: value }))
                  }
                />
              </View>
              <View>
                <TextInput
                  style={styles.input}
                  secureTextEntry={true}
                  placeholder="Пароль"
                  value={state.password}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, password: value }))
                  }
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={() => navigation.navigate("Home")}
              >
                <Text style={styles.textButton}>Зареєструватися</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.containerLink}
                onPress={() => navigation.navigate("Login")}
                activeOpacity={0.8}
              >
                <Text style={styles.link}>Вже є аккаунт? Увійти</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  title: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
    fontSize: 30,
    fontFamily: "Roboto-Medium",
  },
  form: {
    justifyContent: "flex-end",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    height: 50,
    marginBottom: 16,
    paddingLeft: 16,
  },
  button: {
    marginTop: 43,
    borderRadius: 100,
    backgroundColor: "#FF6C00",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    height: 51,
  },
  textButton: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Roboto-Light",
  },
  containerLink: {
    alignItems: "center",
    marginBottom: 78,
  },
  link: {
    color: "#1B4371",
  },
});
