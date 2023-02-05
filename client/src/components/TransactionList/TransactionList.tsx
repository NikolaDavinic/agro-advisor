import { Box, Button, Icon, Stack, Typography } from "@mui/material";
import { useState } from "react";
import TransactionCard from "../TransactionCard/TransactionCard";
import { TransactionForm } from "..";
import { Transacation } from "../../models/transaction.model";
import { api } from "../../utils/api/axios";
import { useSnackbar } from "../../contexts/snackbar.context";
import axios, { AxiosError } from "axios";
import { ApiMessage } from "../../dtos/api-message.dto";

interface TransactionListProps {
  title?: string;
}

const TransactionList = ({ title }: TransactionListProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const { openSnackbar } = useSnackbar();

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
      <Stack gap={1}>
        {/* {transactions.map((t) => (
          <TransactionCard key={t.id} transaction={t} />
        ))} */}
      </Stack>
    </Stack>
  );
};

export default TransactionList;
