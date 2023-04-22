import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable } from "react-native";
import { PostsScreen } from "./PostsScreen";
import { CreatePostScreen } from "./CreatePostsScreen";
import { ProfileScreen } from "./ProfileScreen";

import { SimpleLineIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const MainTab = createBottomTabNavigator();

export default function Home({ navigation }) {
  return (
    <MainTab.Navigator
      initialRouteName="Posts"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: "#FF6C00",
        tabBarActiveTintColor: "#FFFFFF",
        tabBarItemStyle: { borderRadius: 20, width: 70, height: 40 },
        tabBarStyle: {
          paddingTop: 9,
          justifyContent: "center",
          paddingLeft: 82,
          paddingRight: 82,
          paddingBottom: 32,
          height: 83,
        },
        tabBarIconStyle: { color: "#212121CC" },
      }}
    >
      <MainTab.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <SimpleLineIcons name="grid" size={24} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="Create post"
        component={CreatePostScreen}
        options={{
          headerTitleStyle: {
            fontSize: 17,
            fontFamily: "Roboto-Medium",
            color: "#212121",
          },
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.navigate("Posts")}
              style={{ position: "absolute", right: 95 }}
            >
              <AntDesign name="arrowleft" size={24} color="#000000" />
            </Pressable>
          ),
          headerStyle: {
            borderBottomWidth: 0.3,
            borderBottomColor: "#B3B3B3",
          },
          headerTitleAlign: "center",
          tabBarIcon: ({ focused, size, color }) => (
            <Feather name="plus" size={24} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
}
