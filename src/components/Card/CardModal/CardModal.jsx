import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

// import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

// date time picker
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

// description/text editor
import RichTextEditor from "../RichTextEditor";

// css
import "../../../assets/css/Card/Dropdown.css";

const CardModal = ({ card, modifyCardDetails, onCloseModalCard }) => {
  // ============================================================================
  const [originalCard, setOriginalCard] = useState({ ...card });
  const [selectedCard, setSelectedCard] = useState({ ...card });
  const [changes, setChanges] = useState({});

  useEffect(() => {
    setOriginalCard({ ...card });
    setSelectedCard({ ...card });
    setChanges({});
  }, [card]);

  const [isModifyingCard, setIsModifyingCard] = useState(false);

  // ============================================================================
  // save and cancel
  const handleSaveCardChanges = async () => {
    try {
      // const response = await axios.put(`your-api-url/cards/${card._id}`, selectedCard);
      // onUpdate(response.data);
      onCloseModalCard();
      modifyCardDetails(selectedCard);
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const handleCancelModifying = () => {
    setIsModifyingCard(false);
    onCloseModalCard();
  };

  const getChangedProperties = () => {
    const changesToSave = {};
    for (const key in changes) {
      if (changes[key]) {
        changesToSave[key] = selectedCard[key];
      }
    }
    return changesToSave;
  };

  // ============================================================================
  // title
  const titleRef = useRef(null);

  const handleChangeTitle = (e) => {
    const newTitleValue = e.target.value;

    setSelectedCard((prev) => ({
      ...prev,
      title: newTitleValue,
    }));

    setChanges((prev) => ({
      ...prev,
      title: newTitleValue !== originalCard.title,
    }));

    if (Object.keys(getChangedProperties()).length === 0) {
      setIsModifyingCard(true);
    }
  };

  const handleEnterTitle = (e) => {
    handleUnfocus();
    handleChangeTitle(e);
  };

  const handleUnfocus = () => {
    if (titleRef.current) {
      const inputElement = titleRef.current.querySelector("input");
      if (inputElement) {
        inputElement.blur();
      }
    }
  };

  // ============================================================================
  // lastest updated time
  console.log(
    "selectedCard.updatedAt ",
    selectedCard.updatedAt == null
      ? selectedCard.createdAt
      : selectedCard.updatedAt
  );

  const stringUpdatedTime = new Date(
    selectedCard.updatedAt == null
      ? selectedCard.createdAt
      : selectedCard.updatedAt
  );
  const updatedTimeFormatString = `${stringUpdatedTime.getUTCDate()}.${
    stringUpdatedTime.getUTCMonth() + 1
  }.${stringUpdatedTime.getUTCFullYear()}`;

  //  ============================================================================
  // status & priority
  const statusLabelData = [
    {
      name: "not yet",
      textColor: "#818181",
      bgColor: "#E6E6E6",
    },
    {
      name: "At risk",
      textColor: "#DF0606",
      bgColor: "#FF9D9D",
    },
    {
      name: "Pending",
      textColor: "#989212",
      bgColor: "#FFEB4F",
    },
    {
      name: "On track",
      textColor: "#188544",
      bgColor: "#CDF4DD",
    },
  ];

  const priorityLabelData = [
    {
      name: "not yet",
      textColor: "#818181",
      bgColor: "#E6E6E6",
    },
    {
      name: "High",
      textColor: "#6F09AE",
      bgColor: "#CE85FB",
    },
    {
      name: "Medium",
      textColor: "#E3590B",
      bgColor: "#FFBA92",
    },
    {
      name: "Low",
      textColor: "#268FB0",
      bgColor: "#D9F4F8",
    },
  ];

  // ============================================================================
  // status
  const [isHoveredStatus, setIsHoveredStatus] = useState(false);

  const handleHoverStatus = () => {
    setIsHoveredStatus(true);
  };

  const handleMouseLeaveStatus = () => {
    setIsHoveredStatus(false);
  };

  //
  const [isOpenMenuStatus, setIsOpenMenuStatus] = useState(false);

  const selectedStatusLabel =
    selectedCard.status == ""
      ? statusLabelData[0]
      : statusLabelData.find(
          (status) =>
            status.name.toLowerCase() === selectedCard.status.toLowerCase()
        );

  const [selectedStatusToDisplay, setSelectedStatusToDisplay] = useState(
    selectedStatusLabel != undefined
      ? selectedStatusLabel.name
      : statusLabelData[0].name
  );
  const [statusTextColorToDisplay, setStatusTextColorToDisplay] = useState(
    selectedStatusLabel != undefined
      ? selectedStatusLabel.textColor
      : statusLabelData[0].textColor
  );
  const [statusBgColorToDisplay, setStatusBgColorToDisplay] = useState(
    selectedStatusLabel != undefined
      ? selectedStatusLabel.bgColor
      : statusLabelData[0].bgColor
  );

  const toggleDropdownMenuStatus = () => {
    checkIsOpenMenuPriorityThenClose();
    checkIsOpenDateTimePickerThenClose();
    checkIsOpenAssigneeThenClose();

    setIsOpenMenuStatus(!isOpenMenuStatus);
  };

  const handleChangeStatus = (name, textColor, bgColor) => {
    setSelectedStatusToDisplay(name);
    setStatusTextColorToDisplay(textColor);
    setStatusBgColorToDisplay(bgColor);

    setSelectedCard({
      ...selectedCard,
      status: name != "not yet" ? name : "",
      statusTextColor: textColor,
      statusBgColor: bgColor,
    });

    setIsOpenMenuStatus(false);

    if (Object.keys(getChangedProperties()).length === 0) {
      setIsModifyingCard(true);
    }
  };

  const checkIsOpenMenuStatusThenClose = () => {
    if (isOpenMenuStatus) {
      toggleDropdownMenuStatus();
    }
  };

  // ============================================================================
  // priority

  const [isHoveredPriority, setIsHoveredPriority] = useState(false);

  const handleHoverPriority = () => {
    setIsHoveredPriority(true);
  };

  const handleMouseLeavePriority = () => {
    setIsHoveredPriority(false);
  };

  //
  const [isOpenMenuPriority, setIsOpenMenuPriority] = useState(false);

  const selectedPriorityLabel =
    selectedCard.priority == ""
      ? priorityLabelData[0]
      : priorityLabelData.find(
          (priority) =>
            priority.name.toLowerCase() === selectedCard.priority.toLowerCase()
        );

  const [selectedPriorityToDisplay, setSelectedPriorityToDisplay] = useState(
    selectedPriorityLabel != undefined
      ? selectedPriorityLabel.name
      : priorityLabelData[0].name
  );
  const [priorityTextColorToDisplay, setPriorityTextColorToDisplay] = useState(
    selectedPriorityLabel != undefined
      ? selectedPriorityLabel.textColor
      : priorityLabelData[0].textColor
  );
  const [priorityBgColorToDisplay, setPriorityBgColorToDisplay] = useState(
    selectedPriorityLabel != undefined
      ? selectedPriorityLabel.bgColor
      : priorityLabelData[0].bgColor
  );

  const toggleDropdownMenuPriority = () => {
    checkIsOpenMenuStatusThenClose();
    checkIsOpenDateTimePickerThenClose();
    checkIsOpenAssigneeThenClose();

    setIsOpenMenuPriority(!isOpenMenuPriority);
  };

  const handleChangePriority = (name, textColor, bgColor) => {
    setSelectedPriorityToDisplay(name);
    setPriorityTextColorToDisplay(textColor);
    setPriorityBgColorToDisplay(bgColor);

    setSelectedCard({
      ...selectedCard,
      priority: name != "not yet" ? name : "",
      priorityTextColor: textColor,
      priorityBgColor: bgColor,
    });

    setIsOpenMenuPriority(false);

    if (Object.keys(getChangedProperties()).length === 0) {
      setIsModifyingCard(true);
    }
  };

  const checkIsOpenMenuPriorityThenClose = () => {
    if (isOpenMenuPriority) {
      toggleDropdownMenuPriority();
    }
  };

  // ============================================================================
  // description
  //
  const [isHoveredDescriptionField, setIsHoveredDescriptionField] =
    useState(false);

  const handleEnterDescriptionField = () => {
    setIsHoveredDescriptionField(true);
  };

  const handleLeaveDescriptionField = () => {
    setIsHoveredDescriptionField(false);
  };

  //
  const [isOpenDescriptionFieldCard, setIsOpenDescriptionFieldCard] =
    useState(false);
  const [descriptionCardToDisplay, setDescriptionCardToDisplay] = useState(
    selectedCard.description
  );
  const [inputDescriptionCard, setInputDescriptionCard] = useState(
    selectedCard.description
  );

  //
  const toggleOpenDescriptionFieldCard = () => {
    setIsOpenDescriptionFieldCard(!isOpenDescriptionFieldCard);
  };

  // const checkIsOpenDescriptionFieldCardThenClose = () => {
  //   if (isOpenDescriptionFieldCard) {
  //     toggleOpenDescriptionFieldCard();
  //   }
  // };

  //
  const handleChangesDescriptionCard = (newDescription) => {
    if (
      // newDescription == "<p><br></p>" ||
      // newDescription == "<h1><br></h1>" ||
      // newDescription == "<h2><br></h2>" ||
      // newDescription == "<h3><br></h3>" ||
      // newDescription == ""

      !checkDescriptionData(newDescription)
    ) {
      setInputDescriptionCard("");
      setDescriptionCardToDisplay("");
      setSelectedCard({ ...selectedCard, description: "" });
    } else {
      setInputDescriptionCard(newDescription);
      setDescriptionCardToDisplay(newDescription);
      setSelectedCard({ ...selectedCard, description: newDescription });
    }

    if (Object.keys(getChangedProperties()).length === 0) {
      setIsModifyingCard(true);
    }
  };

  const checkDescriptionData = (description) => {
    return (
      description != "<p><br></p>" &&
      description != "<h1><br></h1>" &&
      description != "<h2><br></h2>" &&
      description != "<h3><br></h3>" &&
      description != ""
    );
  };

  // ============================================================================
  // date & time
  const [isOpenDateTimePicker, setIsOpenDateTimePicker] = useState(false);

  const dateValue = selectedCard.deadlineAt.split(" ")[0].split("-");
  const [isOverdueDeadline, setIsOverdueDeadline] = useState(
    selectedCard.deadlineAt == ""
      ? null
      : new Date().getTime() >=
          new Date(dateValue[0], dateValue[1] - 1, dateValue[2]).getTime()
  );

  const [valueDatePickerDayJS, setValueDatePickerDayJS] = useState(
    selectedCard.deadlineAt == "" ? null : dayjs(selectedCard.deadlineAt)
  );
  const [valueTimePickerDayJS, setValueTimePickerDayJS] = useState(
    selectedCard.deadlineAt == "" ? null : dayjs(selectedCard.deadlineAt)
  );

  const [valueDatePicker, setValueDatePicker] = useState("");
  const [valueTimePicker, setValueTimePicker] = useState("");

  //
  const checkOtherOpenExceptDateTimePicker = () => {
    checkIsOpenMenuStatusThenClose();
    checkIsOpenMenuPriorityThenClose();
    checkIsOpenAssigneeThenClose();
  };

  const checkIsOpenDateTimePickerThenClose = () => {
    if (isOpenDateTimePicker) {
      handleCloseDateTimePicker();
    }
  };

  //
  const handleOpenDateTimePicker = () => {
    checkOtherOpenExceptDateTimePicker();
    setIsOpenDateTimePicker(!isOpenDateTimePicker);
  };

  const handleCloseDateTimePicker = () => {
    setIsOpenDateTimePicker(false);
  };

  //
  const handleOpenDatePicker = () => {
    checkOtherOpenExceptDateTimePicker();
  };

  const handleChangeDatePicker = (date) => {
    setValueDatePicker(
      `${date.format("YYYY")}-${date.format("MM")}-${date.format("DD")}`
    );
    setIsOverdueDeadline(null);
  };

  //
  const handleChangeTimePicker = (time) => {
    setValueTimePicker(`${time.format("HH")}:${time.format("mm")}`);
    setIsOverdueDeadline(null);
  };

  //
  const handleSaveDateAndTime = () => {
    if (valueTimePicker && valueDatePicker) {
      const newDateTimeValue = `${valueDatePicker} ${valueTimePicker}`;
      const splitedDate = valueDatePicker.split("-");

      setValueDatePickerDayJS(dayjs(new Date(newDateTimeValue)));
      setValueTimePickerDayJS(dayjs(new Date(newDateTimeValue)));

      setSelectedCard((prev) => ({
        ...prev,
        deadlineAt: newDateTimeValue,
      }));

      setIsOverdueDeadline(
        newDateTimeValue == ""
          ? null
          : new Date().getTime() >=
              new Date(
                splitedDate[0],
                splitedDate[1] - 1,
                splitedDate[2]
              ).getTime()
      );

      if (Object.keys(getChangedProperties()).length === 0) {
        setIsModifyingCard(true);
      }

      handleCloseDateTimePicker();
    } else {
      toast.warning("You haven't chosen date or time yet!");
    }
  };

  const handleRemoveDateAndTime = () => {
    // if (originalCard.deadlineAt != "") {

    // let newDate = new Date();
    // let newDateString = newDate.toString();
    // let newDateStringDayJS = dayjs(newDateString);

    // let newStringValueDatePicker = `${newDateStringDayJS.format(
    //   "YYYY"
    // )}-${newDateStringDayJS.format("MM")}-${newDateStringDayJS.format("DD")}`;

    // let newStringValueTimePicker = `${newDateStringDayJS.format(
    //   "HH"
    // )}:${newDateStringDayJS.format("mm")}`;

    // setValueDatePickerDayJS(newDateStringDayJS);
    // setValueTimePickerDayJS(newDateStringDayJS);
    // setValueDatePicker(newStringValueDatePicker);
    // setValueTimePicker(newStringValueTimePicker);
    // setIsOverdueDeadline(null);

    setValueDatePickerDayJS(null);
    setValueTimePickerDayJS(null);
    setValueDatePicker(null);
    setValueTimePicker(null);
    setIsOverdueDeadline(null);

    setSelectedCard((prev) => ({
      ...prev,
      deadlineAt: "",
    }));

    if (Object.keys(getChangedProperties()).length === 0) {
      setIsModifyingCard(true);
    }
    // }

    handleCloseDateTimePicker();
  };

  // ============================================================================
  // member
  //
  const [isHoveredUserCardArea, setIsHoveredUserCardArea] = useState(null);
  const [isHoveredUserBoardArea, setIsHoveredUserBoardArea] = useState(null);

  const handleEnterUserCardArea = (user) => {
    setIsHoveredUserCardArea(user._id);
  };

  const handleLeaveUserCardArea = () => {
    setIsHoveredUserCardArea(null);
  };

  const handleEnterUserBoardArea = (user) => {
    setIsHoveredUserBoardArea(user._id);
  };

  const handleLeaveUserBoardArea = () => {
    setIsHoveredUserBoardArea(null);
  };

  //
  const [isOpenAssignee, setIsOpenAssignee] = useState(false);

  //
  const checkOtherOpenExceptAssignee = () => {
    checkIsOpenMenuStatusThenClose();
    checkIsOpenMenuPriorityThenClose();
    checkIsOpenDateTimePickerThenClose();
  };

  //
  const handleOpenAssignee = () => {
    checkOtherOpenExceptAssignee();

    setIsOpenAssignee(true);
  };

  const handleCloseAssignee = () => {
    setIsOpenAssignee(false);
  };

  const checkIsOpenAssigneeThenClose = () => {
    if (isOpenAssignee) {
      handleCloseAssignee();
    }
  };

  // //
  // const handleChangeAssignee = (time) => {
  //   setValueTimePicker(`${time.format("HH")}:${time.format("mm")}`);
  //   setIsOverdueDeadline(null);
  // };

  // //
  // const handleSaveAssignee = (newMemberList) => {
  //   setSelectedCard((prev) => ({
  //     ...prev,
  //     memberIds: newMemberList,
  //   }));

  //   if (Object.keys(getChangedProperties()).length === 0) {
  //     setIsModifyingCard(true);
  //   }

  //   handleCloseAssignee();
  // };

  //
  // add/remove member feature
  // const membersOfCard = [];
  const membersOfBoard = [
    {
      _id: "2345345456",
      name: "test 1",
      nameUser: "@test_1",
      cardInvited: false,
    },
    {
      _id: "782345348",
      name: "towo bala",
      nameUser: "@towo_bala",
      cardInvited: false,
    },
    {
      _id: "283534534",
      name: "mymy man nhy",
      nameUser: "@man_nhy",
      cardInvited: false,
    },
    {
      _id: "89234579345",
      name: "test 2",
      nameUser: "@test_2",
      cardInvited: false,
    },
    {
      _id: "873456456",
      name: "test 3",
      nameUser: "@test_3",
      cardInvited: false,
    },
    {
      _id: "q928759345",
      name: "test 4",
      nameUser: "@test_4",
      cardInvited: false,
    },
  ];

  // filteredMembers is the mixture between membersOfCard and membersOfBoard
  const [filteredMembers, setFilteredMembers] = useState(membersOfBoard);

  // handle member transfer between 2 lists via property cardInvited
  const handleTransferTheCard = (member) => {
    const updatedMember = {
      ...member,
      cardInvited: !member.cardInvited,
    };

    setFilteredMembers((prevFilteredMembers) =>
      prevFilteredMembers.map((member) =>
        member._id === updatedMember._id ? updatedMember : member
      )
    );
  };

  //
  // search feature
  const [searchQuery, setSearchQuery] = useState("");

  // Handle input change for the search field
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter members based on search query
  const newFilteredMembers = filteredMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============================================================================
  return (
    <Modal open={true}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: (theme) => theme.trelloCustom.MODAL_CARD_WIDTH,
          pt: 2,
          pb: 3,
          pl: 3.5,
          pr: 5,

          outline: "none",
          borderRadius: "8px",
          boxShadow: 24,

          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.trelloCustom.COLOR_13091B
              : theme.trelloCustom.COLOR_F5F5F5,
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
            inputRef={(el) => {
              titleRef.current = el?.parentNode;
            }}
            value={selectedCard?.title}
            onChange={(ev) => handleChangeTitle(ev)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                handleEnterTitle(ev);
              }
            }}
            type="text"
            variant="outlined"
            sx={{
              flex: 9,
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

          {/* save & cancel btn */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            {/* save btn */}
            {isModifyingCard && (
              <Box
                onClick={() => handleSaveCardChanges()}
                sx={{
                  flex: 1,
                  cursor: "pointer",
                  width: "76px",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 0.25,
                  px: 1.25,
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  color: (theme) => theme.trelloCustom.COLOR_7115BA,
                  bgcolor: (theme) => theme.trelloCustom.COLOR_C985FF,
                  "&:hover": {
                    color: "white",
                    bgcolor: (theme) => theme.trelloCustom.COLOR_8C25DE,
                  },
                }}
              >
                Save
              </Box>
            )}

            {/* cancel btn */}
            <Box
              onClick={() =>
                isModifyingCard
                  ? handleCancelModifying()
                  : handleCancelModifying()
              }
              sx={{
                flex: 1,
                cursor: "pointer",
                width: "76px",
                height: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 0.25,
                px: 1.25,
                fontSize: "0.9rem",
                fontWeight: "bold",
                borderRadius: "5px",
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
              {isModifyingCard ? "Cancel" : "Close"}
            </Box>
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
              {`Updated at ${updatedTimeFormatString}`}
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
                    borderRadius: "4px",
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
                    borderColor: (theme) => theme.trelloCustom.COLOR_818181,
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
                      <Box
                        onClick={toggleDropdownMenuStatus}
                        sx={{ cursor: "pointer" }}
                      >
                        <CloseIcon />
                      </Box>
                    </Box>

                    {statusLabelData.map((item, index) => (
                      <Box
                        key={index}
                        onClick={() =>
                          handleChangeStatus(
                            item.name,
                            item.textColor,
                            item.bgColor
                          )
                        }
                        className={`dropdown-item ${
                          selectedStatusToDisplay == item.name ? "selected" : ""
                        }`}
                        sx={{
                          // "&.selected": {
                          //   bgcolor: (theme) =>
                          //     theme.palette.mode == "dark"
                          //       ? "#232323"
                          //       : theme.trelloCustom.COLOR_C0C0C0,
                          // },
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
                            flex: 1,
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
                                selectedStatusToDisplay == item.name
                                  ? "black"
                                  : "transparent",
                              opacity:
                                selectedStatusToDisplay === item.name ? 1 : 0,
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
                    borderRadius: "4px",
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
                    borderColor: (theme) => theme.trelloCustom.COLOR_8A8A8A,
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
                      <Box
                        onClick={toggleDropdownMenuPriority}
                        sx={{ cursor: "pointer" }}
                      >
                        <CloseIcon />
                      </Box>
                    </Box>

                    {priorityLabelData.map((item, index) => (
                      <Box
                        key={index}
                        onClick={() =>
                          handleChangePriority(
                            item.name,
                            item.textColor,
                            item.bgColor
                          )
                        }
                        className={`dropdown-item ${
                          selectedPriorityToDisplay === item.name
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
                            flex: 1,
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
                                selectedPriorityToDisplay === item.name
                                  ? "black"
                                  : "transparent",
                              opacity:
                                selectedPriorityToDisplay === item.name ? 1 : 0,
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
                                borderRadius: "4px",
                                color: `${item.textColor}`,
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
              onMouseEnter={handleEnterDescriptionField}
              onMouseLeave={handleLeaveDescriptionField}
              sx={{
                mt: 0.75,
                width: "100%",
                minWidth: "360px",
                display: "flex",
                alignItems: "start",
                flexDirection: "column",
              }}
            >
              {/* label of description & edit btn */}
              <Box
                sx={{
                  width: "100%",
                  height: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
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

                {/* edit btn */}
                <Box
                  onClick={() => {
                    checkIsOpenMenuStatusThenClose();
                    checkIsOpenMenuPriorityThenClose();
                    checkIsOpenDateTimePickerThenClose();

                    toggleOpenDescriptionFieldCard();
                  }}
                  sx={{
                    cursor: "pointer",
                    width: "fit-content",
                    px: 1,
                    py: 0.25,
                    display: isHoveredDescriptionField
                      ? isOpenDescriptionFieldCard
                        ? "none"
                        : "flex"
                      : "none",
                    alignItems: "center",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    border: "2px solid",
                    borderRadius: "6px",
                    borderColor: (theme) => theme.trelloCustom.COLOR_8A8A8A,
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
                    style={{
                      overflowX:
                        descriptionCardToDisplay == "" ? "none" : "scroll",
                    }}
                    sx={{
                      cursor: "pointer",
                      width: "100%",
                      height: descriptionCardToDisplay == "" ? "80px" : "200px",
                      py: 1,
                      px: 1.75,
                      border: "2px solid",
                      borderRadius: "6px",
                      borderColor: (theme) => theme.trelloCustom.COLOR_C0C0C0,
                      "&:hover": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_281E38
                            : theme.trelloCustom.COLOR_ECECEC,
                      },
                    }}
                  >
                    {/* descriptionCardToDisplay != "<p><br></p>" &&
                        descriptionCardToDisplay != "<h1><br></h1>" &&
                        descriptionCardToDisplay != "<h2><br></h2>" &&
                        descriptionCardToDisplay != "<h3><br></h3>" &&
                        descriptionCardToDisplay != ""  */}
                    <Box>
                      {checkDescriptionData(descriptionCardToDisplay) ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: descriptionCardToDisplay,
                          }}
                        />
                      ) : (
                        <Typography
                          variant="span"
                          sx={{
                            fontSize: "1rem",
                            color: (theme) => theme.trelloCustom.COLOR_818181,
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
                    handleChangesDescriptionCard={handleChangesDescriptionCard}
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
              {/* active member btn */}
              <Box
                onClick={() => handleOpenAssignee()}
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

              {/* modal members */}
              <Box
                sx={{
                  position: "relative",
                  width: "0",
                }}
              >
                {isOpenAssignee && (
                  <Box
                    sx={{
                      zIndex: "9999",
                      // top: "-100px",
                      // left: "-380px",
                      left: "50px",
                      top: "-95px",
                      position: "absolute",
                      width: "280px",
                      gap: 1.25,
                      px: 2,
                      py: 1.5,
                      borderRadius: "8px",
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_13091B
                          : theme.trelloCustom.COLOR_F8F8F8,
                      boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                          ? `0px 2px 10px ${theme.trelloCustom.COLOR_411A61}`
                          : `0px 2px 10px ${theme.trelloCustom.COLOR_313131}`,
                    }}
                  >
                    {/* title & close btn */}
                    <Box
                      sx={{
                        mb: 1.5,
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* fake component */}
                      <Box sx={{ width: "30px" }}></Box>

                      {/* title */}
                      <Box sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                        Assignee
                      </Box>

                      {/* close btn */}
                      <Box
                        onClick={() => handleCloseAssignee()}
                        sx={{
                          height: "30px",
                          width: "30px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          // py: 0.5,
                          // px: 0.5,
                          borderRadius: "6px",
                          "&:hover": {
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_281E38
                                : theme.trelloCustom.COLOR_D7D7D7,
                          },
                        }}
                      >
                        <CloseIcon />
                      </Box>
                    </Box>

                    {/* input search + invite other member */}
                    <TextField
                      id="filled-search"
                      label="Search member"
                      variant="filled"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      InputProps={{
                        endAdornment: searchQuery && (
                          <IconButton onClick={() => setSearchQuery("")}>
                            <ClearIcon />
                          </IconButton>
                        ),
                      }}
                      sx={{
                        width: "100%",
                        mb: 1.5,
                        "& .MuiFormLabel-root": {
                          "&.MuiInputLabel-root": {
                            color: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_D7D7D7
                                : theme.trelloCustom.COLOR_313131,
                          },
                        },
                        "& .MuiInputBase-root": {
                          "&.MuiFilledInput-root::after": {
                            borderColor: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_D7D7D7
                                : theme.trelloCustom.COLOR_313131,
                          },
                        },
                      }}
                    />

                    <Box
                      sx={{
                        maxHeight: "300px",
                        overflow: "auto",
                      }}
                    >
                      {/* list members of card */}
                      {newFilteredMembers.filter((member) => member.cardInvited)
                        .length > 0 && (
                        <Box>
                          {/* title */}
                          <Box
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? theme.trelloCustom.COLOR_D7D7D7
                                  : theme.trelloCustom.COLOR_313131,
                              mb: 0.5,
                            }}
                          >
                            Members of card
                          </Box>

                          {/* list of members of card */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              justifyContent: "start",
                            }}
                          >
                            {newFilteredMembers
                              .filter((member) => member.cardInvited)
                              .map((user) => (
                                <Box
                                  key={user._id}
                                  onMouseEnter={() =>
                                    handleEnterUserCardArea(user)
                                  }
                                  onMouseLeave={() => handleLeaveUserCardArea()}
                                  sx={{
                                    width: "100%",
                                    height: "50px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    px: 1,
                                    mb: 1,
                                    borderRadius: "6px",

                                    "&:hover": {
                                      bgcolor: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_281E38
                                          : theme.trelloCustom.COLOR_E6E6E6,
                                    },
                                  }}
                                >
                                  {/* avatar & short name of user */}
                                  <Box
                                    sx={{
                                      width: "40px",
                                      height: "40px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderRadius: "50%",
                                      color: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_F8F8F8
                                          : theme.trelloCustom.COLOR_F8F8F8,
                                      bgcolor: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_C200D3
                                          : theme.trelloCustom.COLOR_C0C0C0,
                                    }}
                                  >
                                    {/* A */}
                                    {user.name.charAt(0).toUpperCase()}
                                  </Box>

                                  {/* name + username + button remove */}
                                  <Box
                                    sx={{
                                      width: `calc(100% - 40px)`,
                                      height: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    {/* name and username */}
                                    <Box
                                      sx={{
                                        px: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "start",
                                      }}
                                    >
                                      {/* name */}
                                      <Box
                                        sx={{
                                          fontSize: "1.05rem",
                                          color: (theme) =>
                                            theme.palette.mode === "dark"
                                              ? theme.trelloCustom.COLOR_D7D7D7
                                              : theme.trelloCustom.COLOR_313131,
                                        }}
                                      >
                                        {/* afgh assd */}
                                        {user.name}
                                      </Box>

                                      {/* @ name */}
                                      <Box
                                        sx={{
                                          fontSize: ".85rem",
                                          color: (theme) =>
                                            theme.palette.mode === "dark"
                                              ? theme.trelloCustom.COLOR_D7D7D7
                                              : theme.trelloCustom.COLOR_313131,
                                        }}
                                      >
                                        {/* @afgh_assd */}
                                        {user.nameUser}
                                      </Box>
                                    </Box>

                                    {/* button remove  */}
                                    {isHoveredUserCardArea === user._id && (
                                      <Tooltip title="Remove user from this card">
                                        <Box
                                          onClick={() =>
                                            handleTransferTheCard(user)
                                          }
                                          sx={{
                                            cursor: "pointer",
                                            px: 0.5,
                                            py: 0.5,
                                            mr: 0.5,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "50%",
                                            "&:hover": {
                                              bgcolor: (theme) =>
                                                theme.palette.mode === "dark"
                                                  ? theme.trelloCustom
                                                      .COLOR_463666
                                                  : theme.trelloCustom
                                                      .COLOR_C0C0C0,
                                            },
                                          }}
                                        >
                                          <RemoveCircleOutlineIcon />
                                        </Box>
                                      </Tooltip>
                                    )}
                                  </Box>
                                </Box>
                              ))}
                          </Box>
                        </Box>
                      )}

                      {/* list members of board */}
                      {newFilteredMembers.filter(
                        (member) => !member.cardInvited
                      ).length > 0 && (
                        <Box>
                          {/* title */}
                          <Box
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? theme.trelloCustom.COLOR_D7D7D7
                                  : theme.trelloCustom.COLOR_313131,
                              mb: 0.5,
                            }}
                          >
                            Members of board
                          </Box>

                          {/* list of members of board */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              justifyContent: "start",
                            }}
                          >
                            {newFilteredMembers
                              .filter((member) => !member.cardInvited)
                              .map((user) => (
                                <Box
                                  key={user._id}
                                  onMouseEnter={() =>
                                    handleEnterUserBoardArea(user)
                                  }
                                  onMouseLeave={() =>
                                    handleLeaveUserBoardArea()
                                  }
                                  sx={{
                                    width: "100%",
                                    height: "50px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    px: 1,
                                    mb: 1,
                                    borderRadius: "6px",

                                    "&:hover": {
                                      bgcolor: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_281E38
                                          : theme.trelloCustom.COLOR_E6E6E6,
                                    },
                                  }}
                                >
                                  {/* avatar & short name of user */}
                                  <Box
                                    sx={{
                                      width: "40px",
                                      height: "40px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderRadius: "50%",
                                      color: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_F8F8F8
                                          : theme.trelloCustom.COLOR_F8F8F8,
                                      bgcolor: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_C200D3
                                          : theme.trelloCustom.COLOR_C0C0C0,
                                    }}
                                  >
                                    {/* A */}
                                    {user.name.charAt(0).toUpperCase()}
                                  </Box>

                                  {/* name + username + button add */}
                                  <Box
                                    sx={{
                                      width: `calc(100% - 40px)`,
                                      height: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    {/* name and username */}
                                    <Box
                                      sx={{
                                        px: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "start",
                                      }}
                                    >
                                      {/* name */}
                                      <Box
                                        sx={{
                                          color: (theme) =>
                                            theme.palette.mode === "dark"
                                              ? theme.trelloCustom.COLOR_D7D7D7
                                              : theme.trelloCustom.COLOR_313131,
                                          fontSize: "1.05rem",
                                        }}
                                      >
                                        {/* afgh assd */}
                                        {user.name}
                                      </Box>

                                      {/* @ name */}
                                      <Box
                                        sx={{
                                          fontSize: ".85rem",
                                          color: (theme) =>
                                            theme.palette.mode === "dark"
                                              ? theme.trelloCustom.COLOR_D7D7D7
                                              : theme.trelloCustom.COLOR_313131,
                                        }}
                                      >
                                        {/* @afgh_assd */}
                                        {user.nameUser}
                                      </Box>
                                    </Box>

                                    {/* button add  */}
                                    {isHoveredUserBoardArea === user._id && (
                                      <Tooltip title="Add user into this card">
                                        <Box
                                          onClick={() =>
                                            handleTransferTheCard(user)
                                          }
                                          sx={{
                                            cursor: "pointer",
                                            px: 0.5,
                                            py: 0.5,
                                            mr: 0.5,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "50%",
                                            "&:hover": {
                                              bgcolor: (theme) =>
                                                theme.palette.mode === "dark"
                                                  ? theme.trelloCustom
                                                      .COLOR_463666
                                                  : theme.trelloCustom
                                                      .COLOR_C0C0C0,
                                            },
                                          }}
                                        >
                                          <AddIcon />
                                        </Box>
                                      </Tooltip>
                                    )}
                                  </Box>
                                </Box>
                              ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

            {/* pick a alarm/reminder date for card */}
            <Box
              sx={{
                display: "flex",
              }}
            >
              {/* active due date btn */}
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

              {/* modal pick date & time */}
              <Box
                sx={{
                  position: "relative",
                  width: "0",
                }}
              >
                {isOpenDateTimePicker && (
                  <Box
                    sx={{
                      // top: "100px",
                      // left: "-580px",
                      top: "-50px",
                      left: "50px",
                      position: "absolute",
                      width: "360px",
                      gap: 1.25,
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
                          : `0px 2px 10px ${theme.trelloCustom.COLOR_313131}`,
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
                          borderRadius: "6px",

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
                            onChange={(date) => handleChangeDatePicker(date)}
                            slotProps={{
                              textField: {
                                size: "small",
                              },
                            }}
                            sx={{
                              height: "100%",
                              borderRadius: "6px",
                              bgcolor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? theme.trelloCustom.COLOR_281E38
                                  : theme.trelloCustom.COLOR_EEEEEE,
                              "&:hover": {
                                bgcolor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? theme.trelloCustom.COLOR_463666
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
                            borderRadius: "6px",
                            "& .MuiOutlinedInput-input": {
                              pl: 2,
                            },
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_281E38
                                : theme.trelloCustom.COLOR_EEEEEE,
                            "&:hover": {
                              bgcolor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? theme.trelloCustom.COLOR_463666
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
                          borderRadius: "6px",
                          color: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.trelloCustom.COLOR_7115BA
                              : theme.trelloCustom.COLOR_7115BA,
                          bgcolor: (theme) => theme.trelloCustom.COLOR_C985FF,
                          borderColor: (theme) =>
                            theme.palette.mode === "dark"
                              ? "#555555"
                              : "#1b71a7",
                          "&:hover": {
                            borderRadius: "20px",
                            color: "white",
                            bgcolor: (theme) => theme.trelloCustom.COLOR_8C25DE,
                          },
                        }}
                      >
                        Save
                      </Box>

                      {/* remove btn */}
                      <Box
                        onClick={() => handleRemoveDateAndTime()}
                        variant="contained"
                        size="medium"
                        sx={{
                          cursor: "pointer",
                          height: "100%",
                          width: "100%",
                          pl: 2.5,
                          pr: 2.5,
                          pt: 0.25,
                          pb: 0.25,
                          fontSize: "0.95rem",
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "6px",
                          color: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.trelloCustom.COLOR_D7D7D7
                              : theme.trelloCustom.COLOR_313131,
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.trelloCustom.COLOR_463666
                              : theme.trelloCustom.COLOR_E6E6E6,
                          "&:hover": {
                            borderRadius: "20px",
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.trelloCustom.COLOR_281E38
                                : theme.trelloCustom.COLOR_D7D7D7,
                          },
                        }}
                      >
                        Remove
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
  );
};

export default CardModal;
