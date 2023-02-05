import {
  Box,
  Button,
  CircularProgress,
  Icon,
  Stack,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import TransactionCard from "../TransactionCard/TransactionCard";
import { TransactionForm } from "..";
import { Transacation } from "../../models/transaction.model";
import { api } from "../../utils/api/axios";
import { useSnackbar } from "../../contexts/snackbar.context";
import axios, { AxiosError } from "axios";
import { ApiMessage } from "../../dtos/api-message.dto";
import InfiniteScroll from "react-infinite-scroll-component";

interface TransactionListProps {
  title?: string;
}

interface TransactionsFilter {
  skip?: number;
  take?: number;
  before?: string;
  categoryId?: string;
  expense?: boolean;
}

const TransactionList = ({ title }: TransactionListProps) => {
  const [formOpen, setFormOpen] = useState(false);
  // const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transacation[]>([]);

  const { openSnackbar } = useSnackbar();

  const skip = 0;
  const take = 5;
  const before = null;
  const categoryId = null;
  const expense = null;

  const fetchMore = () => {
    // setLoading(true);
    api
      .get<Transacation[]>("/transactions/q", {
        params: { skip, take, before, categoryId, expense },
      })
      .then(({ data }) => {
        setTransactions((prev) => [...data, ...prev]);
      });
  };

  useEffect(() => {
    api
      .get<Transacation[]>("/transaction/q", { params: { limit: 5 } })
      .then(({ data }) => {
        setTransactions((prev) => [...data]);
      });
  }, []);

  const onAddTransaction = (transaction: Transacation) => {
    api
      .post<Transacation>("/transaction", transaction)
      .then((transaction) => {
        openSnackbar({ message: "Uspesno dodata transakcija" });
      })
      .catch((error: AxiosError<ApiMessage>) => {
        let message = "Doslo je do greske";
        if (axios.isAxiosError(error)) {
          if (error.response?.data) {
            message = error.response.data.msg;
          }
        }
        openSnackbar({ message, severity: "error" });
      });
  };

  return (
    <Stack sx={{ p: "0 20px" }} gap={1}>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <Button
            color={formOpen ? "error" : "primary"}
            onClick={() => setFormOpen((state) => !state)}
            startIcon={<Icon>{formOpen ? "close" : "add"}</Icon>}
            variant="outlined"
          >
            {formOpen ? "Zatvori" : "Nova transakcija"}
          </Button>
        </Box>
      </Box>
      {formOpen && (
        <TransactionForm onSubmit={onAddTransaction}></TransactionForm>
      )}
      {/* <Stack
        id="scrollableDiv"
        sx={{
          maxHeight: "600px",
          overflow: "auto",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        <InfiniteScroll
          dataLength={transactions.length}
          next={fetchMore}
          style={{ display: "flex", flexDirection: "column-reverse" }}
          inverse={true}
          hasMore={true}
          loader={
            <Box className="justify-center w-full flex">
              <CircularProgress className="mt-20" color="primary" />
            </Box>
          }
          scrollableTarget="scrollableDiv"
          endMessage={""}
        >
          <Stack gap="0.6em" padding="1em">
            {transactions.map((t) => (
              <TransactionCard transaction={t} key={t.id} />
            ))}
          </Stack>
        </InfiniteScroll> */}
      {/* </Stack> */}
    </Stack>
  );
};

export default TransactionList;
