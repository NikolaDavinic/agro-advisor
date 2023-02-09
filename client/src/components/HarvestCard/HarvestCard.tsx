import { Box, Button, Paper, Typography } from "@mui/material";
import { Harvest } from "../../models/harvest.model";
import MatIcon from "../MatIcon/MatIcon";
import moment from "moment";

export interface HarvestCardProps {
  harvest: Harvest;
  onDelete: (harvestId?: string) => void;
  [key: string]: any;
}

const HarvestCard = ({ harvest, onDelete, ...props }: HarvestCardProps) => {
  let color: string = "green";

  return (
    <Paper
      elevation={4}
      {...props}
      className={`p-2 flex justify-between ${props.className}`}
    >
      <Box>
        {/* <Typography className="text-gray-600">{moment(harvest?.date).format("DD/MM/yyyy")}</Typography> */}
        <Typography fontWeight="bold">
          <>
            <span>
              <MatIcon style={{ fontSize: 12 }}>
                grass
              </MatIcon>
              {`${harvest.cultureName}  `}
              <MatIcon style={{ fontSize: 13 }}>
                warehouse
              </MatIcon>
              {`${harvest.amount}`} kg
            </span>
          </>
        </Typography>
      </Box>
      <Box>
        <Box>
          <span className="text-gray-400">Datum berbe: </span>
          <span>
            {moment(harvest?.date).format("DD/MM/yyyy")}
          </span>
          <span className="max-w-fit">
            {/* <MatIcon style={{ fontSize: 15 }}>
              edit
            </MatIcon> */}
            <Button onClick={() => onDelete(harvest.id)}>
              <MatIcon color="error" style={{ fontSize: 15 }}>
                delete
              </MatIcon>
            </Button>
          </span>
        </Box>
      </Box>
    </Paper >
  );
};

export default HarvestCard;
