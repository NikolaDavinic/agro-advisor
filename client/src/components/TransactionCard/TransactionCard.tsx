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
          color={transaction.value < 0 ? "error" : "primary"}
        >
          {transaction.value < 0 ? "payment" : "attach_money"}
        </Icon>
        <Box sx={{ flexGrow: 1 }}>
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
      </Stack>
    </Box>
  );
};

export default TransactionCard;
