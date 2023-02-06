import { Box, Button, Menu, MenuItem } from "@mui/material";
import Icon from "@mui/material/Icon";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth.context";
import MatIcon from "../MatIcon/MatIcon";
import "./Sidebar.scss";

const Sidebar = (props: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userOptionsOpen = Boolean(anchorEl);

  const { signout } = useAuthContext();

  const handleLogout = () => {
    signout();
    setAnchorEl(null);
  };

  return (
    <div className="sidebar-content">
      <nav className="sidebar" style={{ position: "sticky", top: 0 }}>
        <ul>
          <li>
            <NavLink to="/">
              {({ isActive }) => (
                <Icon
                  sx={{ fontSize: 35 }}
                  className={`icon ${isActive ? "active" : undefined}`}
                >
                  home
                </Icon>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard">
              {({ isActive }) => (
                <Icon
                  sx={{ fontSize: 35 }}
                  className={`icon ${isActive ? "active" : undefined}`}
                >
                  grid_view
                </Icon>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/newplot">
              {({ isActive }) => (
                <Icon
                  sx={{ fontSize: 35 }}
                  className={`icon ${isActive ? "active" : undefined}`}
                >
                  add
                </Icon>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/machines">
              {({ isActive }) => (
                <MatIcon
                  style={{ fontSize: 35 }}
                  className={`icon ${isActive ? "active" : undefined}`}
                >
                  agriculture
                </MatIcon>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics">
              {({ isActive }) => (
                <Icon
                  sx={{ fontSize: 35 }}
                  className={`icon ${isActive ? "active" : undefined}`}
                ></Icon>
              )}
            </NavLink>
          </li>
        </ul>
        <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Icon sx={{ fontSize: 35 }} className="icon">
            person
          </Icon>
        </Button>
        <Menu
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          open={userOptionsOpen}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleLogout}>
            <Icon className="icon">logout</Icon>Logout
          </MenuItem>
        </Menu>
      </nav>
      <Box className="content" sx={{ overflow: "auto" }}>
        {props.children}
      </Box>
    </div>
  );
};

export default Sidebar;
