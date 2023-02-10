import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useApi } from "../../hooks/api.hook";
import { Transacation } from "../../models/transaction.model";
import React from "react";
import { api } from "../../utils/api/axios";
import { Box } from "@mui/system";
import { CircularProgress, IconButton, LinearProgress } from "@mui/material";
import MatIcon from "../MatIcon/MatIcon";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const labels = [
  "January",
  "February",
  "Marth",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Prihod po godinama",
    },
  },
};

const Chart = (props: any) => {
  const [dataStored, setDataStored] = React.useState<boolean>(false);
  const [labelsForChart, setLabelsForChart] = React.useState<any>([]);
  const [apiData, setAPIData] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<any>({});

  const dataForChar = () => {
    setLoading(true);

    api
      .get("/transaction/dataforchart")
      .then((response) => {
        const d = response.data;
        const res = makeTwoArraysForChart(d);
        setData(res);
        console.log(res);
      })
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    dataForChar();
  }, []);

  const makeTwoArraysForChart = (data: Array<any>) => {
    const labels: Array<any> = [];
    const podaci: Array<any> = [];

    data
      ?.sort((a: any, b: any) => a.date - b.date)
      .forEach((el: any) => {
        labels.push(el.date);
        podaci.push(el.suma);
      });
    const data1 = {
      labels,
      datasets: [
        {
          label: "Prihod",
          data: podaci,
          backgroundColor: "#2196F3",
          borderColor: "#2196F3",
        },
      ],
    };
    return data1;
  };

  if (loading) {
    return (
      <Box>
        Učitava se graf...
        {/* <LinearProgress></LinearProgress> */}
      </Box>
    );
  }

  const handleRefresh = () => {
    dataForChar();
  }

  return (
    <>
      {data?.datasets?.length >= 0 && (
        <Box className="flex-col">
          <div className="w-full">
            <Line options={options} data={data} />
          </div>
          <Box className="flex justify-center">
            <IconButton onClick={handleRefresh}>
              <MatIcon color="primary" variant="contained">
                refresh
              </MatIcon>
            </IconButton>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Chart;
