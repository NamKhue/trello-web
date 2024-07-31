import { useRef, useState } from "react";

// import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogActions from "@mui/material/DialogActions";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";
// import { useModal } from "mui-modal-provider";

// import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AddCardIcon from "@mui/icons-material/AddCard";

import { updateColumnDetailsAPI } from "~/apis";
import ListCards from "./ListCards/ListCards";
// import { mapOrder } from '~/utils/sorts'

// { column }
function Column({
  // cards,
  column,
  // columns,
  createNewCard,
  deleteColumnDetails,
  deleteCardDetails,
  // openModalDetailsCard,

  handleCardClick,
}) {
  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

  const [newColumnTitle, setNewColumnTitle] = useState(column?.title);
  const [newCardTitle, setNewCardTitle] = useState("");
  const inputNewCardTitleRef = useRef(null);

  // dnd kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column._id,
    data: { ...column },
  });

  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: "100%",
    opacity: isDragging ? 0.5 : undefined,
  };

  // click/close
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleDoubleClick = (event, column) => {
  //   if (event.detail === 2) {
  //     handleRenameColumn(column);
  //   }
  // };

  // new
  // const orderedCards = cards;
  // // old
  const orderedCards = column.cards;
  // const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

  // tương lai dùng react-hook form
  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error("Please enter Card's Title", {
        position: "bottom-right",
      });
      return;
    }

    // check sự tồn tại/trùng lặp của dữ liệu thông tin đang được tạo
    // nếu tồn tại
    if (!column.cards.map((card) => card.title).includes(newCardTitle)) {
      // tạo dữ liệu Card để gọi API
      const newCardData = {
        title: newCardTitle,
        columnId: column._id,
      };

      // tương lai
      // dùng redux global store (redux)
      // lúc đó chỉ cần call api ở đây là xong

      // gọi API
      createNewCard(newCardData);
    } else {
      toast.info("This new infomation is existed", {
        position: "bottom-right",
      });
      return;
    }

    // kết thúc việc thêm Card mới & clear input
    toggleOpenNewCardForm();
    setNewCardTitle("");
  };

  // xử lý xóa 1 column và toàn bộ card trong column đó
  const confirmDeleteColumn = useConfirm();

  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: "Delete Column?",
      description:
        "This action will permanently delete this Column and its Cards! Are you sure?",
      confirmationText: "Confirm",
      cancellationText: "Cancel",

      // dialogProps: { maxWidth: 'xs' },
      // confirmationButtonProps: { variant: 'outlined', color: 'info' },
      // cancellationButtonProps: { color: 'error' },
      // allowClose: false
    })
      .then(() => {
        // tương lai redux
        deleteColumnDetails(column._id);
      })
      .catch(() => {});
  };

  // đổi tên (title) của col
  // eslint-disable-next-line no-unused-vars

  const handleRenameColumnDirectly = (column, newColumnTitleEdit) => {
    // set new data UI for column
    // and call api update Board & DB
    if (column.title != newColumnTitleEdit.trim()) {
      column.title = newColumnTitleEdit.trim();

      updateColumnDetailsAPI(column._id, { title: column.title });
    }
  };

  // let newColumnTitleEdit = "";
  // const handleRenameColumn = (column) => {
  //   column.title = column.title.trim();
  //   newColumnTitleEdit = column.title;

  //   // mở modal
  //   const editColumnModal = showModal(ConfirmationDialog, {
  //     title: column.title,
  //     onConfirm: () => {
  //       newColumnTitleEdit = newColumnTitleEdit.trim();
  //       // check sự tồn tại/trùng lặp của dữ liệu thông tin đã được thay đổi
  //       // nếu tồn tại
  //       if (!columns.map((col) => col.title).includes(newColumnTitleEdit)) {
  //         // set new data UI for column
  //         column.title = newColumnTitleEdit;

  //         // call api update Board & DB
  //         updateColumnDetailsAPI(column._id, { title: column.title }).then(
  //           (res) => {
  //             toast.success(res?.modifyColumnResult);
  //           }
  //         );

  //         editColumnModal.hide();
  //       } else {
  //         // nếu dữ liệu y hệt
  //         if (newColumnTitleEdit === column.title) {
  //           toast.info("This new infomation is the same as the old ones");
  //         } else {
  //           toast.info("The infomation that you have been modified is existed");
  //         }
  //       }
  //     },
  //     onCancel: () => {
  //       editColumnModal.hide();
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
  //         Edit Column
  //       </DialogTitle>

  //       <TextField
  //         sx={{
  //           width: "100%",
  //           "& .MuiOutlinedInput-root": {
  //             padding: "5px",
  //             color: (theme) =>
  //               theme.palette.mode === "dark" ? "white" : "black",
  //           },
  //         }}
  //         label="New title"
  //         autoFocus
  //         type="text"
  //         size="small"
  //         variant="outlined"
  //         defaultValue={title}
  //         onChange={(ev) => (newColumnTitleEdit = ev.target.value)}
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

  // const { showModal } = useModal();
  // const handleRenameColumn = () => {
  //   const editColumnModal = showModal(membersModal, {
  //     title: "Members",
  //     onConfirm: () => {
  //       editColumnModal.hide();
  //     },
  //     onCancel: () => {
  //       editColumnModal.hide();
  //     },
  //   });
  // };

  // const membersModal = ({ title, onCancel, onConfirm, ...props }) => (
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
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
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
  //         Edit Column
  //       </DialogTitle>

  //       <TextField
  //         sx={{
  //           width: "100%",
  //           "& .MuiOutlinedInput-root": {
  //             padding: "5px",
  //             color: (theme) =>
  //               theme.palette.mode === "dark" ? "white" : "black",
  //           },
  //         }}
  //         label="New title"
  //         autoFocus
  //         type="text"
  //         size="small"
  //         variant="outlined"
  //         defaultValue={title}
  //         onChange={(ev) => (newColumnTitleEdit = ev.target.value)}
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
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          outline: "none",
          minWidth: "280px",
          maxWidth: "280px",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.trelloCustom.COLOR_13091B
              : theme.trelloCustom.COLOR_F5F5F5,
          ml: 1,
          mr: 1,
          borderRadius: "10px",
          height: "fit-content",
          maxHeight: (theme) =>
            `calc(${theme.trelloCustom.boardContentHeight} - ${theme.spacing(
              5
            )})`,
        }}
      >
        {/* header */}
        <Box
          sx={{
            pl: 1.75,
            pr: 1.5,
            color: (theme) =>
              theme.palette.mode === "dark" ? "white" : "black",
            height: (theme) => theme.trelloCustom.columnHeaderHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* title + input for changing title */}
          <TextField
            type="text"
            variant="outlined"
            value={
              column?.title != newColumnTitle ? newColumnTitle : column?.title
            }
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                ev.preventDefault();
                ev.target.blur();
              }
            }}
            onBlur={() =>
              handleRenameColumnDirectly(column, newColumnTitle.trim())
            }
            sx={{
              "& input": {
                cursor: "pointer",
                pt: 1.1,
                pb: 1.1,
                pl: 0,
                height: "15px",
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "6px",
                bgcolor: "transparent",
                color: (theme) =>
                  theme.palette.mode === "dark" ? "white" : "black",
              },
              "& input:hover": {
                bgcolor: "transparent",
              },
              "& input:focus": {
                pl: 1.75,
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? "white"
                    : theme.trelloCustom.COLOR_8025C0,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_281E38
                    : theme.trelloCustom.COLOR_F8F8F8,
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
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_8A2DCB
                      : theme.trelloCustom.COLOR_313131,
                },
              },
            }}
          />

          <Box data-no-dnd="true">
            <Tooltip title="More options">
              <MoreHorizIcon
                sx={{
                  mt: 0.5,
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_D7D7D7
                      : theme.trelloCustom.COLOR_49454E,
                  cursor: "pointer",
                }}
                id="basic-column-dropdown"
                aria-controls={open ? "basic-menu-column-dropdown" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              />
            </Tooltip>

            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-column-dropdown",
              }}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: "8px",
                },
                "& .MuiMenu-list": {
                  "& .MuiMenuItem-root": {
                    borderRadius: "6px",
                  },
                  paddingLeft: "6px",
                  paddingRight: "6px",
                },
              }}
            >
              {/* <MenuItem
                onClick={() => handleRenameColumn()}
                sx={{
                  "&:hover": {
                    color: "info.light",
                    "& .add-card-icon": {
                      color: "info.light",
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <EditIcon className="add-card-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Rename title</ListItemText>
              </MenuItem> */}

              <MenuItem
                onClick={() => {
                  toggleOpenNewCardForm();
                }}
                sx={{
                  "&:hover": {
                    color: "success.light",
                    "& .add-card-icon": {
                      color: "success.light",
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <AddCardIcon className="add-card-icon" fontSize="small" />
                </ListItemIcon>
                {!openNewCardForm ? (
                  <ListItemText>Add new card</ListItemText>
                ) : (
                  <ListItemText>Close Add new card</ListItemText>
                )}
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  "&:hover": {
                    color: "warning.dark",
                    "& .delete-forever-icon": {
                      color: "warning.dark",
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <DeleteForeverIcon
                    className="delete-forever-icon"
                    fontSize="small"
                  />
                </ListItemIcon>
                <ListItemText>Remove column</ListItemText>
              </MenuItem>

              {/* <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem> */}
            </Menu>
          </Box>
        </Box>

        {/* list card */}
        <ListCards
          column={column}
          cards={orderedCards}
          deleteCardDetails={deleteCardDetails}
          // openModalDetailsCard={openModalDetailsCard}
          handleCardClick={handleCardClick}
        />

        {/* footer */}
        <Box
          sx={{
            pl: 1.65,
            pr: 1.65,
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: (theme) => theme.trelloCustom.columnFooterHeightActive,
                display: "flex",
                // alignItems: "center",
                justifyContent: "center",
                pt: 0.5,
              }}
            >
              <Button
                sx={{
                  width: "100%",
                  height: (theme) =>
                    `calc(${theme.trelloCustom.columnFooterHeightActive} - 15px)`,
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_818181
                      : theme.trelloCustom.COLOR_7115BA,
                  border: "2px solid",
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_565656
                      : theme.trelloCustom.COLOR_C985FF,
                  "&:hover": {
                    borderColor: "transparent",
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_B5BEC7
                        : theme.trelloCustom.COLOR_EBD2FF,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? ""
                        : theme.trelloCustom.COLOR_7115BA,
                  },
                }}
                startIcon={<AddIcon />}
                onClick={toggleOpenNewCardForm}
              >
                Add new card
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                mt: 1,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  pb: 1.25,
                  borderRadius: "6px",
                  height: "fit-content",
                }}
              >
                <TextField
                  ref={inputNewCardTitleRef}
                  label="Enter title of card"
                  type="text"
                  size="small"
                  variant="outlined"
                  autoFocus
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter") {
                      // Do code here
                      ev.preventDefault();

                      addNewCard();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <CloseIcon
                        fontSize="small"
                        sx={{
                          color: newCardTitle
                            ? (theme) =>
                                theme.palette.mode === "dark"
                                  ? "white"
                                  : theme.trelloCustom.COLOR_818181
                            : "transparent",
                          cursor: newCardTitle ? "pointer" : "text",
                        }}
                        onClick={() => {
                          if (!newCardTitle) {
                            inputNewCardTitleRef.current.children[1].children[0].focus();
                          } else {
                            setNewCardTitle("");

                            inputNewCardTitleRef.current.children[1].children[0].focus();
                          }
                        }}
                      />
                    ),
                  }}
                  sx={{
                    // label 'Search'
                    "& label": {
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_D7D7D7
                          : "black",
                    },
                    "& input": {
                      fontSize: "1rem",
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "white" : "black",
                    },
                    "& label.Mui-focused": {
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_D7D7D7
                          : "black",
                    },

                    // border outline
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderWidth: "2px",
                        borderColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_D7D7D7
                            : theme.trelloCustom.COLOR_818181,
                      },
                      "&:hover fieldset": {
                        borderColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_D7D7D7
                            : theme.trelloCustom.COLOR_818181,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_D7D7D7
                            : theme.trelloCustom.COLOR_818181,
                      },
                    },
                  }}
                />

                <Box
                  sx={{
                    mt: 0.25,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{
                      width: "calc(150px - 30px)",
                      pl: 2.5,
                      pr: 2.5,
                      pt: 0.25,
                      pb: 0.25,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      borderRadius: "20px",
                      color: (theme) => theme.trelloCustom.COLOR_49454E,
                      bgcolor: (theme) => theme.trelloCustom.COLOR_D7D7D7,
                      boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                          ? "none"
                          : `0px 2px 10px ${theme.trelloCustom.COLOR_DDDDDD}`,
                      "&:hover": {
                        color: (theme) => theme.trelloCustom.COLOR_D7D7D7,
                        bgcolor: (theme) => theme.trelloCustom.COLOR_818181,
                        boxShadow: (theme) =>
                          theme.palette.mode === "dark"
                            ? "none"
                            : `0px 2px 10px ${theme.trelloCustom.COLOR_DDDDDD}`,
                      },
                    }}
                    onClick={toggleOpenNewCardForm}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    size="medium"
                    sx={{
                      width: "calc(150px - 30px)",
                      pl: 2.5,
                      pr: 2.5,
                      pt: 0.25,
                      pb: 0.25,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      borderRadius: "20px",
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_7115BA
                          : theme.trelloCustom.COLOR_7115BA,
                      bgcolor: (theme) => theme.trelloCustom.COLOR_C985FF,
                      borderColor: (theme) =>
                        theme.palette.mode === "dark" ? "#555555" : "#1b71a7",
                      boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                          ? "none"
                          : `0px 2px 10px ${theme.trelloCustom.COLOR_C78FFF}`,
                      "&:hover": {
                        color: "white",
                        bgcolor: (theme) => theme.trelloCustom.COLOR_8C25DE,
                        boxShadow: (theme) =>
                          theme.palette.mode === "dark"
                            ? "none"
                            : `0px 2px 10px ${theme.trelloCustom.COLOR_C78FFF}`,
                      },
                    }}
                    onClick={addNewCard}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default Column;
