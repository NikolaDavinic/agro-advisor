import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { RootState } from "../../app/store";
import { apiEndpoint } from "../../utils/constants";
import { RequestStatus } from "../user/userSlice";

export interface Category {
  id: number;
  name: string;
  iconUrl: string;
}

const categoriesAdapter = createEntityAdapter<Category>({
  selectId: (c) => c.id,
  sortComparer: (a, b) => b.name.localeCompare(a.name),
});

const initialState = categoriesAdapter.getInitialState<{
  status: RequestStatus;
  error?: string;
}>({
  status: "idle",
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: {},
});

export const getCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("categories/getall", async (_, { rejectWithValue }) => {
  try {
    const { data: categories } = await axios.get(`${apiEndpoint}/categories`);
    return categories;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return rejectWithValue(e.message);
    } else {
      return rejectWithValue("Unknown error occured");
    }
  }
});

export const { selectAll, selectById, selectEntities, selectIds } =
  categoriesAdapter.getSelectors<RootState>((state) => state.categories);
export const categoriesSelector = (state: RootState) => ({
  categories: selectAll(state),
  error: state.categories.error,
  status: state.categories.status,
});

export default categoriesSlice.reducer;
