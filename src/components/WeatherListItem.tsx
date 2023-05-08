import React from "react";
import { useFetchWeather } from "../hooks/useFetchWeather";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import WeatherChart from "./WeatherChart";
import { City } from "../types/dataTypes";

type WeatherListItemProps = {
  cityData: City;
};

export const WeatherListItem: React.FC<WeatherListItemProps> = ({
  cityData,
}) => {
  const { weatherData, loading , hasError} = useFetchWeather(cityData);

  return (
    <View style={styles.background}>
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{cityData.name}</Text>
        {loading ? (
          <Text>loading...</Text>
        ) : weatherData && !hasError ? (
          <WeatherChart weatherData={weatherData} />
        ):(
          <Text>Could not get weather data</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  background: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
