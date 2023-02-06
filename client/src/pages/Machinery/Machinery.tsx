import { Box, Button } from "@mui/material";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import MachineryForm from "../../components/MachineryForm/MachineryForm";
import { useSnackbar } from "../../contexts/snackbar.context";
import { ApiMessage } from "../../dtos/api-message.dto";
import { Machinery } from "../../models/machinery.model";
import { api } from "../../utils/api/axios";

const Machines = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const onAddMachine = (machine: Machinery) => {
    api
      .post<Machinery>("machinery", machine)
      .then(({ data }) => openSnackbar({ message: "Uspesno dodata mašina" }))
      .catch((err: AxiosError<ApiMessage>) => {
        openSnackbar({ message: err.message, severity: "error" });
      });
  };

  return (
    <Box>
      <Box className="p-2">
        <Button variant="outlined">Dodaj mašinu</Button>
        <MachineryForm onSubmit={onAddMachine}></MachineryForm>
      </Box>
    </Box>
  );
};

export default Machines;
