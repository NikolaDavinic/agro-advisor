import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import transactionsReducer from "../features/transactions/transactionsSlice";
import categoriesReducer from "../features/categories/categorySlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    transactions: transactionsReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
