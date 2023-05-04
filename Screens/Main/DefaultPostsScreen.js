import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  getCountFromServer,
} from "firebase/firestore";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";

import { PostsScreenCard } from "../../components/PostsScreenCard";

export const DefaultPostsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  const { nickname, email, avatar } = useSelector((state) => state.auth);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allPosts = [];
      querySnapshot.forEach((doc) => {
        allPosts.push({ ...doc.data(), id: doc.id });
      });
      setPosts(allPosts);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{nickname}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <PostsScreenCard
              photo={item.photo}
              title={item.title}
              location={item.location}
              navigation={navigation}
              coords={item.coords}
              postId={item.id}
              likes={item.like}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
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
