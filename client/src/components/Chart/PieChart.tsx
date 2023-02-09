import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { api } from "../../utils/api/axios";
import randomColor from "randomcolor";
import { Box } from "@mui/material";
import { useApi } from "../../hooks/api.hook";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieDataProps {
  data: PieChartData;
  title?: string;
}

export interface PieChartData {
  labels: string[];
  values: number[];
}

const PieChart = ({ data, title }: PieDataProps) => {
  const packData: (data: PieChartData) => ChartData<"pie"> = (
    data: PieChartData
  ) => {
    const backgroundColors: string[] = [];
    const borderColors: string[] = [];

    data.labels.forEach((el) => {
      let bgColor = randomColor();

      while (backgroundColors.indexOf(bgColor) > -1) {
        bgColor = randomColor();
      }
      backgroundColors.push(bgColor);

      let borColor = randomColor();
      while (borderColors.indexOf(borColor) > -1) {
        borColor = randomColor();
      }
      borderColors.push(borColor);
    });

    return {
      labels: data.labels,
      datasets: [
        {
          borderColor: "#ffb100",
          backgroundColor: backgroundColors,
          data: data.values,
        },
      ],
    };
  };

  return (
    <Box>
      {data && (
        <Pie
          options={{
            responsive: true,
            plugins: { title: { display: true, text: title } },
          }}
          data={packData(data)}
        />
      )}
    </Box>
  );
};

export default PieChart;
