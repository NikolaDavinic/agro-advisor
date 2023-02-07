import { Box, Button, CircularProgress, Paper, Stack } from "@mui/material";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MachineryCard from "../../components/MachineryCard/MachineryCard";
import MachineryDisplay from "../../components/MachineryDisplay/MachineryDisplay";
import MachineryForm from "../../components/MachineryForm/MachineryForm";
import { useSnackbar } from "../../contexts/snackbar.context";
import { ApiMessage } from "../../dtos/api-message.dto";
import { useApi } from "../../hooks/api.hook";
import { Machinery } from "../../models/machinery.model";
import { api } from "../../utils/api/axios";

const Machines = () => {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState<boolean>();
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(
    null
  );

  const { openSnackbar } = useSnackbar();

  const { result: machineSummaries, loading } =
    useApi<Machinery[]>("machinery");

  const { result: selectedMachine, loading: selectedMachineLoading } =
    useApi<Machinery | null>(
      selectedMachineId ? `machinery/${selectedMachineId}` : ""
    );

  useEffect(() => {
    if (machineSummaries && machineSummaries?.length > 0)
      setSelectedMachineId(machineSummaries[0].id ?? null);
  }, [machineSummaries]);

  const onAddMachine = async (machine: Machinery) => {
    let images: string[] = [];

    if (machine.images && machine.images?.length > 0) {
      console.log(machine.images);

      const formData = new FormData();
      machine.images.forEach((img) => formData.append("files", img));

      openSnackbar({ message: "Optremaju se slike...", severity: "info" });
      const res = await api({
        method: "post",
        url: "files/upload-multiple",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      images = res.data.paths;
    }

    machine.images = images;
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

  return (
    <Box>
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
          {loading && (
            <Box className="flex justify-center">
              <CircularProgress color="primary"></CircularProgress>
            </Box>
          )}
          {!loading && (
            <Box>
              {machineSummaries?.map((m) => (
                <MachineryCard
                  onClick={() => setSelectedMachineId(m.id ?? null)}
                  machine={m}
                  key={m.id}
                  className="cursor-pointer"
                ></MachineryCard>
              ))}
            </Box>
          )}
        </Stack>
      </Box>
      {/* <Box>
        {selectedMachine && (
          <MachineryDisplay machine={selectedMachine}></MachineryDisplay>
        )}
      </Box> */}
    </Box>
  );
};

export default Machines;
