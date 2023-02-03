import { useEffect } from "react";
import Chart from "../components/Chart/Chart";
import TransactionList from "../components/TransactionList/TransactionList";
// import {
//   categoriesSelector,
//   getCategories,
// } from "../features/categories/categorySlice";
// import { useAppDispatch, useAppSelector } from "../hooks/app-redux";

const Dashboard = () => {
  // const dispatch = useAppDispatch();
  // const { status } = useAppSelector(categoriesSelector);

  // useEffect(() => {
  //   if (status === "idle") {
  //     dispatch(getCategories());
  //   }
  // }, [dispatch, status]);

  return (
    <>
      <Chart></Chart>
      <TransactionList title="Istorija transakcija"></TransactionList>
    </>
  );
};

export default Dashboard;
