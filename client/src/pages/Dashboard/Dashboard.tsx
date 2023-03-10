import { Box, TextField } from "@mui/material";
import Chart from "../../components/Chart/Chart";
import TransactionList from "../../components/TransactionList/TransactionList";
import PieChart from "../../components/Chart/PieChart";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import PieChartCard from "../../components/Chart/PieChartCard";
import { useApi } from "../../hooks/api.hook";

const Dashboard = () => {
  return (
    <Box className="lg:flex w-full">
      <Box className=" w-full flex-col">
        <Chart></Chart>
        <PieChartCard></PieChartCard>
      </Box>
      <Box className="w-full py-10">
        <TransactionList title="Istorija transakcija"></TransactionList>
      </Box>
    </Box>
  );
};

export default Dashboard;
