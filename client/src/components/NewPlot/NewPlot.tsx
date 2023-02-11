import {
  Alert,
  AlertColor,
  Button,
  CircularProgress,
  Icon,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import L, { LatLngExpression, PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import { SetStateAction, useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth.context";
import { Harvest } from "../../models/harvest.model";
import axios, { api } from "../../utils/api/axios";

export interface Point {
  x: number;
  y: number;
}
export interface PlotDTO {
  id?: string;
  area: number;
  plotNumber: number;
  municipality: string;
  userId?: string;
  currentCulture: string;
  borderPoints: Point[];
  harvests?: Harvest[];
}
interface MapEventsProps {
  setPositions: React.Dispatch<SetStateAction<LatLngExpression[]>>;
  startPos: [number, number];
}
const MapEvents = (props: MapEventsProps) => {
  const map = useMapEvents({
    click(e: any) {
      props.setPositions((prevPos) => [...prevPos, e.latlng]);
    },
    load() {
      map.panTo(props.startPos);
    },
  });
  return <></>;
};
export const homeIcon = L.icon({
  iconUrl:
    "https://cdn1.iconfinder.com/data/icons/real-estate-building-flat-vol-3/104/house__location__home__map__Pin-512.png",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [-3, -76],
});

const NewPlot: React.FC = () => {
  const { user } = useAuthContext();
  const [startPosition, setStartPosition] = useState<[number, number]>(
    user?.addressPoint ? [user.addressPoint.x, user.addressPoint.y] : [43.331456, 21.892134]);

  useEffect(() => {
    setStartPosition(user?.addressPoint ? [user.addressPoint.x, user.addressPoint.y] : [43.331456, 21.892134]);
  }, [user]);

  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const redOptions: PathOptions = { color: "blue", weight: 0.5 };
  const [borderPoints, setBorderPoints] = useState<LatLngExpression[]>([]);
  const removePoints = () => {
    setBorderPoints([]);
  };

  const [municipality, setMunicipality] = useState<string>("");
  const [culture, setCulture] = useState<string>("");
  const [plotNumber, setPlotNumber] = useState<number>(1);
  const [area, setArea] = useState<number>(1);

  const navigate = useNavigate();
  const onCancel = () => {
    navigate(-1);
  };
  const onSubmit = () => {
    setShowSpinner(true);
    var passed = true;
    if (area <= 0) {
      setSnackbarSeverity("warning");
      setSnackbarMessage("Površina mora biti najmanje 1 kv metar!");
      setShowSnackbar(true);
      passed = false;
    } else if (plotNumber <= 0) {
      setSnackbarSeverity("warning");
      setSnackbarMessage("Broj parcele mora biti pozitivan!");
      setShowSnackbar(true);
      passed = false;
    } else if (municipality.length === 0) {
      setSnackbarSeverity("warning");
      setSnackbarMessage("Opština je neophond!");
      setShowSnackbar(true);
      passed = false;
    }
    if (!passed) {
      setShowSpinner(false);
      return;
    }
    const data: PlotDTO = {
      municipality: municipality,
      area: area,
      borderPoints: [],
      currentCulture: culture,
      plotNumber: plotNumber,
      userId: user?.id,
    };
    data.borderPoints = borderPoints.map((p) => {
      var point: string = p.toString();
      var latlngStr = point.toString();
      var substr = latlngStr.substring(
        latlngStr.indexOf("(") + 1,
        latlngStr.lastIndexOf(")")
      );
      var cords = substr.split(",");
      return {
        x: Number(cords[0]),
        y: Number(cords[1]),
      };
    });
    api
      .post("/plot/add", data)
      .then((response) => {
        setSnackbarSeverity("success");
        setSnackbarMessage("Parcela uspešno dodata!");
        setShowSnackbar(true);
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error(error);
        setSnackbarSeverity("error");
        setSnackbarMessage(error);
        setShowSnackbar(true);
      });
  };
  return (
    <div className="w-full h-full flex flex-col p-10">
      {showSpinner && (
        <CircularProgress className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      )}
      <Typography gutterBottom variant="h5">
        Nova parcela
      </Typography>
      <TextField
        autoFocus
        margin="normal"
        label="Opština"
        type="text"
        // fullWidth
        variant="standard"
        onChange={(e) => setMunicipality(e.target.value)}
        value={municipality}
      />
      <TextField
        autoFocus
        margin="normal"
        label="Broj parcele"
        type="number"
        InputProps={{ inputProps: { min: 1 } }}
        // fullWidth
        variant="standard"
        onChange={(e) => setPlotNumber(Number(e.target.value))}
        value={plotNumber}
      />
      <TextField
        autoFocus
        margin="normal"
        label={<p>Površina (m{<sup>2</sup>})</p>}
        type="number"
        InputProps={{ inputProps: { min: 1 } }}
        // fullWidth
        variant="standard"
        onChange={(e) => setArea(Number(e.target.value))}
        value={area}
      />
      <TextField
        margin="normal"
        label="Trenutna kultura"
        type="text"
        // fullWidth
        variant="standard"
        onChange={(e) => setCulture(e.target.value)}
        value={culture}
      />
      <Typography gutterBottom variant="body1">
        Nacrtajte parcelu iZborom graničnih tačaka
      </Typography>
      <div className="w-full h-full">
        <div style={{ minHeight: "450px" }} className="w-full h-3/4 py-4">
          {user && <MapContainer
            className="h-full w-full cursor-crosshair"
            center={startPosition}
            zoom={15}
            scrollWheelZoom={true}
          >
            <TileLayer url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=v4YRbPNezQckuRrQ6AGT" />
            <Polygon pathOptions={redOptions} positions={borderPoints} />
            <MapEvents
              setPositions={setBorderPoints}
              startPos={startPosition}
            />
            <Marker icon={homeIcon} position={startPosition}></Marker>
          </MapContainer>}
        </div>
        <Button onClick={() => removePoints()} variant="contained">
          Obriši tačke
          <Icon sx={{ fontSize: 35 }} className="icon">
            delete
          </Icon>
        </Button>
      </div>
      <div className="w-full flex flex-row mb-5 pb-5">
        <Button fullWidth onClick={() => onCancel()}>
          Odustani
        </Button>
        <Button fullWidth variant="contained" onClick={() => onSubmit()}>
          Dodaj
        </Button>
      </div>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NewPlot;
