import { BottomNavigation, BottomNavigationAction, Box, Button, Icon } from '@mui/material';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const map = {
  '0': '/dashboard',
  '1': '/home',
  '2': '/plots',
  '3': '/machinery',
};

const BottomNav = ({ children }: any) => {
  const [value, setValue] = React.useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    switch (value) {
      case 0:
        navigate('/dashboard');
        break;
      case 1:
        navigate('/home');
        break;
      case 2:
        navigate('/plots');
        break;
      case 3:
        navigate('/machines');
        break;
    }
  }, [value, navigate]);

  return (
    <>
      <div>{children}</div>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          zIndex: 1000,
          left: 0,
          right: 0,
        }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}>
          <BottomNavigationAction
            label='Transakcije'
            icon={<Icon sx={{ fontSize: 35 }}>query_stats</Icon>}
          />
          <BottomNavigationAction label='Home' icon={<Icon sx={{ fontSize: 35 }}>home</Icon>} />
          <BottomNavigationAction label='Parcele' icon={<Icon sx={{ fontSize: 35 }}>grass</Icon>} />

          <BottomNavigationAction
            label='Mašine'
            icon={<Icon sx={{ fontSize: 35 }}>agriculture</Icon>}
          />
        </BottomNavigation>
      </Box>
    </>
  );
};

export default BottomNav;
