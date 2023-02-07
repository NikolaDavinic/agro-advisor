import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
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
import { useConfirm } from "material-ui-confirm";

const Machines = () => {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState<boolean>();
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(
    null
  );

  const confirm = useConfirm();
  const { openSnackbar } = useSnackbar();

  const {
    result: machineSummaries,
    loading,
    setResult: setMachineSummaries,
  } = useApi<Machinery[]>("machinery");

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
        setMachineSummaries((prev) => [data, ...(prev ?? [])]);
        setFormOpen(false);
      })
      .catch((err: AxiosError<ApiMessage>) => {
        openSnackbar({ message: err.message, severity: "error" });
      });
  };

  const deleteMachine = (machine: Machinery) => {
    confirm({
      description: "Da li ste sigurni da želite da obrišete mašinu?",
      title: "Potvrdite akciju",
    }).then(() => {
      api
        .delete(`machinery/${machine.id}`)
        .then(() => {
          openSnackbar({
            message: "Uspešno obrisana mašinu",
            severity: "success",
          });
          setMachineSummaries((prev) =>
            (prev ?? []).filter((m) => m.id !== machine.id)
          );
        })
        .catch((err: AxiosError<ApiMessage>) => {
          openSnackbar({ message: err.message, severity: "error" });
        });
    });
  };

  return (
    <Box className="flex flex-wrap">
      <Box sx={{ flexGrow: 1 }}>
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
          {!loading && machineSummaries?.length == 0 && (
            <Typography className="text-gray-500">
              Dodajte svoju mehanizaciju!
            </Typography>
          )}
          {loading && (
            <Box className="flex justify-center">
              <CircularProgress color="primary"></CircularProgress>
            </Box>
          )}
          {!loading && (
            <Stack maxHeight="80%" overflow="auto" className="p-2 gap-2">
              {machineSummaries?.map((m) => (
                <MachineryCard
                  onClick={() => setSelectedMachineId(m.id ?? null)}
                  machine={m}
                  key={m.id}
                  className="cursor-pointer"
                ></MachineryCard>
              ))}
            </Stack>
          )}
        </Stack>
      </Box>
      <Box sx={{ flexGrow: 5 }} className="p-10">
        {selectedMachine && (
          <>
            <Box>
              <Typography gutterBottom variant="h6" className="text-gray-400">
                Odabrana mašina
              </Typography>
            </Box>
            {selectedMachineLoading ? (
              <LinearProgress color="primary"></LinearProgress>
            ) : (
              <MachineryDisplay
                machine={selectedMachine}
                onDelete={deleteMachine}
              ></MachineryDisplay>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Machines;
