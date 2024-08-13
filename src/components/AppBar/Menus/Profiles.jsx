import React from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import PermIdentityIcon from "@mui/icons-material/PermIdentity";

import SwitchLightDarkMode from "~/components/SwitchLightDarkMode/SwitchLightDarkMode";

import { useAuth } from "~/hooks/useAuth";

function Profiles() {
  const navigate = useNavigate();

  const { logOutAccount, loggedInUser } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenProfilePage = () => {
    console.log("access profile");

    // navigate("/profile");
  };

  const handleLogOutAccount = async () => {
    await logOutAccount();
    navigate("/login");
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
            {loggedInUser?.username.charAt(0).toUpperCase()}
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
        <Box
          sx={{
            px: 2,
            pt: 0.5,
            pb: 1.25,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ width: 40, height: 40, mr: 2 }} />
          <Box sx={{ fontSize: "1rem" }}>
            {loggedInUser.username.charAt(0).toUpperCase() +
              loggedInUser.username.slice(1)}
          </Box>
        </Box>
        <Divider />

        <MenuItem onClick={() => handleOpenProfilePage()}>
          <ListItemIcon>
            <PermIdentityIcon fontSize="medium" />
          </ListItemIcon>
          Profile
        </MenuItem>

        <Divider
          style={{
            marginBlockStart: 0,
            marginBlockEnd: 0,
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 1.5,
          }}
        >
          <SwitchLightDarkMode />
        </Box>

        <Divider
          style={{
            marginBlockStart: 0,
            marginBlockEnd: 0,
          }}
        />

        <MenuItem
          onClick={() => handleLogOutAccount()}
          sx={{
            mt: 1,
            mx: 1,
            borderRadius: "6px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Profiles;
