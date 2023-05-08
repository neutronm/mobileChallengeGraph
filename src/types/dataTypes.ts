export type WeatherData = {
  times: string[];
  temperatures: number[];
};

export type City = {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};
