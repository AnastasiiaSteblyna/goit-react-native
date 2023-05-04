import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import { CommentsScreenCard } from "../../components/CommentsScreenCard";

import { AntDesign } from "@expo/vector-icons";

export const CommentsScreen = ({ route }) => {
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);

  const { avatar, nickname } = useSelector((state) => state.auth);
  const { photo, postId } = route.params;

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("date")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.push({ ...doc.data(), id: doc.id });
      });
      setAllComments(comments);
    });

    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardShown(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardShown(false);
    });

    return () => {
      unsubscribe();
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSetComment = (text) => setComment(text);

  const handleSubmit = async () => {
    const date = new Date();
    const month = date.toLocaleString("default", { month: "long" });
    const fullDate = `${date.getDate()} ${month} ${date.getFullYear()} | ${date.getHours()}:${date.getMinutes()}`;

    await addDoc(collection(db, "posts", postId, "comments"), {
      comment,
      avatar,
      nickname,
      date: Date.now().toString(),
      time: fullDate,
    });
    setComment("");
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          ...styles.container,
          paddingBottom: isKeyboardShown && Platform.OS === "ios" ? 140 : 16,
        }}
      >
        <Image
          source={{ uri: photo }}
          style={{
            ...styles.photo,
            display: isKeyboardShown ? "none" : "flex",
          }}
        />

        <View style={{ flex: isKeyboardShown ? 0 : 1, marginBottom: 30 }}>
          <FlatList
            data={allComments}
            renderItem={({ item }) => (
              <CommentsScreenCard
                avatar={item.avatar}
                comment={item.comment}
                nickname={item.nickname}
                date={item.time}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""}>
          <View style={styles.inputContainer}>
            <TextInput
              value={comment}
              onChangeText={handleSetComment}
              style={styles.inputComment}
              placeholder="Write comment"
              placeholderTextColor={"#BDBDBD"}
            />
            <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
              <AntDesign name="arrowup" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    paddingBottom: 16,
    justifyContent: "flex-end",
  },
  photo: {
    marginTop: 32,
    marginBottom: 32,
    width: "100%",
    height: 240,
    borderRadius: 8,
  },
  inputComment: {
    padding: 16,
    width: "100%",
    height: 50,
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 100,
    backgroundColor: "#F6F6F6",
    fontFamily: "Roboto-Light",
    fontSize: 16,
    color: "#212121",
  },
  submit: {
    position: "absolute",
    top: 8,
    right: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 34,
    height: 34,
    backgroundColor: "#FF6C00",
    borderRadius: 50,
  },
});
