import { Autocomplete, Box, Button, Icon, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { useApi } from "../../hooks/api.hook";
// import { categoriesSelector } from "../features/categories/categorySlice";
import "./TransactionForm.scss";

const TransactionForm = () => {
  const [formState, setFormState] = useState({ isPayment: false });

  const { result: categories, loading: loadingCategories } =
    useApi("/category");

  return (
    <Stack component="form" gap="0.6em">
      <Autocomplete
        disablePortal
        options={[]}
        loading={loadingCategories}
        loadingText="Ucitavanje kategorija..."
        renderInput={(params) => <TextField {...params} label="Kategorija" />}
      />
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
