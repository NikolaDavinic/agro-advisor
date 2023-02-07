import { Box, Paper, Typography } from "@mui/material";
import { Plot } from "../../models/plot.model";
import MatIcon from "../MatIcon/MatIcon";

export interface PlotCardProps {
  plot: Plot;
  [key: string]: any;
}

const PlotCard = ({ plot, ...props }: PlotCardProps) => {
  let color: string = "green";

  return (
    <Paper
      elevation={4}
      {...props}
      className={`p-2 flex justify-between ${props.className}`}
    >
      <Box>
        <Typography className="text-gray-400">{plot.municipality}</Typography>
        <Typography fontWeight="bold">
          <>
            <p>
              <MatIcon style={{ fontSize: 12 }}>
                numbers
              </MatIcon>
              {`${plot.plotNumber}  `}
              <MatIcon style={{ fontSize: 13 }}>
                straighten
              </MatIcon>
              {`${plot.area}`}m<sup>2</sup>
            </p>
          </>
        </Typography>
      </Box>
      <Box>
        <Box>
          <span className="text-gray-400">Trenutna kultura: </span>
          <span style={{ color: color }}>
            {/* ?TODO: Dodaj trenutnu kulturu u plot summary */}
            {/* {moment(machine.registeredUntil).format("DD/MM/yyyy")} */}
          </span>
        </Box>
      </Box>
    </Paper >
  );
};

export default PlotCard;
