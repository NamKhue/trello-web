import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { toast } from "react-toastify";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import CardModal from "~/components/Card/CardModal/CardModal";

// import { mockData } from '~/apis/mock-data'
import { generatePlaceholderCard } from "~/utils/formatters";
import { mapOrder } from "~/utils/sorts";
import {
  fetchBoardDetailsAPI,
  fetchRoleOfBoardsAPI,
  fetchAllMembersAPI,
  createNewCardAPI,
  createNewColumnAPI,
  updateBoardDetailsAPI,
  deleteBoardAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI,
  deleteCardDetailsAPI,
  updateCardDetailsAPI,
  inviteMemberAPI,
  removeMemberAPI,
  changeRoleOfMemberAPI,
  addUserIntoCardAPI,
  removeUserFromCardAPI,
} from "~/apis";

import "../../assets/css/Card/Dropdown.css";

import { useAuth } from "~/hooks/useAuth";

import socket from "~/utils/socket/socket";

function Board() {
  // ============================================================================
  const location = useLocation();
  const navigate = useNavigate();
  // ============================================================================
  const { loggedInUser } = useAuth();
  // ============================================================================
  const { id } = useParams();
  const boardId = id;

  // // ============================================================================
  // // ============================================================================
  // const [boardLoadedCount, setBoardLoadedCount] = useState(0);
  // const [loadedOtherDataCount, setLoadedOtherDataCount] = useState(0);
  // const [loading, setLoading] = useState(true);

  // const [board, setBoard] = useState(null);
  // const [roleOfBoard, setRoleOfBoard] = useState("");
  // const [allMembersInBoard, setAllMembersInBoard] = useState([]);

  // // ============================================================================
  // // load data of board
  // useEffect(() => {
  //   if (boardLoadedCount < 1) {
  //     setBoardLoadedCount(boardLoadedCount + 1);

  //     fetchBoardDetailsAPI(boardId)
  //       .then((board) => {
  //         // sắp xếp dữ liệu columns
  //         board.columns = mapOrder(board.columns, board.columnOrderIds, "_id");
  //         // console.log('board:', board)

  //         board.columns.forEach((column) => {
  //           // cần xử lý vấn đề kéo thả khi đưa vào 1 column rỗng
  //           if (isEmpty(column.cards)) {
  //             column.cards = [generatePlaceholderCard(column)];
  //             column.cardOrderIds = [generatePlaceholderCard(column)._id];
  //           } else {
  //             // sắp xếp dữ liệu cards
  //             column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
  //             // console.log('column.cards:', column.cards)
  //           }
  //         });

  //         // console.log("board:", board);

  //         setBoard(board);
  //       })
  //       .catch((error) => {
  //         toast.error(error.response.data.message);
  //         navigate("/homepage");
  //       });
  //   }
  // }, [boardLoadedCount, boardId, roleOfBoard, board, navigate]);

  // // load more other data
  // useEffect(() => {
  //   if (loadedOtherDataCount < 1 && board != null) {
  //     setLoadedOtherDataCount(loadedOtherDataCount + 1);

  //     // load role of user in board
  //     // lấy dữ liệu vai trò của bảng từ boardUser qua api
  //     // get the user's role in current board
  //     fetchRoleOfBoardsAPI(board._id).then((res) => {
  //       setRoleOfBoard(res);
  //     });

  //     // load all members in board
  //     fetchAllMembersAPI(board._id).then((res) => {
  //       setAllMembersInBoard(res);
  //     });

  //     setLoading(false);
  //   }
  // }, [loadedOtherDataCount, board]);

  // ============================================================================
  // ============================================================================
  const MAX_RETRY_LOAD_MORE = 50;
  const [retryCount, setRetryCount] = useState(0);

  const [boardLoading, setBoardLoading] = useState(true);
  const [allLoading, setAllLoading] = useState(true);

  const [board, setBoard] = useState(null);
  const [roleOfBoard, setRoleOfBoard] = useState("");
  const [allMembersInBoard, setAllMembersInBoard] = useState([]);

  // ============================================================================

  // ============================================================================
  // load data of board
  useEffect(() => {
    if (retryCount < MAX_RETRY_LOAD_MORE && boardLoading) {
      console.log("attempt to refresh board: ", retryCount + 1);

      const interval = setInterval(() => {
        setRetryCount((prevCount) => prevCount + 1);

        fetchBoardDetailsAPI(boardId)
          .then((board) => {
            // sắp xếp dữ liệu columns
            board.columns = mapOrder(
              board.columns,
              board.columnOrderIds,
              "_id"
            );
            // console.log('board:', board)

            board.columns.forEach((column) => {
              // cần xử lý vấn đề kéo thả khi đưa vào 1 column rỗng
              if (isEmpty(column.cards)) {
                column.cards = [generatePlaceholderCard(column)];
                column.cardOrderIds = [generatePlaceholderCard(column)._id];
              } else {
                // sắp xếp dữ liệu cards
                column.cards = mapOrder(
                  column.cards,
                  column.cardOrderIds,
                  "_id"
                );
                // console.log('column.cards:', column.cards)
              }
            });

            // console.log("board:", board);

            setBoard(board);

            setBoardLoading(false);
          })
          .catch((error) => {
            if (!boardLoading) {
              toast.error(error.response.data.message);
              navigate("/homepage");
            }
          });
        //
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [MAX_RETRY_LOAD_MORE, retryCount, boardLoading, boardId]);

  // load more other data
  useEffect(() => {
    if (!boardLoading) {
      // load role of user in board
      // lấy dữ liệu vai trò của bảng từ boardUser qua api
      // get the user's role in current board
      fetchRoleOfBoardsAPI(board._id).then((res) => {
        setRoleOfBoard(res);
      });

      // load all members in board
      fetchAllMembersAPI(board._id).then((res) => {
        setAllMembersInBoard(res);
      });

      setAllLoading(false);
    }
  }, [boardLoading, board]);

  // ============================================================================
  // socket when board is change
  useEffect(() => {
    if (boardId && loggedInUser) {
      socket.emit("join", loggedInUser._id);

      // fetch-deadline-notifications
      // socket.emit("fetch-deadline-notifications", loggedInUser._id);

      socket.emit("access-board", loggedInUser.username, boardId);

      socket.on("update-board", (updatedBoard) => {
        if (updatedBoard._id === boardId) {
          setBoard(updatedBoard);
        }
      });

      socket.on("delete-board", (boardId, userId) => {
        if (loggedInUser._id == userId) {
          if (location.pathname.includes(boardId)) {
            navigate(`/homepage`, { replace: true });
          }
        }
      });
    }

    return () => {
      socket.off("update-board");
    };
  }, [boardId, loggedInUser]);

  // ================================================================================================
  useEffect(() => {
    if (boardId) {
      // socket when user accept the invitation
      socket.on("add-new-user", async () => {
        // load all members in board
        fetchAllMembersAPI(boardId).then((res) => {
          setAllMembersInBoard(res);
        });
      });

      // socket when user is changed the role by owner or creator
      socket.on("change-role-of-user", async () => {
        // fetch again the user's role in current board
        fetchRoleOfBoardsAPI(boardId).then((res) => {
          setRoleOfBoard(res);
        });

        // refresh all members in board
        fetchAllMembersAPI(boardId).then((res) => {
          setAllMembersInBoard(res);
        });

        // fetch again the board's data
        fetchBoardDetailsAPI(boardId)
          .then((board) => {
            // sắp xếp dữ liệu columns
            board.columns = mapOrder(
              board.columns,
              board.columnOrderIds,
              "_id"
            );

            board.columns.forEach((column) => {
              // cần xử lý vấn đề kéo thả khi đưa vào 1 column rỗng
              if (isEmpty(column.cards)) {
                column.cards = [generatePlaceholderCard(column)];
                column.cardOrderIds = [generatePlaceholderCard(column)._id];
              } else {
                // sắp xếp dữ liệu cards
                column.cards = mapOrder(
                  column.cards,
                  column.cardOrderIds,
                  "_id"
                );
              }
            });

            setBoard(board);
          })
          .catch((error) => {
            toast.error(error.response.data.message);
            navigate("/homepage");
          });
      });

      socket.on("remove-user", async (removedUserId) => {
        if (loggedInUser && board) {
          if (loggedInUser._id != removedUserId) {
            // load all members in board
            fetchAllMembersAPI(boardId).then((res) => {
              setAllMembersInBoard(res);
            });

            // remove user from all cards
            board.columns.forEach((column) => {
              if (!isEmpty(column.cards)) {
                column.cards.forEach((card) => {
                  let existRemovedUser = card.members.some(
                    (member) => member.userId == removedUserId
                  );

                  if (existRemovedUser) {
                    card.members = card.members.filter(
                      (member) => member.userId != removedUserId
                    );
                  }
                });
              }
            });

            setBoard(board);
          }
        }
      });
    }
  }, [allMembersInBoard, boardId, navigate, board, loggedInUser]);

  // ============================================================================
  // remove no need properties
  const excludeProperties = (data, propertiesToExclude) => {
    return Object.keys(data)
      .filter((key) => !propertiesToExclude.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
  };

  // ============================================================================
  // gọi API tạo mới Column và làm lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    try {
      const createdColumn = await createNewColumnAPI(board._id, {
        ...newColumnData,
        boardId: board._id,
      });

      // console.log("createdColumn ", createdColumn);

      createdColumn.cards = [generatePlaceholderCard(createdColumn)];
      createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];

      // cập nhật state của board
      // FE set đúng lại state cho board => khong cần tới fetchBoardDetailsAPI nữa
      //
      const newBoard = { ...board };
      newBoard.columns.push(createdColumn);
      newBoard.columnOrderIds.push(createdColumn._id);

      setBoard(newBoard);
      socket.emit("update-board", board._id, newBoard);
      // socket.emit("update-board", newBoard);
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
  // call api to modify column
  const modifyColumn = async (columnId, newDataOfColumn, newColumn) => {
    const newBoard = { ...board };

    const columnToModify = newBoard.columns.findIndex(
      (col) => col._id === columnId
    );
    newBoard.columns[columnToModify] = newColumn;

    setBoard(newBoard);
    socket.emit("update-board", board._id, newBoard);
    socket.emit("update-column", board._id, newColumn);
    // socket.emit("update-board", newBoard);

    try {
      const res = await updateColumnDetailsAPI(columnId, newDataOfColumn);
      toast.success(res.modifyColumnResult);
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
  // call api to update details of board
  const modifyBoardDetails = async (newBoard) => {
    // cập nhật state của board
    // const newBoard = { ...board };

    setBoard(newBoard);
    socket.emit("update-board", board._id, newBoard);
    // socket.emit("update-board", newBoard);

    // call api
    updateBoardDetailsAPI(board._id, newBoard).then((res) => {
      // có thể đặt trong interceptors
      toast.success(res?.modifyBoardResult);
    });
  };

  // ============================================================================
  // call api to update details of board
  const deleteBoard = async () => {
    // call api
    deleteBoardAPI(board._id).then((resDeletedBoard) => {
      //
      socket.emit(
        "notification",
        resDeletedBoard?.responseDeleteBoardNotificationForCreator
      );

      //
      if (
        resDeletedBoard?.listResponseDeleteBoardNotificationForMembersInBoard
          .length > 0
      ) {
        resDeletedBoard?.listResponseDeleteBoardNotificationForMembersInBoard.map(
          (notiItem) => {
            socket.emit("notification", notiItem);
          }
        );
      }

      // // có thể đặt trong interceptors
      // toast.success(resDeletedBoard?.deleteBoardResult);

      allMembersInBoard.map((member) => {
        socket.emit("delete-board", board._id, member.userId);
      });
    });
  };

  // ============================================================================
  // gọi API tạo mới Card và làm lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI(board._id, {
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
    socket.emit("update-board", board._id, newBoard);
    // socket.emit("update-board", newBoard);
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
    socket.emit("update-board", board._id, newBoard);
    // socket.emit("update-board", newBoard);

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
    socket.emit("update-board", board._id, newBoard);
    // socket.emit("update-board", newBoard);

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
    socket.emit("update-board", board._id, newBoard);
    // socket.emit("update-board", newBoard);

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

    // console.log("prevCardOrderIds ", prevCardOrderIds);

    // let nextCardOrderIds = dndOrderedColumns.find(
    //   (col) => col._id === nextColumnId
    // )?.cardOrderIds;

    // moveCardToDifferentColumnAPI({
    //   currentCardId,
    //   prevColumnId,
    //   prevCardOrderIds,
    //   nextColumnId,
    //   nextCardOrderIds,
    // });

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

    // console.log("newBoard ", newBoard);

    newBoard.columns = newBoard.columns.filter((col) => col._id !== columnId);
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
      (_id) => _id !== columnId
    );

    // console.log("newBoard ", newBoard);

    setBoard(newBoard);
    socket.emit("update-board", board._id, newBoard);
    // socket.emit("update-board", newBoard);

    // call api xử lý data
    deleteColumnDetailsAPI(columnId).then((res) => {
      // có thể đặt trong interceptors
      toast.success(res?.deleteColumnResult);
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
    socket.emit("update-board", board._id, newBoard);
    // socket.emit("update-board", newBoard);

    // call api xử lý data
    deleteCardDetailsAPI(cardId, board._id).then((res) => {
      // có thể đặt trong interceptors
      toast.success(res?.deleteCardResult);

      //
      socket.emit(
        "list-notis-delete-card",
        res?.listResponseDeleteCardNotificationForMembersInCard
      );

      //
      socket.emit(
        "notification",
        res?.responseDeleteCardNotificationForCreator
      );
    });
  };

  // ============================================================================
  // sửa đổi thẻ
  const modifyCardDetails = async (modifiedCard) => {
    try {
      // remove property `sortable`
      modifiedCard = excludeProperties(modifiedCard, "sortable");

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
      socket.emit("update-board", board._id, newBoard);
      // socket.emit("update-board", newBoard);

      const res = await updateCardDetailsAPI(
        modifiedCard._id,
        board._id,
        modifiedCard
      );
      toast.success(res.modifyCardResult);

      // notify to that user
      socket.emit("update-card", loggedInUser._id, board._id, modifiedCard);
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
  // invite other users into board
  const inviteUserIntoBoard = async (invitation) => {
    try {
      const responseInviteMemberIntoBoard = await inviteMemberAPI(invitation);
      toast.success(responseInviteMemberIntoBoard.inviteUserResult);

      // notify to that user
      socket.emit(
        "notification",
        responseInviteMemberIntoBoard.notiInviteUserIntoBoard
      );
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
  // remove member out of board
  const removeMemberOutOfBoard = async (userId) => {
    try {
      const resRemoveMemberOutOfBoard = await removeMemberAPI({
        userId: userId,
        boardId: board._id,
      });

      toast.success(resRemoveMemberOutOfBoard.removeUserResult);

      // notify to that user
      socket.emit("notification", resRemoveMemberOutOfBoard.newNoti);

      // notify to that user
      socket.emit("remove-user", userId);
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
  // change the role of member in the board
  const changeRoleOfMember = async (roleChangeData) => {
    try {
      const resChangeRoleOfMember = await changeRoleOfMemberAPI(roleChangeData);
      // toast.success(resChangeRoleOfMember.changedRoleUserResult);

      // notify to that user
      socket.emit(
        "notification",
        resChangeRoleOfMember.notiChangedRoleOfMember
      );

      // notify to that user
      socket.emit("change-role-of-user", roleChangeData.userId);
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
  // add member into card
  const addMemberIntoCard = async (cardId, columnId, assignee) => {
    try {
      // cập nhật state của board
      const newBoard = { ...board };

      const columnToModifyCard = newBoard.columns.findIndex(
        (col) => col._id === columnId
      );

      const cardToModify = newBoard.columns[columnToModifyCard].cards.findIndex(
        (card) => card._id === cardId
      );

      newBoard.columns[columnToModifyCard].cards[cardToModify].members.push(
        assignee
      );

      setBoard(newBoard);
      socket.emit("update-board", newBoard._id, newBoard);

      const responseAddUser = await addUserIntoCardAPI(
        cardId,
        board._id,
        assignee
      );
      // toast.success(responseAddUser.addUserResult);

      // console.log("🚀 ~ responseAddUser.newNoti:", responseAddUser.newNoti);

      // // notify to that user
      socket.emit("notification", responseAddUser.newNoti);
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
  // remove member into card
  const removeMemberFromCard = async (
    cardId,
    columnId,
    indexToRemove,
    assignee
  ) => {
    try {
      assignee = excludeProperties(assignee, ["joinedAt", "cardInvited"]);

      // cập nhật state của board
      const newBoard = { ...board };

      const columnToModifyCard = newBoard.columns.findIndex(
        (col) => col._id === columnId
      );

      const cardToModify = newBoard.columns[columnToModifyCard].cards.findIndex(
        (card) => card._id === cardId
      );

      newBoard.columns[columnToModifyCard].cards[cardToModify].members.splice(
        indexToRemove,
        1
      );

      // notify about updating board
      setBoard(newBoard);
      socket.emit("update-board", boardId, newBoard);

      const responseRemoverUser = await removeUserFromCardAPI(
        cardId,
        board._id,
        assignee
      );
      // toast.success(responseRemoverUser.removeUserResult);

      // console.log(
      //   "🚀 ~ responseRemoverUser.newNoti:",
      //   responseRemoverUser.newNoti
      // );

      // // notify to that user
      socket.emit("notification", responseRemoverUser.newNoti);
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
      {/* {!board ? ( */}
      {/* {loading ? ( */}
      {allLoading ? (
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
        <Container
          disableGutters
          maxWidth={false}
          sx={{
            height: "100vh",
            WebkitUserSelect: "none",
            MsUserSelect: "none",
            userSelect: "none",
          }}
        >
          {/* ============================================================================ */}
          {/* APP BAR */}
          <AppBar socket={socket} />

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
            <BoardBar
              board={board}
              roleOfBoard={roleOfBoard}
              allMembersInBoard={allMembersInBoard}
              modifyBoardDetails={modifyBoardDetails}
              deleteBoard={deleteBoard}
              inviteUserIntoBoard={inviteUserIntoBoard}
              removeMemberOutOfBoard={removeMemberOutOfBoard}
              changeRoleOfMember={changeRoleOfMember}
            />
          </Box>

          {/* ============================================================================ */}
          {/* BOARD CONTENT */}
          <BoardContent
            // board={mockData?.board}

            board={board}
            roleOfBoard={roleOfBoard}
            createNewColumn={createNewColumn}
            modifyColumn={modifyColumn}
            deleteColumnDetails={deleteColumnDetails}
            moveColumns={moveColumns}
            moveCardInTheSameColumn={moveCardInTheSameColumn}
            moveCardToDifferentColumn={moveCardToDifferentColumn}
            createNewCard={createNewCard}
            deleteCardDetails={deleteCardDetails}
            // openModalDetailsCard={openModalDetailsCard}
            handleCardClick={handleCardClick}
          />
          {/* ============================================================================ */}
          {/* MODAL CARD */}
          {popupModal && selectedCard && (
            <CardModal
              onCloseModalCard={() => setPopupModalCard(false)}
              roleOfBoard={roleOfBoard}
              allMembersInBoard={allMembersInBoard}
              card={selectedCard}
              modifyCardDetails={modifyCardDetails}
              addMemberIntoCard={addMemberIntoCard}
              removeMemberFromCard={removeMemberFromCard}
            />
          )}

          {/* ============================================================================ */}
        </Container>
      )}
    </div>
  );
}

export default Board;
