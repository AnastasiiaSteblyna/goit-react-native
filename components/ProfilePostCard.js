import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import {
  collection,
  getCountFromServer,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
//icons
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export const ProfilePostCard = ({
  photo,
  title,
  location,
  navigation,
  coords,
  postId,
  likes,
}) => {
  const [count, setCount] = useState(null);
  const [isLike, setIsLike] = useState(false);

  console.log(location);

  const onLike = async () => {
    setIsLike(!isLike);

    if (isLike) {
      await updateDoc(doc(db, "posts", postId), {
        like: likes - 1,
      });
      return;
    }
    await updateDoc(doc(db, "posts", postId), {
      like: likes ? likes + 1 : 1,
    });
    return;
  };

  const getCommentsCount = async () => {
    try {
      const coll = collection(db, "posts", postId, "comments");
      const snapshot = await getCountFromServer(coll);
      setCount(snapshot.data().count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCommentsCount();
  }, []);
  return (
    <View style={styles.container}>
      <Image source={{ uri: photo }} style={styles.postImage} />
      <Text style={styles.title}>{title}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProfileComments", { photo, postId })
          }
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <FontAwesome name="comment" size={24} color="#FF6C00" />
          <Text style={styles.quantity}> {count}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onLike}
          style={{ flexDirection: "row", alignItems: "center", marginLeft: 24 }}
        >
          {isLike ? (
            <AntDesign name="like1" size={24} color="#FF6C00" />
          ) : (
            <AntDesign name="like2" size={24} color="#FF6C00" />
          )}
          <Text style={styles.quantity}> {likes ? likes : 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: "auto",
          }}
          onPress={() => {
            navigation.navigate("ProfileMap", { coords, title, location });
          }}
        >
          <Feather name="map-pin" size={24} color="#BDBDBD" />
          <Text style={styles.locationTitle}>{location.slice(0, 10)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  postImage: {
    width: "100%",
    marginBottom: 8,
    borderRadius: 8,
    height: 240,
    resizeMode: "cover",
  },
  title: {
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    color: "#212121",
    marginBottom: 8,
  },
  quantity: {
    fontFamily: "Roboto-Light",
    fontSize: 16,
    color: "#212121",
    marginLeft: 6,
  },
  locationTitle: {
    marginLeft: 4,
    fontFamily: "Roboto-Light",
    fontSize: 16,
    color: "#212121",
    textDecorationLine: "underline",
  },
});
