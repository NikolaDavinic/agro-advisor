import { Box, Button, Icon, Stack, Typography } from "@mui/material";
import { MapContainer, TileLayer, useMap, Marker, Popup, Polyline, Polygon, useMapEvents } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import { LatLng, LatLngExpression, PathOptions } from "leaflet";
import { SetStateAction, useState } from "react";
import { SetState } from "immer/dist/internal";

export interface Point {
    x: number;
    y: number;
}
export interface PlotDTO {
    id?: string;
    area: number;
    plotNumber: number;
    municipality: string;
    userId: string;
    currentCulture: string;
    borderPoints: Point[]
}
interface MapEventsProps {
    setPositions: React.Dispatch<SetStateAction<LatLngExpression[]>>
}
const MapEvents = (props: MapEventsProps) => {
    // const [positions, setPositions] = useState<LatLng[]>([]);
    const map = useMapEvents({
        click(e) {
            props.setPositions(prevPos => [...prevPos, e.latlng]);
            // console.log(positions);
        }
    })
    return <></>;
}

const NewPlot: React.FC = () => {

    const redOptions: PathOptions = { color: 'blue', weight: 0.5 }
    const removePoints = () => {
        setBorderPoints([]);
    }
    const [borderPoints, setBorderPoints] = useState<LatLngExpression[]>([]);
    return (
        <div className="w-full h-full">
            <div className="w-1/2 h-1/2">
                {/*TODO: Centriraj mapu na adresu korisnika */}
                <MapContainer className="h-full w-full cursor-crosshair" center={[42.96431, 22.12646]} zoom={15} scrollWheelZoom={true}>
                    <TileLayer
                        url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=v4YRbPNezQckuRrQ6AGT"
                    />
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
            <Button onClick={() => removePoints()}>
                <Icon sx={{ fontSize: 35 }} className="icon">
                    delete
                </Icon>
            </Button>
        </div>
    );
};

export default NewPlot;