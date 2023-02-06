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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const labels = ["2017", "2018", "2019", "2020", "2021", "2022"];

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

export const data = {
  labels,
  datasets: [
    {
      label: "React",
      data: [32, 42, 51, 60, 51, 95],
      backgroundColor: "#2196F3",
      borderColor: "#2196F3",
    },
    {
      label: "Angular",
      data: [37, 42, 41, 37, 31, 44],
      backgroundColor: "#F44236",
      borderColor: "#F44236",
    },
    {
      label: "Vue",
      data: [60, 54, 54, 28, 27, 10],
      backgroundColor: "#FFCA29",
      borderColor: "#FFCA29",
    },
  ],
};

const Chart = (props: any) => {
  return (
    <div className="w-full" style={{ width: "100%" }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default Chart;
