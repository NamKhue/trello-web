import React, { useState, useEffect } from "react";
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

import MoonIcon from "~/components/SwitchLightDarkMode/icons/MoonIcon";
import SunIcon from "~/components/SwitchLightDarkMode/icons/SunIcon";
import Switch from "~/components/SwitchLightDarkMode/Switch";

import { useColorScheme } from "@mui/material/styles";
import { useAuth } from "~/hooks/useAuth";

function Profiles() {
  // =================================================================
  const { mode, setMode } = useColorScheme();

  const [modeTheme, setModeTheme] = useState(mode);
  const [isLight, setIsLight] = useState(mode === "dark" ? true : false);

  const handleSwitchTheme = (mode) => {
    setModeTheme(mode);
    setMode(mode);
    setIsLight(mode === "dark" ? true : false);
  };

  const onToggleModeTheme = () => {
    handleSwitchTheme(mode);
  };

  // =================================================================
  const navigate = useNavigate();

  const { logOutAccount, loggedInUser } = useAuth();

  const [loading, setLoading] = useState(true);

  // =================================================================
  useEffect(() => {
    if (loggedInUser) {
      setLoading(false);
    }
  }, [loggedInUser]);

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

  // =================================================================
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
      {!loading && (
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
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
      )}

      {!loading && (
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
            <Avatar sx={{ ml: 1.5, width: 45, height: 45, mr: 2 }} />
            <Box
              sx={{
                flex: 1,

                width: "100px",
                overflow: "hidden",
                textOverflow: "ellipsis",

                fontSize: "1.15rem",
                fontWeight: "bold",
              }}
            >
              {loggedInUser.username.charAt(0).toUpperCase() +
                loggedInUser.username.slice(1)}
            </Box>
          </Box>
          <Divider />

          <MenuItem
            onClick={() => handleOpenProfilePage()}
            sx={{
              "&.MuiButtonBase-root.MuiMenuItem-root": {
                minHeight: "45px",
              },
            }}
          >
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
            onClick={() =>
              handleSwitchTheme(modeTheme === "dark" ? "light" : "dark")
            }
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              py: 1.5,
              px: 2,

              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "#ffffff14" : "#0000000a",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              {modeTheme === "dark" ? <MoonIcon /> : <SunIcon />}
              Theme
            </Box>
            <Switch isLight={isLight} onToggle={onToggleModeTheme} />
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
              minHeight: "34px",
              mt: 1,
              mx: 1,
              fontSize: ".9rem",
              fontWeight: "bold",
              borderRadius: "6px",
              display: "flex",
              justifyContent: "center",
              color: (theme) =>
                theme.palette.mode === "dark" ? "none" : "#DF0606",
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "#FFFFFF14" : "#FFD8D8",

              "&:hover": {
                color: (theme) =>
                  theme.palette.mode === "dark" ? "#FF4545" : "none",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "#640101" : "#FFC2C2",
                // bgcolor: (theme) =>
                //   theme.palette.mode === "dark" ? "#4b4b4b" : "#FFC2C2",
              },
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      )}
    </Box>
  );
}

export default Profiles;
