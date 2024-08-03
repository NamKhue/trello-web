import { useRef, useState } from "react";
import { Link } from "react-router-dom";

// import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";

// import AppsIcon from "@mui/icons-material/Apps";
// import SvgIcon from "@mui/material/SvgIcon";
// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import AddBoxIcon from "@mui/icons-material/AddBox";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

// import Workspaces from "./Menus/Workspaces";
// import Recent from "./Menus/Recent";
import Profiles from "./Menus/Profiles";
import SwitchLightDarkMode from "~/components/SwitchLightDarkMode/SwitchLightDarkMode";

function AppBar() {
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef(null);

  return (
    <Box
      px={2.5}
      sx={{
        width: "100%",
        height: (theme) => theme.trelloCustom.appBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        overflowX: "hidden",
        color: (theme) => theme.trelloCustom.COLOR_C200D3,
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.trelloCustom.COLOR_1E0734
            : theme.trelloCustom.COLOR_EAC9F5,
      }}
    >
      {/* left side */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* <AppsIcon /> */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: (theme) => theme.trelloCustom.COLOR_C200D3,
              fontSize: "1.75rem",
              fontWeight: "bold",
            }}
          >
            Meelo
          </Box>
        </Link>

        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        ></Box> */}

        {/* <Workspaces />
        <Recent />
        {/* <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          <Button
            variant="outlined"
            sx={{
              color: (theme) =>
                theme.palette.mode === "dark" ? "white" : "primary.main",
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "#0b1723" : "white",
              "&.MuiButton-outlined": {
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? "#cacaca" : "",
                // borderWidth: '0.25px'
              },
              "&.MuiButton-outlined:hover": {
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? "white" : "",
                // borderWidth: '2.5px'
              },
            }}
          >
            Create
            <AddBoxIcon sx={{ ml: 1 }} />
          </Button>
        </Box> */}
      </Box>

      {/* between */}
      <Box
        sx={{
          paddingLeft: "100px",
        }}
      >
        <TextField
          ref={inputRef}
          id="outlined-search"
          placeholder="Search"
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            // 64 - smt need to revise

            style: {
              height: "34px",
            },

            startAdornment: (
              <SearchIcon
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? searchValue
                        ? theme.trelloCustom.COLOR_B5BEC7
                        : "#b5bec757"
                      : theme.trelloCustom.COLOR_C200D3,
                }}
              />
            ),
            endAdornment: (
              <CloseIcon
                fontSize="small"
                sx={{
                  color: (theme) =>
                    searchValue
                      ? theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_B5BEC7
                        : theme.trelloCustom.COLOR_790283
                      : "transparent",
                  cursor: searchValue ? "pointer" : "text",
                }}
                onClick={() => {
                  if (!searchValue) {
                    inputRef.current.children[1].children[0].focus();
                  } else {
                    setSearchValue("");

                    inputRef.current.children[1].children[0].focus();
                  }
                }}
              />
            ),
          }}
          sx={{
            minWidth: "300px",
            maxWidth: "200px",

            // input
            "& .MuiInputBase-input": {
              "&.MuiOutlinedInput-input": {
                paddingLeft: "8px",
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_B5BEC7
                    : theme.trelloCustom.COLOR_790283,
              },
            },

            // border outline
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderWidth: "2px",
                borderRadius: "20px",
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "#b5bec757"
                    : theme.trelloCustom.COLOR_C200D3,
              },
              "&:hover fieldset": {
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_B5BEC7
                    : theme.trelloCustom.COLOR_790283,
              },
              "&.Mui-focused fieldset": {
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_B5BEC7
                    : theme.trelloCustom.COLOR_790283,
              },
            },
          }}
        />
      </Box>

      {/* right side */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <SwitchLightDarkMode />

        <Tooltip title="Notification">
          <Badge
            color="secondary"
            variant="dot"
            sx={{
              cursor: "pointer",
              "& .MuiBadge-badge": {
                bgcolor: (theme) => theme.trelloCustom.COLOR_7852A9,
              },
            }}
          >
            <NotificationsNoneIcon />
          </Badge>
        </Tooltip>

        <Profiles />
      </Box>
    </Box>
  );
}

export default AppBar;
