import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "react-toastify";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import Column from "./Column/Column";

function ListColumns({
  // cards,
  columns,
  createNewColumn,
  createNewCard,
  deleteColumnDetails,
  deleteCardDetails,
  // openModalDetailsCard,

  handleCardClick,
}) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const toggleOpenNewColumnForm = () =>
    setOpenNewColumnForm(!openNewColumnForm);

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const inputNewColumnTitleRef = useRef(null);

  // tương lai dùng react-hook form
  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error("Please enter Column's Title");
      return;
    }

    // check sự tồn tại/trùng lặp của dữ liệu thông tin đang được tạo
    // nếu tồn tại
    if (!columns.map((col) => col.title).includes(newColumnTitle)) {
      // tạo dữ liệu Column để gọi API
      const newColumnData = {
        title: newColumnTitle,
      };

      // tương lai
      // dùng redux global store (redux)
      // lúc đó chỉ cần call api ở đây là xong

      // gọi API
      createNewColumn(newColumnData);
    } else {
      toast.info("This new infomation is existed");
      return;
    }

    // kết thúc việc thêm Column mới & clear input
    toggleOpenNewColumnForm();
    setNewColumnTitle("");
  };

  return (
    <SortableContext
      items={columns?.map((col) => col._id)}
      strategy={horizontalListSortingStrategy}
    >
      {/* list of columns */}
      <Box
        sx={{
          outline: "none",
          bgcolor: "inherit",
          width: "100%",
          height: "100%",
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          "&::-webkit-scrollbar-track": { ml: 1, mr: 1 },
        }}
      >
        {/* list of columns */}
        {columns?.map((column) => (
          <Column
            key={column._id}
            // cards={cards.filter((card) => card.columnId == column._id)}
            columns={columns}
            column={column}
            createNewCard={createNewCard}
            deleteColumnDetails={deleteColumnDetails}
            deleteCardDetails={deleteCardDetails}
            // openModalDetailsCard={openModalDetailsCard}
            handleCardClick={handleCardClick}
          />
        ))}

        {/* 'add new column' button */}
        {!openNewColumnForm ? (
          <Box
            onClick={toggleOpenNewColumnForm}
            sx={{
              minWidth: "280px",
              maxWidth: "280px",
              mx: 1,
              borderRadius: "10px",
              height: "46px",
              display: "flex",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.trelloCustom.COLOR_51247C
                  : theme.trelloCustom.COLOR_5B2E88,
            }}
          >
            <Button
              startIcon={<AddIcon />}
              sx={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: (theme) => theme.trelloCustom.COLOR_B5BEC7,
                borderRadius: "10px",
                "&:hover": {
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_B5BEC7
                      : theme.trelloCustom.COLOR_EEEEEE,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_13091B
                      : theme.trelloCustom.COLOR_432065,
                },
                width: "100%",
                justifyContent: "center",
              }}
            >
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: "300px",
              maxWidth: "300px",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              mx: 1,
              pl: 2.5,
              pr: 2.5,
              pt: 2,
              pb: 1.5,
              borderRadius: "10px",
              height: "fit-content",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.trelloCustom.COLOR_13091B
                  : theme.trelloCustom.COLOR_EEEEEE,
            }}
          >
            <TextField
              ref={inputNewColumnTitleRef}
              label="Enter title of column"
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onKeyDown={(ev) => {
                if (ev.key === "Enter") {
                  // Do code here
                  ev.preventDefault();

                  addNewColumn();
                }
              }}
              InputProps={{
                endAdornment: (
                  <CloseIcon
                    fontSize="small"
                    sx={{
                      color: newColumnTitle
                        ? (theme) =>
                            theme.palette.mode === "dark"
                              ? "white"
                              : theme.trelloCustom.COLOR_818181
                        : "transparent",
                      cursor: newColumnTitle ? "pointer" : "text",
                    }}
                    onClick={() => {
                      if (!newColumnTitle) {
                        inputNewColumnTitleRef.current.children[1].children[0].focus();
                      } else {
                        setNewColumnTitle("");

                        inputNewColumnTitleRef.current.children[1].children[0].focus();
                      }
                    }}
                  />
                ),
              }}
              sx={{
                // label 'Search'
                "& label": {
                  // color: "white",
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
                  // color: "white",
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
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                size="medium"
                sx={{
                  width: "calc(150px - 25px)",
                  pl: 2.5,
                  pr: 2.5,
                  pt: 0.25,
                  pb: 0.25,
                  fontSize: "1.1rem",
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
                onClick={toggleOpenNewColumnForm}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                size="medium"
                sx={{
                  width: "calc(150px - 25px)",
                  pl: 2.5,
                  pr: 2.5,
                  pt: 0.25,
                  pb: 0.25,
                  fontSize: "1.1rem",
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
                onClick={addNewColumn}
              >
                Add
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  );
}

export default ListColumns;
