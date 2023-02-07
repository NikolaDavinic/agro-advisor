import { Alert, AlertColor, CircularProgress, Snackbar, Typography } from "@mui/material";
import { PathOptions } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polygon, TileLayer, Tooltip } from "react-leaflet";
import { NavigateFunction, useNavigate } from "react-router";
import { homeIcon } from "../../components/NewPlot/NewPlot";
import { useAuthContext } from "../../contexts/auth.context";
import { Plot } from "../../models/plot.model";
import axios, { api } from "../../utils/api/axios";
import randomColor from "randomcolor";

interface PolygonClickEventProps {
    plot: Plot;
    navigate: NavigateFunction;
}
const bluePathOptions: PathOptions = { color: "blue", weight: 0.5, fillOpacity: 0.6 };

const PlotPolygon = ({ plot, navigate }: PolygonClickEventProps) => {
    const eventHandlers = useMemo(
        () => ({
            click() {
                navigate(`/plot/${plot.id}`);
            },
        }),
        [],
    )

    return (
        //@ts-ignore
        <Polygon eventHandlers={eventHandlers} pathOptions={{ ...bluePathOptions, color: randomColor() }} positions={plot.borderPoints.map(point => [point.coordinates.values[0], point.coordinates.values[1]])}>
            <Tooltip sticky={true}>{
                <>
                    <p>{`Plot number: ${plot.plotNumber}`}</p>
                    <p>{`Area: ${plot.area} m`}<sup>2 </sup></p>
                    <p>{`Culture: ${plot.currentCulture}`}</p>
                </>}
            </Tooltip>
        </Polygon>
    )
}

const PlotMap: React.FC = () => {
    const [showSpinner, setShowSpinner] = useState<boolean>(true);
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success");
    const { user } = useAuthContext();
    const [startPosition, setStartPosition] = useState<[number, number]>([43.331456, 21.892134]);
    const [plots, setPlots] = useState<Plot[]>([]);
    const navigate = useNavigate();

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
                <Typography gutterBottom variant="h5">
                    Click on any plot to view further details
                </Typography>
                <div style={{ minHeight: "450px" }} className="w-full h-full py-4">
                    <MapContainer className="h-full w-full cursor-crosshair" center={startPosition} zoom={15} scrollWheelZoom={true}>
                        <TileLayer
                            url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=v4YRbPNezQckuRrQ6AGT"
                        />
                        <>
                            {plots.length > 0 && plots.map(plot =>
                                <PlotPolygon navigate={navigate} plot={plot} key={plot.id} />
                            )}
                        </>
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