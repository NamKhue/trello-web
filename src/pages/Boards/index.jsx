import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useMediaQuery } from "@mui/material";

import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";

import AppBar from "~/components/AppBar/AppBar";

import { fetchAllBoardsAPI, createNewBoardAPI } from "~/apis";

// ============================================================================
//
const paddingLeft = "200px";
const paddingRight = "200px";
const paddingTop = "32px";
const paddingBottom = "32px";
//
const appBarHeight = "48px";
//
const gapBetweenLeftAndRightSide = "40px";
const leftSideWidth = "260px";
const rightSideWidth = `calc(100vw - ${paddingLeft} - ${paddingRight} - ${leftSideWidth} - ${gapBetweenLeftAndRightSide})`;
//
const topOfRightSideHeight = "40px";
const gapBetweenTopAndMiddleOfRightSide = "40px";
//
// const rightSideHeight = `calc(100vh - ${paddingTop} - ${paddingBottom} - ${appBarHeight})`;
const paginationHeight = "60px";
const gapBetweenGridAndPagination = "20px";
const gridListHeight = `calc(100vh - ${paddingTop} - ${paddingBottom} - ${appBarHeight} - ${topOfRightSideHeight} - ${gapBetweenTopAndMiddleOfRightSide} - ${paginationHeight})`;
// ============================================================================

// ============================================================================
// const fakeAllBoards = [
//   { _id: 1, title: "To Do", createdAt: new Date(), updatedAt: null },
//   { _id: 2, title: "Doing", createdAt: new Date(), updatedAt: null },
//   { _id: 3, title: "Done", createdAt: new Date(), updatedAt: null },
//   { _id: 4, title: "To Do", createdAt: new Date(), updatedAt: null },
//   { _id: 5, title: "Doing", createdAt: new Date(), updatedAt: null },
//   { _id: 6, title: "Done", createdAt: new Date(), updatedAt: null },
//   { _id: 7, title: "To Do", createdAt: new Date(), updatedAt: null },
//   { _id: 8, title: "Doing", createdAt: new Date(), updatedAt: null },
//   { _id: 9, title: "Done", createdAt: new Date(), updatedAt: null },
//   { _id: 10, title: "To Do", createdAt: new Date(), updatedAt: null },
//   { _id: 11, title: "Doing", createdAt: new Date(), updatedAt: null },
//   { _id: 12, title: "Done", createdAt: new Date(), updatedAt: null },
//   { _id: 13, title: "To Do", createdAt: new Date(), updatedAt: null },
//   { _id: 14, title: "Doing", createdAt: new Date(), updatedAt: null },
//   { _id: 15, title: "Done", createdAt: new Date(), updatedAt: null },
//   { _id: 16, title: "To Do", createdAt: new Date(), updatedAt: null },
//   { _id: 17, title: "Doing", createdAt: new Date(), updatedAt: null },
//   { _id: 18, title: "Done", createdAt: new Date(), updatedAt: null },
//   { _id: 19, title: "To Do", createdAt: new Date(), updatedAt: null },
//   { _id: 20, title: "Doing", createdAt: new Date(), updatedAt: null },
//   { _id: 21, title: "Done", createdAt: new Date(), updatedAt: null },
//   { _id: 22, title: "To Do", createdAt: new Date(), updatedAt: null },
//   { _id: 23, title: "Doing", createdAt: new Date(), updatedAt: null },
// ];
// ============================================================================

// ============================================================================
function HomePage() {
  // ============================================================================
  // ============================================================================
  const [loadedCount, setLoadedCount] = useState(0);

  // load data
  useEffect(() => {
    // call api
    fetchAllBoardsAPI().then((board) => {
      if (loadedCount < 1) {
        setLoadedCount(loadedCount + 1);
        setBoards(sortListViaCreatedOrUpdatedTime(board));

        // console.log("sdfsdf ", sortListViaCreatedOrUpdatedTime(board));
      }
    });
  }, [loadedCount]);
  // ============================================================================

  // ============================================================================

  const [boards, setBoards] = useState([]);

  const [page, setPage] = useState(1);
  const [columns, setColumns] = useState(4);
  // const [rows, setRows] = useState(4);

  const [openModalBoardTitle, setOpenModalBoardTitle] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  const [flagShouldSortBoards, setFlagShouldSortBoards] = useState(false);

  const isFlexDirectionRow = useMediaQuery("(min-width: 900px)");

  const itemsPerPage = columns * 4;
  const currentListItems = boards.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const updateColumnsAndRows = (isRow) => {
    if (isRow) {
      // setRows(4);

      if (window.innerWidth < 1024) {
        return 2;
      } else if (window.innerWidth < 1280) {
        return 3;
      } else {
        return 4;
      }
    } else {
      // setRows(3);

      if (window.innerWidth < 678) {
        return 2;
      } else if (window.innerWidth < 768) {
        return 3;
      } else if (window.innerWidth < 900) {
        return 4;
      } else {
        return 4;
      }
    }
  };

  const sortListViaCreatedOrUpdatedTime = (originalList) => {
    return [...originalList].sort((a, b) => {
      if (a.updatedAt && b.updatedAt) {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      } else if (a.updatedAt && !b.updatedAt) {
        return new Date(b.createdAt) - new Date(a.updatedAt);
      } else if (!a.updatedAt && b.updatedAt) {
        return new Date(b.updatedAt) - new Date(a.createdAt);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const [flagDoneFirstLoad, setFlagDoneFirstLoad] = useState(false);

  // update UI when responsive
  useEffect(() => {
    const handleResize = () => {
      // update columns & rows
      setColumns(updateColumnsAndRows(isFlexDirectionRow));

      // console.log("cal ", Math.ceil(boards.length / itemsPerPage));
      // console.log("page ", page);
      // console.log("");

      // update pagination page
      if (page > Math.ceil(boards.length / itemsPerPage)) {
        setPage(Math.ceil(boards.length / itemsPerPage));
      }
    };

    window.addEventListener("resize", handleResize);
    if (!flagDoneFirstLoad) {
      setFlagDoneFirstLoad(true);
      setColumns(updateColumnsAndRows(isFlexDirectionRow));
    }
    // handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    isFlexDirectionRow,
    boards.length,
    itemsPerPage,
    page,
    flagDoneFirstLoad,
  ]);

  // sort boards based on updatedAt, with the most recent first
  useEffect(() => {
    if (flagShouldSortBoards) {
      setBoards(sortListViaCreatedOrUpdatedTime(boards));
    }
    setFlagShouldSortBoards(false);
  }, [boards, flagShouldSortBoards]);

  const handleChangePaginationPage = (event, value) => {
    setPage(value);
  };

  const handleOpenModalBoardTitle = () => setOpenModalBoardTitle(true);
  const handleCloseModalBoardTitle = () => setOpenModalBoardTitle(false);

  const handleCreateNewBoard = async () => {
    if (newBoardTitle) {
      setFlagShouldSortBoards(true);

      const newBoard = {
        title: newBoardTitle.trim(),
      };

      // call api to save into mongodb
      await createNewBoardAPI(newBoard);

      // update UI
      setBoards((prevBoards) => [newBoard, ...prevBoards]);
      setNewBoardTitle("");
      setPage(1); // back to the 1st pagination page
      handleCloseModalBoardTitle();

      // notify on screen
      toast.success("Successfully created new board!");
    } else {
      toast.error("You should enter the title of new board!");
    }
  };
  // ============================================================================

  // ============================================================================
  // ============================================================================
  return (
    <div>
      {/* loading page */}
      {!(boards.length > 0) ? (
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
          <CircularProgress sx={{ color: "white" }} />
          <Typography>Loading All Boards...</Typography>
        </Box>
      ) : (
        <Container
          disableGutters
          maxWidth={false}
          sx={{ height: "100vh", minWidth: "468px" }}
        >
          {/* ============================================================================ */}
          {/* APP BAR */}
          <AppBar />

          {/* ============================================================================ */}
          {/* HOME CONTENT */}
          <Box
            sx={{
              height: `calc(100vh - ${appBarHeight})`,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.trelloCustom.COLOR_3C1C64
                  : theme.trelloCustom.COLOR_F9F4FD,

              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: {
                xs: `calc(${gapBetweenLeftAndRightSide} - 20px)`,
                xl: `${gapBetweenLeftAndRightSide}`,
              },
              // transition: "flex-direction 0.3s",
              transition: "padding 0.3s",
              padding: {
                xs: "20px 20px 10px 20px",
                sm: "20px 48px",
                md: "32px 64px",
                lg: "32px 112px",
                xl: "32px 200px",
              },
            }}
          >
            {/* left side */}
            <Box
              sx={{
                width: { xs: "100%", md: leftSideWidth },
                display: "flex",
                gap: 2,
                flexDirection: { xs: "row", md: "column" },
                justifyContent: { xs: "space-between", md: "flex-start" },
                transition: "width 0.3s, flex-direction 0.3s",
              }}
            >
              {/* my boards button */}
              <Box
                onClick={() => console.log("show my board")}
                sx={{
                  height: "50px",
                  cursor: "pointer",
                  px: 3,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "4px",
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_E6E6E6
                      : theme.trelloCustom.COLOR_790283,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_51247C
                      : theme.trelloCustom.COLOR_DDADF0,
                  "&:hover": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_E6E6E6
                        : theme.trelloCustom.COLOR_F8F8F8,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_1E0734
                        : theme.trelloCustom.COLOR_9357CF,
                  },
                }}
              >
                My board
              </Box>

              {/* all boards button */}
              <Box
                onClick={() => console.log("show all boards")}
                sx={{
                  height: "50px",
                  cursor: "pointer",
                  px: 3,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "4px",
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_E6E6E6
                      : theme.trelloCustom.COLOR_790283,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_51247C
                      : theme.trelloCustom.COLOR_DDADF0,
                  "&:hover": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_E6E6E6
                        : theme.trelloCustom.COLOR_F8F8F8,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_1E0734
                        : theme.trelloCustom.COLOR_9357CF,
                  },
                }}
              >
                All boards
              </Box>

              {/* invited boards button */}
              <Box
                onClick={() => console.log("show invited boards")}
                sx={{
                  height: "50px",
                  cursor: "pointer",
                  px: 3,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "4px",
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_E6E6E6
                      : theme.trelloCustom.COLOR_790283,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_51247C
                      : theme.trelloCustom.COLOR_DDADF0,
                  "&:hover": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_E6E6E6
                        : theme.trelloCustom.COLOR_F8F8F8,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_1E0734
                        : theme.trelloCustom.COLOR_9357CF,
                  },
                }}
              >
                Invited boards
              </Box>
            </Box>

            {/* right side */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "width 0.3s",
                gap: gapBetweenGridAndPagination,
                width: {
                  xs: "100%",
                  md: `${rightSideWidth}`,
                },
                // height: {
                //   xs: `calc(${rightSideHeight} - 100px)`,
                //   md: `${rightSideHeight}`,
                // },
              }}
            >
              {/* top & grid-list of right side */}
              <Box>
                {/* top of right side */}
                <Box
                  sx={{
                    height: `${topOfRightSideHeight}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: {
                      xs: `calc(${gapBetweenTopAndMiddleOfRightSide} - 20px)`,
                      md: `${gapBetweenTopAndMiddleOfRightSide}`,
                    },
                  }}
                >
                  {/* type of boards' page */}
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_E6E6E6
                          : theme.trelloCustom.COLOR_790283,
                    }}
                  >
                    My board
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      height: "100%",
                      gap: 1.5,
                    }}
                  >
                    {/* filter boards button */}
                    <Box
                      onClick={() => console.log("filter boards")}
                      sx={{
                        height: "100%",
                        cursor: "pointer",
                        pl: 1.25,
                        pr: 2,
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "4px",

                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_E6E6E6
                            : theme.trelloCustom.COLOR_790283,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_51247C
                            : theme.trelloCustom.COLOR_DDADF0,
                        "&:hover": {
                          color: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.trelloCustom.COLOR_E6E6E6
                              : theme.trelloCustom.COLOR_F8F8F8,
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.trelloCustom.COLOR_1E0734
                              : theme.trelloCustom.COLOR_9357CF,
                        },
                      }}
                    >
                      <FilterListIcon sx={{ mr: 0.5 }} />
                      Filter
                    </Box>

                    {/* create new board button */}
                    <Box
                      onClick={handleOpenModalBoardTitle}
                      sx={{
                        height: "100%",
                        cursor: "pointer",
                        pl: 1.25,
                        pr: 2,
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "4px",

                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_E6E6E6
                            : theme.trelloCustom.COLOR_790283,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_51247C
                            : theme.trelloCustom.COLOR_DDADF0,
                        "&:hover": {
                          color: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.trelloCustom.COLOR_E6E6E6
                              : theme.trelloCustom.COLOR_F8F8F8,
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.trelloCustom.COLOR_1E0734
                              : theme.trelloCustom.COLOR_9357CF,
                        },
                      }}
                    >
                      <AddIcon sx={{ mr: 0.5 }} />
                      New board
                    </Box>
                  </Box>
                </Box>

                {/* middle of right side */}
                {/* list of boards */}
                <Box
                  sx={{
                    flex: 1,
                    height: {
                      xs: `calc(${gridListHeight} - 100px)`,
                      md: `${gridListHeight}`,
                    },
                    transition: "height 0.3s",
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      gridTemplateColumns: `repeat(${columns}, 1fr)`,
                      transition: "grid-template-columns 0.3s",
                    }}
                  >
                    {currentListItems.map((board) => (
                      <Grid item xs={12 / columns} key={board._id}>
                        <Link
                          to={`/board/${board._id}`}
                          style={{
                            textDecoration: "none",
                          }}
                        >
                          <Box
                            sx={{
                              cursor: "pointer",
                              height: "100px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "8px",
                              fontSize: "1.2rem",

                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? theme.trelloCustom.COLOR_E6E6E6
                                  : theme.trelloCustom.COLOR_790283,
                              bgcolor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? theme.trelloCustom.COLOR_51247C
                                  : theme.trelloCustom.COLOR_DDADF0,
                              "&:hover": {
                                color: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? theme.trelloCustom.COLOR_E6E6E6
                                    : theme.trelloCustom.COLOR_F8F8F8,
                                bgcolor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? theme.trelloCustom.COLOR_1E0734
                                    : theme.trelloCustom.COLOR_9357CF,
                              },
                            }}
                          >
                            {board.title}
                          </Box>
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>

              {/* pagination */}
              <Box
                sx={{
                  height: `${paginationHeight}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  position: "relative",
                }}
              >
                <Pagination
                  count={Math.ceil(boards.length / itemsPerPage)}
                  page={page}
                  onChange={handleChangePaginationPage}
                  color="secondary"
                  sx={{
                    "& .MuiPagination-ul": {
                      gap: 1.25,
                    },
                    "& .MuiButtonBase-root.MuiPaginationItem-root": {
                      height: "40px",
                      minWidth: "40px",
                      borderRadius: "6px",
                      fontSize: "1rem",

                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_E6E6E6
                          : theme.trelloCustom.COLOR_790283,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_51247C
                          : theme.trelloCustom.COLOR_DDADF0,
                      "&:hover": {
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_E6E6E6
                            : theme.trelloCustom.COLOR_F8F8F8,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_1E0734
                            : theme.trelloCustom.COLOR_9357CF,
                      },
                    },
                    "& .MuiButtonBase-root.MuiPaginationItem-root:hover": {
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_E6E6E6
                          : theme.trelloCustom.COLOR_790283,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_51247C
                          : theme.trelloCustom.COLOR_DDADF0,
                      "&:hover": {
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_E6E6E6
                            : theme.trelloCustom.COLOR_F8F8F8,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_1E0734
                            : theme.trelloCustom.COLOR_9357CF,
                      },
                    },
                    "& .MuiButtonBase-root.MuiPaginationItem-root.Mui-selected":
                      {
                        borderRadius: "6px",
                        color: "white",
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_1E0734
                            : theme.trelloCustom.COLOR_9357CF,
                      },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* ============================================================================ */}
          {/* MODAL CARD */}
          <Modal
            open={openModalBoardTitle}
            onClose={handleCloseModalBoardTitle}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                px: 4,
                py: 3,
                outline: 0,
                boxShadow: 24,
                borderRadius: "12px",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_13091B
                    : theme.trelloCustom.COLOR_F8F8F8,
              }}
            >
              <Box
                sx={{
                  fontSize: "1.4rem",
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_D7D7D7
                      : theme.trelloCustom.COLOR_313131,
                }}
              >
                Create new board
              </Box>

              <TextField
                autoFocus
                fullWidth
                label="Enter title of board"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    setNewBoardTitle(e.target.value);
                    handleCreateNewBoard();
                  }
                }}
                sx={{
                  mt: 2,

                  "& .MuiInputBase-input.MuiOutlinedInput-input": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_D7D7D7
                        : theme.trelloCustom.COLOR_313131,
                    fontSize: "1.4rem",
                  },
                  "& .MuiFormLabel-root.MuiInputLabel-root": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_D7D7D7
                        : theme.trelloCustom.COLOR_313131,
                    fontSize: ".9rem",
                    top: "6px",
                  },
                  "& .MuiFormLabel-root.MuiInputLabel-root.Mui-focused": {
                    transform: "translate(14px, -14px) scale(0.75)",
                  },
                  "& .MuiInputBase-root.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_D7D7D7
                          : theme.trelloCustom.COLOR_313131,
                    },
                }}
              />

              {/* create & cancel buttons */}
              <Box
                sx={{
                  height: "35px",
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                  gap: 2,
                }}
              >
                <Box
                  onClick={handleCreateNewBoard}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2,
                    borderRadius: "5px",
                    fontWeight: "bold",

                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "none"
                        : `0 2px 10px ${theme.trelloCustom.COLOR_C78FFF}`,

                    color: (theme) => theme.trelloCustom.COLOR_7115BA,
                    bgcolor: (theme) => theme.trelloCustom.COLOR_C985FF,
                    "&:hover": {
                      color: "white",
                      bgcolor: (theme) => theme.trelloCustom.COLOR_8C25DE,
                    },
                  }}
                >
                  Create
                </Box>

                <Box
                  onClick={handleCloseModalBoardTitle}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2,
                    borderRadius: "5px",
                    fontWeight: "bold",

                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "none"
                        : `0 2px 10px ${theme.trelloCustom.COLOR_D7D7D7}`,

                    color: (theme) => theme.trelloCustom.COLOR_49454E,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_D7D7D7
                        : theme.trelloCustom.COLOR_,
                    "&:hover": {
                      color: (theme) => theme.trelloCustom.COLOR_D7D7D7,
                      bgcolor: (theme) => theme.trelloCustom.COLOR_818181,
                    },
                  }}
                >
                  Cancel
                </Box>
              </Box>
            </Box>
          </Modal>

          {/* ============================================================================ */}
        </Container>
      )}
    </div>
  );
}

export default HomePage;
