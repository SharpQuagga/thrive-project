import { loaderColor } from "@/constants/colots";
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const MyLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={loaderColor} />
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

export default MyLoader;
