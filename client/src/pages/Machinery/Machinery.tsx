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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(
    null
  );
  const [changeLoader, setChangeLoader] = useState<boolean>(false);

  const confirm = useConfirm();
  const { openSnackbar } = useSnackbar();

  const {
    result: machineSummaries,
    loading,
    setResult: setMachineSummaries,
  } = useApi<Machinery[]>("machinery");

  const {
    result: selectedMachine,
    loading: selectedMachineLoading,
    setResult: setSelectedMachine,
  } = useApi<Machinery | null>(
    selectedMachineId ? `machinery/${selectedMachineId}` : ""
  );

  useEffect(() => {
    if (machineSummaries && machineSummaries?.length > 0)
      setSelectedMachineId(machineSummaries[0].id ?? null);
  }, [machineSummaries]);

  const editMachine = () => {
    setFormOpen(true);
    setIsEditing(true);
  };

  const onAddMachine = async (
    machine: Machinery,
    addedPhotos?: File[],
    removedPhotos?: string[]
  ) => {
    let images: string[] = [];

    setChangeLoader(true);

    if (addedPhotos && addedPhotos.length > 0) {
      const formData = new FormData();
      addedPhotos?.forEach((img) => formData.append("files", img));

      openSnackbar({ message: "Optremaju se slike...", severity: "info" });

      const res = await api({
        method: "post",
        url: "files/upload-multiple",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      images = res.data.paths;
    }

    if (isEditing) {
      machine.images = [
        ...(selectedMachine?.images?.filter(
          (i) => removedPhotos?.indexOf(i) === -1
        ) ?? []),
        ...images,
      ];

      machine.id = selectedMachineId ?? "";

      api
        .put<Machinery>("machinery", machine)
        .then(({ data }) => {
          openSnackbar({
            message: "Uspesno izmenjena mašina",
            severity: "success",
          });
          setFormOpen(false);
          setSelectedMachineId(null);
          setMachineSummaries((prev) => [
            data,
            ...(prev ?? []).filter((p) => p.id !== data.id),
          ]);
        })
        .catch((err: AxiosError<ApiMessage>) => {
          openSnackbar({ message: err.message, severity: "error" });
        })
        .finally(() => setChangeLoader(false));
    } else {
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
        })
        .finally(() => setChangeLoader(false));
    }
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
            message: "Uspešno obrisana mašina",
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
              onClick={() => {
                setFormOpen((prev) => !prev);
                setIsEditing(false);
              }}
            >
              {formOpen ? "Zatvori" : "Dodaj mašinu"}
            </Button>
          </Box>
          {formOpen && (
            <Paper className="p-2">
              <MachineryForm
                buttonText={isEditing ? "Sačuvaj izmene" : "Dodaj"}
                onSubmit={onAddMachine}
                machine={isEditing ? selectedMachine : null}
              ></MachineryForm>
            </Paper>
          )}
          {changeLoader && <LinearProgress></LinearProgress>}
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
                  onClick={() => {
                    setSelectedMachineId(m.id ?? null);
                    if (isEditing) setFormOpen(false);
                  }}
                  machine={m}
                  key={m.id}
                  className={`cursor-pointer ${
                    m.id === selectedMachineId ? "highlighted" : null
                  }`}
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
                onEditClick={editMachine}
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
