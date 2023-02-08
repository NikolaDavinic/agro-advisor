import { Box, Button, CircularProgress, Paper, Stack } from "@mui/material";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MachineryCard from "../../components/MachineryCard/MachineryCard";
import MachineryForm from "../../components/MachineryForm/MachineryForm";
import PlotCard from "../../components/PlotCard/PlotCard";
import { useSnackbar } from "../../contexts/snackbar.context";
import { ApiMessage } from "../../dtos/api-message.dto";
import { useApi } from "../../hooks/api.hook";
import { Machinery } from "../../models/machinery.model";
import { Plot } from "../../models/plot.model";
import { api } from "../../utils/api/axios";

const Plots = () => {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState<boolean>();
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(
    null
  );

  const { openSnackbar } = useSnackbar();

  const { result: plotSummaries, loading } =
    useApi<Plot[]>("plot/plotsSum");

  const { result: selectedPlot, loading: selectedPlotLoading } =
    useApi<Plot | null>(
      selectedPlotId ? `plot/${selectedPlotId}` : ""
    );

  useEffect(() => {
    if (plotSummaries && plotSummaries?.length > 0)
      setSelectedPlotId(plotSummaries[0].id ?? null);
  }, [plotSummaries]);

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
              onClick={() => navigate("/newplot")}
            >
              Dodaj zemljište
            </Button>
          </Box>
          {/* {formOpen && (
            <Paper className="p-2">
              <MachineryForm onSubmit={onAddMachine}></MachineryForm>
            </Paper>
          )} */}
          {loading && (
            <Box className="flex justify-center">
              <CircularProgress color="primary"></CircularProgress>
            </Box>
          )}
          {!loading && (
            <Box className="w-1/3">
              {plotSummaries?.map((p) => (
                <PlotCard
                  onClick={() => setSelectedPlotId(p.id ?? null)}
                  plot={p}
                  key={p.id}
                  className="cursor-pointer m-1"
                ></PlotCard>
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

export default Plots;
