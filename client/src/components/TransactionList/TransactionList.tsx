import { Box, Button, Icon, Stack, Typography } from "@mui/material";
import { useState } from "react";
import TransactionCard from "../TransactionCard/TransactionCard";
import { TransactionForm } from "..";

const transactions = [
  {
    id: 1,
    amount: 10,
    description: "optional",
    descriptionPreview: "should be optional",
    time: "12:00",
    category: {
      id: 1,
      name: "concentrat",
    },
    type: "payment",
  },
  {
    id: 2,
    amount: 20,
    description: "optional",
    descriptionPreview: "should be optional",
    time: "14:00",
    category: {
      id: 1,
      name: "concentrat",
    },
    type: "payment",
  },
  {
    id: 3,
    amount: 10000,
    description: "optional",
    descriptionPreview: "should be optional",
    time: "12:00",
    category: {
      id: 1,
      name: "concentrat",
    },
    type: "income",
  },
];

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
        {transactions.map((t) => (
          <TransactionCard key={t.id} transaction={t} />
        ))}
      </Stack>
    </Stack>
  );
};

export default TransactionList;
