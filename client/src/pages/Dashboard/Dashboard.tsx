import { Box } from "@mui/material";
import Chart from "../../components/Chart/Chart";
import TransactionList from "../../components/TransactionList/TransactionList";

const Dashboard = () => {
  return (
    <Box className="lg:flex w-full">
      <Box className="w-full">
        <Chart></Chart>
      </Box>
      <Box className="w-full py-10">
        <TransactionList title="Istorija transakcija"></TransactionList>
      </Box>
    </Box>
  );
};

export default Dashboard;
