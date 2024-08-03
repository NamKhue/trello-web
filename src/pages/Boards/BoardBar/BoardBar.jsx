import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import GroupIcon from "@mui/icons-material/Group";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";

// import { capitalizeFirstLetter } from "~/utils/formatters";

const BUTTON_BOARD_BAR_STYLE = {
  borderRadius: "4px",
  color: "white",
  bgcolor: (theme) => theme.trelloCustom.COLOR_7236AE,
  "&.MuiButton-root": {
    bgcolor: (theme) => theme.trelloCustom.COLOR_7236AE,
    borderColor: "transparent",
  },
  "&.MuiButton-root:hover": {
    bgcolor: (theme) => theme.trelloCustom.COLOR_7236AE,
    borderColor: "transparent",
  },
};

function BoardBar({ board, modifyBoardDetails }) {
  const [newBoardTitle, setNewBoardTitle] = useState(board?.title);

  // đổi tên (title) của board
  const handleRenameBoardDirectly = (board, newBoardTitleEdit) => {
    // set new data UI for board
    // and call api update Board & DB
    if (newBoardTitleEdit.trim() != "") {
      if (board.title != newBoardTitleEdit.trim()) {
        board.title = newBoardTitleEdit.trim();

        modifyBoardDetails(board);
      }
    } else {
      setNewBoardTitle(board.title);
      toast.error("You can't let the title of board empty!");
    }
  };

  const [isHoveredTitleBoard, setIsHoveredTitleBoard] = useState(false);
  const handleMouseHoverTitleBoard = () => {
    setIsHoveredTitleBoard(true);
  };

  const handleMouseLeaveTitleBoard = () => {
    setIsHoveredTitleBoard(false);
  };

  return (
    <Box
      sx={{
        width: "calc(100% - 40px)",
        height: (theme) => `calc(${theme.trelloCustom.boardBarHeight} - 25px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        paddingX: 2.5,
        marginY: 1.5,
        marginX: 2.5,
        overflowX: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.trelloCustom.COLOR_51247C
            : theme.trelloCustom.COLOR_9357CF,
        borderRadius: "6px",
      }}
    >
      {/* left side */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <TextField
          // ref={inputNewColumnTitleRef}
          onMouseEnter={handleMouseHoverTitleBoard}
          onMouseLeave={handleMouseLeaveTitleBoard}
          type="text"
          variant="outlined"
          value={board?.title != newBoardTitle ? newBoardTitle : board?.title}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              ev.preventDefault();
              ev.target.blur();
            }
          }}
          onBlur={() => handleRenameBoardDirectly(board, newBoardTitle)}
          InputProps={{
            endAdornment: (
              // edit btn
              <Box>
                {isHoveredTitleBoard && (
                  <Box
                    sx={{
                      cursor: "pointer",
                      width: "fit-content",
                      height: "30px",
                      px: 1,
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold",

                      bgcolor: "transparent",
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_D7D7D7
                          : theme.trelloCustom.COLOR_F8F8F8,
                    }}
                  >
                    <EditIcon sx={{ fontSize: "1.5rem", pr: 0.5 }} />
                  </Box>
                )}
              </Box>
            ),
          }}
          sx={{
            "& input": {
              cursor: "pointer",
              pt: 1.25,
              pb: 1.25,
              pr: 1.75,
              height: "15px",
              fontSize: "1.3rem",
              fontWeight: "bold",
              border: "2px solid transparent",
              borderRadius: "6px",
              bgcolor: "transparent",
              color: (theme) => theme.trelloCustom.COLOR_F8F8F8,
            },
            "& input:hover": {
              bgcolor: (theme) => theme.trelloCustom.COLOR_7236AE,
              borderColor: (theme) => theme.trelloCustom.COLOR_7236AE,
            },
            "& input:focus": {
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.trelloCustom.COLOR_D7D7D7
                  : theme.trelloCustom.COLOR_F8F8F8,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.trelloCustom.COLOR_281E38
                  : theme.trelloCustom.COLOR_7236AE,
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.trelloCustom.COLOR_C0C0C0
                  : theme.trelloCustom.COLOR_D7D7D7,
            },
            "& .MuiInputBase-input": {
              overflow: "hidden",
              textOverflow: "ellipsis",
            },

            // border outline
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderRadius: "6px",
                borderWidth: "2px",
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "transparent",
              },
              "&.Mui-focused fieldset": {
                borderColor: "transparent",
                // borderColor: (theme) =>
                //   theme.palette.mode === "dark"
                //     ? theme.trelloCustom.COLOR_8A2DCB
                //     : theme.trelloCustom.COLOR_313131,
              },
            },
          }}
        />

        {/* </Tooltip>
        <Chip
          sx={MENU_STYLES}
          icon={<LockPersonIcon />}
          label={capitalizeFirstLetter(board?.type)}
          onClick={() => {}}
        />
        <Chip 
          sx={MENU_STYLES} 
          icon={<AddToDriveIcon />} 
          label="Add to google drive" 
          onClick={() => {}}
        />
        <Chip 
          sx={MENU_STYLES} 
          icon={<BoltIcon />} 
          label="Automation" 
          onClick={() => {}}
        />
        <Chip 
          sx={MENU_STYLES} 
          icon={<FilterListIcon />} 
          label="Filters" 
          onClick={() => {}}
        /> */}
      </Box>

      {/* right side */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          variant="outlined"
          sx={BUTTON_BOARD_BAR_STYLE}
          // onClick={openModalMembers}
        >
          <PersonAddAltIcon sx={{ mr: 1 }} />
          Invite
        </Button>

        {/* <ModalForm isOpen={isModalOpen} onClose={closeModal} /> */}

        <Button variant="outlined" sx={BUTTON_BOARD_BAR_STYLE}>
          <GroupIcon sx={{ mr: 1 }} />
          Members
        </Button>

        {/* <AvatarGroup
          max={4}
          sx={{
            "& .MuiAvatar-root": {
              border: "2px solid",
              width: 34,
              height: 34,
              fontSize: 16,
              borderColor: (theme) =>
                theme.palette.mode === "dark" ? "#d6d6d6" : "#5399de",
            },
            "& .MuiAvatar-circular": {
              color: (theme) =>
                theme.palette.mode === "dark" ? "#0b1723" : "white",
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "" : "#a4b0de",
            },
          }}
        >
          <Tooltip title="cootanasy">
            <Avatar alt="Remy Sharp" />
          </Tooltip>
          <Tooltip title="cootanasy">
            <Avatar alt="Travis Howard" />
          </Tooltip>
          <Tooltip title="cootanasy">
            <Avatar alt="Cindy Baker" />
          </Tooltip>
          <Tooltip title="cootanasy">
            <Avatar alt="Agnes Walker" />
          </Tooltip>
          <Tooltip title="cootanasy">
            <Avatar alt="Trevor Henderson" />
          </Tooltip>
        </AvatarGroup> */}
      </Box>
    </Box>
  );
}

export default BoardBar;
