import {
  Box,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Transacation } from "../../models/transaction.model";
import { FormatCurrency, shortenText } from "../../utils/Formatting";
import MatIcon from "../MatIcon/MatIcon";

interface TransactionCardProps {
  transaction: Transacation;
  onDelete?: (transaction: Transacation) => void;
  onEditClick?: (transaction: Transacation) => void;
}

const TransactionCard = ({
  transaction,
  onDelete = () => {},
  onEditClick = () => {},
}: TransactionCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        boxShadow: "0 2px 10px gray",
        p: "0.6em 1em",
        borderRadius: "10px",
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <Icon
          fontSize="large"
          color={transaction.value < 0 ? "error" : "primary"}
        >
          {transaction.value < 0 ? "payment" : "attach_money"}
        </Icon>
        <Box sx={{ flexGrow: 1, ml: "20px" }}>
          <Typography variant="subtitle1" fontSize="1.1em" sx={{ mb: "-5px" }}>
            {shortenText(transaction.description, 30)}
          </Typography>
          <Typography fontSize="0.8em" color="var(--secondary-gray)">
            {new Date(transaction.date).toLocaleDateString()}
          </Typography>
        </Box>
        <Box>
          <Typography
            style={{ alignSelf: "flex-start" }}
            textAlign="right"
            color={transaction.value < 0 ? "error" : "var(--primary)"}
          >
            {FormatCurrency(transaction.value, "RSD")}
          </Typography>
          <Typography textAlign="right" sx={{ fontWeight: "bold" }}>
            {transaction.categoryName}
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={handleClick}>
            <MatIcon style={{ color: "black" }}>more_vert</MatIcon>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                onDelete(transaction);
              }}
            >
              <MatIcon color="error">delete</MatIcon>
              &nbsp;Obriši
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                onEditClick(transaction);
              }}
            >
              <MatIcon color="primary">edit</MatIcon>&nbsp;Izmeni
            </MenuItem>
          </Menu>
        </Box>
      </Stack>
    </Box>
  );
};

export default TransactionCard;
