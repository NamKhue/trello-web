import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { toast } from "react-toastify";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

// import { useColorScheme } from "@mui/material/styles";
// import { BorderRight } from "@mui/icons-material";

import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";

import CardModal from "~/components/Card/CardModal/CardModal";

// import { mockData } from '~/apis/mock-data'
import { generatePlaceholderCard } from "~/utils/formatters";
import { mapOrder } from "~/utils/sorts";
import {
  fetchBoardDetailsAPI,
  createNewCardAPI,
  createNewColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI,
  deleteCardDetailsAPI,
  updateCardDetailsAPI,
} from "~/apis";

// import theme from "~/theme";
import "../../assets/css/Card/Dropdown.css";

function Board() {
  // ============================================================================
  // ============================================================================
  const [board, setBoard] = useState(null);

  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // ============================================================================
  // fix cứng tạm thời boardId - 61
  // tương lai dùng react-router-dom

  // new solution
  // useEffect(() => {
  //   const boardId = "65dd549752af25f9410efe69";

  //   const fetchData = async () => {
  //     let success = false;
  //     let retryCount = 0;
  //     const maxRetries = 5;
  //     const retryDelay = 1000; // 1 second

  //     while (!success && retryCount < maxRetries) {
  //       // call api
  //       fetchBoardDetailsAPI(boardId)
  //         .then((board) => {
  //           // sắp xếp dữ liệu columns
  //           board.columns = mapOrder(
  //             board.columns,
  //             board.columnOrderIds,
  //             "_id"
  //           );
  //           // console.log('board:', board)

  //           board.columns.forEach((column) => {
  //             // cần xử lý vấn đề kéo thả khi đưa vào 1 column rỗng
  //             if (isEmpty(column.cards)) {
  //               column.cards = [generatePlaceholderCard(column)];
  //               column.cardOrderIds = [generatePlaceholderCard(column)._id];
  //             } else {
  //               // sắp xếp dữ liệu cards
  //               column.cards = mapOrder(
  //                 column.cards,
  //                 column.cardOrderIds,
  //                 "_id"
  //               );
  //               // console.log('column.cards:', column.cards)
  //             }
  //           });

  //           // console.log('board:', board)

  //           setBoard(board);

  //           // setup for list of cards
  //           let listCards = [];

  //           board.columns.forEach((column) => {
  //             column.cards.forEach((card) => {
  //               listCards.push(card);
  //             });
  //           });

  //           setListCards(listCards);

  //           success = true;
  //           setLoading(false);
  //         })
  //         // .catch((error) => {
  //         //   retryCount += 1;
  //         //   setError(
  //         //     `Error fetching data: ${error.message}. Retrying (${retryCount}/${maxRetries})...`
  //         //   );
  //         //   return new Promise((resolve) => setTimeout(resolve, retryDelay));
  //         // })
  //         .finally(() => {
  //           retryCount += 1;

  //           return new Promise((resolve) => setTimeout(resolve, retryDelay));
  //         });
  //     }

  //     if (!success) {
  //       setLoading(false);
  //       setError("Failed to fetch data after multiple attempts.");
  //     }
  //   };

  //   fetchData();
  // }, []);

  // old solution
  useEffect(() => {
    const boardId = "65dd549752af25f9410efe69";

    // call api
    fetchBoardDetailsAPI(boardId).then((board) => {
      // sắp xếp dữ liệu columns
      board.columns = mapOrder(board.columns, board.columnOrderIds, "_id");
      // console.log('board:', board)

      board.columns.forEach((column) => {
        // cần xử lý vấn đề kéo thả khi đưa vào 1 column rỗng
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          // sắp xếp dữ liệu cards
          column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
          // console.log('column.cards:', column.cards)
        }
      });

      // console.log('board:', board)

      setBoard(board);
    });
  }, []);

  // ============================================================================
  // func này có nhiệm vụ gọi API tạo mới Column và làm lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });

    createdColumn.cards = [generatePlaceholderCard(createdColumn)];
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];

    // cập nhật state của board
    // FE set đúng lại state cho board => khong cần tới fetchBoardDetailsAPI nữa
    //
    const newBoard = { ...board };
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id);
    setBoard(newBoard);
  };

  // ============================================================================
  // func này có nhiệm vụ gọi API tạo mới Card và làm lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });

    // console.log('createdCard:', createdCard)

    // cập nhật state của board
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    );

    // xóa placeholder card sau khi thêm mới
    if (columnToUpdate) {
      // sol 2
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard];
        columnToUpdate.cardOrderIds = [createdCard._id];
      } else {
        columnToUpdate.cards.push(createdCard);
        columnToUpdate.cardOrderIds.push(createdCard._id);
      }
    }

    // sol 1
    // let indexErasePlaceholderCard = columnToUpdate.cards.findIndex(card => card.FE_PlaceholderCard)
    // if (indexErasePlaceholderCard >= 0) {
    //   columnToUpdate.cards.splice(indexErasePlaceholderCard, 1)
    // }

    // console.log('indexErasePlaceholderCard:', indexErasePlaceholderCard)
    // console.log('columnToUpdate:', columnToUpdate)

    setBoard(newBoard);
  };

  // ============================================================================
  // call api cập nhật data columnOrderIds từ board chứa nó
  const moveColumns = (dndOrderedColumns) => {
    // cập nhật state của board
    const dndOrderedColumnsIds = dndOrderedColumns.map((col) => col._id);
    const newBoard = { ...board };

    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;

    setBoard(newBoard);

    // gọi API update Board
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: newBoard.columnOrderIds,
    });
  };

  // ============================================================================
  // card
  // kéo thả Card cùng column
  // call api cập nhật data cardOrderIds từ column chứa nó
  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    // cập nhật state của board
    const newBoard = { ...board };

    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );

    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }

    setBoard(newBoard);

    // gọi API update Board
    updateColumnDetailsAPI(columnId, {
      cardOrderIds: columnToUpdate.cardOrderIds,
    });
  };

  // ============================================================================
  // di chuyển card từ col A sang col B
  // 1: update cardOrderIds và cards của A (xóa _id của card đang kéo)
  // 2: update cardOrderIds và cards của B (thêm _id của card đang kéo)
  // 3: update columnId của card vừa kéo
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    // cập nhật state của board
    const dndOrderedColumnsIds = dndOrderedColumns.map((col) => col._id);
    const newBoard = { ...board };

    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;

    setBoard(newBoard);

    // gọi API để xử lý data
    let prevCardOrderIds = dndOrderedColumns.find(
      (col) => col._id === prevColumnId
    )?.cardOrderIds;

    // debug lỗi khi kéo card cuối cùng ra khỏi column, column tuy rỗng về mặt giao diện nhưng ẩn đằng sau tồn tại Placeholder Card
    // do đó cần coi nó là mảng rỗng [] để gửi data lên cho BE
    // console.log(prevCardOrderIds)
    if (
      prevCardOrderIds[0] &&
      prevCardOrderIds[0].includes("placeholder-card")
    ) {
      prevCardOrderIds = [];
    }
    // console.log(prevCardOrderIds)

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(
        (col) => col._id === nextColumnId
      )?.cardOrderIds,
    });
  };

  // ============================================================================
  // xử lý xóa 1 column và toàn bộ card trong column đó
  const deleteColumnDetails = (columnId) => {
    // cập nhật state của board
    const newBoard = { ...board };
    newBoard.columns = newBoard.columns.filter((col) => col._id !== columnId);
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
      (_id) => _id !== columnId
    );
    setBoard(newBoard);

    // call api xử lý data
    deleteColumnDetailsAPI(columnId).then((res) => {
      // có thể đặt trong interceptors
      toast.success(res?.deleteResult);
    });
  };

  // ============================================================================
  // xử lý xóa 1 column và toàn bộ card trong column đó
  const deleteCardDetails = (columnId, cardId) => {
    // cập nhật state của board
    const newBoard = { ...board };

    let columnToDeleteCard = newBoard.columns.findIndex(
      (col) => col._id === columnId
    );

    newBoard.columns[columnToDeleteCard].cards = newBoard.columns[
      columnToDeleteCard
    ].cards.filter((card) => card._id !== cardId);

    newBoard.columns[columnToDeleteCard].cardOrderIds = newBoard.columns[
      columnToDeleteCard
    ].cardOrderIds.filter((_id) => _id !== cardId);

    if (isEmpty(newBoard.columns[columnToDeleteCard].cards)) {
      newBoard.columns[columnToDeleteCard].cards = [
        generatePlaceholderCard(newBoard.columns[columnToDeleteCard]),
      ];
      newBoard.columns[columnToDeleteCard].cardOrderIds = [
        generatePlaceholderCard(newBoard.columns[columnToDeleteCard])._id,
      ];
    }

    setBoard(newBoard);

    // call api xử lý data
    deleteCardDetailsAPI(cardId).then((res) => {
      // có thể đặt trong interceptors
      toast.success(res?.deleteResult);
    });
  };

  // ============================================================================
  // sửa đổi thẻ
  const modifyCardDetails = (modifiedCard) => {
    // cập nhật state của board
    const newBoard = { ...board };

    const columnToModifyCard = newBoard.columns.findIndex(
      (col) => col._id === modifiedCard.columnId
    );

    const cardToModify = newBoard.columns[columnToModifyCard].cards.findIndex(
      (card) => card._id === modifiedCard._id
    );

    newBoard.columns[columnToModifyCard].cards[cardToModify] = modifiedCard;

    setBoard(newBoard);

    // call api
    updateCardDetailsAPI(
      modifiedCard._id,
      newBoard.columns[columnToModifyCard].cards[cardToModify]
    ).then((res) => {
      // có thể đặt trong interceptors
      toast.success(res?.modifyCardResult);
    });
  };

  // ============================================================================
  // ============================================================================
  // modal of card
  const [popupModal, setPopupModalCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setPopupModalCard(true);
  };
  // ============================================================================

  // ============================================================================
  // ============================================================================
  // 1 lỗi
  // đồng thời connect tới DB và load trang
  // sau khi connect thành công thì trang cứ mãi mãi loading mà khong show lên dữ liệu

  // if (!board) {
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         gap: 2,
  //         width: "100vw",
  //         height: "100vh",
  //         color: "white",
  //         bgcolor: (theme) =>
  //           theme.palette.mode === "dark"
  //             ? theme.trelloCustom.COLOR_13091B
  //             : theme.trelloCustom.COLOR_7852A9,
  //       }}
  //     >
  //       <CircularProgress sx={{ color: "white" }} />
  //       <Typography>Loading Board...</Typography>
  //     </Box>
  //   );
  // }

  // ============================================================================
  // ============================================================================
  return (
    <div>
      {!board ? (
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
          <Typography>Loading Board...</Typography>
        </Box>
      ) : (
        <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
          {/* ============================================================================ */}
          {/* APP BAR */}
          <AppBar />

          {/* ============================================================================ */}
          {/* BOARD BAR */}
          <Box
            sx={{
              display: "flex",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.trelloCustom.COLOR_3C1C64
                  : theme.trelloCustom.COLOR_7852A9,
            }}
          >
            {/* <BoardBar board={mockData?.board} /> */}
            <BoardBar board={board} />
          </Box>

          {/* ============================================================================ */}
          {/* BOARD CONTENT */}
          <BoardContent
            // board={mockData?.board}

            board={board}
            createNewColumn={createNewColumn}
            createNewCard={createNewCard}
            moveColumns={moveColumns}
            moveCardInTheSameColumn={moveCardInTheSameColumn}
            moveCardToDifferentColumn={moveCardToDifferentColumn}
            deleteColumnDetails={deleteColumnDetails}
            deleteCardDetails={deleteCardDetails}
            // openModalDetailsCard={openModalDetailsCard}
            handleCardClick={handleCardClick}
          />
          {/* ============================================================================ */}
          {/* MODAL CARD */}
          {popupModal && selectedCard && (
            <CardModal
              card={selectedCard}
              modifyCardDetails={modifyCardDetails}
              onCloseModalCard={() => setPopupModalCard(false)}
            />
          )}

          {/* ============================================================================ */}
        </Container>
      )}
    </div>
  );
}

export default Board;
