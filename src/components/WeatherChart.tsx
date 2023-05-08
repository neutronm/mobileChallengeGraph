import React, { useEffect, useRef, useState } from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
} from "victory-native";
import { D3Scale } from "victory-core";
import moment from "moment";
import { Svg, Circle, Line } from "react-native-svg";
import { Dimensions } from "react-native";
import { WeatherData } from "../types/dataTypes";

type WeatherChartProps = {
  weatherData: WeatherData;
};
type ChartData = {
  temperature: number;
  time: string;
};
const WeatherChart: React.FC<WeatherChartProps> = ({ weatherData }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const minimumTemp = useRef<number>(0);
  const maximumTemp = useRef<number>(100);
  const nowIndex = useRef<number>(0);

  useEffect(() => {
    setChartData(
      weatherData.temperatures.map((temp: number, index: number) => {
        return { temperature: temp, time: weatherData.times[index] };
      })
    );
    minimumTemp.current = Math.min(...weatherData.temperatures);
    maximumTemp.current = Math.max(...weatherData.temperatures);
  }, [weatherData]);

  useEffect(() => {
    //Todo: Timezone
    nowIndex.current = weatherData.times.findIndex((time: string) => {
      return moment(time).hour() === moment().utc().hour();
    });
  }, [weatherData]);


  return (
    <VictoryChart
      padding={{ left: 70, right: 30, top: 50, bottom: 60 }}
      height={300}
      width={0.9 * Dimensions.get('window').width}
      domainPadding={{ y: 10 }}
      minDomain={{ y: minimumTemp.current > 0 ? 0 : minimumTemp.current - 1 }}
    >
      <VictoryAxis
        dependentAxis
        label="Temperature (°C)"
        tickCount={
          minimumTemp.current > 0
            ? Math.ceil(maximumTemp.current)
            : Math.ceil(maximumTemp.current - minimumTemp.current)
        }
        tickFormat={(tick) => (tick % 3 === 0 ? `${tick}` : "")}
        style={{
          axis: { strokeWidth: 1, stroke: "grey" },
          axisLabel: { padding: 45 },
          ticks: {
            size: ({ tick }: { tick: number }) => (tick % 3 === 0 ? 10 : 5),
            stroke: "grey",
            strokeWidth: 1,
          },
        }}
      />
      <VictoryAxis
        label="Hours (GMT)"
        tickCount={24}
        tickFormat={(t) =>
          t % 4 === 0 ? moment(weatherData.times[t]).format("H:mm") : ""
        }
        style={{
          axisLabel: { padding: 40 },
          axis: { strokeWidth: 1, stroke: "grey" },
          ticks: {
            size: ({ tick }: { tick: number }) => (tick % 4 === 0 ? 10 : 5),
            stroke: "grey",
            strokeWidth: 1,
          },
        }}
      />
      <VictoryLine
        data={chartData}
        y={"temperature"}
        interpolation="natural"
        style={{
          data: {
            stroke: "#76B77A",
            strokeWidth: 5,
          },
        }}
      />
      <NowIndicator
        x={nowIndex.current}
        y={weatherData.temperatures[nowIndex.current]}
      />
    </VictoryChart>
  );
};

type NowIndicatorProps = {
  x: number;
  y: number;
  scale?: {
    x: D3Scale;
    y: D3Scale;
  }
};
const NowIndicator: React.FC<NowIndicatorProps> = (props) => {
  // the x and y methods inside scale, scales the position on the chart to the pixels of canvas
  const x = props.scale?.x(props.x);
  const y = props.scale?.y(props.y);
  const y0 = props.scale?.y(0);
  const x0 = props.scale?.x(0);
  return (
    <Svg>
      <Line
        x1={x}
        y1={y0}
        x2={x}
        y2={y}
        stroke={"black"}
        opacity={0.2}
        strokeWidth="1"
        strokeDasharray={[5, 3]}
      />
      <Line
        x1={x0}
        y1={y}
        x2={x}
        y2={y}
        stroke={"black"}
        opacity={0.2}
        strokeWidth="1"
        strokeDasharray={[5, 3]}
      />
      <Circle
        cx={x}
        cy={y}
        r={5.5}
        stroke={"#76B77A"}
        strokeWidth="4"
        fill={"white"}
      />
    </Svg>
  );
};

export default WeatherChart;
