import { useState } from "react";

import { useConfirm } from "material-ui-confirm";
// import { useModal } from "mui-modal-provider";
// import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import { Card as MuiCard } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import CardActions from "@mui/material/CardActions";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";

import { TbFileDescription } from "react-icons/tb";
import { CgAttachment } from "react-icons/cg";
import { CiCalendar } from "react-icons/ci";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function Card({
  card,
  // cards,
  // column,

  deleteCardDetails,
  // openModalDetailsCard,
  handleCardClick,
}) {
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

  // const shouldShowCardActions = () => {
  //   return (
  //     !!card?.memberIds?.length ||
  //     !!card?.comments?.length ||
  //     !!card?.attachments?.length
  //   );
  // };

  const shouldShowLabel = () => {
    return !!card?.status?.length || !!card?.priority?.length;
  };

  const shouldShowIconRepresenting = () => {
    return !!card?.description?.length || !!card?.attachments?.length;
  };

  const shouldShowDateAndMember = () => {
    // if (card?.title == "làm tài liệu báo cáo test 2") {
    //   console.log(
    //     'card?.deadlineAt.split(" ")[0].split("-") ',
    //     card?.deadlineAt.split(" ")[0].split("-")
    //   );
    //   console.log(
    //     'card?.deadlineAt.split(" ")[0].split("-")[2] ',
    //     card?.deadlineAt.split(" ")[0].split("-")[2]
    //   );
    // }

    return !!card?.deadlineAt?.length || !!card?.memberIds?.length;
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
      <div key={card} onContextMenu={handleContextMenu(card)}>
        <MuiCard
          ref={setNodeRef}
          style={dndKitCardStyles}
          {...attributes}
          {...listeners}
          // onClick={() => openModalDetailsCard(column._id, card._id)}
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
            <Typography>{card?.title}</Typography>

            {/* icon representing for description & attachment */}
            {shouldShowIconRepresenting() && (
              <Box
                sx={{
                  mt: 0.5,
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {!!card?.description?.length && (
                  <TbFileDescription
                    style={{
                      marginLeft: "-3px",
                    }}
                  />
                )}
                {/* {!!card?.attachments?.length && <CgAttachment />} */}
                <CgAttachment />
              </Box>
            )}

            {/* icon representing for description & attachment */}
            {shouldShowDateAndMember() && (
              <Box
                sx={{
                  mt: 0.5,
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* date & time */}
                {card?.deadlineAt?.length && (
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
                          ? theme.trelloCustom.COLOR_F8F8F8
                          : theme.trelloCustom.COLOR_1C1B1F,
                    }}
                  >
                    {/* icon */}
                    <CiCalendar
                      style={{
                        marginTop: "-2px",
                        marginLeft: "-1.5px",
                        fontSize: "1rem",
                        strokeWidth: 0.75,
                      }}
                    />

                    {/* content date & time */}
                    <Box
                      sx={{
                        fontSize: ".8rem",
                        fontWeight: "bold",
                      }}
                    >
                      {`${card?.deadlineAt.split(" ")[0].split("-")[2]}.${
                        card?.deadlineAt.split(" ")[0].split("-")[1]
                      }.${card?.deadlineAt.split(" ")[0].split("-")[0]}`}
                    </Box>
                  </Box>
                )}

                {/* member */}
                <Box></Box>
              </Box>
            )}
          </CardContent>

          {/* {shouldShowCardActions() && (
            <CardActions sx={{ p: "0 4px 8px 4px" }}>
              {!!card?.memberIds?.length && (
                <Button size="small" startIcon={<GroupIcon />}>
                  {card?.memberIds?.length}
                </Button>
              )}

              {!!card?.comments?.length && (
                <Button size="small" startIcon={<CommentIcon />}>
                  {card?.comments?.length}
                </Button>
              )}

              {!!card?.attachments?.length && (
                <Button size="small" startIcon={<AttachFileIcon />}>
                  {card?.attachments?.length}
                </Button>
              )}
            </CardActions>
          )} */}
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
