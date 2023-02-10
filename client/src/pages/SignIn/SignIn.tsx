import { Box, Button, Grid, LinearProgress, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/auth.context';
import { useSnackbar } from '../../contexts/snackbar.context';
import { User } from '../../models/user.model';
import { api } from '../../utils/api/axios';

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    reValidateMode: 'onSubmit',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signin } = useAuthContext();
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((creds: any) => {
    setIsLoading(true);

    api
      .post<{ user: User; authToken: string }>(`/user/signin`, creds)
      .then(({ data }) => {
        signin(data);
        navigate('/home');
      })
      .catch(err => {
        openSnackbar({
          message: 'Pogresan email ili lozinka',
          severity: 'error',
        });
      })
      .finally(() => setIsLoading(false));
  });

  return (
    <Box
      sx={{
        height: '100%',
        p: '1em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Stack
        component='form'
        onSubmit={onSubmit}
        sx={{
          display: 'flex',
          gap: '0.8em',
          width: { xs: '100%', sm: '80%' },
          maxWidth: '600px',
        }}>
        <TextField
          label='Email'
          className='form-field'
          type='email'
          {...register('email', { required: true })}
          error={Boolean(errors.email)}></TextField>
        <TextField
          label='Lozinka'
          className='form-field'
          type='password'
          {...register('password', { required: true })}
          error={Boolean(errors.password)}></TextField>
        {isLoading && <LinearProgress></LinearProgress>}
        <Button variant='contained' sx={{ p: 1.2 }} type='submit'>
          Prijava
        </Button>
        <Grid container justifyContent='flex-end'>
          <Box>
            Nemate nalog? <Link to='/signup'> Registrujte se</Link>
          </Box>
        </Grid>
      </Stack>
    </Box>
  );
};

export default SignIn;
