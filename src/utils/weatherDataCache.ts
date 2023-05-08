import AsyncStorage from "@react-native-async-storage/async-storage";
import { WeatherData } from "../types/dataTypes"
import moment from "moment";
import { DATE_FORMAT } from "../constants/constants";

export const retrieveFromCache = async (cityName:string):Promise<WeatherData | null> => {
    const currentDate = moment().format(DATE_FORMAT)
    const cacheKey = `${cityName}-${currentDate}`;
    try {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (error) {
      console.error(`Error retrieving data from cache for ${cityName}: `, error);
    }
    return null;
}

export const putInCache = async (cityName:string,weatherData:WeatherData): Promise<void> => {
    const currentDate = moment().format(DATE_FORMAT)
    const cacheKey = `${cityName}-${currentDate}`;
    try {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(weatherData));
    } catch (error) {
      console.error(`Error saving data to cache for ${cityName}: `, error);
    }
}

export const invalidateOldCaches = async (): Promise<void> =>{
   const currentDate = moment().format(DATE_FORMAT)
    try {
        const keys = await AsyncStorage.getAllKeys();
        const oldCacheKeys = keys.filter((key) => !key.endsWith(currentDate));
        await AsyncStorage.multiRemove(oldCacheKeys);
      } catch (error) {
        console.error("Error invalidating old cache data: ", error);
      }
}