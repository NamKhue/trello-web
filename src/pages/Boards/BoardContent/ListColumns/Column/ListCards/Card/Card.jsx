import { useState, useEffect } from "react";
import { styled } from "@mui/system";

import { useConfirm } from "material-ui-confirm";
// import { useModal } from "mui-modal-provider";

import Box from "@mui/material/Box";
import { Card as MuiCard, Tooltip } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";

import { TbFileDescription } from "react-icons/tb";
import { CgAttachment } from "react-icons/cg";
import { CiCalendar } from "react-icons/ci";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useAuth } from "~/hooks/useAuth";
import socket from "~/utils/socket/socket";

import { getCommentsAPI } from "~/apis";

const ClipTypography = styled(Typography)(() => ({
  overflow: "hidden",
  textOverflow: "clip",
}));

function Card({
  roleOfBoard,
  card,

  deleteCardDetails,
  handleCardClick,
}) {
  // ============================================================================
  const { loggedInUser } = useAuth();

  // ============================================================================
  const [userIsMemberOfCard, setUserIsMemberOfCard] = useState(false);

  // ============================================================================
  const checkUserIsMemberOfCard = (cardMembers) => {
    const isMemberOfCard = cardMembers.some(
      (member) => member.email === loggedInUser.email
    );
    setUserIsMemberOfCard(isMemberOfCard);
  };

  // ============================================================================
  useEffect(() => {
    if (card.members && loggedInUser) {
      // const isMemberOfCard = card.members.some(
      //   (member) => member.userId === loggedInUser._id
      // );
      // setUserIsMemberOfCard(isMemberOfCard);

      checkUserIsMemberOfCard(card.members);
    }
  }, []);

  // ============================================================================
  const [comments, setComments] = useState([]);

  // load comments' data
  useEffect(() => {
    if (card && !card._id.includes("placeholder-card")) {
      getCommentsAPI(card._id, card.boardId).then((resComments) => {
        setComments(resComments);
      });
    }
  }, [card]);

  // ============================================================================
  //socket

  // new-comment
  useEffect(() => {
    if (card && !card._id.includes("placeholder-card")) {
      socket.on("new-comment", () => {
        getCommentsAPI(card._id, card.boardId).then((resComments) => {
          setComments(resComments);
        });
      });
    }
  }, [card]);

  useEffect(() => {
    // add-user-into-card
    socket.on("add-user-into-card", async (actorId, filteredMembers) => {
      if (loggedInUser._id !== actorId) {
        const newFilteredCardMembers = filteredMembers.filter(
          (member) => member.cardInvited
        );
        checkUserIsMemberOfCard(newFilteredCardMembers);
      }
    });

    // remove-user-from-card
    socket.on("remove-user-from-card", (actorId, filteredMembers) => {
      if (loggedInUser._id !== actorId) {
        const newFilteredCardMembers = filteredMembers.filter(
          (member) => member.cardInvited
        );
        checkUserIsMemberOfCard(newFilteredCardMembers);
      }
    });
  }, []);

  // ============================================================================
  // dnd kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card._id,
    data: { ...card },
  });

  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? "2px solid #2ECC71" : undefined,
  };

  const shouldShowLabel = () => {
    return !!card?.status?.length || !!card?.priority?.length;
  };

  const shouldShowIconRepresenting = () => {
    return (
      !!card?.description?.length ||
      !!card?.attachments?.length ||
      !!comments?.length
    );
  };

  const shouldShowDateAndMember = () => {
    return !!card?.deadlineAt || !!card?.members?.length;
  };

  // right click handle - click chUột phải để mở menu options
  const [contextMenu, setContextMenu] = useState(null);

  // xử lý menu options
  const handleContextMenu = (item) => (event) => {
    event.preventDefault();

    setContextMenu(
      contextMenu === null
        ? {
            item,
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  // switch giữa các option
  const handleContextMenuItems = (menuItem) => {
    return () => {
      switch (menuItem) {
        case "Delete":
          handleDeleteCard(contextMenu.item);
          break;
        case "Modify":
          handleCardClick(contextMenu.item);
          break;
        default:
          break;
      }

      setContextMenu(null);
    };
  };

  // xử lý xóa 1 card trong 1 column
  const confirmDeleteColumn = useConfirm();

  const handleDeleteCard = (card) => {
    confirmDeleteColumn({
      title: "Delete Card?",
      description:
        "This action will permanently delete this Card! Are you sure?",
      confirmationText: "Confirm",
      cancellationText: "Cancel",
    })
      .then(() => {
        // console.log(`Deleting card ${card?._id} in col ${card?.columnId}`)

        // tương lai redux
        deleteCardDetails(card?.columnId, card?._id);
      })
      .catch(() => {});
  };

  return (
    <div>
      <div
        key={card}
        onContextMenu={
          roleOfBoard != "member" || userIsMemberOfCard
            ? handleContextMenu(card)
            : null
        }
      >
        <MuiCard
          ref={setNodeRef}
          style={roleOfBoard != "member" ? dndKitCardStyles : null}
          {...attributes}
          {...listeners}
          onClick={() => handleCardClick(card)}
          sx={{
            outline: "none",
            cursor: "pointer",
            overflow: "unset",
            display: card?.FE_PlaceholderCard ? "none" : "block",
            borderRadius: "6px",
            border: "2px solid transparent",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "none"
                : `0px 2px 10px ${theme.trelloCustom.COLOR_CBCBCB}`,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_180F27
                : "white",
            "&:hover": {
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.trelloCustom.COLOR_CE85FB
                  : theme.trelloCustom.COLOR_C985FF,
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? `0px 2px 10px ${theme.trelloCustom.COLOR_1E252A}`
                  : `0px 2px 10px ${theme.trelloCustom.COLOR_CBCBCB}`,
            },
          }}
        >
          {card?.cover && (
            <CardMedia sx={{ height: 140 }} image={card?.cover} />
          )}

          <CardContent
            sx={{
              p: 1.5,
              "&:last-child": {
                p: 1.5,
              },
            }}
          >
            {/* labels of status & priority */}
            {shouldShowLabel() && (
              <Box
                sx={{
                  mt: 0.25,
                  mb: 1,
                  display: "flex",
                  gap: 1.5,
                  height: "25px",
                }}
              >
                {/* label status */}
                {!!card?.status?.length && (
                  <Box
                    sx={{
                      cursor: "pointer",
                      width: "fit-content",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      px: 1.25,
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      borderRadius: "4px",
                      color: `${card?.statusTextColor}`,
                      bgcolor: `${card?.statusBgColor}`,
                    }}
                  >
                    {card?.status?.charAt(0).toUpperCase() +
                      card?.status?.slice(1)}
                  </Box>
                )}

                {/* label priority */}
                {!!card?.priority?.length && (
                  <Box
                    sx={{
                      cursor: "pointer",
                      width: "fit-content",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      px: 1.25,
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      borderRadius: "4px",
                      color: `${card?.priorityTextColor}`,
                      bgcolor: `${card?.priorityBgColor}`,
                    }}
                  >
                    {card?.priority?.charAt(0).toUpperCase() +
                      card?.priority?.slice(1)}
                  </Box>
                )}
              </Box>
            )}

            {/* title */}
            {/* <Typography>{card?.title}</Typography> */}
            <ClipTypography variant="body2">{card?.title}</ClipTypography>

            {/* icon representing for description & attachment */}
            {shouldShowIconRepresenting() && (
              <Box
                sx={{
                  mt: 0.5,
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.25,

                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_B469FF
                      : theme.trelloCustom.COLOR_7236AE,
                }}
              >
                {!!card?.description?.length && (
                  <TbFileDescription
                    style={{
                      marginLeft: "-2px",
                    }}
                  />
                )}

                {!!card?.attachments?.length && (
                  <CgAttachment
                    style={{
                      fontSize: ".9rem",
                    }}
                  />
                )}

                {!!comments.length && (
                  <QuestionAnswerIcon
                    sx={{
                      width: "1rem",
                    }}
                  />
                )}
              </Box>
            )}

            {/* icon representing for description & attachment */}
            {shouldShowDateAndMember() && (
              <Box
                sx={{
                  mt: 0.5,
                  // height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* date & time */}
                {card.deadlineAt ? (
                  <Box
                    sx={{
                      // border: "1px solid",
                      // borderRadius: "3px",
                      // borderColor: (theme) => theme.trelloCustom.COLOR_8B8B8B,
                      // px: 0.5,
                      width: "fit-content",
                      gap: 0.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",

                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_B469FF
                          : theme.trelloCustom.COLOR_7236AE,
                    }}
                  >
                    {/* icon */}
                    <CiCalendar
                      style={{
                        marginTop: "-2px",
                        marginLeft: "-1px",
                        fontSize: "1rem",
                        strokeWidth: 0.75,
                      }}
                    />

                    {/* content date & time */}
                    <Box
                      sx={{
                        fontSize: ".8rem",
                        fontWeight: "bold",

                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_C0C0C0
                            : theme.trelloCustom.COLOR_1C1B1F,
                      }}
                    >
                      {`${card?.deadlineAt.split(" ")[0].split("-")[2]}.${
                        card?.deadlineAt.split(" ")[0].split("-")[1]
                      }.${card?.deadlineAt.split(" ")[0].split("-")[0]}`}
                    </Box>
                  </Box>
                ) : (
                  <Box></Box>
                )}

                {/* member */}
                {card.members && (
                  <AvatarGroup
                    max={2}
                    sx={{
                      mr: "5px",
                      display: "flex",
                      flexDirection: "row",
                      "&.MuiAvatar-root": {
                        transform: "translateX(-8px)",
                        zIndex: 1,
                      },
                      //
                      "&.MuiAvatarGroup-root .MuiAvatar-root": {
                        mr: "-5px",
                        fontSize: ".75rem",
                        // fontWeight: "bold",
                        height: "26px",
                        width: "26px",
                        border: (theme) =>
                          theme.palette.mode === "dark"
                            ? `1px solid ${theme.trelloCustom.COLOR_7236AE}`
                            : `1px solid ${theme.trelloCustom.COLOR_B469FF}`,
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_B469FF
                            : theme.trelloCustom.COLOR_7236AE,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_3A135F
                            : theme.trelloCustom.COLOR_EDDAFF,
                      },
                    }}
                  >
                    {card.members.map((cardMember) => (
                      <Box key={cardMember.userId}>
                        <Tooltip
                          title={cardMember.username}
                          placement="bottom"
                          arrow
                        >
                          <Avatar
                            alt={cardMember.username.toUpperCase()}
                            src="#"
                          />
                        </Tooltip>
                      </Box>
                    ))}
                  </AvatarGroup>
                )}
              </Box>
            )}
          </CardContent>
        </MuiCard>
      </div>

      <Menu
        open={contextMenu != null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu != null
            ? {
                top: contextMenu.mouseY,
                left: contextMenu.mouseX,
              }
            : undefined
        }
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "8px",
          },
          "& .MuiMenu-list": {
            "& .MuiMenuItem-root": {
              borderRadius: "6px",
              fontSize: "14px",
            },
            paddingLeft: "6px",
            paddingRight: "6px",
          },
        }}
      >
        <MenuItem onClick={handleContextMenuItems("Delete")}>Delete</MenuItem>
        <MenuItem onClick={handleContextMenuItems("Modify")}>Modify</MenuItem>
      </Menu>
    </div>
  );
}

export default Card;
