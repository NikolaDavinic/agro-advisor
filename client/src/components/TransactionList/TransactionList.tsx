import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Icon,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import TransactionCard from "../TransactionCard/TransactionCard";
import { MatIcon, TransactionForm } from "..";
import { Transacation } from "../../models/transaction.model";
import { api } from "../../utils/api/axios";
import { useSnackbar } from "../../contexts/snackbar.context";
import axios, { AxiosError } from "axios";
import { ApiMessage } from "../../dtos/api-message.dto";
import InfiniteScroll from "react-infinite-scroll-component";
import { Category } from "../../models/category.model";
import { useApi } from "../../hooks/api.hook";

interface TransactionListProps {
  title?: string;
}

interface TransactionsFilter {
  before?: string;
  categoryIds?: string;
  type?: "priliv" | "rashod" | string;
}

const TransactionList = ({ title }: TransactionListProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transacation[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [editingTransaction, setEditingTransaction] =
    useState<Transacation | null>();

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [filterDate, setFilterDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [filterType, setFilterType] = useState<
    "priliv" | "rashod" | "prilivrashod" | string
  >("prilivrashod");
  const [searchFilter, setSearchFilter] = useState<TransactionsFilter>();

  const { openSnackbar } = useSnackbar();

  const {
    result: categories,
    loading: loadingCategories,
    setResult,
  } = useApi<Category[]>("/category");

  const fetchMore = () => {
    api
      .get<Transacation[]>("/transaction/q", {
        params: {
          skip: transactions.length,
          take: 5,
        },
      })
      .then(({ data }) => {
        if (data.length < 5) {
          setHasMore(false);
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
          before: searchFilter?.before,
          categoryIds: searchFilter?.categoryIds,
          type: searchFilter?.type,
        },
      })
      .then(({ data }) => {
        if (data.length < 5) {
          setHasMore(false);
        }
        setTransactions((prev) => [...data]);
      })
      .catch(() => {
        setHasMore(false);
      });
  }, [searchFilter]);

  const onSubmitTransaction = (transaction: Transacation) => {
    console.log(editingTransaction);
    if (editingTransaction != null) {
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
    // if (editingTransaction) return;
    console.log(transaction);
    setEditingTransaction(transaction);
    setFormOpen(true);
  };

  const deleteTransaction = (transaction: Transacation) => {
    api
      .delete<ApiMessage>(`/transaction/${transaction.id}`)
      .then((res) => {
        setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
        openSnackbar({ message: "Transakcija uspesno obrisana" });
      })
      .catch(() => {
        openSnackbar({
          message: "Doslo je do greske pri brisanju transakcije",
        });
      });
  };

  const applyFilter = () => {
    setSearchFilter({
      before: new Date(filterDate).toISOString(),
      type: filterType,
      categoryIds: selectedCategories.map((c) => c.id ?? "").join(","),
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
      <Paper
        className="flex gap-2 items-center flex-wrap p-2"
        sx={{ backgroundColor: "var(--secondary-light)" }}
      >
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          size="small"
          color="secondary"
          sx={{ background: "white" }}
        >
          <MenuItem value="prilivrashod">Prilivi i rashodi</MenuItem>
          <MenuItem value="priliv">Prilivi</MenuItem>
          <MenuItem value="rashod">Rashodi</MenuItem>
        </Select>
        <Autocomplete
          sx={{ background: "white" }}
          className="flex-grow"
          color="secondary"
          size="small"
          limitTags={3}
          disablePortal
          getOptionLabel={(o) => o?.name ?? ""}
          options={categories ?? []}
          filterSelectedOptions
          isOptionEqualToValue={(op1, val) => op1.id === val.id}
          loading={loadingCategories}
          onChange={(e, val) => setSelectedCategories(val)}
          value={selectedCategories}
          multiple
          renderOption={(props, option) => (
            <li {...props}>
              <Box className="flex w-full items-center justify-between">
                {option.name}
                {option.userId && (
                  <Tooltip title="Kategorija koju ste vi dodali" arrow>
                    <span>
                      <MatIcon color="primary">person</MatIcon>
                    </span>
                  </Tooltip>
                )}
              </Box>
            </li>
          )}
          loadingText="Ucitavanje kategorija..."
          renderInput={(params) => <TextField {...params} label="Kategorija" />}
        />
        <TextField
          sx={{ background: "white" }}
          type="date"
          label="Starije od"
          size="small"
          value={filterDate}
          onChange={(e) =>
            setFilterDate(new Date(e.target.value).toISOString().split("T")[0])
          }
        ></TextField>
        <Button
          color="primary"
          startIcon={<MatIcon>search</MatIcon>}
          variant="contained"
          sx={{ height: "100%" }}
          onClick={applyFilter}
        >
          Primeni
        </Button>
      </Paper>
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
                onDelete={deleteTransaction}
              />
            ))}
          </Stack>
        </InfiniteScroll>
      </Box>
    </Stack>
  );
};

export default TransactionList;
