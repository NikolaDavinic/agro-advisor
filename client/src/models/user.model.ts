import { Point } from "../components/NewPlot/NewPlot";

export interface User {
  id?: string;
  name?: string;
  email?: string;
  address?: string;
  addressPoint?: Point;
}
