import { Box, Icon, Stack, Typography } from "@mui/material";
import { Transacation } from "../../models/transaction.model";
import { FormatCurrency, shortenText } from "../../utils/Formatting";

interface TransactionCardProps {
  transaction: Transacation;
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  return (
    <Box
      sx={{
        boxShadow: "0 2px 10px gray",
        p: "0.6em 1em",
        borderRadius: "10px",
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center", gap: "20px" }}>
        <Icon
          fontSize="large"
          color={transaction.type === "payment" ? "error" : "primary"}
        >
          {transaction.type === "payment" ? "payment" : "attach_money"}
        </Icon>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontSize="1.1em" sx={{ mb: "-5px" }}>
            {shortenText(transaction.description, 30)}
          </Typography>
          <Typography fontSize="0.8em" color="var(--secondary-gray)">
            {transaction.time}
          </Typography>
        </Box>
        <Typography style={{ alignSelf: "flex-start" }}>
          {FormatCurrency(transaction.amount, "RSD")}
        </Typography>
      </Stack>
    </Box>
  );
};

export default TransactionCard;
