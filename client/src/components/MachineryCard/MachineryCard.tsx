import { Paper } from "@mui/material";
import { Machinery } from "../../models/machinery.model";

export interface MachineryCardProps {
  machine: Machinery;
}

const MachineryCard = ({ machine }: MachineryCardProps) => {
  return <Paper>{machine.registeredUntil}</Paper>;
};

export default MachineryCard;
