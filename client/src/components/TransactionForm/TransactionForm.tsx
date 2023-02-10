import {
  Autocomplete,
  Box,
  Button,
  Icon,
  ListItem,
  Modal,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from '../../contexts/snackbar.context';
import { useApi } from '../../hooks/api.hook';
import { Category } from '../../models/category.model';
import { Transacation } from '../../models/transaction.model';
import { api } from '../../utils/api/axios';
import MatIcon from '../MatIcon/MatIcon';
import './TransactionForm.scss';

interface TransactionFormProps {
  addingCategoryEn?: boolean;
  buttonText?: string;
  transaction?: Transacation | null;
  onSubmit?: (val: Transacation) => void;
}

interface FormFields {
  value: number;
  category: Category | null;
  description: string;
  date: string;
}

const TransactionForm = ({
  addingCategoryEn = true,
  buttonText = 'Dodaj',
  onSubmit,
  transaction,
}: TransactionFormProps) => {
  const [formState, setFormState] = useState<boolean>(
    transaction?.value ? (transaction.value < 0 ? true : false) : false,
  );
  const [addingCategory, setAddingCategory] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>(transaction?.categoryName ?? '');
  const [newCategory, setNewCategory] = useState<string>('');

  const { openSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormFields>({
    defaultValues: {
      category: transaction ? { id: transaction?.categoryId } : null,
      date: (transaction ? new Date(transaction.date) : new Date()).toISOString().split('T')[0],
      description: transaction?.description ?? '',
      value: transaction?.value ? Math.abs(transaction.value) : 0,
    },
    reValidateMode: 'onChange',
  });

  const {
    result: categories,
    loading: loadingCategories,
    setResult,
  } = useApi<Category[]>('/category');

  useEffect(() => {
    if (transaction != null) {
      reset({
        category: transaction ? { id: transaction?.categoryId } : null,
        date: moment(transaction.date).format('yyyy-MM-DD'),
        description: transaction?.description ?? '',
        value: transaction?.value ? Math.abs(transaction.value) : 0,
      });
    }
  }, [transaction, reset]);

  const onSubmitForm = (data: FormFields) => {
    if (!onSubmit) return;

    onSubmit({
      value: formState ? -data.value : Number(data.value),
      description: data.description,
      date: new Date(data.date).toISOString(),
      categoryName: data.category?.name ?? '',
      categoryId: data.category?.id,
    });
  };

  const addCategory = (e: React.SyntheticEvent) => {
    e.preventDefault();

    api
      .post<Category>('/category', { name: newCategory })
      .then(({ data }) => {
        setResult(prev => [data, ...(prev ?? [])]);
        setValue('category', data);
        openSnackbar({
          message: `Korisnicka kategorija ${newCategory} uspesno dodata`,
        });
        setNewCategory('');
        setAddingCategory(false);
      })
      .catch(() => {
        openSnackbar({ message: 'Doslo je do greske', severity: 'error' });
      });
  };

  return (
    <Paper className='p-2' elevation={3}>
      <Modal
        open={addingCategory}
        onClose={() => setAddingCategory(false)}
        className='flex justify-center items-center'>
        <Paper className='w-full md:w-3/5 lg:w-2/5 m-2'>
          <Stack component='form' onSubmit={addCategory}>
            <ListItem>
              <Typography variant='h6' color='gray'>
                Dodaj svoju kategoriju transakcije
              </Typography>
            </ListItem>
            <ListItem>
              <Box className='w-full'>
                <TextField
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder='Nova kategorija'
                  className='w-full'></TextField>
              </Box>
            </ListItem>
            <ListItem>
              <Box className='w-full justify-end flex'>
                <Button startIcon={<MatIcon>done</MatIcon>} variant='outlined' type='submit'>
                  Dodaj
                </Button>
              </Box>
            </ListItem>
          </Stack>
        </Paper>
      </Modal>
      <Stack component='form' gap='0.6em' onSubmit={handleSubmit(onSubmitForm)}>
        <Controller
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              disablePortal
              getOptionLabel={o => o?.name ?? ''}
              options={categories ?? []}
              isOptionEqualToValue={(op1, val) => op1.id === val.id}
              loading={loadingCategories}
              inputValue={categoryFilter}
              onChange={(e, val) => onChange(val)}
              value={value}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box className='flex w-full items-center justify-between'>
                    {option.name}
                    {option.userId && (
                      <Tooltip title='Kategorija koju ste vi dodali' arrow>
                        <span>
                          <MatIcon color='primary'>person</MatIcon>
                        </span>
                      </Tooltip>
                    )}
                  </Box>
                </li>
              )}
              onInputChange={(e, newvalue) => setCategoryFilter(newvalue)}
              noOptionsText={
                addingCategoryEn && (
                  <>
                    <Box className='justify-between flex flex-wrap gap-4 align-middle'>
                      Nema opcija
                      <Button
                        variant='outlined'
                        onClick={() => {
                          setAddingCategory(true);
                          setNewCategory(categoryFilter);
                        }}>
                        Dodaj
                      </Button>
                    </Box>
                  </>
                )
              }
              loadingText='Ucitavanje kategorija...'
              renderInput={params => (
                <TextField
                  {...params}
                  error={Boolean(errors.category)}
                  size='small'
                  label='Kategorija'
                  placeholder='Dodajte svoju kategoriju ukoliko je nema u ovoj listi'
                />
              )}
            />
          )}
          name='category'
          control={control}
        />

        <Box sx={{ display: 'flex' }}>
          <Button
            sx={{ mr: '5px' }}
            variant='outlined'
            color={formState ? 'error' : 'primary'}
            onClick={() => setFormState(prev => !prev)}>
            {formState ? <Icon>remove</Icon> : <Icon>add</Icon>}
          </Button>
          <TextField
            size='small'
            type='number'
            label='Iznos'
            error={Boolean(errors.value)}
            className='form-field'
            {...register('value', { required: true })}
            color={formState ? 'error' : 'primary'}></TextField>
        </Box>
        <TextField
          size='small'
          label='Opis'
          color='primary'
          className='form-field'
          error={Boolean(errors.description)}
          {...register('description', { required: false })}></TextField>
        <TextField
          size='small'
          type='date'
          error={Boolean(errors.date)}
          {...register('date', { required: true })}></TextField>
        <Box className='justify-end flex'>
          <Button
            className='w-auto'
            variant='outlined'
            type='submit'
            startIcon={<MatIcon>check</MatIcon>}>
            {buttonText}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default TransactionForm;
