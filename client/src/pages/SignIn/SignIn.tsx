import { Box, Button, Grid, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth.context";
import { useSnackbar } from "../../contexts/snackbar.context";
import { User } from "../../models/user.model";
import { api } from "../../utils/api/axios";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    reValidateMode: "onSubmit",
  });

  const { signin } = useAuthContext();
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((creds: any) => {
    api
      .post<{ user: User; authToken: string }>(`/user/signin`, creds)
      .then(({ data }) => {
        signin(data);
        navigate("/home");
      })
      .catch((err) => {
        openSnackbar({
          message: "Pogresan email ili lozinka",
          severity: "error",
        });
      });
  });

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
        onSubmit={onSubmit}
        sx={{
          display: "flex",
          gap: "0.8em",
          width: { xs: "100%", sm: "80%" },
          maxWidth: "600px",
        }}
      >
        <TextField
          label="Email"
          className="form-field"
          type="email"
          {...register("email", { required: true })}
          error={Boolean(errors.email)}
        ></TextField>
        <TextField
          label="Password"
          className="form-field"
          type="password"
          {...register("password", { required: true })}
          error={Boolean(errors.password)}
        ></TextField>
        {/* <p style={{ color: "red" }}>{error}</p> */}
        <Button variant="contained" sx={{ p: 1.2 }} type="submit">
          Sign In
        </Button>
        <Grid container justifyContent="flex-end">
          <Box>
            Don't have an account? <Link to="/signup"> Sign Up</Link>
          </Box>
        </Grid>
      </Stack>
    </Box>
  );
};

export default SignIn;
