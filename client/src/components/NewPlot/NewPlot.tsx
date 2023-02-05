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
import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression, PathOptions } from "leaflet";
import { SetStateAction, useState } from "react";
import { useAuthContext } from "../../contexts/auth.context";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api/axios";

export interface Point {
  x: number;
  y: number;
}
export interface PlotDTO {
  // id?: string;
  area: Number;
  plotNumber: Number;
  municipality: string;
  userId?: string;
  currentCulture: string;
  borderPoints: Point[];
}
interface MapEventsProps {
  setPositions: React.Dispatch<SetStateAction<LatLngExpression[]>>;
}
const MapEvents = (props: MapEventsProps) => {
  const map = useMapEvents({
    click(e: any) {
      props.setPositions((prevPos) => [...prevPos, e.latlng]);
    },
  });
  return <></>;
};

const NewPlot: React.FC = () => {
  const { user, isAuthenticated } = useAuthContext();

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
  const [plotNumber, setPlotNumber] = useState<Number>(1);
  const [area, setArea] = useState<Number>(1);

  const navigate = useNavigate();
  const onCancel = () => {
    navigate(-1);
  };
  const onSubmit = () => {
    setShowSpinner(true);
    var passed = true;
    if (area <= 0) {
      setSnackbarSeverity("warning");
      setSnackbarMessage("Area must be at least 1 square meter!");
      setShowSnackbar(true);
      passed = false;
    } else if (plotNumber <= 0) {
      setSnackbarSeverity("warning");
      setSnackbarMessage("Plot number must be non zero value!");
      setShowSnackbar(true);
      passed = false;
    } else if (municipality.length == 0) {
      setSnackbarSeverity("warning");
      setSnackbarMessage("municipality is required!");
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
    // api
    //     .post("/listing/add", data)
    //     .then((response) => {
    //         return navigate("/listing/" + response.data[0].id);
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //         setSnackbarSeverity("error");
    //         setSnackbarMessage(error);
    //         setShowSnackbar(true);
    //     });
    console.log(data);
  };
  return (
    <div className="w-full h-full flex flex-col p-10">
      {showSpinner && (
        <CircularProgress className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      )}
      <Typography gutterBottom variant="h5">
        New plot
      </Typography>
      <TextField
        autoFocus
        margin="normal"
        label="Municipality"
        type="text"
        // fullWidth
        variant="standard"
        onChange={(e) => setMunicipality(e.target.value)}
        value={municipality}
      />
      <TextField
        autoFocus
        margin="normal"
        label="Plot Number"
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
        label={<p>Area (m{<sup>2</sup>})</p>}
        type="number"
        InputProps={{ inputProps: { min: 1 } }}
        // fullWidth
        variant="standard"
        onChange={(e) => setArea(Number(e.target.value))}
        value={area}
      />
      <TextField
        margin="normal"
        label="Current Culture"
        type="text"
        // fullWidth
        variant="standard"
        onChange={(e) => setMunicipality(e.target.value)}
        value={municipality}
      />
      <Typography gutterBottom variant="body1">
        Draw plot by selecting border points:
      </Typography>
      <div className="w-full h-full">
        <div className="w-full h-3/4 py-4">
          {/*TODO: Centriraj mapu na adresu korisnika */}
          <MapContainer
            className="h-full w-full cursor-crosshair"
            center={[42.96431, 22.12646]}
            zoom={15}
            scrollWheelZoom={true}
          >
            <TileLayer url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=v4YRbPNezQckuRrQ6AGT" />
            <Polygon pathOptions={redOptions} positions={borderPoints} />
            <MapEvents setPositions={setBorderPoints} />
            {/*TODO: Marker na adresu korisnika sa ikonicu kuce */}
            {/* <Marker icon={pocetakIcon} position={[dogadjaj.ruta.lokacije[0].xCord, dogadjaj.ruta.lokacije[0].yCord]}>
                        <Popup>
                            Pocetak rute
                        </Popup>
                    </Marker> */}
          </MapContainer>
        </div>
        <Button onClick={() => removePoints()} variant="contained">
          Clear Points
          <Icon sx={{ fontSize: 35 }} className="icon">
            delete
          </Icon>
        </Button>
      </div>
      <div className="w-full flex flex-row">
        <Button fullWidth onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button fullWidth variant="contained" onClick={() => onSubmit()}>
          Add
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
