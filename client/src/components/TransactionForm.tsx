import { Box, Button, Icon, MenuItem, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { categoriesSelector } from "../features/categories/categorySlice";
import { useAppSelector } from "../hooks/app-redux";
import "./TransactionForm.scss";

const TransactionForm = () => {
  const [formState, setFormState] = useState({ isPayment: false });

  const { categories, status, error } = useAppSelector(categoriesSelector);

  return (
    <Stack component="form" gap="0.6em">
      <TextField
        select
        className="form-field"
        label="Kategorija"
        placeholder="Kategorija"
      >
        {categories.map((category) => (
          <MenuItem value={category.id}>{category.name}</MenuItem>
        ))}
      </TextField>
      <Box sx={{ display: "flex" }}>
        <Button
          sx={{ mr: "5px" }}
          variant="outlined"
          color={formState.isPayment ? "error" : "primary"}
          onClick={() =>
            setFormState((prev) => ({
              ...prev,
              isPayment: !prev.isPayment,
            }))
          }
        >
          {formState.isPayment ? <Icon>remove</Icon> : <Icon>add</Icon>}
        </Button>
        <TextField
          type="number"
          label="Iznos"
          className="form-field"
          color={formState.isPayment ? "error" : "primary"}
        ></TextField>
      </Box>
      <TextField
        label="Opis"
        color="primary"
        className="form-field"
      ></TextField>
    </Stack>
  );
};

export default TransactionForm;
