import { Box, Button, MenuItem, Select, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Controller, useForm } from 'react-hook-form';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { Machinery } from '../../models/machinery.model';
import MatIcon from '../MatIcon/MatIcon';
import Upload from '../Upload/Upload';
import { useEffect } from 'react';
import { getFileName } from '../../utils/Formatting';
import { options } from '../Chart/Chart';

interface FormFields {
  type: number;
  productionYear: string;
  images: File[];
  licensePlate: string;
  registeredUntil: string;
  model: string;
}

const nameToValue: { [key: string]: number } = {
  Kombi: 0,
  Traktor: 1,
  Kamion: 2,
  Kombajn: 3,
  Motokultivator: 4,
  Ostalo: 5,
};

const mapToProxyFile: (v: string) => File = (v: string) => {
  const file = new File([], v);
  return file;
};

interface MachineryFormProps {
  machine?: Machinery | null;
  onSubmit: (machine: Machinery, addedPhotos?: File[], removedPhotos?: string[]) => void;
  buttonText?: string;
}

const MachineryForm = ({
  onSubmit = () => {},
  machine,
  buttonText = 'Dodaj',
}: MachineryFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      type: machine?.type
        ? typeof machine.type === 'string'
          ? nameToValue[machine.type]
          : machine.type
        : 0,
      images: machine?.images ? machine.images.map(mapToProxyFile) : [],
      licensePlate: machine?.licensePlate ?? '',
      registeredUntil: moment(
        machine?.registeredUntil ? machine.registeredUntil : new Date(),
      ).format('yyyy-MM-DD'),
      model: machine?.model ?? '',
      productionYear: machine?.productionYear ? machine.productionYear + '' : '2000',
    },
    reValidateMode: 'onChange',
  });

  const formSubmit = (data: FormFields) => {
    console.log(data.images);
    onSubmit(
      {
        licensePlate: data.licensePlate,
        type: data.type,
        productionYear: data.productionYear,
        registeredUntil: new Date(data.registeredUntil).toISOString(),
        model: data.model,
      },
      data.images.filter(v => v.size > 0),
      machine?.images?.filter(i => data.images.find(di => di.name === i) === undefined),
    );
  };

  useEffect(() => {
    if (machine) {
      reset({
        type: machine?.type
          ? typeof machine.type === 'string'
            ? nameToValue[machine.type]
            : machine.type
          : 0,
        images: machine?.images ? machine.images.map(mapToProxyFile) : [],
        licensePlate: machine?.licensePlate ?? '',
        registeredUntil: moment(
          machine?.registeredUntil ? machine.registeredUntil : new Date(),
        ).format('yyyy-MM-DD'),
        model: machine?.model ?? '',
        productionYear: machine?.productionYear ? machine.productionYear + '' : '2000',
      });
    }
  }, [machine, reset]);

  return (
    <Stack component='form' onSubmit={handleSubmit(formSubmit)} className='gap-2'>
      <Select
        {...register('type', { required: true })}
        defaultValue={machine?.type ? nameToValue[machine.type] : 0}
        size='small'
        label='Tip mašine'>
        <MenuItem value={0}>Kombi</MenuItem>
        <MenuItem value={1}>Traktor</MenuItem>
        <MenuItem value={2}>Kamion</MenuItem>
        <MenuItem value={3}>Kombajn</MenuItem>
        <MenuItem value={4}>Motokultivator</MenuItem>
        <MenuItem value={5}>Ostalo</MenuItem>
      </Select>
      <TextField
        size='small'
        label='Model'
        placeholder='Model mašine'
        {...register('model', { required: true })}
        error={Boolean(errors.model)}></TextField>
      <Controller
        control={control}
        name='productionYear'
        render={({ field: { onChange, value } }) => (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label='Godina proizvodnje'
              views={['year']}
              openTo='year'
              onChange={val => onChange(val?.get('year').toString())}
              value={moment(value)}
              renderInput={props => <TextField size='small' {...props}></TextField>}></DatePicker>
          </LocalizationProvider>
        )}
      />
      <TextField
        size='small'
        label='Registraciona oznaka'
        placeholder='XX-NNNN-XX'
        {...register('licensePlate')}></TextField>
      <TextField
        size='small'
        label='Registrovan do'
        type='date'
        {...register('registeredUntil')}></TextField>
      <Controller
        render={({ field: { onChange, value } }) => (
          <Upload text='Otpremi fotografije' value={value} onChange={onChange}></Upload>
        )}
        control={control}
        name='images'></Controller>
      <Box className='flex justify-end'>
        <Button
          color='primary'
          type='submit'
          variant='outlined'
          startIcon={<MatIcon>check</MatIcon>}>
          {buttonText}
        </Button>
      </Box>
    </Stack>
  );
};

export default MachineryForm;
