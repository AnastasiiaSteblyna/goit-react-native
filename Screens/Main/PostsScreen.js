import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable } from "react-native";

import { DefaultPostsScreen } from "../Main/DefaultPostsScreen";
import { MapScreen } from "../Main/MapScreen";
import { CommentsScreen } from "../Main/CommentsScreen";

const NestedScreen = createNativeStackNavigator();

export const PostsScreen = ({ navigation }) => {
  return (
    <NestedScreen.Navigator initialRouteName="DefaultScreen">
      <NestedScreen.Screen
        name="DefaultScreen"
        component={DefaultPostsScreen}
        options={{
          headerTitle: "Posts",
          headerTitleStyle: {
            fontSize: 17,
            fontFamily: "Roboto-Medium",
            color: "#212121",
          },
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Login")}
              style={{ position: "absolute", right: 16 }}
            >
              <MaterialIcons name="logout" size={24} color="#BDBDBD" />
            </Pressable>
          ),
          headerStyle: {
            borderBottomWidth: 0.3,
            borderBottomColor: "#B3B3B3",
          },
          headerTitleAlign: "center",
        }}
      />
      <NestedScreen.Screen
        name="Map"
        component={MapScreen}
        options={{ headerTitleAlign: "center" }}
      />
      <NestedScreen.Screen
        name="Comments"
        component={CommentsScreen}
        options={{ headerTitleAlign: "center" }}
      />
    </NestedScreen.Navigator>
  );
};
