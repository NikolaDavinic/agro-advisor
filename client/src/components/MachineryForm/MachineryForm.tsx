import { Box, Button, MenuItem, Select, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Controller, useForm } from "react-hook-form";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { Machinery } from "../../models/machinery.model";
import MatIcon from "../MatIcon/MatIcon";
import Upload from "../Upload/Upload";

interface FormFields {
  type: number;
  productionYear: string;
  images: File[];
  licensePlate: string;
  registeredUntil: string;
  model: string;
}

interface MachineryFormProps {
  onSubmit: (machine: Machinery) => void;
}

const MachineryForm = ({ onSubmit = () => {} }: MachineryFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      type: 0,
      images: [],
      licensePlate: "",
      registeredUntil: moment().format("yyyy-MM-DD"),
      model: "",
    },
    reValidateMode: "onSubmit",
  });

  const formSubmit = (data: FormFields) => {
    console.log(data);
    onSubmit({
      licensePlate: data.licensePlate,
      type: data.type,
      productionYear: data.productionYear,
      registeredUntil: new Date(data.registeredUntil).toISOString(),
      model: data.model,
      images: data.images,
    });
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(formSubmit)}
      className="gap-2"
    >
      <Select
        {...register("type", { required: true })}
        defaultValue={0}
        size="small"
        label="Tip mašine"
      >
        <MenuItem value={0}>Kombi</MenuItem>
        <MenuItem value={1}>Traktor</MenuItem>
        <MenuItem value={2}>Kamion</MenuItem>
        <MenuItem value={3}>Kombajn</MenuItem>
        <MenuItem value={4}>Motokultivator</MenuItem>
        <MenuItem value={5}>Ostalo</MenuItem>
      </Select>
      <TextField
        size="small"
        label="Model"
        placeholder="Model mašine"
        {...register("model", { required: true })}
      ></TextField>
      <Controller
        control={control}
        name="productionYear"
        render={({ field: { onChange, value } }) => (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Godina proizvodnje"
              views={["year"]}
              openTo="year"
              onChange={(val) => onChange(val?.get("year").toString())}
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
        label="Registraciona oznaka"
        placeholder="XX-NNNN-XX"
      ></TextField>
      <TextField
        size="small"
        label="Registrovan do"
        type="date"
        {...register("registeredUntil")}
      ></TextField>
      <Controller
        render={({ field: { onChange, value } }) => (
          <Upload text="Otpremi" value={value} onChange={onChange}></Upload>
        )}
        control={control}
        name="images"
      ></Controller>
      <Box className="flex justify-end">
        <Button
          color="primary"
          type="submit"
          variant="outlined"
          startIcon={<MatIcon>check</MatIcon>}
        >
          Dodaj
        </Button>
      </Box>
    </Stack>
  );
};

export default MachineryForm;
