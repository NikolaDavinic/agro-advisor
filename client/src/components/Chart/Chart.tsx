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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const labels = ["January", "February", "Marth", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Grafikon po prihodu",
    },
  },
};



const Chart = (props: any) => {

  const [dataStored, setDataStored] = React.useState<boolean>(false);
  const [labelsForChart, setLabelsForChart] = React.useState<any>([]);
  const [apiData, setAPIData] = React.useState<any>([]);
  const [data, setData] = React.useState<any>({});

  const {
    result: dataa,
    loading: loadingData,
    setResult,
  } = useApi<any[]>("/transaction/dataforchart");

  const dataForChar = () => {
    api
      .get("/transaction/dataforchart")
      .then((response) => {
        const d = response.data;
        const res = makeTwoArraysForChart(d);
        setData(res);
        console.log(res);
      });
  };

  React.useEffect(() => {
    dataForChar();
  }, [])


  const makeTwoArraysForChart = (data: Array<any>) => {
    const labels: Array<any> = [];
    const podaci: Array<any> = [];
    data?.forEach((el: any) => {
      labels.push(el.date);
      podaci.push(el.suma);
    })
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
  }

  return (
    <>
      {dataa != null ?
        <div className="w-full" style={{ width: "100%" }}>
          <Line options={options} data={data} />
        </div>
        :
        <div>
          Ucitava se graf...
        </div>
      }
    </>
  );
};

export default Chart;
