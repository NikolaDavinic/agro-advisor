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
      text: "Chart.js Line Chart",
    },
  },
};



const Chart = (props: any) => {

  // const [d, setD] = React.useState<any>([]);
  // const [labels, setLabels] = React.useState<[]>([]);

  const {
    result: dataa,
    loading: loadingDataa,
    setResult,
  } = useApi<any[]>("/transaction/dataforchart");

  // const dataForChart = () => {
  //   const labels: any = [];
  //   const datase: any = [];
  //   dataa?.map(el => {
  //     labels.push(el.date);
  //     datase.push(el.value);
  //   })
  //   console.log(dataa);
  //   const data = {
  //     labels,
  //     datasets: [
  //       {
  //         label: "Prihod",
  //         data: datase,
  //         backgroundColor: "#2196F3",
  //         borderColor: "#2196F3",
  //       },
  //     ],
  //   };
  //   return data;
  // }

  // React.useEffect(() => {
  //   // setD(dataForChart());
  // }, [dataa]);

  // const dataForChart = {
  //   labels,
  //   datasets: [
  //     {
  //       label: "Prihod",
  //       data: [32, 42, 51, 60, 51, 95],
  //       backgroundColor: "#2196F3",
  //       borderColor: "#2196F3",
  //     },
  //   ],
  // };

     const data = {
      labels,
      datasets: [
        {
          label: "Prihod",
          data: [12,53,3,61,52,12,63],
          backgroundColor: "#2196F3",
          borderColor: "#2196F3",
        },
      ],
    };

const Chart = (props:any) => {
  return (
    <div className="w-full" style={{ width: "100%" }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default Chart;
