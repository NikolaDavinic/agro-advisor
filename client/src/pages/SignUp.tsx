import { Box, Button, Grid, Stack, TextField } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
// import style from "./signup.module.scss";

interface FormInputs {
  name: string;
  surname: string;
  password: string;
  email: string;
  repeatPassword: string;
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

  // const { user, error, status } = useAppSelector(selectUserState);
  // const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (status === "resolved" && !user) {
  //     navigate("/signin");
  //   }
  // }, [navigate, status, user]);

  const onSubmit = (data: FormInputs) => {
    // if (status !== "pending") {
    //   dispatch(signUp(data));
    // }
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
          label="Surname"
          className="form-field"
          error={Boolean(errors.surname)}
          helperText={errors.surname && "Surname field is required"}
          {...register("surname", { required: true })}
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
