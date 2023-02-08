import { Box, ListItem, Paper, Stack, Typography } from "@mui/material";
import moment from "moment";
import { Machinery } from "../../models/machinery.model";
import "./MachineryCard.scss";

export interface MachineryCardProps {
  machine: Machinery;
  [key: string]: any;
}

const MachineryCard = ({ machine, ...props }: MachineryCardProps) => {
  let color: string = "green";

  const dateDiff = moment(machine.registeredUntil).diff(moment(), "days");

  if (dateDiff < 0) {
    color = "#A63232";
  } else if (dateDiff < 30) {
    color = "orange";
  }

  return (
    <Paper
      elevation={4}
      {...props}
      className={`p-2 flex justify-between ${props.className}`}
    >
      <Box>
        <Typography className="text-gray-400">{machine.type}</Typography>
        <Typography fontWeight="bold">{machine.model}</Typography>
      </Box>
      <Box>
        <Box>
          <span className="text-gray-400">Registrovan do: </span>
          <span style={{ color: color }}>
            {moment(machine.registeredUntil).format("DD/MM/yyyy")}
          </span>
        </Box>
        {dateDiff < 90 && (
          <Box
            textAlign="right"
            className="text-xs"
            color={dateDiff < 0 ? color : "gray"}
          >
            {dateDiff < 0 ? (
              "Istekla registracija"
            ) : (
              <span>
                Registracija ističe za{" "}
                <span style={{ color: color }}>{dateDiff}</span> dana
              </span>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default MachineryCard;
