import { useEffect, useState } from "react";
// import { useColorScheme } from "@mui/material/styles";
import { isEmpty } from "lodash";
import { toast } from "react-toastify";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

// import { BorderRight } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";

// description/text editor
import RichTextEditor from "../../components/Card/RichTextEditor";

// date time picker
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

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
  editCardDetailsAPI,
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

      // setup for list of cards
      let listCards = [];

      board.columns.forEach((column) => {
        column.cards.forEach((card) => {
          listCards.push(card);
        });
      });

      setListCards(listCards);
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

  // kéo thả Card cùng column
  // call api cập nhật data cardOrderIds từ column chứa nó
  const editCard = (columnId, cardId) => {
    // cập nhật state của board
    // const newBoard = { ...board };

    // let columnToEditCard = newBoard.columns.findIndex(
    //   (col) => col._id === columnId
    // );

    // const cardToModify = newBoard.columns[columnToEditCard].cards.find(
    //   (card) => card._id === cardId
    // );

    // if (cardToModify) {
    //   cardToModify.title = props;
    // }

    editCardDetailsAPI(cardId, { ...selectedCard }).then((res) => {
      // có thể đặt trong interceptors
      toast.success(res?.modifyCardResult);
    });

    // setBoard(newBoard);
  };

  // ============================================================================
  // ============================================================================
  // modal of card
  const [isOpenModalDetailsCard, setIsOpenModalDetailsCard] = useState(false);
  // const [isCardModified, setIsCardModified] = useState(false);
  const [cardId, setCardId] = useState();
  const [columnIdOfCard, setColumnIdOfCard] = useState();

  const openModalDetailsCard = (columnId, cardId) => {
    // cập nhật state của board
    const newBoard = { ...board };

    let columnToEditCard = newBoard.columns.findIndex(
      (col) => col._id === columnId
    );

    const cardToEdit = newBoard.columns[columnToEditCard].cards.find(
      (card) => card._id === cardId
    );

    // setup for card
    setSelectedCard(cardToEdit);
    setCardId(cardToEdit._id);
    setColumnIdOfCard(cardToEdit.columnId);

    // title
    if (
      cardToEdit?.title != titleCardToDisplay.trim() &&
      titleCardToDisplay.trim() != ""
    ) {
      setOldTitleCard(titleCardToDisplay.trim());

      setTitleCardToDisplay(titleCardToDisplay.trim());
      setInputTitleCard(titleCardToDisplay.trim());
    } else {
      setOldTitleCard(cardToEdit?.title);

      setTitleCardToDisplay(cardToEdit?.title);
      setInputTitleCard(cardToEdit?.title);
    }

    // lastest updated time
    const stringUpdatedTime = new Date(cardToEdit.updatedAt);
    setUpdatedTimeFormatString(
      `${stringUpdatedTime.getUTCDate()}.${
        stringUpdatedTime.getUTCMonth() + 1
      }.${stringUpdatedTime.getUTCFullYear()}`
    );

    // status
    if (
      cardToEdit?.status != selectedStatusToDisplay &&
      selectedStatusToDisplay != ""
    ) {
      setOldSelectedStatus(selectedStatusToDisplay);

      setSelectedStatusToDisplay(selectedStatusToDisplay);
      setStatusTextColorToDisplay(statusTextColorToDisplay);
      setStatusBgColorToDisplay(statusBgColorToDisplay);

      setSelectedStatus(selectedStatusToDisplay);
    } else {
      setOldSelectedStatus(cardToEdit?.status);

      setSelectedStatusToDisplay(cardToEdit?.status);
      setStatusTextColorToDisplay(cardToEdit?.statusTextColor);
      setStatusBgColorToDisplay(cardToEdit?.statusBgColor);

      setSelectedStatus(cardToEdit?.status);
    }

    // Priority
    if (
      cardToEdit?.status != selectedPriorityToDisplay &&
      selectedPriorityToDisplay != ""
    ) {
      setOldSelectedPriority(selectedPriorityToDisplay);

      setSelectedPriorityToDisplay(selectedPriorityToDisplay);
      setPriorityTextColorToDisplay(priorityTextColorToDisplay);
      setPriorityBgColorToDisplay(priorityBgColorToDisplay);

      setSelectedPriority(selectedPriorityToDisplay);
    } else {
      setOldSelectedPriority(cardToEdit?.priority);

      setSelectedPriorityToDisplay(cardToEdit?.priority);
      setPriorityTextColorToDisplay(cardToEdit?.priorityTextColor);
      setPriorityBgColorToDisplay(cardToEdit?.priorityBgColor);

      setSelectedPriority(cardToEdit?.priority);
    }

    // Description
    if (
      cardToEdit?.description != descriptionCardToDisplay.trim() &&
      descriptionCardToDisplay.trim() != ""
    ) {
      setOldDescription(descriptionCardToDisplay.trim());

      setDescriptionCardToDisplay(descriptionCardToDisplay.trim());
      setInputDescriptionCard(descriptionCardToDisplay.trim());
      setListSubstringDescription(
        parseHTMLString(descriptionCardToDisplay.trim())
      );
    } else {
      setOldDescription(cardToEdit?.description);

      setInputDescriptionCard(cardToEdit?.description);
      setDescriptionCardToDisplay(cardToEdit?.description);
      setListSubstringDescription(parseHTMLString(cardToEdit?.description));
    }

    // date & time
    // notiDateTimeToDisplay is yyyy-mm-dd

    // console.log("");
    // console.log("cardToEdit?.notiDateTime ", cardToEdit?.notiDateTime);
    // console.log("selectedCard?.notiDateTime ", selectedCard?.notiDateTime);
    // console.log("notiDateTimeToDisplay ", notiDateTimeToDisplay);

    if (
      cardToEdit?.notiDateTime.length ||
      selectedCard?.notiDateTime.length ||
      notiDateTimeToDisplay.length
    ) {
      if (
        cardToEdit?.notiDateTime != notiDateTimeToDisplay &&
        notiDateTimeToDisplay.length
      ) {
        console.log("");
        console.log("here 1");
        console.log("");

        let partsOfNotiDateTime = notiDateTimeToDisplay.split(" ");
        let notiDate = partsOfNotiDateTime[0].split("-");
        const formattedNotiDateTime = new Date(
          notiDate[0],
          notiDate[1] - 1,
          notiDate[2]
        ).toDateString();

        setOldNotiDateTime(notiDateTimeToDisplay);
        setValueDatePickerDayJS(dayjs(formattedNotiDateTime));
        setValueTimePickerDayJS(dayjs(notiDateTimeToDisplay));
        setValueDatePicker(partsOfNotiDateTime[0]);
        setValueTimePicker(partsOfNotiDateTime[1]);
        // setNotiDateTimeToDisplay(notiDateTimeToDisplay);

        setIsOverdueDeadline(
          new Date().getTime() >=
            new Date(notiDate[0], notiDate[1] - 1, notiDate[2]).getTime()
        );
      } else {
        console.log("");
        console.log("here 2");
        console.log("");

        let partsOfNotiDateTime = cardToEdit?.notiDateTime.split(" ");
        let notiDate = partsOfNotiDateTime[0].split("-");
        const formattedNotiDateTime = new Date(
          notiDate[0],
          notiDate[1] - 1,
          notiDate[2]
        ).toDateString();

        setOldNotiDateTime(cardToEdit?.notiDateTime);
        setNotiDateTimeToDisplay(cardToEdit?.notiDateTime);
        setValueDatePickerDayJS(dayjs(formattedNotiDateTime));
        setValueTimePickerDayJS(dayjs(cardToEdit?.notiDateTime));
        setValueDatePicker(partsOfNotiDateTime[0]);
        setValueTimePicker(partsOfNotiDateTime[1]);

        setIsOverdueDeadline(
          new Date().getTime() >=
            new Date(notiDate[0], notiDate[1] - 1, notiDate[2]).getTime()
        );
      }
    } else {
      console.log("");
      console.log("here 3");
      console.log("");

      let newDate = new Date();
      let newDateString = newDate.toString();
      let newDateStringDayJS = dayjs(newDateString);

      let newStringValueDatePicker = `${newDateStringDayJS.format(
        "YYYY"
      )}-${newDateStringDayJS.format("MM")}-${newDateStringDayJS.format("DD")}`;
      let newStringValueTimePicker = `${newDateStringDayJS.format(
        "HH"
      )}:${newDateStringDayJS.format("mm")}`;
      // setNotiDateTimeToDisplay(
      //   `${newStringValueDatePicker} ${newStringValueTimePicker}`
      // );

      setValueDatePickerDayJS(newDateStringDayJS);
      setValueTimePickerDayJS(newDateStringDayJS);
      setValueDatePicker(newStringValueDatePicker);
      setValueTimePicker(newStringValueTimePicker);
      setOldNotiDateTime("");
      setSelectedCard({
        ...selectedCard,
        notiDateTime: "",
      });

      setIsOverdueDeadline(null);
    }

    // open modal
    setIsOpenModalDetailsCard(true);
  };

  const handleCloseModal = (columnId, cardId) => {
    checkIsOpenMenuStatusThenClose();
    checkIsOpenMenuPriorityThenClose();
    checkIsOpenDescriptionFieldCardThenClose();
    checkIsOpenDateTimePickerThenClose();
    // checkIsOpenAsigneeListThenClose();

    setIsOpenModalDetailsCard(false);

    // check if there is any changes of card's details
    // if yes, update the changes
    if (checkIsCardModified()) {
      editCard(columnId, cardId);
    }
  };

  const checkIsCardModified = () => {
    // console.log("");
    // console.log("valueDatePicker ", valueDatePicker);
    // console.log("valueTimePicker ", valueTimePicker);
    // console.log("notiDateTimeToDisplay ", notiDateTimeToDisplay);
    // console.log("oldNotiDateTime ", oldNotiDateTime);
    // console.log("");

    // console.log("{...selectedCard} ", { ...selectedCard });
    // console.log("selectedCard?.notiDateTime ", selectedCard?.notiDateTime);
    // console.log("");

    if (
      titleCardToDisplay != oldTitleCard ||
      selectedStatus != oldSelectedStatus ||
      selectedPriority != oldSelectedPriority ||
      descriptionCardToDisplay != oldDescription ||
      notiDateTimeToDisplay != oldNotiDateTime
    ) {
      console.log("co thay doi");
      // setIsCardModified(true);

      return true;
    }

    return false;
  };

  // ============================================================================
  //
  const [listCards, setListCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  // title
  const [oldTitleCard, setOldTitleCard] = useState("");
  const [titleCardToDisplay, setTitleCardToDisplay] = useState("");
  const [inputTitleCard, setInputTitleCard] = useState("");

  const handleInputChangeTitleCard = (ev) => {
    const newCardTitle = ev.target.value;

    setListCards((prevCards) =>
      prevCards.map((card) =>
        card._id === selectedCard._id
          ? { ...card, title: newCardTitle.trim() }
          : card
      )
    );

    setInputTitleCard(newCardTitle);
    setTitleCardToDisplay(newCardTitle);

    setSelectedCard({ ...selectedCard, title: newCardTitle.trim() });
  };

  // ============================================================================
  // lastest updated time
  const [updatedTimeFormatString, setUpdatedTimeFormatString] = useState("");

  // ============================================================================
  // status & priority
  const [isHoveredStatus, setIsHoveredStatus] = useState(false);
  const [isHoveredPriority, setIsHoveredPriority] = useState(false);

  const handleHoverStatus = () => {
    setIsHoveredStatus(true);
  };

  const handleMouseLeaveStatus = () => {
    setIsHoveredStatus(false);
  };

  const handleHoverPriority = () => {
    setIsHoveredPriority(true);
  };

  const handleMouseLeavePriority = () => {
    setIsHoveredPriority(false);
  };

  const statusLabelData = [
    {
      id: 100,
      name: "not yet",
      textColor: "#818181",
      bgColor: "#D7D7D7",
    },
    {
      id: 1,
      name: "At risk",
      textColor: "#DF0606",
      bgColor: "#FF9D9D",
    },
    {
      id: 2,
      name: "Pending",
      textColor: "#989212",
      bgColor: "#FFEB4F",
    },
    {
      id: 3,
      name: "On track",
      textColor: "#188544",
      bgColor: "#CDF4DD",
    },
  ];

  const priorityLabelData = [
    {
      id: 10000,
      name: "not yet",
      textColor: "#818181",
      bgColor: "#D7D7D7",
    },
    {
      id: 4,
      name: "High",
      textColor: "#6F09AE",
      bgColor: "#CE85FB",
    },
    {
      id: 5,
      name: "Medium",
      textColor: "#E3590B",
      bgColor: "#FFBA92",
    },
    {
      id: 6,
      name: "Low",
      textColor: "#268FB0",
      bgColor: "#D9F4F8",
    },
  ];

  const [isOpenMenuStatus, setIsOpenMenuStatus] = useState(false);
  const [oldSelectedStatus, setOldSelectedStatus] = useState("");

  const [selectedStatusToDisplay, setSelectedStatusToDisplay] = useState("");
  const [statusTextColorToDisplay, setStatusTextColorToDisplay] = useState("");
  const [statusBgColorToDisplay, setStatusBgColorToDisplay] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");

  const toggleDropdownMenuStatus = () => {
    checkIsOpenMenuPriorityThenClose();
    checkIsOpenDateTimePickerThenClose();

    setIsOpenMenuStatus(!isOpenMenuStatus);
  };

  const handleChangeStatus = (name, textColor, bgColor) => {
    setSelectedStatusToDisplay(name);
    setStatusTextColorToDisplay(textColor);
    setStatusBgColorToDisplay(bgColor);

    setSelectedStatus(name);

    setIsOpenMenuStatus(false);

    setSelectedCard({
      ...selectedCard,
      status: name,
      statusTextColor: textColor,
      statusBgColor: bgColor,
    });
  };

  const [isOpenMenuPriority, setIsOpenMenuPriority] = useState(false);
  const [oldSelectedPriority, setOldSelectedPriority] = useState("");

  const [selectedPriorityToDisplay, setSelectedPriorityToDisplay] =
    useState("");
  const [priorityTextColorToDisplay, setPriorityTextColorToDisplay] =
    useState("");
  const [priorityBgColorToDisplay, setPriorityBgColorToDisplay] = useState("");

  const [selectedPriority, setSelectedPriority] = useState("");

  const toggleDropdownMenuPriority = () => {
    checkIsOpenMenuStatusThenClose();
    checkIsOpenDateTimePickerThenClose();

    setIsOpenMenuPriority(!isOpenMenuPriority);
  };

  const handleChangePriority = (name, textColor, bgColor) => {
    setSelectedPriorityToDisplay(name);
    setPriorityTextColorToDisplay(textColor);
    setPriorityBgColorToDisplay(bgColor);

    setSelectedPriority(name);

    setIsOpenMenuPriority(false);

    setSelectedCard({
      ...selectedCard,
      priority: name,
      priorityTextColor: textColor,
      priorityBgColor: bgColor,
    });
  };

  const checkIsOpenMenuStatusThenClose = () => {
    if (isOpenMenuStatus) {
      toggleDropdownMenuStatus();
    }
  };

  const checkIsOpenMenuPriorityThenClose = () => {
    if (isOpenMenuPriority) {
      toggleDropdownMenuPriority();
    }
  };

  // ============================================================================
  // description
  const [isOpenDescriptionFieldCard, setIsOpenDescriptionFieldCard] =
    useState(false);

  const toggleOpenDescriptionFieldCard = () => {
    setIsOpenDescriptionFieldCard(!isOpenDescriptionFieldCard);
  };

  const checkIsOpenDescriptionFieldCardThenClose = () => {
    if (isOpenDescriptionFieldCard) {
      toggleOpenDescriptionFieldCard();
    }
  };

  const [oldDescription, setOldDescription] = useState("");
  const [descriptionCardToDisplay, setDescriptionCardToDisplay] = useState("");
  const [inputDescriptionCard, setInputDescriptionCard] = useState("");

  const handleChangesDescriptionCard = (newDescription) => {
    setInputDescriptionCard(newDescription);
    setDescriptionCardToDisplay(newDescription);

    const newListSubstringDescription = parseHTMLString(newDescription.trim());
    setSelectedCard({ ...selectedCard, description: newDescription.trim() });

    setListSubstringDescription(newListSubstringDescription);
  };

  const [listSubstringDescription, setListSubstringDescription] = useState([]);

  // Function to parse HTML string and extract listSubstringDescription with properties
  const parseHTMLString = (htmlString) => {
    // Create a new DOMParser instance
    const parser = new DOMParser();

    // Parse the HTML string into a DOM document
    const doc = parser.parseFromString(htmlString, "text/html");

    // Initialize an array to store substrings with properties
    const substrings = [];

    // Helper function to check if the node has a specific child element
    const hasChildElement = (parentNode, childTagName) => {
      return (
        Array.from(parentNode.getElementsByTagName(childTagName)).length > 0
      );
    };

    // Function to recursively traverse DOM nodes and extract text with properties
    const traverseNodes = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text.length > 0) {
          // Add text content to substrings
          substrings.push({
            text: text,
            hasURL: false,
            urlLink: "",
            isBoldOrStrong: false,
            isUnderline: false,
            isItalic: false,
            isHeadingOne: false,
            isHeadingTwo: false,
            isHeadingThree: false,
            isEnterDownLine: false,
          });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        let isBoldOrStrong = false;
        let isUnderline = false;
        let isItalic = false;
        let isHeadingOne = false;
        let isHeadingTwo = false;
        let isHeadingThree = false;

        if (tagName === "a") {
          const urlLink = node.href;
          const childText = Array.from(node.childNodes)
            .map((childNode) => childNode.textContent.trim())
            .filter((text) => text.length > 0)
            .join(" ");

          isBoldOrStrong =
            hasChildElement(node, "strong") || hasChildElement(node, "b");
          isUnderline = hasChildElement(node, "u");
          isItalic = hasChildElement(node, "em") || hasChildElement(node, "i");

          substrings.push({
            text: childText,
            hasURL: true,
            urlLink: urlLink,
            isBoldOrStrong: isBoldOrStrong,
            isUnderline: isUnderline,
            isItalic: isItalic,
            isHeadingOne: isHeadingOne,
            isHeadingTwo: isHeadingTwo,
            isHeadingThree: isHeadingThree,
            isEnterDownLine: false,
          });
        } else if (tagName === "p") {
          if (substrings.length > 0) {
            substrings.push({
              text: "",
              hasURL: false,
              urlLink: "",
              isBoldOrStrong: false,
              isUnderline: false,
              isItalic: false,
              isHeadingOne: false,
              isHeadingTwo: false,
              isHeadingThree: false,
              isEnterDownLine: true,
            });
          }

          Array.from(node.childNodes).forEach(traverseNodes);
        } else if (tagName === "h1") {
          isHeadingOne = true;
          const childText = Array.from(node.childNodes)
            .map((childNode) => childNode.textContent.trim())
            .filter((text) => text.length > 0)
            .join(" ");

          substrings.push({
            text: childText,
            hasURL: false,
            urlLink: "",
            isBoldOrStrong: false,
            isUnderline: false,
            isItalic: false,
            isHeadingOne: isHeadingOne,
            isHeadingTwo: isHeadingTwo,
            isHeadingThree: isHeadingThree,
            isEnterDownLine: false,
          });
        } else if (tagName === "h2") {
          isHeadingTwo = true;
          const childText = Array.from(node.childNodes)
            .map((childNode) => childNode.textContent.trim())
            .filter((text) => text.length > 0)
            .join(" ");

          substrings.push({
            text: childText,
            hasURL: false,
            urlLink: "",
            isBoldOrStrong: false,
            isUnderline: false,
            isItalic: false,
            isHeadingOne: isHeadingOne,
            isHeadingTwo: isHeadingTwo,
            isHeadingThree: isHeadingThree,
            isEnterDownLine: false,
          });
        } else if (tagName === "h3") {
          isHeadingThree = true;
          const childText = Array.from(node.childNodes)
            .map((childNode) => childNode.textContent.trim())
            .filter((text) => text.length > 0)
            .join(" ");

          substrings.push({
            text: childText,
            hasURL: false,
            urlLink: "",
            isBoldOrStrong: false,
            isUnderline: false,
            isItalic: false,
            isHeadingOne: isHeadingOne,
            isHeadingTwo: isHeadingTwo,
            isHeadingThree: isHeadingThree,
            isEnterDownLine: false,
          });
        } else {
          Array.from(node.childNodes).forEach(traverseNodes);
        }
      }
    };

    // Start traversing nodes starting from the document body
    Array.from(doc.body.childNodes).forEach(traverseNodes);

    return substrings;
  };

  // ============================================================================
  // date & time
  const [isOpenDateTimePicker, setIsOpenDateTimePicker] = useState(false);

  const [isOverdueDeadline, setIsOverdueDeadline] = useState(false);

  //
  const [notiDateTimeToDisplay, setNotiDateTimeToDisplay] = useState("");
  const [oldNotiDateTime, setOldNotiDateTime] = useState("");

  const handleOpenDateTimePicker = () => {
    checkOtherOpenExceptDateTimePicker();
    setIsOpenDateTimePicker(!isOpenDateTimePicker);
  };

  const checkOtherOpenExceptDateTimePicker = () => {
    checkIsOpenMenuStatusThenClose();
    checkIsOpenMenuPriorityThenClose();
  };

  const handleCloseDateTimePicker = () => {
    setIsOpenDateTimePicker(false);
  };

  const checkIsOpenDateTimePickerThenClose = () => {
    if (isOpenDateTimePicker) {
      handleCloseDateTimePicker();
    }
  };

  //
  const [valueDatePickerDayJS, setValueDatePickerDayJS] = useState(dayjs(""));
  const [valueDatePicker, setValueDatePicker] = useState("");

  const handleOpenDatePicker = () => {
    checkIsOpenMenuStatusThenClose();
    checkIsOpenMenuPriorityThenClose();
  };

  const handleChangeDatePicker = (date) => {
    setValueDatePicker(
      `${date.format("YYYY")}-${date.format("MM")}-${date.format("DD")}`
    );
  };

  //
  const [valueTimePickerDayJS, setValueTimePickerDayJS] = useState(dayjs(""));
  const [valueTimePicker, setValueTimePicker] = useState("");

  const handleChangeTimePicker = (time) => {
    setValueTimePicker(`${time.format("HH")}:${time.format("mm")}`);
  };

  //
  const handleRemoveDateAndTime = () => {
    let newDate = new Date();
    let newDateString = newDate.toString();
    let newDateStringDayJS = dayjs(newDateString);

    setValueDatePickerDayJS(newDateStringDayJS);
    setValueTimePickerDayJS(newDateStringDayJS);
    setNotiDateTimeToDisplay("");
    setSelectedCard({
      ...selectedCard,
      notiDateTime: "",
    });

    setIsOverdueDeadline(null);

    handleCloseDateTimePicker();
  };

  const handleSaveDateAndTime = () => {
    let newValueNoteDateTime = `${valueDatePicker} ${valueTimePicker}`;

    setValueDatePickerDayJS(dayjs(newValueNoteDateTime));
    setValueTimePickerDayJS(dayjs(newValueNoteDateTime));
    setNotiDateTimeToDisplay(newValueNoteDateTime);
    setSelectedCard({
      ...selectedCard,
      notiDateTime: newValueNoteDateTime,
    });

    let notiDate = valueDatePicker.split("-");
    setIsOverdueDeadline(
      new Date().getTime() >=
        new Date(notiDate[0], notiDate[1] - 1, notiDate[2]).getTime()
    );

    handleCloseDateTimePicker();
  };

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
            cards={listCards}
            createNewColumn={createNewColumn}
            createNewCard={createNewCard}
            moveColumns={moveColumns}
            moveCardInTheSameColumn={moveCardInTheSameColumn}
            moveCardToDifferentColumn={moveCardToDifferentColumn}
            deleteColumnDetails={deleteColumnDetails}
            deleteCardDetails={deleteCardDetails}
            openModalDetailsCard={openModalDetailsCard}
          />

          {/* ============================================================================ */}
          {/* MODAL OF CARD */}
          <Modal open={isOpenModalDetailsCard}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: (theme) => theme.trelloCustom.MODAL_CARD_WIDTH,

                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_13091B
                    : theme.trelloCustom.COLOR_F5F5F5,

                borderRadius: "8px",
                boxShadow: 24,
                pt: 2,
                pb: 3,
                pl: 3.5,
                pr: 5,
              }}
            >
              {/* title of card and close btn */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                {/* title of card */}
                <TextField
                  type="text"
                  variant="outlined"
                  value={inputTitleCard}
                  onChange={(ev) => handleInputChangeTitleCard(ev)}
                  sx={{
                    flex: 9,
                    // minWidth: (theme) =>
                    //   `calc(${theme.trelloCustom.MODAL_CARD_WIDTH} - 64px - 40px)`,
                    "& input": {
                      cursor: "text",
                      py: 1,
                      px: 0,
                      pl: 1.5,
                      height: "20px",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      borderRadius: "6px",
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "white" : "black",
                      bgcolor: "transparent",
                    },
                    "& input:hover": {
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_281E38
                          : theme.trelloCustom.COLOR_E6E6E6,
                    },
                    "& input:focus": {
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "white" : "black",
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_281E38
                          : theme.trelloCustom.COLOR_EEEEEE,
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

                {/* close btn */}
                {/* <CloseIcon
              onClick={() => handleCloseModal(columnIdOfCard, cardId)}
              sx={{
                cursor: "pointer",
                minWidth: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 0.25,
                borderRadius: "6px",
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_D7D7D7
                    : theme.trelloCustom.COLOR_313131,
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_281E38
                      : theme.trelloCustom.COLOR_D7D7D7,
                },
              }}
            /> */}

                <Box
                  onClick={() => handleCloseModal(columnIdOfCard, cardId)}
                  sx={{
                    flex: 1,
                    cursor: "pointer",
                    width: "80px",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 0.25,
                    px: 1.25,
                    fontWeight: "bold",
                    borderRadius: "6px",
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_D7D7D7
                        : theme.trelloCustom.COLOR_313131,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_281E38
                        : theme.trelloCustom.COLOR_E6E6E6,
                    "&:hover": {
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_281E38
                          : theme.trelloCustom.COLOR_D7D7D7,
                    },
                  }}
                >
                  {/* {isCardModified ? "Save" : "Close"} */}
                  Save
                </Box>
              </Box>

              {/* updated time */}
              <Box sx={{ display: "flex", flexDirection: "column", pb: 1.5 }}>
                {/* content of updated time */}
                <Box
                  sx={{
                    pl: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box
                    id="modal-modal-description"
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: (theme) => theme.trelloCustom.COLOR_818181,
                      pb: 0,
                    }}
                  >
                    Updated at {updatedTimeFormatString}
                  </Box>
                </Box>

                {/* a line to seperate the title and the body of card */}
                <Box
                  sx={{
                    pl: 1.5,
                    height: 0,
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_49454E
                        : theme.trelloCustom.COLOR_D9D9D9,
                  }}
                >
                  <hr
                    style={{
                      borderStyle: "solid",
                      borderWidth: "0.5px",
                    }}
                  />
                </Box>
              </Box>

              {/* body of card's details */}
              <Box
                sx={{
                  pt: 2,
                  pl: 1.5,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 3,
                }}
              >
                {/* right side */}
                <Box
                  sx={{
                    flex: 3,
                  }}
                >
                  {/* status */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 0.25,
                    }}
                  >
                    {/* label of status */}
                    <Box
                      sx={{
                        flex: 3,
                        fontWeight: "bold",
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_D7D7D7
                            : theme.trelloCustom.COLOR_313131,
                      }}
                    >
                      Status
                    </Box>

                    {/* options of status */}
                    <Box
                      className="dropdown-container"
                      onMouseEnter={handleHoverStatus}
                      onMouseLeave={handleMouseLeaveStatus}
                      sx={{
                        py: 0.75,
                        flex: 5,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.25,
                      }}
                    >
                      {/* display value of status */}
                      <Box
                        onClick={() => toggleDropdownMenuStatus()}
                        sx={{
                          cursor: "pointer",
                          width: "fit-content",
                          px: 1.75,
                          py: 0.5,
                          mr: 1,
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          borderRadius: "6px",
                          color: `${statusTextColorToDisplay}`,
                          bgcolor: `${statusBgColorToDisplay}`,
                        }}
                      >
                        {selectedStatusToDisplay.charAt(0).toUpperCase() +
                          selectedStatusToDisplay.slice(1)}{" "}
                      </Box>

                      {/* edit btn */}
                      <Box
                        onClick={toggleDropdownMenuStatus}
                        sx={{
                          cursor: "pointer",
                          width: "fit-content",
                          px: 1,
                          py: 0.25,
                          display: isHoveredStatus ? "flex" : "none",
                          alignItems: "center",
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          border: "2px solid",
                          borderRadius: "6px",
                          borderColor: (theme) =>
                            theme.trelloCustom.COLOR_818181,
                          color: (theme) => theme.trelloCustom.COLOR_818181,
                          bgcolor: "transparent",

                          "&:hover": {
                            color: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_D7D7D7
                                : theme.trelloCustom.COLOR_313131,
                            borderColor: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_D7D7D7
                                : theme.trelloCustom.COLOR_313131,
                          },
                        }}
                      >
                        <EditIcon sx={{ fontSize: "1.25rem", pr: 0.5 }} />
                        Edit
                      </Box>

                      {/* options menu status */}
                      {isOpenMenuStatus && (
                        <Box
                          className={"dropdown-menu"}
                          sx={{
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_13091B
                                : "",
                            boxShadow: (theme) =>
                              theme.palette.mode === "dark"
                                ? `0px 2px 10px ${theme.trelloCustom.COLOR_411A61}`
                                : "",
                          }}
                        >
                          <Box
                            className="dropdown-header"
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? theme.trelloCustom.COLOR_D7D7D7
                                  : "",
                            }}
                          >
                            Select status
                            <Box onClick={toggleDropdownMenuStatus}>
                              <CloseIcon sx={{ cursor: "pointer" }} />
                            </Box>
                          </Box>

                          {statusLabelData.map((item) => (
                            <Box
                              key={item.id}
                              onClick={() =>
                                handleChangeStatus(
                                  item.name.toLowerCase(),
                                  item.textColor,
                                  item.bgColor
                                )
                              }
                              className={`dropdown-item ${
                                selectedStatus === item.name.toLowerCase()
                              } ? 'selected' : ''}`}
                              sx={{
                                "&:hover": {
                                  bgcolor: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? theme.trelloCustom.COLOR_281E38
                                      : "",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  px: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    marginRight: "10px",
                                    width: "50px",
                                    flex: 1,
                                    color:
                                      selectedStatus === item.name.toLowerCase()
                                        ? "black"
                                        : "transparent",
                                    opacity:
                                      selectedStatus === item.name.toLowerCase()
                                        ? 1
                                        : 0,
                                  }}
                                >
                                  <CheckIcon
                                    sx={{
                                      color: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? "white"
                                          : "black",
                                    }}
                                  />
                                </Box>
                                <Box sx={{ flex: 4 }}>
                                  <Box
                                    sx={{
                                      cursor: "pointer",
                                      width: "fit-content",
                                      px: 1.75,
                                      py: 0.5,
                                      fontSize: "0.9rem",
                                      fontWeight: "bold",
                                      color: `${item.textColor}`,
                                      borderRadius: "6px",
                                      bgcolor: `${item.bgColor}`,
                                    }}
                                  >
                                    {item.name.charAt(0).toUpperCase() +
                                      item.name.slice(1)}
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* priority */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 0.25,
                    }}
                  >
                    {/* label of priority */}
                    <Box
                      sx={{
                        flex: 3,
                        fontWeight: "bold",
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_D7D7D7
                            : theme.trelloCustom.COLOR_313131,
                      }}
                    >
                      Priority
                    </Box>

                    {/* options of priority */}
                    <Box
                      className="dropdown-container"
                      onMouseEnter={handleHoverPriority}
                      onMouseLeave={handleMouseLeavePriority}
                      sx={{
                        py: 0.75,
                        flex: 5,
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "bold",
                        gap: 0.25,
                      }}
                    >
                      {/* display value of priority */}
                      <Box
                        onClick={() => toggleDropdownMenuPriority()}
                        sx={{
                          cursor: "pointer",
                          width: "fit-content",
                          px: 1.75,
                          py: 0.5,
                          mr: 1,
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          borderRadius: "6px",
                          color: `${priorityTextColorToDisplay}`,
                          bgcolor: `${priorityBgColorToDisplay}`,
                        }}
                      >
                        {selectedPriorityToDisplay.charAt(0).toUpperCase() +
                          selectedPriorityToDisplay.slice(1)}{" "}
                      </Box>

                      {/* edit btn */}
                      <Box
                        onClick={toggleDropdownMenuPriority}
                        sx={{
                          cursor: "pointer",
                          width: "fit-content",
                          px: 1,
                          py: 0.25,
                          display: isHoveredPriority ? "flex" : "none",
                          alignItems: "center",
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          border: "2px solid",
                          borderRadius: "6px",
                          borderColor: (theme) =>
                            theme.trelloCustom.COLOR_8A8A8A,
                          color: (theme) => theme.trelloCustom.COLOR_818181,
                          bgcolor: "transparent",

                          "&:hover": {
                            color: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_D7D7D7
                                : theme.trelloCustom.COLOR_313131,
                            borderColor: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_D7D7D7
                                : theme.trelloCustom.COLOR_313131,
                          },
                        }}
                      >
                        <EditIcon sx={{ fontSize: "1.25rem", pr: 0.5 }} />
                        Edit
                      </Box>

                      {/* options menu priority */}
                      {isOpenMenuPriority && (
                        <Box
                          className="dropdown-menu"
                          sx={{
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_13091B
                                : "",
                            boxShadow: (theme) =>
                              theme.palette.mode === "dark"
                                ? `0px 2px 10px ${theme.trelloCustom.COLOR_411A61}`
                                : "",
                          }}
                        >
                          <Box
                            className="dropdown-header"
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? theme.trelloCustom.COLOR_D7D7D7
                                  : "",
                            }}
                          >
                            Select priority
                            <Box onClick={toggleDropdownMenuPriority}>
                              <CloseIcon sx={{ cursor: "pointer" }} />
                            </Box>
                          </Box>

                          {priorityLabelData.map((item) => (
                            <Box
                              key={item.id}
                              onClick={() =>
                                handleChangePriority(
                                  item.name.toLowerCase(),
                                  item.textColor,
                                  item.bgColor
                                )
                              }
                              className={`dropdown-item ${
                                selectedPriority === item.name.toLowerCase()
                              } ? 'selected' : ''}`}
                              sx={{
                                "&:hover": {
                                  bgcolor: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? theme.trelloCustom.COLOR_281E38
                                      : "",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  px: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    marginRight: "10px",
                                    width: "50px",
                                    flex: 1,
                                    color:
                                      selectedPriority ===
                                      item.name.toLowerCase()
                                        ? "black"
                                        : "transparent",
                                    opacity:
                                      selectedPriority ===
                                      item.name.toLowerCase()
                                        ? 1
                                        : 0,
                                  }}
                                >
                                  <CheckIcon
                                    sx={{
                                      color: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? "white"
                                          : "black",
                                    }}
                                  />
                                </Box>
                                <Box sx={{ flex: 4 }}>
                                  <Box
                                    sx={{
                                      cursor: "pointer",
                                      width: "fit-content",
                                      px: 1.75,
                                      py: 0.5,
                                      fontSize: "0.9rem",
                                      fontWeight: "bold",
                                      color: `${item.textColor}`,
                                      borderRadius: "6px",
                                      bgcolor: `${item.bgColor}`,
                                    }}
                                  >
                                    {item.name.charAt(0).toUpperCase() +
                                      item.name.slice(1)}
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* description */}
                  <Box
                    sx={{
                      width: "100%",
                      minWidth: "360px",
                      display: "flex",
                      alignItems: "start",
                      flexDirection: "column",
                      pt: 0.75,
                    }}
                  >
                    {/* label of description */}
                    <Box
                      sx={{
                        fontWeight: "bold",
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_D7D7D7
                            : theme.trelloCustom.COLOR_313131,
                      }}
                    >
                      Description
                    </Box>

                    {/* text area */}
                    <Box
                      sx={{
                        width: "100%",
                        pt: 1.5,
                      }}
                    >
                      {/* button to display the field */}
                      {!isOpenDescriptionFieldCard && (
                        <Box
                          onClick={() => {
                            checkIsOpenMenuStatusThenClose();
                            checkIsOpenMenuPriorityThenClose();

                            toggleOpenDescriptionFieldCard();
                          }}
                          style={{
                            overflowX:
                              descriptionCardToDisplay == "<p><br></p>"
                                ? "none"
                                : "scroll",
                          }}
                          sx={{
                            cursor: "pointer",
                            width: "100%",
                            height:
                              descriptionCardToDisplay == "<p><br></p>"
                                ? "80px"
                                : "200px",
                            py: 1,
                            px: 1.75,
                            border: "2px solid",
                            borderRadius: "6px",
                            borderColor: (theme) =>
                              theme.trelloCustom.COLOR_C0C0C0,
                            "&:hover": {
                              bgcolor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? theme.trelloCustom.COLOR_281E38
                                  : theme.trelloCustom.COLOR_ECECEC,
                            },
                          }}
                        >
                          <Box>
                            {descriptionCardToDisplay != "<p><br></p>" ? (
                              listSubstringDescription.map((substring, index) =>
                                substring.isEnterDownLine ? (
                                  <span key={index}>
                                    <br />
                                  </span>
                                ) : substring.hasURL ? (
                                  <Typography
                                    display="inline"
                                    key={index}
                                    sx={{
                                      borderRadius: "6px",
                                      py: 1,
                                      px: 0.5,
                                      fontWeight: substring.isBoldOrStrong
                                        ? "bold"
                                        : "normal",
                                      textDecoration: substring.isUnderline
                                        ? "underline"
                                        : "none",
                                      fontStyle: substring.isItalic
                                        ? "italic"
                                        : "normal",
                                      fontSize: "1rem",
                                      bgcolor: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_281E38
                                          : theme.trelloCustom.COLOR_EAC9F5,
                                      color: (theme) =>
                                        theme.trelloCustom.COLOR_C200D3,
                                      "&:hover": {
                                        color: "white",
                                        bgcolor: (theme) =>
                                          theme.palette.mode === "dark"
                                            ? theme.trelloCustom.COLOR_51247C
                                            : theme.trelloCustom.COLOR_9357CF,
                                      },
                                    }}
                                  >
                                    <Tooltip
                                      placement="top"
                                      title={`URL: ${substring.urlLink}`}
                                    >
                                      <span>{substring.text}</span>
                                    </Tooltip>
                                  </Typography>
                                ) : (
                                  <Typography
                                    display="inline"
                                    key={index}
                                    style={{
                                      fontWeight: substring.isBoldOrStrong
                                        ? "bold"
                                        : "normal",
                                      textDecoration: substring.isUnderline
                                        ? "underline"
                                        : "none",
                                      fontStyle: substring.isItalic
                                        ? "italic"
                                        : "normal",
                                      fontSize: substring.isHeadingOne
                                        ? "2rem"
                                        : substring.isHeadingTwo
                                        ? "1.5rem"
                                        : substring.isHeadingThree
                                        ? "1.17rem"
                                        : "1rem",
                                    }}
                                  >
                                    {substring.text}{" "}
                                  </Typography>
                                )
                              )
                            ) : (
                              <Typography
                                variant="span"
                                sx={{
                                  fontSize: "1rem",
                                  color: (theme) =>
                                    theme.trelloCustom.COLOR_818181,
                                }}
                              >
                                Add description here
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )}

                      {/* text area with modules */}
                      {isOpenDescriptionFieldCard && (
                        <RichTextEditor
                          toggleOpenDescriptionFieldCard={
                            toggleOpenDescriptionFieldCard
                          }
                          descriptionCardToDisplay={descriptionCardToDisplay}
                          inputDescriptionCard={inputDescriptionCard}
                          handleChangesDescriptionCard={
                            handleChangesDescriptionCard
                          }
                        />
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* left side */}
                <Box
                  sx={{
                    flex: 1.25,
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "center",
                    gap: 1.5,
                  }}
                >
                  {/* show/invite members of card */}
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Box
                      onClick={() => {}}
                      sx={{
                        cursor: "pointer",
                        position: "relative",
                        width: "100%",
                        height: "2.5em",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        pl: 2,
                        pr: 0.25,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: "4px",
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_D7D7D7
                            : theme.trelloCustom.COLOR_313131,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_281E38
                            : theme.trelloCustom.COLOR_E6E6E6,
                        "&:hover": {
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.trelloCustom.COLOR_463666
                              : theme.trelloCustom.COLOR_D7D7D7,
                        },
                      }}
                    >
                      Assignee
                      {/* icon */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "40px",
                          height: "40px",
                          borderRadius: "20px",
                          "&:hover": {
                            bgcolor: "#ffffff14",
                          },
                        }}
                      >
                        <PeopleIcon />
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        width: "0",
                      }}
                    ></Box>
                  </Box>

                  {/* pick a alarm/reminder date for card */}
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    {/* due date btn */}
                    <Box
                      onClick={() => handleOpenDateTimePicker()}
                      sx={{
                        cursor: "pointer",
                        position: "relative",
                        height: "2.5em",
                        width: "100%",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        pl: 2,
                        pr: 0.25,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: "4px",
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_D7D7D7
                            : theme.trelloCustom.COLOR_313131,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_281E38
                            : theme.trelloCustom.COLOR_E6E6E6,
                        "&:hover": {
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.trelloCustom.COLOR_463666
                              : theme.trelloCustom.COLOR_D7D7D7,
                        },
                      }}
                    >
                      Due date
                      {/* icon */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "40px",
                          height: "40px",
                          borderRadius: "20px",
                          "&:hover": {
                            bgcolor: "#ffffff14",
                          },
                        }}
                      >
                        <CalendarMonthIcon />
                      </Box>
                    </Box>

                    {/* pick date & time */}
                    <Box
                      sx={{
                        position: "relative",
                        width: "0",
                      }}
                    >
                      {isOpenDateTimePicker && (
                        <Box
                          sx={{
                            // left: "-580px",
                            left: "20px",
                            position: "absolute",
                            width: "360px",
                            gap: 1.5,
                            display: "flex",
                            flexDirection: "column",
                            px: 2,
                            pt: 2.5,
                            pb: 1.5,
                            borderRadius: "8px",
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_13091B
                                : theme.trelloCustom.COLOR_F8F8F8,
                            boxShadow: (theme) =>
                              theme.palette.mode === "dark"
                                ? `0px 2px 10px ${theme.trelloCustom.COLOR_411A61}`
                                : `0px 2px 10px ${theme.trelloCustom.COLOR_DDDDDD}`,
                          }}
                        >
                          {/* banner for representing OVERDUE or COMING */}
                          {isOverdueDeadline != null && (
                            <Box
                              sx={{
                                mb: 0.75,
                                height: "35px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "2px",

                                fontWeight: "bold",
                                color: (theme) =>
                                  isOverdueDeadline
                                    ? theme.trelloCustom.COLOR_DF0606
                                    : theme.trelloCustom.COLOR_268FB0,
                                bgcolor: (theme) =>
                                  isOverdueDeadline
                                    ? theme.trelloCustom.COLOR_FF9D9D
                                    : theme.trelloCustom.COLOR_D9F4F8,
                              }}
                            >
                              {isOverdueDeadline ? "OVERDUE" : "COMING"}
                            </Box>
                          )}

                          {/* date ̃& time picker */}
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 2,
                                height: "40px",
                              }}
                            >
                              {/* date picker */}
                              <Box onClick={() => handleOpenDatePicker()}>
                                <DatePicker
                                  label={"Choose date"}
                                  views={["year", "month", "day"]}
                                  format="DD-MM-YYYY"
                                  value={valueDatePickerDayJS}
                                  onChange={(date) =>
                                    handleChangeDatePicker(date)
                                  }
                                  slotProps={{
                                    textField: {
                                      size: "small",
                                    },
                                  }}
                                  sx={{
                                    height: "100%",
                                    borderRadius: "4px",
                                    bgcolor: (theme) =>
                                      theme.palette.mode === "dark"
                                        ? theme.trelloCustom.COLOR_463666
                                        : theme.trelloCustom.COLOR_EEEEEE,
                                    "&:hover": {
                                      bgcolor: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_281E38
                                          : theme.trelloCustom.COLOR_E6E6E6,
                                    },
                                    "& .MuiOutlinedInput-input": {
                                      pl: 2,
                                    },
                                    "& .MuiInputLabel-root": {
                                      "&.MuiInputLabel-root": {
                                        mb: 1,
                                        pl: 0.25,
                                        fontWeight: "bold",
                                        fontSize: "1rem",
                                        color: (theme) =>
                                          theme.palette.mode === "dark"
                                            ? theme.trelloCustom.COLOR_D7D7D7
                                            : "black",
                                      },
                                    },
                                    "& .MuiOutlinedInput-root": {
                                      border: "none",
                                      borderColor: "transparent",
                                      fontSize: "1rem",
                                      color: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_D7D7D7
                                          : "black",
                                      "&.MuiOutlinedInput-notchedOutline": {
                                        border: "none",
                                        borderColor: "transparent",
                                      },
                                    },

                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                      {
                                        borderColor: "transparent",
                                      },

                                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                        borderColor: "transparent",
                                      },
                                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "none",
                                        borderColor: "transparent",
                                      },
                                  }}
                                />
                              </Box>

                              {/* timer picker */}
                              <TimePicker
                                label="Choose timer"
                                value={valueTimePickerDayJS}
                                onChange={(newValue) =>
                                  handleChangeTimePicker(newValue)
                                }
                                slotProps={{
                                  textField: {
                                    size: "small",
                                  },
                                }}
                                sx={{
                                  height: "100%",
                                  borderRadius: "4px",
                                  "& .MuiOutlinedInput-input": {
                                    pl: 2,
                                  },
                                  bgcolor: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? theme.trelloCustom.COLOR_463666
                                      : theme.trelloCustom.COLOR_EEEEEE,
                                  "&:hover": {
                                    bgcolor: (theme) =>
                                      theme.palette.mode === "dark"
                                        ? theme.trelloCustom.COLOR_281E38
                                        : theme.trelloCustom.COLOR_E6E6E6,
                                  },
                                  "& .MuiInputLabel-root": {
                                    "&.MuiInputLabel-root": {
                                      pl: 0.25,
                                      fontWeight: "bold",
                                      fontSize: "1rem",
                                      color: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_D7D7D7
                                          : "black",
                                    },
                                  },
                                  "& .MuiOutlinedInput-root": {
                                    border: "none",
                                    borderColor: "transparent",
                                    fontSize: "1rem",
                                    color: (theme) =>
                                      theme.palette.mode === "dark"
                                        ? theme.trelloCustom.COLOR_D7D7D7
                                        : "black",
                                    "&.MuiOutlinedInput-notchedOutline": {
                                      border: "none",
                                      borderColor: "transparent",
                                    },
                                  },
                                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "transparent",
                                    },
                                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                    {
                                      border: "none",
                                      borderColor: "transparent",
                                    },
                                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      border: "none",
                                      borderColor: "transparent",
                                    },
                                }}
                              />
                            </Box>
                          </LocalizationProvider>

                          {/* remove and save btn */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 2,
                              height: "35px",
                            }}
                          >
                            {/* remove btn */}
                            <Box
                              onClick={() => handleRemoveDateAndTime()}
                              variant="contained"
                              size="medium"
                              sx={{
                                cursor: "pointer",
                                height: "100%",
                                width: "100%",
                                // width: "calc(150px - 50px)",
                                pl: 2.5,
                                pr: 2.5,
                                pt: 0.25,
                                pb: 0.25,
                                fontSize: "0.95rem",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "20px",
                                color: (theme) =>
                                  theme.trelloCustom.COLOR_49454E,
                                bgcolor: (theme) =>
                                  theme.trelloCustom.COLOR_D7D7D7,
                                boxShadow: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "none"
                                    : "0px 2px 10px #DDDDDD",
                                "&:hover": {
                                  color: (theme) =>
                                    theme.trelloCustom.COLOR_D7D7D7,
                                  bgcolor: (theme) =>
                                    theme.trelloCustom.COLOR_818181,
                                  boxShadow: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "none"
                                      : "0px 2px 10px #DDDDDD",
                                },
                              }}
                            >
                              Remove
                            </Box>

                            {/* save btn */}
                            <Box
                              onClick={() => handleSaveDateAndTime()}
                              variant="contained"
                              size="medium"
                              sx={{
                                cursor: "pointer",
                                height: "100%",
                                width: "100%",
                                // width: "calc(150px - 50px)",
                                pl: 2.5,
                                pr: 2.5,
                                pt: 0.25,
                                pb: 0.25,
                                fontSize: "0.95rem",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "20px",
                                color: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? theme.trelloCustom.COLOR_7115BA
                                    : theme.trelloCustom.COLOR_7115BA,
                                bgcolor: (theme) =>
                                  theme.trelloCustom.COLOR_C985FF,
                                borderColor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "#555555"
                                    : "#1b71a7",
                                boxShadow: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "none"
                                    : "0px 2px 10px #C78FFF",
                                "&:hover": {
                                  color: "white",
                                  bgcolor: (theme) =>
                                    theme.trelloCustom.COLOR_8C25DE,
                                  boxShadow: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "none"
                                      : "0px 2px 10px #C78FFF",
                                },
                              }}
                            >
                              Save
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
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

export default Board;
