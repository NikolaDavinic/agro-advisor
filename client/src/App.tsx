import "./App.scss";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics/Analytics";
import Navigation from "./components/Navigation/Navigation";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { SignIn, SignUp } from "./pages";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { SnackbarProvider } from "./contexts/snackbar.context";

const theme = createTheme({
  palette: {
    primary: {
      light: "#fbc02d",
      main: "#311b92",
      dark: "#000063",
    },
    secondary: {
      light: "#fbc02d",
      main: "#ffd54f",
      dark: "#000063",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <Box sx={{ height: "100vh" }}>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route element={<Navigation />}>
                <Route
                  path=""
                  element={<Navigate to="/home"></Navigate>}
                ></Route>
                <Route path="/home" element={<Home />}></Route>
                <Route path="/dashboard" element={<Dashboard />}></Route>
                <Route path="/analytics" element={<Analytics />}></Route>
              </Route>
            </Route>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
          </Routes>
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
