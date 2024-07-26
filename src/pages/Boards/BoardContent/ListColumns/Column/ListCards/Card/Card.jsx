import { useState } from "react";
import { Card as MuiCard } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import GroupIcon from "@mui/icons-material/Group";
import CommentIcon from "@mui/icons-material/Comment";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useConfirm } from "material-ui-confirm";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { useModal } from "mui-modal-provider";
import { toast } from "react-toastify";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { editCardDetailsAPI } from "~/apis";

function Card({
  card,
  cards,
  column,

  deleteCardDetails,
  openModalDetailsCard,
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
    border: isDragging ? "2px solid #2ecc71" : undefined,
  };

  const shouldShowCardActions = () => {
    // return (
    //   !!card?.memberIds?.length ||
    //   !!card?.comments?.length ||
    //   !!card?.attachments?.length
    // );

    return true;
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
          // openModalDetailsCard(contextMenu.item);
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

  // sửa card
  // eslint-disable-next-line no-unused-vars
  // let newCardTitleEdit = "";

  // const { showModal } = useModal();

  // const handleEditCard = (card) => {
  //   card.title = card.title.trim();
  //   newCardTitleEdit = card.title;

  //   // mở modal
  //   const editCardModal = showModal(ConfirmationDialog, {
  //     title: card.title,
  //     // hàm onConfirm khong nên chứa > 1 tham số
  //     // vì như vậy xử lý khá khó (tức là cần nghĩ thêm)
  //     // tách bạch từng cái cho dễ ra hướng giải quyết
  //     onConfirm: () => {
  //       // xử lý khi click OK
  //       newCardTitleEdit = newCardTitleEdit.trim();

  //       // check sự tồn tại/trùng lặp của dữ liệu thông tin đã được thay đổi
  //       // nếu tồn tại
  //       if (!cards.map((card) => card.title).includes(newCardTitleEdit)) {
  //         // set new data UI for card
  //         card.title = newCardTitleEdit;

  //         // call api update Board & DB
  //         editCardDetailsAPI(card._id, { title: card.title }).then((res) => {
  //           toast.success(res?.modifyCardResult);
  //         });

  //         editCardModal.hide();
  //       } else {
  //         // nếu dữ liệu y hệt
  //         if (newCardTitleEdit === card.title) {
  //           toast.info("This new infomation is the same as the old ones", {
  //             position: "bottom-right",
  //           });
  //         } else {
  //           toast.info("The infomation that you have been modified is existed");
  //         }
  //       }
  //     },
  //     onCancel: () => {
  //       editCardModal.hide();
  //     },
  //   });
  // };

  // const ConfirmationDialog = ({ title, onCancel, onConfirm, ...props }) => (
  //   <Dialog
  //     sx={{
  //       maxWidth: "false",
  //     }}
  //     {...props}
  //   >
  //     <div
  //       style={{
  //         width: 300,
  //         paddingLeft: "30px",
  //         paddingRight: "30px",
  //       }}
  //     >
  //       <DialogTitle
  //         style={{
  //           paddingLeft: "0",
  //         }}
  //         sx={{
  //           "& .MuiTypography-root": {
  //             margin: "0 auto",
  //           },
  //         }}
  //       >
  //         Modify Card
  //       </DialogTitle>

  //       <TextField
  //         sx={{
  //           width: "100%",
  //           "& .MuiOutlinedInput-root": {
  //             padding: "5px",
  //           },
  //         }}
  //         label="New title"
  //         autoFocus
  //         type="text"
  //         size="small"
  //         variant="outlined"
  //         defaultValue={title}
  //         onChange={(ev) => (newCardTitleEdit = ev.target.value)}
  //         onKeyDown={(ev) => {
  //           if (ev.key === "Enter") {
  //             ev.preventDefault();

  //             onConfirm();
  //           }
  //         }}
  //       />

  //       <DialogActions
  //         sx={{
  //           paddingLeft: 0,
  //           paddingRight: 0,
  //         }}
  //       >
  //         <Button onClick={onCancel} color="error">
  //           Cancel
  //         </Button>
  //         <Button onClick={onConfirm} variant="outlined" color="info">
  //           Confirm
  //         </Button>
  //       </DialogActions>
  //     </div>
  //   </Dialog>
  // );

  return (
    <div>
      <div key={card} onContextMenu={handleContextMenu(card)}>
        <MuiCard
          ref={setNodeRef}
          style={dndKitCardStyles}
          {...attributes}
          {...listeners}
          onClick={() => openModalDetailsCard(column._id, card._id)}
          sx={{
            cursor: "pointer",
            overflow: "unset",
            display: card?.FE_PlaceholderCard ? "none" : "block",
            borderRadius: "6px",
            border: "2px solid transparent",
            boxShadow: (theme) =>
              theme.palette.mode === "dark" ? "none" : "0px 2px 10px #E0E0E0",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_281E38
                : theme.trelloCustom.COLOR_FCFCFC,
            "&:hover": {
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.trelloCustom.COLOR_CE85FB
                  : theme.trelloCustom.COLOR_C985FF,
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0px 2px 10px #1E252A"
                  : "0px 2px 10px #E0E0E0",
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
            <Typography>{card?.title}</Typography>
          </CardContent>

          {shouldShowCardActions() && (
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
          )}
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
