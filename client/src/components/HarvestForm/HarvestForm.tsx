import { Box, Button, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { Harvest } from "../../models/harvest.model";
import MatIcon from "../MatIcon/MatIcon";

interface FormFields {
  cultureName?: string;
  amount: number;
  date: Date;
}

interface HarvestFormProps {
  onSubmit: (harvest: Harvest) => void;
}

const HarvestForm = ({
  onSubmit = () => { },
}: HarvestFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      amount: 0,
      cultureName: "",
      date: new Date()
    },
    reValidateMode: "onSubmit",
  });

  const formSubmit = (data: FormFields) => {
    onSubmit(
      {
        amount: data.amount,
        cultureName: data.cultureName,
        date: data.date
      }
    );
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(formSubmit)}
      className="gap-2"
    >
      <Controller
        control={control}
        name="date"
        render={({ field: { onChange, value } }) => (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Datum berbe"
              onChange={(val) => onChange(val?.toDate())}
              value={moment(value)}
              renderInput={(props) => (
                <TextField size="small" {...props}></TextField>
              )}
            ></DatePicker>
          </LocalizationProvider>
        )}
      />
      <TextField
        size="small"
        label="Ubrana kultura"
        {...register("cultureName")}
      ></TextField>
      <TextField
        size="small"
        label="Količina u kg"
        type="string"
        {...register("amount")}
      ></TextField>
      <Box className="flex justify-end">
        <Button
          color="primary"
          type="submit"
          variant="outlined"
          startIcon={<MatIcon>check</MatIcon>}
        >
          Dodaj berbu
        </Button>
      </Box>
    </Stack>
  );
};

export default HarvestForm;
