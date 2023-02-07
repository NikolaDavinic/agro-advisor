import { Alert, AlertColor, CircularProgress, Snackbar } from "@mui/material";
import { LatLngExpression, PathOptions } from "leaflet";
import { SetStateAction, useEffect, useState } from "react";
import { MapContainer, Marker, Polygon, TileLayer, Tooltip, useMapEvents } from "react-leaflet";
import { homeIcon, Point } from "../../components/NewPlot/NewPlot";
import { useAuthContext } from "../../contexts/auth.context";
import { Plot } from "../../models/plot.model";
import axios, { api } from "../../utils/api/axios";
interface MapEventsProps {
    setPositions: React.Dispatch<SetStateAction<LatLngExpression[]>>;
    startPos: [number, number]
}
const MapEvents = (props: MapEventsProps) => {
    const map = useMapEvents({
        click(e: any) {
            props.setPositions((prevPos) => [...prevPos, e.latlng]);
        },
        load() {
            map.panTo(props.startPos);
        }
    });
    return <></>;
};
const PlotMap: React.FC = () => {
    const [showSpinner, setShowSpinner] = useState<boolean>(true);
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success");
    const { user } = useAuthContext();
    const [startPosition, setStartPosition] = useState<[number, number]>([43.331456, 21.892134]);
    const [plots, setPlots] = useState<Plot[]>([]);
    const blueOptions: PathOptions = { color: "blue", weight: 0.5, fillOpacity: 0.6 };

    useEffect(() => {
        if (user && user.address && user.address?.length > 0) {
            axios.get(`https://api.maptiler.com/geocoding/${user.address}.json?key=eIgS48TpQ70m77qKYrsx`)
                .then(res => {
                    if (res.data.features.length > 0)
                        setStartPosition([res.data.features[0].geometry.coordinates[1], res.data.features[0].geometry.coordinates[0]]);
                })
        }
        api.get<Plot[]>(`/plot/plots`)
            .then(res => {
                setShowSpinner(false);
                setPlots(res.data);
                // setBorderPoints(plotRes.BorderPoints)
            })
            .catch(err => {
                setSnackbarMessage(err);
                setShowSnackbar(true);
                setShowSpinner(false);
            })
    }, []);
    return (
        <div className="w-full h-full flex flex-col p-10">
            {showSpinner && <CircularProgress className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}

            {!showSpinner && <div className="w-full h-full">
                <div style={{ minHeight: "450px" }} className="w-full h-full py-4">
                    <MapContainer className="h-full w-full cursor-crosshair" center={startPosition} zoom={15} scrollWheelZoom={true}>
                        <TileLayer
                            url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=v4YRbPNezQckuRrQ6AGT"
                        />
                        <>
                            {plots.length > 0 && plots.map(plot =>
                                // console.log(plot.borderPoints[0].coordinates.values)
                                //@ts-ignore
                                <Polygon pathOptions={blueOptions} positions={plot.borderPoints.map(point => [point.coordinates.values[0], point.coordinates.values[1]])}>
                                    <Tooltip sticky={true}>{<>
                                        <p>{`Plot number: ${plot.plotNumber}`}</p>
                                        <p>{`Area: ${plot.area} m`}<sup>2 </sup></p>
                                        <p>{`Culture: ${plot.currentCulture}`}</p>
                                    </>}</Tooltip>
                                </Polygon>
                            
                            )}
                        </>
                        {/* <MapEvents setPositions={setBorderPoints} startPos={startPosition} /> */}
                        <Marker icon={homeIcon} position={startPosition}>
                        </Marker>
                    </MapContainer>
                </div>

            </div>}
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
        </div >
    );
}
export default PlotMap;