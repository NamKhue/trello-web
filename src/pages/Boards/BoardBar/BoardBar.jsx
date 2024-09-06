import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { Divider } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import GroupIcon from "@mui/icons-material/Group";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import EmailIcon from "@mui/icons-material/Email";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import CheckIcon from "@mui/icons-material/Check";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import LinkIcon from "@mui/icons-material/Link";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import {
  getPublicInvitationAPI,
  generateInvitationLinkForPublicAPI,
  deleteInvitationLinkForPublicAPI,
} from "~/apis";

// import { capitalizeFirstLetter } from "~/utils/formatters";

import socket from "~/utils/socket/socket";

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

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

function BoardBar({
  board,
  allMembersInBoard,
  roleOfBoard,
  modifyBoardDetails,
  deleteBoard,
  inviteUserIntoBoard,
  removeMemberOutOfBoard,
  changeRoleOfMember,
}) {
  // ============================================================================
  // socket when board's title is change
  useEffect(() => {
    if (board) {
      socket.on("update-board", (updateBoard) => {
        if (updateBoard._id === board._id) {
          setNewBoardTitle(updateBoard.title);
        }
      });

      // return () => {
      //   socket.off("update-board");
      // };
    }
  }, [board]);

  // ================================================================================================
  const [newBoardTitle, setNewBoardTitle] = useState(board?.title);
  // ================================================================================================
  // RENAME TITLE FOR BOARD
  const handleRenameBoardDirectly = (board, newBoardTitleEdit) => {
    newBoardTitleEdit = newBoardTitleEdit.trim();
    setNewBoardTitle(newBoardTitleEdit);

    // set new data UI for board
    // and call api update Board & DB
    if (newBoardTitleEdit.trim() != "") {
      if (board.title != newBoardTitleEdit.trim()) {
        board.title = newBoardTitleEdit.trim();

        const newBoardData = { ...board, title: board.title };

        modifyBoardDetails(newBoardData);
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

  // ================================================================================================
  // INVITE MEMBER
  // const [openModalInviteMember, setOpenModalInviteMember] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");

  // const checkModalMembersInBoardIsClose = () => {
  //   if (openModalMembersInBoard) {
  //     handleCloseModalMembersInBoard();
  //   }
  //   if (openModalMoreOptions) {
  //     handleCloseModalMoreOptions();
  //   }
  // };

  // const handleOpenModalInviteMember = () => {
  //   checkModalMembersInBoardIsClose();
  //   setOpenModalInviteMember(!openModalInviteMember);
  // };

  // const handleCloseModalInviteMember = () => {
  //   setRecipientEmail("");
  //   setOpenModalInviteMember(false);
  // };

  const handleChangeRecipientEmail = (event) => {
    setRecipientEmail(event.target.value);
  };

  const checkIsRecipientEmailValid = (email) => {
    return EMAIL_REGEX.test(email);
  };

  const handleInviteMember = async () => {
    // check if the email is valid
    if (checkIsRecipientEmailValid(recipientEmail)) {
      const invitation = {
        boardId: board._id,
        email: recipientEmail.trim(),
      };

      inviteUserIntoBoard(invitation);

      handleCloseMenuInviteMember();
    } else {
      toast.error("Please check the email again.");
    }
  };

  // ================================================================================================
  // MEMBERS IN BOARD
  // const [openModalMembersInBoard, setOpenModalMembersInBoard] = useState(false);
  const [searchQueryMembersInBoard, setSearchQueryMembersInBoard] =
    useState("");

  // const checkModalInviteMemberIsClose = () => {
  //   if (openModalInviteMember) {
  //     handleCloseModalInviteMember();
  //   }
  //   if (openModalMoreOptions) {
  //     handleCloseModalMoreOptions();
  //   }
  // };

  // const handleOpenModalMembersInBoard = () => {
  //   checkModalInviteMemberIsClose();
  //   setOpenModalMembersInBoard(!openModalMembersInBoard);
  // };

  // const handleCloseModalMembersInBoard = () => {
  //   setSearchQueryMembersInBoard("");
  //   setOpenModalMembersInBoard(false);
  // };

  const handleChangeSearchMemberInBoard = (event) => {
    setSearchQueryMembersInBoard(event.target.value);
  };

  // search query for members in board
  const [filteredMembers, setFilteredMembers] = useState([]);
  useEffect(() => {
    if (allMembersInBoard.length > 0 && searchQueryMembersInBoard.length > 0) {
      const filteredMembers = allMembersInBoard.filter(
        (member) =>
          member.userDetails.username
            .toLowerCase()
            .includes(searchQueryMembersInBoard.toLowerCase()) ||
          member.userDetails.email
            .toLowerCase()
            .includes(searchQueryMembersInBoard.toLowerCase())
      );
      setFilteredMembers(filteredMembers);
    } else {
      setFilteredMembers(allMembersInBoard);
    }
  }, [allMembersInBoard, searchQueryMembersInBoard]);

  //
  const [isHoveredUserBoardArea, setIsHoveredUserBoardArea] = useState(null);

  const handleEnterUserBoardArea = (user) => {
    setIsHoveredUserBoardArea(user._id);
  };

  const handleLeaveUserBoardArea = () => {
    setIsHoveredUserBoardArea(null);
  };

  const handleRemoveUserFromBoard = (user) => {
    setFilteredMembers((prevList) =>
      prevList.filter((member) => member.userId !== user.userId)
    );
    removeMemberOutOfBoard(user.userId);
  };

  // ================================================================================================
  // CONTEXT MENU FOR UPGRADING THE ROLE OF MEMBER
  const [currentMember, setCurrentMember] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  // Open the menu
  const handleOpenMenuChangingRoleOfMember = (event, member) => {
    setAnchorEl(event.currentTarget);
    setCurrentMember(member);
  };

  // Close the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  //
  const handleChooseRoleTypeMemberForMember = (user) => {
    const roleChangeData = {
      boardId: board._id,
      userId: user.userId,
      role: "member",
    };

    const indexToModify = filteredMembers.findIndex(
      (member) => member.userId == user.userId
    );
    filteredMembers[indexToModify].role = "member";

    setFilteredMembers(filteredMembers);

    changeRoleOfMember(roleChangeData);

    handleClose();
  };

  const handleChooseRoleTypeOwnerForMember = (user) => {
    const roleChangeData = {
      boardId: board._id,
      userId: user.userId,
      role: "owner",
    };
    const indexToModify = filteredMembers.findIndex(
      (member) => member.userId == user.userId
    );
    filteredMembers[indexToModify].role = "owner";
    setFilteredMembers(filteredMembers);
    changeRoleOfMember(roleChangeData);
    handleClose();
  };

  // ================================================================================================
  useEffect(() => {
    if (board) {
      getPublicInvitationAPI(board._id)
        .then((res) => {
          const resInvitationForPublic = res;

          if (resInvitationForPublic) {
            setPublicInvitationLink(resInvitationForPublic.invitationLink);
            setIsClickGenerateLink(true);
          }
        })
        .catch(() => {
          setIsClickGenerateLink(false);
          setPublicInvitationLink("");
        });
    }
  }, [board]);

  const [isClickGenerateLink, setIsClickGenerateLink] = useState(false);
  const [publicInvitationLink, setPublicInvitationLink] = useState("");

  const handleGenerateInvitationLink = async () => {
    try {
      const resPublicInvitationLink = await generateInvitationLinkForPublicAPI(
        board._id
      );

      setIsClickGenerateLink(true);
      setPublicInvitationLink(resPublicInvitationLink);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
        return error.response.data.message;
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        return "An unexpected error occurred. Please try again.";
      }
    }
  };

  const [copySuccessMsg, setCopySuccessMsg] = useState("");

  const handleCopyInvitationLink = async () => {
    navigator.clipboard.writeText(publicInvitationLink).then(
      () => {
        setCopySuccessMsg("Copied to clickboard!");
        setTimeout(() => setCopySuccessMsg(""), 2000);
      },
      (error) => {
        toast.error(error);
        setCopySuccessMsg("Failed to copy text.");
        setTimeout(() => setCopySuccessMsg(""), 2000);
      }
    );
  };

  const handleRemoveInvitationLink = async () => {
    try {
      // Create a URL object
      const url = new URL(publicInvitationLink);

      // Use URLSearchParams to get the token from the query parameters
      const tokenPublicInvitation = url.searchParams.get("token");

      await deleteInvitationLinkForPublicAPI(board._id, tokenPublicInvitation);

      setIsClickGenerateLink(false);
      setPublicInvitationLink("");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
        return error.response.data.message;
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        return "An unexpected error occurred. Please try again.";
      }
    }
  };

  // ================================================================================================
  // const [openModalMoreOptions, setOpenModalMoreOptions] = useState(false);

  // const handleOpenModalMoreOptions = () => {
  //   checkModalMoreOptions();

  //   setOpenModalMoreOptions(!openModalMoreOptions);
  // };

  // const handleCloseModalMoreOptions = () => {
  //   setOpenModalMoreOptions(false);
  // };

  // const checkModalMoreOptions = () => {
  //   if (openModalInviteMember) {
  //     handleCloseModalInviteMember();
  //   }
  //   if (openModalMembersInBoard) {
  //     handleCloseModalMembersInBoard();
  //   }
  // };

  //
  const confirmDeleteColumn = useConfirm();

  const handleDeleteBoard = () => {
    confirmDeleteColumn({
      title: "Delete Board?",
      description:
        "This action will permanently delete this Board and all components! Are you sure?",
      confirmationText: "Confirm",
      cancellationText: "Cancel",
    })
      .then(() => {
        deleteBoard();
      })
      .catch(() => {});
  };

  // ================================================================================================
  // ================================================================================================
  //
  const [anchorElMenuInviteMember, setAnchorElMenuInviteMember] =
    useState(null);

  const handleOpenMenuInviteMember = (event) => {
    setAnchorElMenuInviteMember(event.currentTarget);
  };

  const handleCloseMenuInviteMember = () => {
    setRecipientEmail("");
    setAnchorElMenuInviteMember(null);
  };

  //
  const [anchorElModalMembersInBoard, setAnchorElModalMembersInBoard] =
    useState(null);

  const handleOpenModalMembersInBoard = (event) => {
    setAnchorElModalMembersInBoard(event.currentTarget);
  };

  const handleCloseModalMembersInBoard = () => {
    setSearchQueryMembersInBoard("");
    setAnchorElModalMembersInBoard(null);
  };

  //
  const [anchorElModalMoreOptions, setAnchorElModalMoreOptions] =
    useState(null);

  const handleOpenModalMoreOptions = (event) => {
    setAnchorElModalMoreOptions(event.currentTarget);
  };

  const handleCloseModalMoreOptions = () => {
    setRecipientEmail("");
    setAnchorElModalMoreOptions(null);
  };

  // ================================================================================================
  // ================================================================================================
  return (
    <Box
      sx={{
        width: "calc(100% - 40px)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: (theme) =>
            `calc(${theme.trelloCustom.boardBarHeight} - 25px)`,
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
          <Tooltip title={board?.title} placement="bottom" arrow>
            {roleOfBoard === "creator" || roleOfBoard === "owner" ? (
              <TextField
                onMouseEnter={handleMouseHoverTitleBoard}
                onMouseLeave={handleMouseLeaveTitleBoard}
                type="text"
                variant="outlined"
                value={
                  board?.title != newBoardTitle ? newBoardTitle : board?.title
                }
                onChange={(e) => setNewBoardTitle(e.target.value)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter") {
                    ev.preventDefault();
                    ev.target.blur();
                    // ev.target.value.trim();
                    handleRenameBoardDirectly(board, newBoardTitle);
                  }
                }}
                onBlur={(ev) => {
                  ev.preventDefault();
                  ev.target.blur();
                  // ev.target.value.trim();
                  handleRenameBoardDirectly(board, newBoardTitle);
                }}
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
                    },
                  },
                }}
              />
            ) : (
              <Box
                sx={{
                  width: {
                    xs: "250px",
                    sm: "350px",
                    md: "400px",
                    lg: "700px",
                  },
                  display: "inline-block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",

                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: (theme) => theme.trelloCustom.COLOR_F8F8F8,
                }}
              >
                {board?.title}
              </Box>
            )}
          </Tooltip>
        </Box>

        {/* right side */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {(roleOfBoard === "creator" || roleOfBoard === "owner") && (
            <Tooltip title={"Invite member"} arrow>
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Button
                  variant="outlined"
                  sx={BUTTON_BOARD_BAR_STYLE}
                  onClick={(e) => handleOpenMenuInviteMember(e)}
                >
                  <PersonAddAltIcon sx={{ mr: 1 }} />
                  Invite
                </Button>
              </Box>
            </Tooltip>
          )}

          <Tooltip title={"Members of board"} arrow>
            <Button
              onClick={(e) => handleOpenModalMembersInBoard(e)}
              variant="outlined"
              sx={BUTTON_BOARD_BAR_STYLE}
            >
              <GroupIcon sx={{ mr: 1 }} />
              Members
            </Button>
          </Tooltip>

          {(roleOfBoard === "creator" || roleOfBoard === "owner") && (
            <Tooltip title={"More options"} arrow>
              <Box
                onClick={(e) => handleOpenModalMoreOptions(e)}
                variant="outlined"
                sx={{
                  cursor: "pointer",
                  height: "35px",
                  width: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid transparent",
                  borderRadius: "4px",
                  color: (theme) => theme.trelloCustom.COLOR_F8F8F8,
                  bgcolor: (theme) => theme.trelloCustom.COLOR_7236AE,
                }}
              >
                <MoreVertIcon sx={{}} />
              </Box>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* modal invite */}
      <Menu
        id="basic-invite-memmber-menu"
        anchorEl={anchorElMenuInviteMember}
        open={Boolean(anchorElMenuInviteMember)}
        onClose={handleCloseMenuInviteMember}
        sx={{
          "& .MuiPaper-root.MuiPopover-paper.MuiMenu-paper": {
            borderRadius: "8px",
          },
          "& .MuiList-root.MuiMenu-list": {
            p: 0,
          },
        }}
      >
        <Box
          sx={{
            width: "350px",
            gap: 1.25,
            px: 2,
            py: 1.5,
            borderRadius: "8px",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_13091B
                : theme.trelloCustom.COLOR_F8F8F8,
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? `0px 2px 10px ${theme.trelloCustom.COLOR_411A61}`
                : `0px 2px 10px ${theme.trelloCustom.COLOR_818181}`,
          }}
        >
          {/* title & close btn */}
          <Box
            sx={{
              height: "30px",
              mb: 1.5,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* title */}
            <Box
              sx={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                cursor: "context-menu",
              }}
            >
              Invite
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* copy msg */}
              {copySuccessMsg && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    pl: 1,
                    pr: 1.25,
                    py: 0.5,
                    mr: 1,
                    borderRadius: "20px",

                    fontSize: ".95rem",
                    color: (theme) => theme.trelloCustom.COLOR_188544,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_C6FFCE
                        : theme.trelloCustom.COLOR_CDF4DD,
                  }}
                >
                  <CheckCircleOutlineIcon
                    sx={{
                      fontSize: "1.25rem",
                    }}
                  />
                  {copySuccessMsg}
                </Box>
              )}

              {/* close btn */}
              <Box
                onClick={() => handleCloseMenuInviteMember()}
                sx={{
                  height: "30px",
                  width: "30px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // py: 0.5,
                  // px: 0.5,
                  borderRadius: "6px",
                  "&:hover": {
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_281E38
                        : theme.trelloCustom.COLOR_D7D7D7,
                  },
                }}
              >
                <CloseIcon />
              </Box>
            </Box>
          </Box>

          {/* input search + invite other member */}
          <TextField
            id="filled-search"
            label="Email of member"
            variant="filled"
            value={recipientEmail}
            onChange={handleChangeRecipientEmail}
            InputProps={{
              endAdornment: recipientEmail && (
                <IconButton onClick={() => setRecipientEmail("")}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
            sx={{
              width: "100%",
              mb: 1.5,
              "& .MuiFormLabel-root": {
                "&.MuiInputLabel-root": {
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_D7D7D7
                      : theme.trelloCustom.COLOR_313131,
                },
              },
              "& .MuiInputBase-root": {
                "&.MuiFilledInput-root::after": {
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_D7D7D7
                      : theme.trelloCustom.COLOR_313131,
                },
              },
            }}
          />

          {/* invite button */}
          {checkIsRecipientEmailValid(recipientEmail) && (
            <Box
              onClick={() => handleInviteMember()}
              sx={{
                cursor: "pointer",
                width: "100%",
                height: "35px",
                gap: 0.75,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_281E38
                    : theme.trelloCustom.COLOR_E6E6E6,
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_463666
                      : theme.trelloCustom.COLOR_D7D7D7,
                },
              }}
            >
              <EmailIcon />
              Send
            </Box>
          )}

          {checkIsRecipientEmailValid(recipientEmail) && (
            <Divider
              sx={{
                mt: 1.5,
                mb: 1,
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_D7D7D7
                    : theme.trelloCustom.COLOR_7236AE,
              }}
            />
          )}

          {/* generate invitation link component */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box
              sx={{
                mr: 0.5,
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",

                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_E6E6E6
                    : theme.trelloCustom.COLOR_7236AE,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_281E38
                    : theme.trelloCustom.COLOR_EDDAFF,
              }}
            >
              <LinkIcon />
            </Box>

            <Box
              sx={{
                flex: 6,
                display: "flex",
                flexDirection: "column",
                gap: 0.25,
              }}
            >
              <Box
                sx={{
                  fontSize: ".95rem",
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_E6E6E6
                      : theme.trelloCustom.COLOR_313131,
                }}
              >
                {"Share this board via public link"}
              </Box>

              <Box
                sx={{
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {!isClickGenerateLink && (
                  <Box
                    onClick={() => handleGenerateInvitationLink()}
                    sx={{
                      cursor: "pointer",
                      width: "fit-content",
                      display: "flex",
                      alignItems: "center",
                      fontSize: ".9rem",
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_9357CF
                          : theme.trelloCustom.COLOR_7236AE,

                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Create link
                  </Box>
                )}

                {isClickGenerateLink && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      onClick={() => handleCopyInvitationLink()}
                      sx={{
                        cursor: "pointer",
                        width: "fit-content",
                        fontSize: ".9rem",
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_9357CF
                            : theme.trelloCustom.COLOR_7236AE,

                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Copy link
                    </Box>

                    <FiberManualRecordIcon
                      sx={{
                        "&.MuiSvgIcon-root": {
                          width: ".25em",
                          color: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.trelloCustom.COLOR_9357CF
                              : theme.trelloCustom.COLOR_7236AE,
                        },
                      }}
                    />

                    <Box
                      onClick={() => handleRemoveInvitationLink()}
                      sx={{
                        cursor: "pointer",
                        width: "fit-content",
                        fontSize: ".9rem",
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_9357CF
                            : theme.trelloCustom.COLOR_7236AE,

                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Remove link
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Menu>

      {/* modal members */}
      <Menu
        id="basic-members-menu"
        anchorEl={anchorElModalMembersInBoard}
        open={Boolean(anchorElModalMembersInBoard)}
        onClose={handleCloseModalMembersInBoard}
        sx={{
          "& .MuiPaper-root.MuiPopover-paper.MuiMenu-paper": {
            borderRadius: "8px",
          },
          "& .MuiList-root.MuiMenu-list": {
            p: 0,
          },
        }}
      >
        <Box
          sx={{
            width: "360px",
            gap: 1.25,
            px: 2,
            py: 1.5,
            borderRadius: "8px",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_13091B
                : theme.trelloCustom.COLOR_F8F8F8,
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? `0px 2px 10px ${theme.trelloCustom.COLOR_411A61}`
                : `0px 2px 10px ${theme.trelloCustom.COLOR_818181}`,
          }}
        >
          {/* title & close btn */}
          <Box
            sx={{
              mb: 1.5,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* fake component */}
            {/* <Box sx={{ width: "30px" }}></Box> */}

            {/* title */}
            <Box
              sx={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                cursor: "context-menu",
              }}
            >
              Members
            </Box>

            {/* close btn */}
            <Box
              onClick={() => handleCloseModalMembersInBoard()}
              sx={{
                height: "30px",
                width: "30px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_281E38
                      : theme.trelloCustom.COLOR_D7D7D7,
                },
              }}
            >
              <CloseIcon />
            </Box>
          </Box>

          {/* input search + invite other member */}
          <TextField
            id="filled-search"
            label="Search member"
            variant="filled"
            value={searchQueryMembersInBoard}
            onChange={handleChangeSearchMemberInBoard}
            InputProps={{
              endAdornment: searchQueryMembersInBoard && (
                <IconButton onClick={() => setSearchQueryMembersInBoard("")}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
            sx={{
              width: "100%",
              mb: 1.5,
              "& .MuiFormLabel-root": {
                "&.MuiInputLabel-root": {
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_D7D7D7
                      : theme.trelloCustom.COLOR_313131,
                },
              },
              "& .MuiInputBase-root": {
                "&.MuiFilledInput-root::after": {
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_D7D7D7
                      : theme.trelloCustom.COLOR_313131,
                },
              },
            }}
          />

          <Box
            sx={{
              maxHeight: "380px",
              overflow: "auto",
            }}
          >
            {/* list members of board */}
            {filteredMembers.length > 0 && (
              <Box>
                {/* title */}
                <Divider />

                {/* list of members of board */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "start",
                    pt: 1,
                  }}
                >
                  {filteredMembers.map((user) => (
                    <Box
                      key={user._id}
                      onMouseEnter={() => handleEnterUserBoardArea(user)}
                      onMouseLeave={() => handleLeaveUserBoardArea()}
                      sx={{
                        width: "100%",
                        height: "60px",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 1.5,
                          // mb: 1,
                          borderRadius: "6px",

                          "&:hover": {
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_281E38
                                : theme.trelloCustom.COLOR_E6E6E6,
                          },
                        }}
                      >
                        {/* avatar & short name of user */}
                        <Box
                          sx={{
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            color: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_F8F8F8
                                : theme.trelloCustom.COLOR_F8F8F8,
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_C200D3
                                : theme.trelloCustom.COLOR_C0C0C0,
                          }}
                        >
                          {/* A */}
                          {user.userDetails.username.charAt(0).toUpperCase()}
                        </Box>

                        {/* email + username + button add */}
                        <Box
                          sx={{
                            width: `calc(100% - 40px)`,
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* email and username */}
                          <Box
                            sx={{
                              px: 2,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                            }}
                          >
                            {/* username */}
                            <Box
                              sx={{
                                color: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? theme.trelloCustom.COLOR_D7D7D7
                                    : theme.trelloCustom.COLOR_313131,
                                fontSize: "1.05rem",
                              }}
                            >
                              {user.userDetails.username
                                .charAt(0)
                                .toUpperCase() +
                                user.userDetails.username.slice(1)}
                            </Box>

                            {/* @ email */}
                            <Tooltip title={user.userDetails.email}>
                              <Box
                                sx={{
                                  maxWidth:
                                    isHoveredUserBoardArea === user._id
                                      ? user.role.toLowerCase() === "creator"
                                        ? "200px"
                                        : roleOfBoard === "member"
                                        ? "200px"
                                        : "150px"
                                      : "200px",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  fontWeight: "bold",
                                  fontSize: ".85rem",
                                  color: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? theme.trelloCustom.COLOR_D7D7D7
                                      : theme.trelloCustom.COLOR_313131,
                                }}
                              >
                                {user.userDetails.email}
                              </Box>
                            </Tooltip>
                          </Box>

                          {/* button change the role of user and remove user */}
                          {isHoveredUserBoardArea === user._id &&
                            user.role != "creator" &&
                            roleOfBoard !== "member" && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 0.5,
                                }}
                              >
                                <Tooltip
                                  title="Change the role of this user in board"
                                  sx={{
                                    position: "relative",
                                  }}
                                >
                                  <Box
                                    onClick={(e) =>
                                      handleOpenMenuChangingRoleOfMember(
                                        e,
                                        user
                                      )
                                    }
                                    sx={{
                                      cursor: "pointer",
                                      px: 0.5,
                                      py: 0.5,
                                      mr: 0.5,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderRadius: "8px",
                                      "&:hover": {
                                        bgcolor: (theme) =>
                                          theme.palette.mode === "dark"
                                            ? theme.trelloCustom.COLOR_463666
                                            : theme.trelloCustom.COLOR_C0C0C0,
                                      },
                                    }}
                                  >
                                    <ManageAccountsIcon />
                                  </Box>
                                </Tooltip>

                                <Tooltip
                                  title="Remove user out of this board"
                                  PopperProps={{
                                    style: { marginTop: "-12px" },
                                  }}
                                  sx={{
                                    ".MuiTooltip-popper": {
                                      inset: "-25px auto 0px auto",
                                    },
                                  }}
                                >
                                  <Box
                                    onClick={() =>
                                      handleRemoveUserFromBoard(user)
                                    }
                                    sx={{
                                      cursor: "pointer",
                                      px: 0.5,
                                      py: 0.5,
                                      mr: 0.5,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderRadius: "8px",
                                      "&:hover": {
                                        bgcolor: (theme) =>
                                          theme.palette.mode === "dark"
                                            ? theme.trelloCustom.COLOR_463666
                                            : theme.trelloCustom.COLOR_C0C0C0,
                                      },
                                    }}
                                  >
                                    <PersonRemoveAlt1Icon />
                                  </Box>
                                </Tooltip>

                                {/* the menu to change the role of user */}
                                {currentMember && (
                                  <Menu
                                    id="member-menu"
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "left",
                                    }}
                                    transformOrigin={{
                                      vertical: "top",
                                      horizontal: "left",
                                    }}
                                  >
                                    <MenuItem
                                      onClick={() =>
                                        handleChooseRoleTypeOwnerForMember(
                                          currentMember
                                        )
                                      }
                                    >
                                      Owner
                                      {currentMember.role.toLowerCase() ===
                                        "owner" && (
                                        <CheckIcon sx={{ ml: 1.5 }} />
                                      )}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() =>
                                        handleChooseRoleTypeMemberForMember(
                                          currentMember
                                        )
                                      }
                                    >
                                      Member
                                      {currentMember.role.toLowerCase() ===
                                        "member" && (
                                        <CheckIcon sx={{ ml: 1.5 }} />
                                      )}
                                    </MenuItem>
                                  </Menu>
                                )}
                              </Box>
                            )}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Menu>

      {/* modal more options */}
      <Menu
        id="basic-more-options-menu"
        anchorEl={anchorElModalMoreOptions}
        open={Boolean(anchorElModalMoreOptions)}
        onClose={handleCloseModalMoreOptions}
        sx={{
          "& .MuiPaper-root.MuiPopover-paper.MuiMenu-paper": {
            borderRadius: "8px",
          },
          "& .MuiList-root.MuiMenu-list": {
            p: 0,
          },
        }}
      >
        <Box
          sx={{
            width: "300px",
            gap: 1.25,
            px: 2,
            py: 1.5,
            borderRadius: "8px",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_13091B
                : theme.trelloCustom.COLOR_F8F8F8,
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? `0px 2px 10px ${theme.trelloCustom.COLOR_411A61}`
                : `0px 2px 10px ${theme.trelloCustom.COLOR_818181}`,
          }}
        >
          {/* title & close btn */}
          <Box
            sx={{
              mb: 1.5,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* fake component */}
            {/* <Box sx={{ width: "30px" }}></Box> */}

            {/* title */}
            <Box
              sx={{
                fontSize: "1.15rem",
                fontWeight: "bold",
                cursor: "context-menu",
              }}
            >
              More options
            </Box>

            {/* close btn */}
            <Box
              onClick={() => handleCloseModalMoreOptions()}
              sx={{
                height: "30px",
                width: "30px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_281E38
                      : theme.trelloCustom.COLOR_D7D7D7,
                },
              }}
            >
              <CloseIcon />
            </Box>
          </Box>

          <Box
            sx={{
              maxHeight: "380px",
              overflow: "auto",
            }}
          >
            <Box
              onClick={() => handleDeleteBoard()}
              sx={{
                cursor: "pointer",
                py: 1,
                px: 1.5,
                borderRadius: "6px",
                color: (theme) =>
                  theme.palette.mode === "dark" ? "none" : "#DF0606",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "#FFFFFF14" : "#FFD8D8",

                "&:hover": {
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "#FF4545" : "none",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "#640101" : "#FFC2C2",
                },
              }}
            >
              Delete board
            </Box>
          </Box>
        </Box>
      </Menu>
    </Box>
  );
}

export default BoardBar;
