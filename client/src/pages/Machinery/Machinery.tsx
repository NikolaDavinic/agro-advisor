import { Box, Button, Paper, Stack } from "@mui/material";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MachineryCard from "../../components/MachineryCard/MachineryCard";
import MachineryForm from "../../components/MachineryForm/MachineryForm";
import { useSnackbar } from "../../contexts/snackbar.context";
import { ApiMessage } from "../../dtos/api-message.dto";
import { useApi } from "../../hooks/api.hook";
import { Machinery } from "../../models/machinery.model";
import { api } from "../../utils/api/axios";

const Machines = () => {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState<boolean>();

  const { openSnackbar } = useSnackbar();

  const { result: machineSummaries, loading } =
    useApi<Machinery[]>("machinery");

  const onAddMachine = (machine: Machinery) => {
    api
      .post<Machinery>("machinery", machine)
      .then(({ data }) => {
        openSnackbar({ message: "Uspesno dodata mašina" });
        setFormOpen(false);
      })
      .catch((err: AxiosError<ApiMessage>) => {
        openSnackbar({ message: err.message, severity: "error" });
      });
  };
  console.log(machineSummaries);
  return (
    <Box>
      <Stack className="p-2 gap-2">
        <Box>
          <Button
            variant="outlined"
            color={formOpen ? "error" : "primary"}
            onClick={() => setFormOpen((prev) => !prev)}
          >
            {formOpen ? "Zatvori" : "Dodaj mašinu"}
          </Button>
        </Box>
        {formOpen && (
          <Paper className="p-2">
            <MachineryForm onSubmit={onAddMachine}></MachineryForm>
          </Paper>
        )}
        <Box>
          {machineSummaries?.map((m) => (
            <MachineryCard
              machine={m}
              key={m.id}
              className="cursor-pointer"
            ></MachineryCard>
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

export default Machines;
