import { Point } from "geojson";
import { Harvest } from "./harvest.model";

export interface Plot {
    id: string | null;
    area: number;
    plotNumber: number;
    // BorderPoints: GeoJsonPoint<GeoJson2DGeographicCoordinates>[];
    borderPoints : Point[]
    municipality: string;
    userId: string;
    currentCulture: string;
    harvests: Harvest[];
}