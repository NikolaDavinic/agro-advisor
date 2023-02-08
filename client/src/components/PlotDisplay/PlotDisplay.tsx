import {
  Box,
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
  Typography,
} from "@mui/material";
import moment from "moment";
import { Machinery } from "../../models/machinery.model";
import ImageGallery from "react-image-gallery";
import { useState } from "react";
import MatIcon from "../MatIcon/MatIcon";
import styles from "./MachineryDisplay.module.scss";
import { Plot } from "../../models/plot.model";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import { LatLngExpression, PathOptions } from "leaflet";
import { ClassNames } from "@emotion/react";
import { useNavigate } from "react-router-dom";

interface PlotDisplayProps {
  plot: Plot;
  onDelete?: (plot: Plot) => void;
}
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
        <div className="min-h-fit">
          {children}
        </div>
        // </Box>
      ) : <></>}
    </div>
  );
}
const PlotDisplay = ({
  plot,
  onDelete = () => { },
}: PlotDisplayProps) => {
  let color: string = "green";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [borderPoints, setBorderPoints] = useState<LatLngExpression[]>(
    plot.borderPoints.map(point =>
      //@ts-ignore
      [point.coordinates.values[0], point.coordinates.values[1]]
    ));
  //@ts-ignore
  const [startPosition, setStartPosition] = useState<[number, number]>([plot.borderPoints[0].coordinates.values[0], plot.borderPoints[0].coordinates.values[1]]);

  const [currentTab, setCurrentTab] = useState<number>(0);

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
              <TableCell>
                {plot.municipality ?? "/"}
              </TableCell>
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
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="basic tabs example">
              <Tab label="Mapa" />
              <Tab label="Berbe" />
              <Tab label="Vremenska prognoza" />
            </Tabs>
          </Box>
        </Box>
        <TabPanel value={currentTab} index={0}>
          <div className="w-full h-96">
            {plot && <MapContainer className="h-full w-full cursor-crosshair" center={startPosition} zoom={16.5} scrollWheelZoom={true}>
              <TileLayer
                url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=v4YRbPNezQckuRrQ6AGT"
              />
              <Polygon pathOptions={blueOptions} positions={borderPoints} />

            </MapContainer>}
          </div>
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          Item Three
        </TabPanel>
      </Box>
    </Paper>
  );
};

export default PlotDisplay;
