import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { City, WeatherData } from '../types/dataTypes';
import moment from 'moment';

type WeatherAPIResponse = {
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}

export const useFetchWeather = (city: City) => {
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const currentDate = moment().format('YYYY-MM-DD');
      console.log('currentDate',currentDate);
        try {
          const storedData = await AsyncStorage.getItem(city.name);
          if (storedData) {
            setWeatherData(JSON.parse(storedData));
            setLoading(false);
          } else {
            const response = await axios.get<WeatherAPIResponse>(
              `https://api.open-meteo.com/v1/forecast?latitude=${city.coordinates.latitude}&longitude=${city.coordinates.longitude}&hourly=temperature_2m&start_date=${currentDate}&end_date=${currentDate}`
            );
            setWeatherData({
                temperatures:response.data.hourly.temperature_2m,
                times: response.data.hourly.time
            });
            await AsyncStorage.setItem(city.name, JSON.stringify({
                temperatures:response.data.hourly.temperature_2m,
                times: response.data.hourly.time
            }));
            setLoading(false);
          }
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };
    fetchData();
  }, [city]);

  return { weatherData, loading };
};
