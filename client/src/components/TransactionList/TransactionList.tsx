import { Box, Button, Icon, Stack, Typography } from "@mui/material";
import { useState } from "react";
import TransactionCard from "../TransactionCard/TransactionCard";
import { TransactionForm } from "..";

interface TransactionListProps {
  title?: string;
}

const TransactionList = ({ title }: TransactionListProps) => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <Stack sx={{ p: "0 20px" }} gap={1}>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <Button
            onClick={() => setFormOpen((state) => !state)}
            startIcon={<Icon>add</Icon>}
            variant="outlined"
          >
            Dodaj
          </Button>
        </Box>
      </Box>
      {formOpen && <TransactionForm></TransactionForm>}
      <Stack gap={1}>
        {/* {transactions.map((t) => (
          <TransactionCard key={t.id} transaction={t} />
        ))} */}
      </Stack>
    </Stack>
  );
};

export default TransactionList;
