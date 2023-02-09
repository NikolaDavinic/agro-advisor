import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import moment from 'moment';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";


interface FormField {
    year: string;
} 

function YearPicker() {

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
      } = useForm<FormField>({
        defaultValues: {
            year: "2000",
        },
        reValidateMode: "onSubmit",
      });

      // const formChange = (data: FormField) => {
      //   console.log(data);
      //   onSubmit({
      //     year: data.year,
      //   });
      // };

  return (
    <div>
        <Controller
              control={control}
              name="year"
              render={({ field: { onChange, value } }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Godina"
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
    </div>
  )
}

export default YearPicker