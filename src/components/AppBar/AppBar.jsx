// import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";

// import AppsIcon from "@mui/icons-material/Apps";
// import SvgIcon from "@mui/material/SvgIcon";
// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import AddBoxIcon from "@mui/icons-material/AddBox";
// import CloseIcon from "@mui/icons-material/Close";
// import SearchIcon from "@mui/icons-material/Search";

// import Workspaces from "./Menus/Workspaces";
// import Recent from "./Menus/Recent";
import Profiles from "./Menus/Profiles";
import Notification from "./Notification";

function AppBar() {
  // const [searchValue, setSearchValue] = useState("");
  // const inputRef = useRef(null);

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
          width: "90px",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
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
      </Box>

      {/* between */}
      {/* <Box
        sx={{
          width: {
            sm: "200px",
            md: "300px",
            lg: "400px",
          },
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
            // minWidth: "300px",
            // maxWidth: "200px",

            width: {
              sm: "200px",
              md: "300px",
              lg: "400px",
            },

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
      </Box> */}

      {/* right side */}
      <Box
        sx={{
          width: "90px",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Notification />

        <Profiles />
      </Box>
    </Box>
  );
}

export default AppBar;
