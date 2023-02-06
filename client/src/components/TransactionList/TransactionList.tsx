import {
  Box,
  Button,
  CircularProgress,
  Icon,
  LinearProgress,
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
  const [transactions, setTransactions] = useState<Transacation[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [editingTransaction, setEditingTransaction] =
    useState<Transacation | null>();

  const { openSnackbar } = useSnackbar();

  const fetchMore = () => {
    api
      .get<Transacation[]>("/transaction/q", {
        params: {
          skip: transactions.length,
          take: 5,
        },
      })
      .then(({ data }) => {
        if (data.length === 0) {
          setHasMore(false);
          return;
        }
        setTransactions((prev) => [...prev, ...data]);
      })
      .catch(() => {
        setHasMore(false);
      });
  };

  useEffect(() => {
    api
      .get<Transacation[]>("/transaction/q", {
        params: {
          skip: 0,
          take: 5,
        },
      })
      .then(({ data }) => {
        if (data.length === 0) {
          setHasMore(false);
          return;
        }
        setTransactions((prev) => [...data]);
      })
      .catch(() => {
        setHasMore(false);
      });
  }, []);

  const onSubmitTransaction = (transaction: Transacation) => {
    if (editingTransaction) {
      api
        .put<Transacation>("/transaction", {
          ...transaction,
          id: editingTransaction.id,
        })
        .then(({ data }) => {
          setTransactions((prev) =>
            prev.map((t) => (t.id !== data.id ? t : data))
          );
          openSnackbar({ message: "Transakcija uspesno izmenjena " });
          setEditingTransaction(null);
          setFormOpen(false);
        })
        .catch(() => {
          openSnackbar({
            message: "Doslo je do greske pri izmeni transakcije",
            severity: "error",
          });
        });
    } else {
      api
        .post<Transacation>("/transaction", transaction)
        .then(({ data }) => {
          setTransactions((prev) => [data, ...prev]);
          openSnackbar({ message: "Uspesno dodata transakcija" });
          setFormOpen(false);
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
    }
  };

  const editTransaction = (transaction: Transacation) => {
    if (editingTransaction) return;

    setEditingTransaction(transaction);
    setFormOpen(true);
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
            onClick={() => {
              setEditingTransaction(null);
              setFormOpen((state) => !state);
            }}
            startIcon={<Icon>{formOpen ? "close" : "add"}</Icon>}
            variant="outlined"
          >
            {formOpen ? "Zatvori" : "Nova transakcija"}
          </Button>
        </Box>
      </Box>
      {formOpen && (
        <TransactionForm
          onSubmit={onSubmitTransaction}
          transaction={editingTransaction}
          buttonText={
            editingTransaction ? "Sacuvaj izmene" : " Sacuvaj transakciju"
          }
        ></TransactionForm>
      )}
      <Box
        id="scrollable-box"
        sx={{
          maxHeight: "400px",
          overflow: "auto",
        }}
      >
        <InfiniteScroll
          dataLength={transactions.length} //This is important field to render the next data
          next={fetchMore}
          hasMore={hasMore}
          loader={
            <Box>
              <LinearProgress></LinearProgress>
            </Box>
          }
          scrollableTarget="scrollable-box"
          endMessage={
            <p style={{ textAlign: "center", color: "gray" }}>
              Nema više transakcija...
            </p>
          }
        >
          <Stack gap="0.6em" padding="1em">
            {transactions.map((t) => (
              <TransactionCard
                transaction={t}
                key={t.id}
                onEditClick={editTransaction}
              />
            ))}
          </Stack>
        </InfiniteScroll>
      </Box>
    </Stack>
  );
};

export default TransactionList;
