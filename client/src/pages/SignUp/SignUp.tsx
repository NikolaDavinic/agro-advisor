import { Box, Button, Grid, Stack, TextField } from "@mui/material";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "../../contexts/snackbar.context";
import { ApiMessage } from "../../dtos/api-message.dto";
import { api } from "../../utils/api/axios";

interface FormInputs {
  name: string;
  password: string;
  email: string;
  repeatPassword: string;
  address?: string;
}

const SignUp = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormInputs>({
    reValidateMode: "onChange",
  });

  const { openSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = (data: FormInputs) => {
    api
      .post<ApiMessage>("/user/signup", {
        password: data.password,
        address: data.address,
        email: data.email,
        name: data.name,
      })
      .then((res) => {
        openSnackbar({ message: "Uspesna registracija", severity: "success" });
        navigate("/signin");
      })
      .catch((error: AxiosError<ApiMessage>) => {
        let message = "Doslo je do greske";
        if (axios.isAxiosError(error)) {
          if (error.response?.data) {
            message = error.response.data.msg;
          }
        }
        openSnackbar({ message, severity: "error" });
      });
  };

  const repeatPasswordValidator = useCallback(
    (value: string) => getValues("password") === value,
    [getValues]
  );

  return (
    <Box
      sx={{
        height: "100%",
        p: "1em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          gap: "0.6em",
          width: { xs: "100%", sm: "80%" },
          maxWidth: "600px",
        }}
      >
        <TextField
          label="Name"
          className="form-field"
          error={Boolean(errors.name)}
          helperText={errors.name && "Name field is required"}
          {...register("name", { required: true })}
        ></TextField>
        <TextField
          label="Email"
          type="email"
          className="form-field"
          error={Boolean(errors.email)}
          helperText={errors.email && "Email is required"}
          {...register("email", { required: true })}
        ></TextField>
        <TextField
          label="Address"
          className="form-field"
          error={Boolean(errors.address)}
          {...register("address")}
        ></TextField>
        <TextField
          label="Password"
          type="password"
          className="form-field"
          error={Boolean(errors.password)}
          helperText={errors.password && "Password is required"}
          {...register("password", { required: true })}
        ></TextField>
        <TextField
          label="Repeat password"
          type="password"
          className="form-field"
          {...register("repeatPassword", {
            required: true,
            validate: repeatPasswordValidator,
          })}
          error={Boolean(errors.repeatPassword)}
          helperText={errors.repeatPassword && "Passwords don't match"}
        ></TextField>
        {/* <p>{error}</p> */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          // disabled={status === "pending"}
        >
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
          <Box>
            Already have an account? <Link to="/signin">Sign In</Link>
          </Box>
        </Grid>
      </Stack>
    </Box>
  );
};

export default SignUp;
