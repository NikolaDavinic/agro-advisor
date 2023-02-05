import { Box, Button, Stack, Typography } from "@mui/material";
import { MapContainer, TileLayer, useMap, Marker, Popup, Polyline, Polygon, useMapEvents } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import { LatLng, LatLngExpression, PathOptions } from "leaflet";
import { useState } from "react";

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
const MapEvents = () => {
    const [position, setPosition] = useState<LatLng>();
    const map = useMapEvents({
        click(e) {
            alert(e.latlng);
        }
    })
    return <></>;
}

const NewPlot: React.FC = () => {

    const redOptions: PathOptions = { color: 'red', weight: 0.5 }
    const polygon: LatLngExpression[] = [
        [42.96431, 22.12646],
        [42.96531, 22.12646],
        [42.96531, 22.12846],
    ]
    return (
        <div className="w-1/2 h-1/2 absolute">
            <MapContainer className="h-full w-full" center={[42.96431, 22.12646]} zoom={15} scrollWheelZoom={true}>
                <TileLayer
                    url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=v4YRbPNezQckuRrQ6AGT"
                />
                <Polygon pathOptions={redOptions} positions={polygon} />
                <MapEvents />
                {/* <Marker icon={pocetakIcon} position={[dogadjaj.ruta.lokacije[0].xCord, dogadjaj.ruta.lokacije[0].yCord]}>
                        <Popup>
                            Pocetak rute
                        </Popup>
                    </Marker> */}
            </MapContainer>
        </div>
    );
};

export default NewPlot;