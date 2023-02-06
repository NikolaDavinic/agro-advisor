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

  const [chartData, setChartData] = React.useState<any>([]);
  const [labelsForChart, setLabelsForChart] = React.useState<any>([]);
  const [apiData, setAPIData] = React.useState<any>([]);

  const {
    result: dataa,
    loading: loadingData,
    setResult,
  } = useApi<any[]>("/transaction/dataforchart");

  React.useEffect(() => {
    if(loadingData){
      setAPIData(dataa);
      console.log(data);
    }
    
  }, [])

  const data = {
    labels,
    datasets: [
      {
        label: "Prihod",
        data: [12, 53, 3, 61, 52, 12, 63],
        backgroundColor: "#2196F3",
        borderColor: "#2196F3",
      },
    ],
  };


  return (
    <>
      {loadingData ?
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
