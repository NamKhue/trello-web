import React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

function Profiles() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        "&.MuiList-root": {
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.trelloCustom.COLOR_C200D3
              : theme.trelloCustom.COLOR_C200D3,
          "& MuiMenu-list": {
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_C200D3
                : theme.trelloCustom.COLOR_C200D3,
          },
        },
      }}
    >
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            padding: 0,
          }}
          aria-controls={open ? "basic-menu-profiles" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            alt="User"
            sx={{
              width: 38,
              height: 38,
              fontSize: 16,
              "&.MuiAvatar-root": {
                border: "2px solid",
                color: (theme) =>
                  theme.palette.mode === "dark" ? "white" : "white",
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "#d6d6d6"
                    : theme.trelloCustom.COLOR_7236AE,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_C200D3
                    : theme.trelloCustom.COLOR_C200D3,
              },
            }}
          >
            U
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button-profiles",
        }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar sx={{ width: 30, height: 30, mr: 2 }} /> Profile
        </MenuItem>
        {/* <MenuItem onClick={handleClose}>
          <Avatar sx={{ width: 30, height: 30, mr: 2 }} /> My account
        </MenuItem> */}
        <Divider />
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem> */}
        <MenuItem onClick={handleClose}>
          <ListItemIcon sx={{ pl: 0.5, mr: 1 }}>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon sx={{ pl: 0.75, mr: 1 }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Profiles;
