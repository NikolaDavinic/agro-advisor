import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { apiEndpoint } from "../../utils/constants";
import { Category } from "../categories/categorySlice";
import { RequestStatus } from "../user/userSlice";

interface Transaction {
  id: number;
  amount: number;
  currency: string;
  description: string;
  creationDate: string;
  category: Category;
}

const transactionsAdapter = createEntityAdapter<Transaction>({
  selectId: (transaction) => transaction.id,
  sortComparer: (a, b) => a.creationDate.localeCompare(b.creationDate),
});

const initialState = transactionsAdapter.getInitialState<{
  status: RequestStatus;
  error?: string;
}>({
  status: "idle",
  error: "",
});

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTransaction.fulfilled, transactionsAdapter.addOne)
      .addCase(addTransaction.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      });

    builder.addMatcher(
      ({ type }) => [addTransaction.pending].includes(type),
      (state) => {
        state.status = "pending";
      }
    );
  },
});

export const addTransaction = createAsyncThunk<
  Transaction,
  Omit<Transaction, "category" | "creationDate"> & { categoryId: number },
  { rejectValue: string }
>("transaction/add", async (transaction, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<Transaction>(
      `${apiEndpoint}/transactions`,
      transaction
    );
    return data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return rejectWithValue(e.message);
    } else {
      return rejectWithValue("Unknown error occured");
    }
  }
});

export default transactionsSlice.reducer;
