import { createStackNavigator } from "@react-navigation/stack";
import { DefaultProfileScreen } from "./DefaultProfileScreen";
import { MapScreen } from "./MapScreen";
import { CommentsScreen } from "./CommentsScreen";

const NestedScreen = createStackNavigator();

export const ProfileScreen = () => {
  return (
    <NestedScreen.Navigator initialRouteName="DefaultProfile">
      <NestedScreen.Screen
        name="DefaultProfile"
        component={DefaultProfileScreen}
        options={{ headerShown: false }}
      />
      <NestedScreen.Screen
        name="ProfileMap"
        component={MapScreen}
        options={{
          headerTitle: "Map",
          headerTitleAlign: "center",
          headerLeftLabelVisible: false,
        }}
      />
      <NestedScreen.Screen
        name="ProfileComments"
        component={CommentsScreen}
        options={{
          headerTitle: "Comments",
          headerTitleAlign: "center",
          headerLeftLabelVisible: false,
        }}
      />
    </NestedScreen.Navigator>
  );
};
