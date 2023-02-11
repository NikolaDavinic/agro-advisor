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
import { Point } from "geojson";
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
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth.context";
import { Harvest } from "../../models/harvest.model";
import { Plot } from "../../models/plot.model";
import axios, { api } from "../../utils/api/axios";
import { homeIcon, PlotDTO } from "../NewPlot/NewPlot";

interface MapEventsProps {
  setPositions: React.Dispatch<SetStateAction<LatLngExpression[]>>;
  startPos: [number, number];
}
const MapEvents = (props: MapEventsProps) => {
  const map = useMapEvents({
    click(e: any) {
      // console.log(e.latlng);
      const newPoint = [Number(e?.latlng?.lat), Number(e?.latlng?.lng)];
      //@ts-ignore
      // props.setPositions((prevPos) => [...prevPos, newPoint]);
      props.setPositions((prevPos) => [...prevPos, newPoint]);
    },
    load() {
      map.panTo(props.startPos);
    },
  });
  return <></>;
};

interface EditPlotProps {}

const EditPlot: React.FC = ({}: EditPlotProps) => {
  const { user } = useAuthContext();
  const { plotId } = useParams();

  const [startPosition, setStartPosition] = useState<[number, number]>([
    43.331456, 21.892134,
  ]);
  const [borderPoints, setBorderPoints] = useState<LatLngExpression[]>([]);
  const removePoints = () => {
    setBorderPoints([]);
  };
  const [plot, setPlot] = useState<Plot>();
  const [municipality, setMunicipality] = useState<string>("");
  const [culture, setCulture] = useState<string>("");
  const [plotNumber, setPlotNumber] = useState<number>(1);
  const [area, setArea] = useState<number>(1);

  useEffect(() => {
    api
      .get<Plot>(`/plot/${plotId}`)
      .then((res) => {
        setShowSpinner(false);
        setPlot(res.data);
        setStartPosition([
          //@ts-ignore
          res.data.borderPoints[0].coordinates.values[0],
          //@ts-ignore
          res.data.borderPoints[0].coordinates.values[1],
        ]);
        setMunicipality(res.data.municipality);
        setArea(res.data.area);
        setPlotNumber(res.data.plotNumber);
        setCulture(res.data.currentCulture);
        setBorderPoints(
          res.data.borderPoints.map((point) =>
            //@ts-ignore
            [point.coordinates.values[0], point.coordinates.values[1]]
          )
        );
      })
      .catch((err) => {
        setSnackbarMessage(err);
        setShowSnackbar(true);
        setShowSpinner(false);
      });
  }, []);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const redOptions: PathOptions = { color: "blue", weight: 0.5 };

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
    } else if (municipality.length === 0) {
      setSnackbarSeverity("warning");
      setSnackbarMessage("Municipality is required!");
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
      userId: user?.id as string,
      id: plot?.id as string,
      harvests: plot?.harvests as Harvest[],
    };
    // data.borderPoints = borderPoints.map(p => {
    //     var point: string = p.toString();
    //     var latlngStr = point.toString();
    //     var substr = latlngStr.substring(
    //         latlngStr.indexOf("(") + 1,
    //         latlngStr.lastIndexOf(")")
    //     );
    //     var cords = substr.split(",");
    //     return {
    //         // x: Number(cords[0]), y: Number(cords[1])
    //         ...plot?.borderPoints[plot.borderPoints.indexOf(p)],
    //         coordinates: [Number(cords[0]), Number(cords[1])]
    //     };
    // })
    data.borderPoints = borderPoints.map((p) => {
      // var point: string = p.toString();
      // var latlngStr = point.toString();
      // var substr = latlngStr.substring(
      //     latlngStr.indexOf("(") + 1,
      //     latlngStr.lastIndexOf(")")
      // );
      // var cords = substr.split(",");
      return {
        //@ts-ignore
        x: Number(p[0]),
        //@ts-ignore
        y: Number(p[1]),
      };
    });
    api
      .put("/plot/edit", data)
      .then((response) => {
        setSnackbarSeverity("success");
        setSnackbarMessage("Plot updated successfully!");
        setShowSnackbar(true);
        //TODO:TESTING
        setPlot(response.data);
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error(error);
        setSnackbarSeverity("error");
        setSnackbarMessage(error);
        setShowSnackbar(true);
        setShowSpinner(false);
      });
  };
  return (
    <div className="w-full h-full flex flex-col p-10">
      {showSpinner && (
        <CircularProgress className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      )}
      <Typography gutterBottom variant="h5">
        Izmeni parcelu
      </Typography>
      <TextField
        autoFocus
        margin="normal"
        label="Municipality"
        type="text"
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
        variant="standard"
        onChange={(e) => setArea(Number(e.target.value))}
        value={area}
      />
      <TextField
        margin="normal"
        label="Current Culture"
        type="text"
        variant="standard"
        onChange={(e) => setCulture(e.target.value)}
        value={culture}
      />
      <Typography gutterBottom variant="body1">
        Iscrtajte parcelu odabirom međnih tačaka:
      </Typography>
      <div className="w-full h-full">
        <div style={{ minHeight: "450px" }} className="w-full h-3/4 py-4">
          {plot && (
            <MapContainer
              className="h-full w-full cursor-crosshair"
              center={startPosition}
              zoom={16.5}
              scrollWheelZoom={true}
            >
              <TileLayer url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=v4YRbPNezQckuRrQ6AGT" />
              <Polygon pathOptions={redOptions} positions={borderPoints} />
              <MapEvents
                setPositions={setBorderPoints}
                startPos={startPosition}
              />
              {/* <Marker icon={homeIcon} position={startPosition}>
                        </Marker> */}
            </MapContainer>
          )}
        </div>
        <Button onClick={() => removePoints()} variant="contained">
          Clear Points
          <Icon sx={{ fontSize: 35 }} className="icon">
            delete
          </Icon>
        </Button>
      </div>
      <div className="w-full flex flex-row mb-5 pb-5">
        <Button fullWidth onClick={() => onCancel()}>
          DISCARD
        </Button>
        <Button fullWidth variant="contained" onClick={() => onSubmit()}>
          SAVE
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

export default EditPlot;
