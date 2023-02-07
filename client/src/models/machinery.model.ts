export interface Machinery {
  id?: string;
  type: number | string;
  machineTypeValue?: string;
  productionYear: string;
  images?: string[] | File[];
  model: string;
  licensePlate: string;
  registeredUntil: string;
}
