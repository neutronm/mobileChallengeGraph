import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { City, WeatherData } from "../types/dataTypes";
import moment from "moment";
import { getRequest } from "../api/getRequest";
import { TEMP_FORECAST_URL } from "../constants/urls";
import { putInCache, retrieveFromCache } from "../utils/weatherDataCache";
import { DATE_FORMAT } from "../constants/constants";

type WeatherAPIResponse = {
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
};

type WeatherAPIParams = {
  latitude: number;
  longitude: number;
  hourly: string;
  start_date: string;
  end_date: string;
};

type UseFetchWeatherReturnType = {
  weatherData: WeatherData | undefined;
  loading: boolean;
}

export const useFetchWeather = (city: City):UseFetchWeatherReturnType  => {
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [loading, setLoading] = useState<boolean>(true);
  const currentDate = moment().format(DATE_FORMAT);
  
  const fetchData = async () => {
    console.log('getting data for', city.name);
    try {
      const storedData = await retrieveFromCache(city.name);
      if (storedData) {
        setWeatherData(storedData);
        setLoading(false);
      } else {
        const response = await getRequest<WeatherAPIResponse, WeatherAPIParams>({
          url: TEMP_FORECAST_URL,
          params: {
            latitude: city.coordinates.latitude,
            longitude: city.coordinates.longitude,
            hourly: "temperature_2m",
            start_date: currentDate,
            end_date: currentDate,
          },
        });
        setWeatherData({
          temperatures: response.hourly.temperature_2m,
          times: response.hourly.time,
        });
        putInCache(
          city.name,{
            temperatures: response.hourly.temperature_2m,
            times: response.hourly.time,
          }
        );
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [city]);

  return { weatherData, loading };
};
