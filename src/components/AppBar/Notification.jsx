import { useEffect, useState } from "react";
import { formatRelative } from "date-fns";
import { enUS } from "date-fns/locale";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";

import {
  getListOfNotificationsAPI,
  markAsReadSingleNotiAPI,
  markAllNotisAsReadAPI,
  removeAllNotificationsAPI,
  getInvitationAPI,
  acceptInvitationAPI,
  declineInvitationAPI,
  removeNotificationAPI,
} from "~/apis";

import { useAuth } from "~/hooks/useAuth";
import socket from "~/utils/socket/socket";

const Notification = () => {
  // ============================================================================
  const navigate = useNavigate();
  const location = useLocation();
  // ============================================================================
  const { loggedInUser } = useAuth();
  // ============================================================================
  const [listNotifications, setListNotifications] = useState([]);

  // ============================================================================
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [anyNotiNotReadYet, setAnyNotiNotReadYet] = useState(false);

  const [loading, setLoading] = useState(true);
  let loadedCount = 0;
  // ============================================================================

  // ============================================================================
  // load data
  useEffect(() => {
    if (loadedCount < 1) {
      loadedCount++;

      getListOfNotificationsAPI().then((listNotifications) => {
        setListNotifications(listNotifications);
        setAnyNotiNotReadYet(
          listNotifications.some((noti) => !noti.markIsRead)
        );
      });
    }
  }, [loadedCount]);

  useEffect(() => {
    if (listNotifications) {
      setLoading(false);
    }
  }, [listNotifications]);

  // ============================================================================
  // socket update noti component
  useEffect(() => {
    // normal noti
    socket.on("new-notification", (notification) => {
      setListNotifications((prevList) => {
        if (prevList.some((n) => n._id === notification._id)) {
          return prevList;
        }
        setAnyNotiNotReadYet(true);
        return [notification, ...prevList];
      });

      if (
        notification.type.toUpperCase() === "REMOVE" &&
        notification.from.toUpperCase() === "BOARD"
      ) {
        // should be reload the board page after being removed out of board
        // if (location.pathname !== "/homepage") {
        navigate(`/homepage`, { replace: true });
        // }
      }
    });

    // remove noti
    socket.on("remove-notification", (notification) => {
      const updatedListNotifications = listNotifications.filter(
        (noti) => noti._id != notification._id
      );

      setListNotifications(updatedListNotifications);
      setAnyNotiNotReadYet(
        updatedListNotifications.some((noti) => !noti.markIsRead)
      );
    });

    // remove all notis
    socket.on("remove-all-notifications", () => {
      setListNotifications([]);
      setAnyNotiNotReadYet(false);
    });

    // deadline noti
    socket.on("deadline-notifications", (listDeadlineNotifications) => {
      listDeadlineNotifications.map((noti) => {
        setListNotifications((prevList) => {
          if (prevList.some((n) => n._id === noti._id)) {
            return prevList;
          }

          setAnyNotiNotReadYet(true);
          return [noti, ...prevList];
        });
      });
    });

    // delete card noti
    socket.on("noti-delete-card", (notification) => {
      setListNotifications((prevList) => {
        if (prevList.some((n) => n._id === notification._id)) {
          return prevList;
        }
        setAnyNotiNotReadYet(true);
        return [notification, ...prevList];
      });
    });

    // noti-receive-new-comment
    socket.on("noti-receive-new-comment", (notification) => {
      setListNotifications((prevList) => {
        if (prevList.some((n) => n._id === notification._id)) {
          return prevList;
        }
        setAnyNotiNotReadYet(true);
        return [notification, ...prevList];
      });
    });

    // noti-receive-new-reply
    socket.on("noti-receive-new-reply", (notification) => {
      setListNotifications((prevList) => {
        if (prevList.some((n) => n._id === notification._id)) {
          return prevList;
        }
        setAnyNotiNotReadYet(true);
        return [notification, ...prevList];
      });
    });

    //
  }, [listNotifications, navigate, location]);

  // ============================================================================
  const [isOpenNotification, setIsOpenNotification] = useState(false);

  // ============================================================================
  const [tabValue, setTabValue] = useState("all");

  const handleOpenNotification = () => {
    setIsOpenNotification(!isOpenNotification);
  };

  //
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredNotifications = listNotifications.filter(
    (notification) => tabValue === "all" || !notification.markIsRead
  );

  // ================================================================================================
  // CONTEXT MENU OPTIONS FOR NOTIFICATION COMPONENT
  const [
    anchorElMenuOptionsForNotificationComponent,
    setAnchorElMenuOptionsForNotificationComponent,
  ] = useState(null);

  // Open the menu
  const handleOpenMenuOptionsForNotificationComponent = (event) => {
    setAnchorElMenuOptionsForNotificationComponent(event.currentTarget);
  };

  // Close the menu
  const handleCloseMenuOptionsForNotificationComponent = () => {
    setAnchorElMenuOptionsForNotificationComponent(null);
  };

  //
  const handleChooseRemoveAllNotifications = async () => {
    handleCloseMenuOptionsForNotificationComponent();

    try {
      await removeAllNotificationsAPI();

      // notify
      socket.emit("remove-all-notifications", loggedInUser._id);
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

  const handleChooseMarkAllAsRead = async () => {
    handleCloseMenuOptionsForNotificationComponent();

    if (listNotifications.some((noti) => !noti.markIsRead) === true) {
      const newListNotis = listNotifications;

      for (
        let indexToUpdate = 0;
        indexToUpdate < newListNotis.length;
        indexToUpdate++
      ) {
        newListNotis[indexToUpdate].markIsRead = true;
      }

      setListNotifications(newListNotis);
      setAnyNotiNotReadYet(newListNotis.some((noti) => !noti.markIsRead));

      try {
        await markAllNotisAsReadAPI(loggedInUser._id);

        // const resMarkAllAsRead = await markAllNotisAsReadAPI(loggedInUser._id);
        // toast.success(resMarkAllAsRead.markAllAsReadResult);
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
    }
  };

  // ============================================================================
  // CONTEXT MENU OPTIONS FOR EACH NOTIFICATION
  const [anchorElForEachNoti, setAnchorElForEachNoti] = useState(null);

  const handleClickMenuOptionsEachNoti = (event, notification) => {
    setAnchorElForEachNoti(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleCloseMenuOptionsEachNoti = () => {
    setAnchorElForEachNoti(null);
  };

  //
  const handleMarkAsRead = async (notification) => {
    handleCloseMenuOptionsEachNoti();

    // update UI
    const newListNotis = listNotifications;

    const indexToUpdate = newListNotis.findIndex(
      (noti) => noti._id === notification._id
    );

    newListNotis[indexToUpdate].markIsRead =
      !newListNotis[indexToUpdate].markIsRead;

    setListNotifications(newListNotis);
    setAnyNotiNotReadYet(newListNotis.some((noti) => !noti.markIsRead));

    // call api
    try {
      await markAsReadSingleNotiAPI(notification);
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

  const handleRemoveNotification = async (notification) => {
    handleCloseMenuOptionsEachNoti();

    // notify to that user
    socket.emit("remove-notification", notification);

    try {
      await removeNotificationAPI(notification._id);
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

  // ============================================================================
  //
  const handleAcceptInvitationJoiningIntoBoard = async (notification) => {
    // update UI
    const newListNotis = listNotifications;

    const indexToUpdate = newListNotis.findIndex(
      (noti) => noti._id === notification._id
    );

    if (newListNotis[indexToUpdate].response === "PENDING") {
      newListNotis[indexToUpdate].response = "ACCEPTED";
    }
    if (!newListNotis[indexToUpdate].markIsRead) {
      newListNotis[indexToUpdate].markIsRead =
        !newListNotis[indexToUpdate].markIsRead;
    }

    setListNotifications(newListNotis);
    setAnyNotiNotReadYet(newListNotis.some((noti) => !noti.markIsRead));

    await markAsReadSingleNotiAPI(notification);

    try {
      const targetInvitation = await getInvitationAPI(
        notification.invitationId
      );

      const resAcceptInvitation = await acceptInvitationAPI(
        targetInvitation.token
      );

      // notify to that user
      socket.emit("notification", resAcceptInvitation.notiAcceptInvitation);

      // add new board if user is in homepage
      socket.emit(
        "accept-joining-new-board",
        targetInvitation.recipientId
        // targetInvitation.boardId
      );

      // add new user when user accept the invitation
      socket.emit("add-new-user", targetInvitation.boardId);

      // reload page
      // if (location.pathname == "/homepage") {
      //   console.log("here");
      //   navigate(`/homepage`, { replace: true });
      // }
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

  const handleDeclineInvitationJoiningIntoBoard = async (notification) => {
    // update UI
    const newListNotis = listNotifications;

    const indexToUpdate = newListNotis.findIndex(
      (noti) => noti._id === notification._id
    );

    if (newListNotis[indexToUpdate].response === "PENDING") {
      newListNotis[indexToUpdate].response = "REJECTED";
    }
    if (!newListNotis[indexToUpdate].markIsRead) {
      newListNotis[indexToUpdate].markIsRead =
        !newListNotis[indexToUpdate].markIsRead;
    }

    setListNotifications(newListNotis);
    setAnyNotiNotReadYet(newListNotis.some((noti) => !noti.markIsRead));

    await markAsReadSingleNotiAPI(notification);

    try {
      const targetInvitation = await getInvitationAPI(
        notification.invitationId
      );

      const resDeclineInvitation = await declineInvitationAPI(
        // notification.invitationId
        targetInvitation.token
      );

      // notify to that user
      socket.emit("notification", resDeclineInvitation.notiDeclineInvitation);

      // reload page
      // if (location.pathname == "/homepage") {
      //   console.log("here");
      //   navigate(`/homepage`, { replace: true });
      // }
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

  // ============================================================================
  // ============================================================================
  return (
    <Box>
      {/* noti icon to active noti component */}
      <Badge
        onClick={() => handleOpenNotification()}
        color="secondary"
        variant="dot"
        sx={{
          position: "relative",
          cursor: "pointer",

          p: 0.75,
          borderRadius: "20px",

          "&.MuiBadge-root": {
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_351159
                : theme.trelloCustom.COLOR_D1A3FF,
          },

          "& .MuiSvgIcon-root": {
            fill: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_B469FF
                : theme.trelloCustom.COLOR_7236AE,
          },

          "& .MuiBadge-badge": {
            top: "11px",
            right: "9px",

            bgcolor: (theme) =>
              anyNotiNotReadYet
                ? theme.palette.mode === "dark"
                  ? theme.trelloCustom.COLOR_B469FF
                  : theme.trelloCustom.COLOR_7236AE
                : "transparent",
          },

          "&:hover": {
            bgcolor: (theme) => theme.trelloCustom.COLOR_9357CF,

            "& .MuiSvgIcon-root": {
              fill: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.trelloCustom.COLOR_1E0734
                  : theme.trelloCustom.COLOR_F8F8F8,
            },

            "& .MuiBadge-badge": {
              bgcolor: (theme) =>
                anyNotiNotReadYet
                  ? theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_1E0734
                    : theme.trelloCustom.COLOR_F8F8F8
                  : "transparent",
            },
          },
        }}
      >
        <Tooltip title="Notification" placement="left-start">
          <NotificationsNoneIcon
            sx={{
              height: "28px",
              width: "28px",
            }}
          />
        </Tooltip>
      </Badge>

      {/* noti component */}
      {isOpenNotification && (
        <Box
          sx={{
            position: "absolute",
            maxWidth: "450px",
            maxHeight: "500px",
            overflow: "hidden",
            top: "50px",
            right: "20px",
            py: 1,
            borderRadius: "16px",
            boxShadow: 24,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_13091B
                : "white",
            zIndex: 1000,
          }}
        >
          {/* label noti & button mark all as read */}
          <Stack
            direction="row"
            justifyContent="space-between"
            mb={2}
            sx={{
              "&.MuiStack-root": {
                px: 2,
                height: "40px",
                display: "flex",
                alignItems: "center",
                mb: 0.25,
              },
            }}
          >
            <Box
              sx={{
                cursor: "context-menu",
                fontSize: "1.35rem",
                fontWeight: "bold",
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_B469FF
                    : theme.trelloCustom.COLOR_7236AE,
              }}
            >
              Notifications
            </Box>

            {/* <Box
              onClick={() => handleMarkAllAsRead()}
              sx={{
                cursor: "pointer",
                px: 1,
                mr: 0.5,
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.75,
                fontSize: ".9rem",
                fontWeight: "bold",
                border: "2px solid #ccc",
                borderRadius: "8px",
                borderColor: "transparent",
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_B469FF
                    : theme.trelloCustom.COLOR_7236AE,
                "&:hover": {
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_B469FF
                      : theme.trelloCustom.COLOR_7236AE,
                },
              }}
            >
              <DoneAllIcon sx={{ fontSize: "1.3rem" }} />
              Mark all as read
            </Box> */}

            <Box>
              <Box
                onClick={(e) =>
                  handleOpenMenuOptionsForNotificationComponent(e)
                }
                sx={{
                  cursor: "pointer",
                  width: "35px",
                  height: "35px",
                  mr: 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: "50%",

                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_B469FF
                      : theme.trelloCustom.COLOR_7236AE,

                  "&:hover": {
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_2C194D
                        : theme.trelloCustom.COLOR_E8D1FF,
                  },
                }}
              >
                <MoreHorizIcon />
              </Box>

              {/* menu open from each noti */}
              <Menu
                anchorEl={anchorElMenuOptionsForNotificationComponent}
                open={Boolean(anchorElMenuOptionsForNotificationComponent)}
                onClose={() => handleCloseMenuOptionsForNotificationComponent()}
              >
                <MenuItem
                  onClick={() => handleChooseMarkAllAsRead()}
                  sx={{
                    mx: 1.25,
                    borderRadius: "5px",
                  }}
                >
                  {"Mark all as read"}
                </MenuItem>

                {/* delete all notis */}
                <MenuItem
                  onClick={() => handleChooseRemoveAllNotifications()}
                  sx={{
                    mx: 1.25,
                    borderRadius: "5px",
                  }}
                >
                  {"Remove all notifications"}
                </MenuItem>
              </Menu>
            </Box>
          </Stack>

          {/* tabs divide status of noti */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              px: 2,
              mb: 0.5,

              "&.MuiTabs-root": {
                minHeight: "35px",
              },
              "& .MuiButtonBase-root.MuiTab-root": {
                minHeight: "35px",
                borderTopRightRadius: "10px",
                borderTopLeftRadius: "10px",

                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_7236AE
                    : theme.trelloCustom.COLOR_818181,

                "&:hover": {
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? "none"
                      : theme.trelloCustom.COLOR_7236AE,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_2C194D
                      : theme.trelloCustom.COLOR_EDDAFF,
                },
              },
              "& .MuiButtonBase-root.MuiTab-root.Mui-selected": {
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_B469FF
                    : theme.trelloCustom.COLOR_7236AE,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_2C194D
                    : theme.trelloCustom.COLOR_EDDAFF,
              },

              "& .MuiTabs-indicator": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_B469FF
                    : theme.trelloCustom.COLOR_7236AE,
              },
            }}
          >
            <Tab
              label="All"
              value="all"
              sx={{
                fontWeight: "bold",
              }}
            />
            <Tab
              label="Unread"
              value="unread"
              sx={{
                fontWeight: "bold",
              }}
            />
          </Tabs>

          {/* contents of list of notis */}
          <Box
            sx={{
              width: "450px",
              height: !filteredNotifications.length ? "350px" : null,
              overflow: "scroll",

              px: 2,
              pr: 1.25,
              mb: 0.25,

              "&::-webkit-scrollbar": {
                width: "6px",
                height: "0",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_7236AE
                    : theme.trelloCustom.COLOR_818181,
              },
              "&::-webkit-scrollbar-thumb:hover": {
                // backgroundColor: (theme) =>
                //   theme.palette.mode === "dark"
                //     ? "#1f222f"
                //     : theme.trelloCustom.COLOR_C0C0C0,
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_7236AE
                    : theme.trelloCustom.COLOR_818181,
              },
            }}
          >
            {loading ? (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_B469FF
                      : theme.trelloCustom.COLOR_7236AE,
                }}
              >
                {"Loading..."}
              </Box>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification._id}
                  sx={{
                    mb: 2,
                    my: 1,

                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_180F27
                        : "none",
                    border: "1px solid",
                    borderColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "transparent"
                        : theme.trelloCustom.COLOR_D7D7D7,
                    boxShadow: "none",

                    "&:hover": {
                      borderColor: (theme) =>
                        theme.palette.mode === "dark" ? "none" : "transparent",
                      boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                          ? "none"
                          : `0px 2px 10px ${theme.trelloCustom.COLOR_CBCBCB}`,
                    },

                    "&.MuiPaper-root.MuiCard-root": {
                      borderRadius: "6px",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      "&.MuiCardContent-root": {
                        pl: 1.5,
                        pr: 0.25,
                      },
                      "&:last-child": {
                        py: 1.25,
                      },

                      display: "flex",
                      alignItems: "start",
                      justifyContent: "space-between",

                      gap: 1.75,
                    }}
                  >
                    {/* noti's ava of actor */}
                    <Box
                      sx={{
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          height: "45px",
                          width: "45px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",

                          borderRadius: "10px",
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          color: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.trelloCustom.COLOR_B469FF
                              : theme.trelloCustom.COLOR_7236AE,
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.trelloCustom.COLOR_3A135F
                              : theme.trelloCustom.COLOR_EDDAFF,
                        }}
                      >
                        {notification.actorName.charAt(0).toUpperCase()}
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      {/* noti's content */}
                      <Box
                        sx={{
                          flex: 9,
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.75,
                        }}
                      >
                        {/* notify msg */}
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: notification.markIsRead
                              ? "normal"
                              : "bold",
                            color: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_D7D7D7
                                : theme.trelloCustom.COLOR_313131,
                          }}
                        >
                          {notification.notifyMessage}
                        </Typography>

                        {/* comment/reply msg */}
                        {(notification.type.toUpperCase() === "COMMENT" ||
                          notification.type.toUpperCase() === "REPLY") && (
                          <Box
                            sx={{
                              width: "fit-content",
                              py: 0.75,
                              px: 2,
                              fontWeight: "normal",
                              fontSize: ".9rem",
                              borderRadius: "6px",
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? theme.trelloCustom.COLOR_B469FF
                                  : theme.trelloCustom.COLOR_7236AE,
                              bgcolor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? theme.trelloCustom.COLOR_3A135F
                                  : theme.trelloCustom.COLOR_EDDAFF,
                            }}
                          >
                            {notification.contentComment}
                          </Box>
                        )}

                        {/* buttons for invitation noti */}
                        {notification.type.toUpperCase() === "INVITE" &&
                          (notification.response.toUpperCase() === "PENDING" ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <Box
                                onClick={() =>
                                  handleAcceptInvitationJoiningIntoBoard(
                                    notification
                                  )
                                }
                                sx={{
                                  cursor: "pointer",
                                  py: 0.5,
                                  px: 1.5,
                                  fontSize: ".8rem",
                                  fontWeight: "bold",
                                  borderRadius: "4px",
                                  border: "1px solid transparent",
                                  color: (theme) =>
                                    theme.trelloCustom.COLOR_188544,
                                  bgcolor: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? theme.trelloCustom.COLOR_C6FFCE
                                      : theme.trelloCustom.COLOR_CDF4DD,
                                }}
                              >
                                Accept
                              </Box>

                              <Box
                                onClick={() =>
                                  handleDeclineInvitationJoiningIntoBoard(
                                    notification
                                  )
                                }
                                sx={{
                                  cursor: "pointer",
                                  py: 0.5,
                                  px: 1.5,
                                  fontSize: ".8rem",
                                  fontWeight: "bold",
                                  borderRadius: "4px",
                                  border: "1px solid transparent",
                                  color: (theme) =>
                                    theme.trelloCustom.COLOR_6F09AE,
                                  bgcolor: (theme) =>
                                    theme.trelloCustom.COLOR_CE85FB,
                                }}
                              >
                                Decline
                              </Box>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                fontWeight: notification.markIsRead
                                  ? "normal"
                                  : "bold",
                                fontSize: ".9rem",
                                color: (theme) =>
                                  theme.trelloCustom.COLOR_818181,
                              }}
                            >
                              <CheckIcon
                                sx={{
                                  width: "25px",
                                  height: "25px",
                                  p: 0.25,
                                  borderRadius: "50%",
                                  color: (theme) =>
                                    theme.trelloCustom.COLOR_188544,
                                  bgcolor: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? theme.trelloCustom.COLOR_C6FFCE
                                      : theme.trelloCustom.COLOR_CDF4DD,
                                }}
                              />

                              {"You've already responded this invitation"}
                            </Box>
                          ))}

                        {/* notify time */}
                        <Box
                          sx={{
                            fontWeight: notification.markIsRead
                              ? "normal"
                              : "bold",
                            fontSize: ".75rem",
                            color: (theme) => theme.trelloCustom.COLOR_818181,
                          }}
                        >
                          {formatRelative(
                            new Date(notification.happenedAt),
                            Date.now(),
                            {
                              locale: enUS,
                            }
                          )
                            .charAt(0)
                            .toUpperCase() +
                            formatRelative(
                              new Date(notification.happenedAt),
                              Date.now(),
                              {
                                locale: enUS,
                              }
                            ).slice(1)}
                        </Box>
                      </Box>

                      {/* noti's menu options */}
                      <Box
                        sx={{
                          flex: 1,

                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",

                          gap: 1,
                        }}
                      >
                        {!notification.markIsRead && (
                          <Box
                            sx={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              bgcolor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? theme.trelloCustom.COLOR_B469FF
                                  : theme.trelloCustom.COLOR_7236AE,
                            }}
                          ></Box>
                        )}

                        <IconButton
                          onClick={(e) =>
                            handleClickMenuOptionsEachNoti(e, notification)
                          }
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_B469FF
                      : theme.trelloCustom.COLOR_7236AE,
                }}
              >
                {tabValue === "all"
                  ? "Your don't have any notification"
                  : "You've already read all notifications"}
              </Box>
            )}
          </Box>

          {/* menu open from each noti */}
          <Menu
            anchorEl={anchorElForEachNoti}
            open={Boolean(anchorElForEachNoti)}
            onClose={handleCloseMenuOptionsEachNoti}
          >
            <MenuItem
              onClick={() => handleMarkAsRead(selectedNotification)}
              sx={{
                mx: 1.25,
                borderRadius: "5px",
              }}
            >
              {selectedNotification &&
                (selectedNotification.markIsRead
                  ? "Mark as unread"
                  : "Mark as read")}
            </MenuItem>

            {/* delete noti */}
            <MenuItem
              onClick={() => handleRemoveNotification(selectedNotification)}
              sx={{
                mx: 1.25,
                borderRadius: "5px",
              }}
            >
              {"Remove notification"}
            </MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
};

export default Notification;
