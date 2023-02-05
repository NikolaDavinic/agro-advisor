import {
  Autocomplete,
  Box,
  Button,
  Icon,
  List,
  ListItem,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { useSnackbar } from "../../contexts/snackbar.context";
import { useApi } from "../../hooks/api.hook";
import { Category } from "../../models/category.model";
import { api } from "../../utils/api/axios";
import MatIcon from "../MatIcon/MatIcon";
import "./TransactionForm.scss";

interface TransactionFormProps {
  addingCategoryEn?: boolean;
}

const TransactionForm = ({ addingCategoryEn = true }: TransactionFormProps) => {
  const [formState, setFormState] = useState({ isPayment: false });
  const [addingCategory, setAddingCategory] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>("");
  const { openSnackbar } = useSnackbar();

  const {
    result: categories,
    loading: loadingCategories,
    setResult,
  } = useApi<Category[]>("/category");

  const addCategory = () => {
    api
      .post<Category>("/category", { name: newCategory })
      .then(({ data }) => {
        setResult((prev) => [data, ...(prev ?? [])]);
        openSnackbar({
          message: `Korisnicka kategorija ${newCategory} uspesno dodata`,
        });
        setNewCategory("");
        setAddingCategory(false);
      })
      .catch(() => {
        openSnackbar({ message: "Doslo je do greske", severity: "error" });
      });
  };

  return (
    <>
      <Modal
        open={addingCategory}
        onClose={() => setAddingCategory(false)}
        className="flex justify-center items-center"
      >
        <Paper className="w-full md:w-3/5 lg:w-2/5 m-2">
          <Stack component="form" onSubmit={addCategory}>
            <ListItem>
              <Typography variant="h6" color="gray">
                Dodaj svoju kategoriju transakcije
              </Typography>
            </ListItem>
            <ListItem>
              <Box className="w-full">
                <TextField
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nova kategorija"
                  className="w-full"
                ></TextField>
              </Box>
            </ListItem>
            <ListItem>
              <Box className="w-full justify-end flex">
                <Button
                  startIcon={<MatIcon>done</MatIcon>}
                  variant="outlined"
                  type="submit"
                >
                  Dodaj
                </Button>
              </Box>
            </ListItem>
          </Stack>
        </Paper>
      </Modal>
      <Stack component="form" gap="0.6em">
        <Autocomplete
          disablePortal
          getOptionLabel={(o) => o.name ?? ""}
          options={categories ?? []}
          loading={loadingCategories}
          noOptionsText={
            addingCategoryEn && (
              <>
                <Box className="justify-between flex flex-wrap gap-4 align-middle">
                  Nema opcija
                  <Button
                    variant="outlined"
                    onClick={() => setAddingCategory(true)}
                  >
                    Dodaj
                  </Button>
                </Box>
              </>
            )
          }
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
    </>
  );
};

export default TransactionForm;
