import { View, Text, StyleSheet } from "react-native";

export const MapScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Мапа</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
