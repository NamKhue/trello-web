import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { useAuth } from "~/hooks/useAuth";
import socket from "~/utils/socket/socket";
import { acceptInvitationAPI } from "~/apis";

const AcceptInvitationPage = () => {
  const { loggedInUser } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  React.useEffect(() => {
    if (token && loggedInUser) {
      // Call your API to handle the invitation
      acceptInvitationAPI(token)
        .then((resNotiAcceptingPublicInvitation) => {
          // add new board if user is in homepage
          socket.emit("accept-joining-new-board", loggedInUser._id);

          // notify to that user
          socket.emit(
            "notification",
            resNotiAcceptingPublicInvitation.notiAcceptInvitationViaLink
          );

          // add new user when user accept the invitation
          socket.emit(
            "add-new-user",
            resNotiAcceptingPublicInvitation.notiAcceptInvitationViaLink
              .objectId
          );

          toast.success("Successfully joined board!");
        })
        .catch((error) => {
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
        })
        .finally(() => {
          navigate(`/homepage`, { replace: true });
        });
    }
  }, [token, loggedInUser]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        width: "100vw",
        height: "100vh",
        color: "white",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.trelloCustom.COLOR_13091B
            : theme.trelloCustom.COLOR_7852A9,
      }}
    >
      {/* loading page */}
      <CircularProgress sx={{ color: "white" }} />

      <Typography>
        {token ? "Processing your invitation..." : "Invalid invitation link"}
      </Typography>
    </Box>
  );
};

export default AcceptInvitationPage;
