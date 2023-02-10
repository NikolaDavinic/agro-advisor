import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import { useConfirm } from 'material-ui-confirm';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PlotCard from '../../components/PlotCard/PlotCard';
import PlotDisplay from '../../components/PlotDisplay/PlotDisplay';
import { useSnackbar } from '../../contexts/snackbar.context';
import { ApiMessage } from '../../dtos/api-message.dto';
import { useApi } from '../../hooks/api.hook';
import { Plot } from '../../models/plot.model';
import { api } from '../../utils/api/axios';

const Plots = () => {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const confirm = useConfirm();
  const { openSnackbar } = useSnackbar();
  // const { result: plotSummaries, loading } =
  //   useApi<Plot[]>("plot/plotsSum");
  const {
    result: plotSummaries,
    loading,
    setResult: setplotSummaries,
  } = useApi<Plot[]>('plot/plotsSum');

  const { result: selectedPlot, loading: selectedPlotLoading } =
    useApi<Plot | null>(selectedPlotId ? `plot/${selectedPlotId}` : '');
  const onPlotSelect = (id?: string) => {
    setSelectedPlotId(id ?? null);
    var newurl =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname +
      `?plot=${id}`;
    window.history.pushState({ path: newurl }, '', newurl);
  };

  useEffect(() => {
    if (plotSummaries && plotSummaries?.length > 0) {
      const plotId = searchParams.get('plot');
      if (plotId != null) onPlotSelect(plotId);
      else onPlotSelect(plotSummaries[0].id ?? null);
    }
  }, [plotSummaries, searchParams]);

  const showHarvestForm = () => {
    setFormOpen(true);
    console.log('formOpened');
  };
  const deletePlot = (plot: Plot) => {
    confirm({
      description: 'Da li ste sigurni da želite da obrišete zemljište?',
      title: 'Potvrdite akciju',
    }).then(() => {
      api
        .delete(`plot/${plot.id}`)
        .then(() => {
          openSnackbar({
            message: 'Uspešno obrisano zemljiste',
            severity: 'success',
          });
          setplotSummaries(prev => (prev ?? []).filter(p => p.id !== plot.id));
        })
        .catch((err: AxiosError<ApiMessage>) => {
          openSnackbar({ message: err.message, severity: 'error' });
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
              color={'primary'}
              onClick={() => navigate('/newplot')}>
              Dodaj zemljište
            </Button>
          </Box>
          {loading && (
            <Box className="flex justify-center">
              <CircularProgress color="primary"></CircularProgress>
            </Box>
          )}
          {!loading && (
            <Stack maxHeight="80%" overflow="auto" className="p-2 gap-2">
              {plotSummaries?.map(p => (
                <PlotCard
                  onClick={() => {
                    onPlotSelect(p.id);
                  }}
                  plot={p}
                  key={p.id}
                  className={`cursor-pointer 
                  ${p.id === selectedPlotId ? 'highlighted' : null}
                  `}></PlotCard>
              ))}
            </Stack>
          )}
        </Stack>
      </Box>
      <Box sx={{ flexGrow: 5 }} className="p-10">
        {selectedPlot && (
          <>
            <Box>
              <Typography gutterBottom variant="h6" className="text-gray-400">
                Odabrano zemljište
              </Typography>
            </Box>
            {selectedPlotLoading ? (
              <LinearProgress color="primary"></LinearProgress>
            ) : (
              <PlotDisplay
                plot={selectedPlot}
                onDelete={deletePlot}></PlotDisplay>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Plots;
