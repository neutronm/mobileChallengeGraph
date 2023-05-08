import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Home } from "./src/screens/Home";

export default () => {
  return (
    <View>
      <StatusBar style="auto" />
      <Home />
    </View>
  );
};
