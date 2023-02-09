import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tabs,
} from "@mui/material";
import { LatLngExpression, PathOptions } from "leaflet";
import { useState } from "react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../contexts/snackbar.context";
import { Harvest } from "../../models/harvest.model";
import { Plot } from "../../models/plot.model";
import { api } from "../../utils/api/axios";
import HarvestCard from "../HarvestCard/HarvestCard";
import HarvestForm from "../HarvestForm/HarvestForm";
import MatIcon from "../MatIcon/MatIcon";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const blueOptions: PathOptions = { color: "blue", weight: 0.5 };

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className="min-h-fit"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index ? (
        // <Box sx={{ p: 3 }}>
        <div className="min-h-fit">{children}</div>
      ) : (
        // </Box>
        <></>
      )}
    </div>
  );
}
interface PlotDisplayProps {
  plot: Plot;
  onDelete?: (plot: Plot) => void;
}
const PlotDisplay = ({
  plot: plotProp,
  onDelete = () => {},
}: PlotDisplayProps) => {
  const [plot, setPlot] = useState<Plot>(plotProp);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const [borderPoints, setBorderPoints] = useState<LatLngExpression[]>(
    plot.borderPoints.map((point) =>
      //@ts-ignore
      [point.coordinates.values[0], point.coordinates.values[1]]
    )
  );

  const [startPosition, setStartPosition] = useState<[number, number]>([
    //@ts-ignore
    plot.borderPoints[0].coordinates.values[0],
    //@ts-ignore
    plot.borderPoints[0].coordinates.values[1],
  ]);

  const [currentTab, setCurrentTab] = useState<number>(0);
  const { openSnackbar } = useSnackbar();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  const onAddHarvest = (harvest: Harvest) => {
    api
      .post<Harvest>(`/harvest/add/${plot.id}`, harvest)
      .then(({ data }) => {
        openSnackbar({ message: "Berba uspesno dodata!", severity: "success" });
        setPlot((prevPlot) => ({
          ...prevPlot,
          harvests: [data, ...prevPlot.harvests],
        }));
      })
      .catch((error) => {
        console.error(error);
        openSnackbar({ message: "Doslo je do greske", severity: "error" });
      });
  }
  const onDeleteHarvest = (harvestId?: string) => {
    console.log(harvestId);
    api
      .delete(`/harvest/${plot.id}/${harvestId}`)
      .then((response) => {
        openSnackbar({
          message: "Berba uspesno Obrisana!",
          severity: "success",
        });
        setPlot((prevPlot) => ({
          ...prevPlot,
          harvests: prevPlot.harvests.filter((h) => h.id !== harvestId),
        }));
      })
      .catch((error) => {
        console.error(error);
        openSnackbar({ message: "Doslo je do greske", severity: "error" });
      });
  };

  return (
    <Paper elevation={4} className={`p-2`}>
      <Box className="w-full">
        <Box className="flex justify-end">
          <IconButton onClick={handleClick}>
            <MatIcon style={{ color: "black" }}>more_vert</MatIcon>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: "left", vertical: "top" }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                onDelete(plot);
              }}
            >
              <MatIcon color="error">delete</MatIcon>
              &nbsp;Obriši
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                navigate(`/plot/${plot.id}/edit`);
              }}
            >
              <MatIcon color="action">edit</MatIcon>
              &nbsp;Izmeni
            </MenuItem>
          </Menu>
        </Box>
        <Table className="w-full" sx={{ fontSize: "1.6rem" }}>
          <TableBody>
            <TableRow>
              <TableCell variant="head">Opština:</TableCell>
              <TableCell>{plot.municipality ?? "/"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left" variant="head">
                Broj Parcele:
              </TableCell>
              <TableCell>{plot.plotNumber ?? "/"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left" variant="head">
                Površina:
              </TableCell>
              <TableCell>
                <>
                  {plot.area}
                  {` m`}
                  <sup>2</sup>
                </>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left" variant="head">
                Trenutna kultura:
              </TableCell>
              <TableCell>{plot.currentCulture ?? "/"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box className="p-4 flex justify-center">
          <Box
            sx={{ margin: "auto", maxWidth: { xs: "100vw", md: "40vw" } }}
            className="w-full lg:w-3/5 xl:2/5"
            textAlign="center"
          >
            <Tabs
              centered
              className="w-full justify-between"
              indicatorColor="secondary"
              value={currentTab}
              onChange={handleTabChange}
              aria-label="basic tabs example"
            >
              <Tab label="Mapa" className="w-1/2" />
              <Tab label="Berbe" className="w-1/2" />
            </Tabs>
          </Box>
        </Box>
        <TabPanel value={currentTab} index={0}>
          <div className="w-full h-96">
            {plot && (
              <MapContainer
                className="h-full w-full cursor-crosshair"
                center={startPosition}
                zoom={16.5}
                scrollWheelZoom={true}
              >
                <TileLayer url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=v4YRbPNezQckuRrQ6AGT" />
                <Polygon pathOptions={blueOptions} positions={borderPoints} />
              </MapContainer>
            )}
          </div>
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <div className="w-full h-96">
            <Stack overflow="auto" className="p-2 gap-2 h-full">
              <Box>
                <Button
                  variant="text"
                  color={formOpen ? "error" : "primary"}
                  onClick={() => setFormOpen((prev) => !prev)}
                >
                  {formOpen ? "Zatvori" : "Dodaj berbu"}
                </Button>
              </Box>
              {formOpen && (
                <Paper className="p-2">
                  <HarvestForm
                    onSubmit={(harvest) => onAddHarvest(harvest)}
                  ></HarvestForm>
                </Paper>
              )}
              {plot.harvests.length === 0 && "Nemate unetih berbi..."}
              {plot.harvests.length > 0 &&
                plot.harvests?.map((h) => (
                  <HarvestCard
                    harvest={h}
                    key={h.id}
                    className={`cursor-pointer`}
                    onDelete={(harvestId) => onDeleteHarvest(harvestId)}
                  ></HarvestCard>
                ))}
            </Stack>
          </div>
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          Item Three
        </TabPanel>
      </Box>
    </Paper>
  );
};

export default PlotDisplay;
