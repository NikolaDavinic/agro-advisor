import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { api } from '../../utils/api/axios';
import randomColor from 'randomcolor';
import { Box } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieDataProps {
  positive: string;
}

export const datas = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const PieChart = ({ positive }: PieDataProps) => {

  const [loading, setLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<any>({});

  const dataForChar = () => {
    setLoading(true);

    api
      .get("/transaction/numbertransactionbycategories?positive=" + positive)
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
    const backgroundColor: Array<any> = [];
    const borderColor: Array<any> = [];

    data
      .forEach((el: any) => {
        console.log(el);
        if (el.key.year == 2023) {
          labels.push(el.key.categoryName);
          podaci.push(el.numberOfTransaction);
          let bgColor = randomColor();
          while (backgroundColor.indexOf(bgColor) > -1) {
            bgColor = randomColor();
          }
          backgroundColor.push(bgColor);
          let borColor = randomColor();
          while (borderColor.indexOf(borColor) > -1) {
            borColor = randomColor();
          }
          borderColor.push(borColor);
        }
      });
    const data1 = {
      labels,
      datasets: [
        {
          label: podaci,
          data: podaci,
          backgroundColor,
          borderColor,
          borderWidth: 1,
        },
      ],
    };
    console.log(data1);
    return data1;
  };
  return <Box>
    {data?.datasets?.length >= 0 && <Pie data={data} />} 
  </Box>
}

export default PieChart;