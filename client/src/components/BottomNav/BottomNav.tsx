import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Icon,
} from "@mui/material";
import React from "react";

const BottomNav = ({ children }: any) => {
  const [value, setValue] = React.useState(0);

  return (
    <>
      <div>{children}</div>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label="Dashboard"
            icon={<Icon sx={{ fontSize: 35 }}>grid_view</Icon>}
          />
          <BottomNavigationAction
            label="Home"
            icon={<Icon sx={{ fontSize: 35 }}>home</Icon>}
          />
          <BottomNavigationAction
            label="Analytics"
            icon={<Icon sx={{ fontSize: 35 }}>show_chart</Icon>}
          />
        </BottomNavigation>
      </Box>
    </>
  );
};

export default BottomNav;
