import { authSingOutUser } from "../../redux/auth/operations";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  FlatList,
  SafeAreaView,
} from "react-native";
import { ProfilePostCard } from "../../components/ProfilePostCard";

import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const imageBg = require("../../assets/images/bg.png");

export const DefaultProfileScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [posts, setPosts] = useState([]);

  const { nickname, avatar, userId } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    setPhoto(avatar);
    const q = query(collection(db, "posts"), where("userId", "==", userId));
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

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={imageBg} style={styles.imageBg}>
        <View style={styles.profileContainer}>
          {/* ---------------------- Блок Аватар ---------------------- */}
          <View style={styles.avatar}>
            <Image source={{ uri: photo }} style={styles.avatarImg} />
            {photo ? (
              <Pressable
                onPress={() => {
                  setPhoto(null);
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
          {/* --------------------------------------------------------- */}
          <Pressable
            style={styles.logoutIcon}
            onPress={() => dispatch(authSingOutUser())}
          >
            <MaterialIcons name="logout" size={24} color="#BDBDBD" />
          </Pressable>
          <Text style={styles.username}>{nickname}</Text>
          <SafeAreaView style={{ flex: 1, width: "100%", marginTop: 32 }}>
            <FlatList
              data={posts}
              renderItem={({ item }) => (
                <ProfilePostCard
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
    height: "85%",
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
  },
});
