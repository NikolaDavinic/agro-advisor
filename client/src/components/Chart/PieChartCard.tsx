import { Box, Button, Icon, IconButton, LinearProgress, MenuItem, Select } from "@mui/material";
import {
  DatePicker,
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/api.hook";
import PieChart, { PieChartData } from "./PieChart";
import MatIcon from "../MatIcon/MatIcon";


interface CategoryNameCount {
  categoryName: string;
  count: number;
}

interface PieChartCardData {
  year: number;
  expense: CategoryNameCount[];
  income: CategoryNameCount[];
}

function PieChartCard() {
  const [selectedYear, setSelectedYear] = useState<number>();
  const [years, setYears] = useState<number[]>([]);

  const { result: chartData, loading, reload} = useApi<PieChartCardData[]>(
    "transaction/expense-income-per-year"
  );

  useEffect(() => {
    const y = chartData?.map((a) => a.year);

    if (y) {
      setYears(y);
      setSelectedYear(y.reduce((a, b) => Math.max(a, b), -1));
    }
  }, [chartData]);

  console.log(chartData);

  const packData: (type: "expense" | "income") => PieChartData = (type) => {
    const data = chartData?.find((d) => d.year === selectedYear);
    const labels: string[] = [];
    const values: number[] = [];

    ((type === "expense" ? data?.expense : data?.income) ?? []).forEach((d) => {
      labels.push(d.categoryName);
      values.push(d.count);
    });

    return { labels, values };
  };

  if (loading) {
    return <LinearProgress></LinearProgress>;
  }

  if (years?.length === 0) {
    return <Box>Nema transakcija za prikaz na grafikonu</Box>;
  }

  const incomeData = packData("income");
  const expenseData = packData("expense");

  const handleRefresh = () => {
    reload();
  }

  return (
    <Box className="w-full md:w-1/2 gap-5">
      <Box className="p-2 flex">
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </Select>
          <IconButton onClick={handleRefresh}>
            <MatIcon color="primary" variant="contained">
              refresh
            </MatIcon>
          </IconButton>
      </Box>
      <Box className="w-full lg:flex">
        <Box className="lg:flex w-full">
          {incomeData.labels.length > 0 && (
            <PieChart title="Prihodi" data={packData("income")} />
          )}
        </Box>
        <Box className="lg:flex w-full">
          {expenseData.values.length > 0 && (
            <PieChart title="Rashodi" data={packData("expense")} />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default PieChartCard;
