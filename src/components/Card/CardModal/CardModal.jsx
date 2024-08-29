import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { DateTime } from "luxon";

import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

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

import { useAuth } from "~/hooks/useAuth";
import socket from "~/utils/socket/socket";

// Function to check if the deadline is overdue
const checkIsOverdue = (deadlineAt) => {
  // Parse the deadlineAt string into a Luxon DateTime object with the given format and timezone
  const deadlineDate = DateTime.fromFormat(deadlineAt, "yyyy-MM-dd hh:mm", {
    zone: "Asia/Bangkok",
  });

  // Get the current date and time in the same timezone
  const now = DateTime.now().setZone("Asia/Bangkok");

  // Check if the current datetime is greater than the deadline
  return now > deadlineDate;
};

// // Function to check if current time is within the notification range before the deadline
// function isWithinNotificationRange(deadlineAt, notifyBefore, notifyUnit) {
//   // Parse the deadlineAt string to a DateTime object
//   const deadlineDateTime = DateTime.fromFormat(deadlineAt, "yyyy-MM-dd HH:mm", {
//     zone: "Asia/Bangkok",
//   });

//   // Get current time in the same time zone
//   const dateNow = DateTime.now().setZone("Asia/Bangkok");

//   // Normalize both dates to the start of the minute for comparison
//   const normalizedDateNow = dateNow.startOf("minute");
//   const normalizedDeadlineDateTime = deadlineDateTime.startOf("minute");

//   // Handle the special case where notifyBefore is 0 and notifyUnit is 'minute'
//   if (notifyBefore === 0 && notifyUnit === "minute") {
//     return normalizedDateNow.equals(normalizedDeadlineDateTime);
//   }

//   // Calculate the difference in minutes
//   const diffInMinutes = deadlineDateTime.diff(dateNow, "minutes").as("minutes");

//   // Determine the notification threshold based on notifyUnit
//   let notifyThreshold;
//   switch (notifyUnit) {
//     case "minute":
//       notifyThreshold = notifyBefore;
//       break;
//     case "hour":
//       notifyThreshold = notifyBefore * 60;
//       break;
//     case "day":
//       notifyThreshold = notifyBefore * 24 * 60;
//       break;
//     case "week":
//       notifyThreshold = notifyBefore * 7 * 24 * 60;
//       break;
//     default:
//       throw new Error(
//         'Unsupported notifyUnit. Use "minute", "hour", "day", or "week".'
//       );
//   }

//   // Return true if the current time is within the notification range before the deadline
//   return diffInMinutes <= notifyThreshold && diffInMinutes >= 0;
// }

// ============================================================================
const CardModal = ({
  onCloseModalCard,
  roleOfBoard,
  allMembersInBoard,
  card,
  modifyCardDetails,
  addMemberIntoCard,
  removeMemberFromCard,
}) => {
  // ============================================================================
  const { loggedInUser } = useAuth();
  // ============================================================================
  const [loading, setLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  // ============================================================================
  const [originalCard, setOriginalCard] = useState({ ...card });
  const [selectedCard, setSelectedCard] = useState({ ...card });
  // ============================================================================
  const [userIsMemberOfCard, setUserIsMemberOfCard] = useState(false);
  // ============================================================================

  // ============================================================================
  const loadData = () => {
    setLoading(true);

    setOriginalCard({ ...card });
    setSelectedCard({ ...card });

    const formattedMembersOfCard = card.members.map((member) => ({
      ...member,
      cardInvited: true,
    }));

    const formattedMembersOfBoard = allMembersInBoard.map((member) => ({
      userId: member.userId,
      username: member.userDetails.username,
      email: member.userDetails.email,
      cardInvited: false,
    }));

    const formattedMembersOfCardIds = new Set(
      formattedMembersOfCard.map((member) => member.userId)
    );

    const filteredFormattedMembersOfBoard = formattedMembersOfBoard.filter(
      (member) => !formattedMembersOfCardIds.has(member.userId)
    );

    setFilteredMembers(
      removeDuplicates([
        ...formattedMembersOfCard,
        ...filteredFormattedMembersOfBoard,
      ])
    );

    const isMemberOfCard = card.members.some(
      (member) => member.email === loggedInUser.email
    );
    setUserIsMemberOfCard(isMemberOfCard);

    setLoading(false);
  };

  function removeDuplicates(arr) {
    const seen = new Set();
    return arr.filter((item) => {
      if (!seen.has(item.userId)) {
        seen.add(item.userId);
        return true;
      }
      return false;
    });
  }

  useEffect(() => {
    if (loadedCount < 1) {
      loadData();
      setLoadedCount(loadedCount + 1);
    }
  }, [loadedCount]);

  // ============================================================================
  // socket
  useEffect(() => {
    if (card && loggedInUser) {
      // update-card
      socket.on("update-card", (actorId, modifiedCard) => {
        if (loggedInUser._id !== actorId) {
          // update UI of card
          setSelectedCard(modifiedCard);

          // status
          const selectedStatusLabel =
            modifiedCard.status == ""
              ? statusLabelData[0]
              : statusLabelData.find(
                  (status) =>
                    status.name.toLowerCase() ===
                    modifiedCard.status.toLowerCase()
                );
          setSelectedStatusToDisplay(
            selectedStatusLabel != undefined
              ? selectedStatusLabel.name
              : statusLabelData[0].name
          );
          setStatusTextColorToDisplay(
            selectedStatusLabel != undefined
              ? selectedStatusLabel.textColor
              : statusLabelData[0].textColor
          );
          setStatusBgColorToDisplay(
            selectedStatusLabel != undefined
              ? selectedStatusLabel.bgColor
              : statusLabelData[0].bgColor
          );

          // priority
          const selectedPriorityLabel =
            modifiedCard.priority == ""
              ? priorityLabelData[0]
              : priorityLabelData.find(
                  (priority) =>
                    priority.name.toLowerCase() ===
                    modifiedCard.priority.toLowerCase()
                );
          setSelectedPriorityToDisplay(
            selectedPriorityLabel != undefined
              ? selectedPriorityLabel.name
              : priorityLabelData[0].name
          );
          setPriorityTextColorToDisplay(
            selectedPriorityLabel != undefined
              ? selectedPriorityLabel.textColor
              : priorityLabelData[0].textColor
          );
          setPriorityBgColorToDisplay(
            selectedPriorityLabel != undefined
              ? selectedPriorityLabel.bgColor
              : priorityLabelData[0].bgColor
          );

          // description
          setDescriptionCardToDisplay(modifiedCard.description);
          setInputDescriptionCard(modifiedCard.description);

          // date & time
          setIsOverdueDeadline(checkIsOverdue(modifiedCard.deadlineAt));

          // const dateValue = modifiedCard.deadlineAt.split(" ")[0].split("-");
          // setIsOverdueDeadline(
          //   modifiedCard.deadlineAt == ""
          //     ? null
          //     : new Date().getTime() >=
          //         new Date(
          //           dateValue[0],
          //           dateValue[1] - 1,
          //           dateValue[2]
          //         ).getTime()
          // );
          setValueDatePickerDayJS(
            modifiedCard.deadlineAt == ""
              ? null
              : dayjs(modifiedCard.deadlineAt)
          );
          setValueTimePickerDayJS(
            modifiedCard.deadlineAt == ""
              ? null
              : dayjs(modifiedCard.deadlineAt)
          );
          setValueDatePicker("");
          setValueTimePicker("");
        }
      });

      // add-user-into-card
      socket.on("add-user-into-card", async (actorId, newFilterMembers) => {
        if (loggedInUser._id !== actorId) {
          setFilteredMembers(removeDuplicates(newFilterMembers));
        }

        card.members = removeDuplicates(newFilterMembers).filter(
          (member) => member.cardInvited
        );

        const isMemberOfCard = card.members.some(
          (member) => member.email === loggedInUser.email
        );
        setUserIsMemberOfCard(isMemberOfCard);

        // else {
        //   card.members = removeDuplicates(newFilterMembers).filter(
        //     (member) => member.cardInvited
        //   );

        //   const isMemberOfCard = card.members.some(
        //     (member) => member.email === loggedInUser.email
        //   );
        //   setUserIsMemberOfCard(isMemberOfCard);
        // }
      });

      // remove-user-from-card
      socket.on("remove-user-from-card", async (actorId, newFilterMembers) => {
        if (loggedInUser._id !== actorId) {
          setFilteredMembers(removeDuplicates(newFilterMembers));
        }

        card.members = removeDuplicates(newFilterMembers).filter(
          (member) => member.cardInvited
        );

        const isMemberOfCard = card.members.some(
          (member) => member.email === loggedInUser.email
        );
        setUserIsMemberOfCard(isMemberOfCard);

        // } else {
        //   card.members = removeDuplicates(newFilterMembers).filter(
        //     (member) => member.cardInvited
        //   );

        //   const isMemberOfCard = card.members.some(
        //     (member) => member.email === loggedInUser.email
        //   );
        //   setUserIsMemberOfCard(isMemberOfCard);
        // }
      });
    }
  }, [card, loggedInUser]);

  // ============================================================================
  const [isModifyingCard, setIsModifyingCard] = useState(false);

  // ============================================================================
  // save and cancel
  const handleSaveCardChanges = async () => {
    try {
      onCloseModalCard();
      modifyCardDetails(selectedCard);
    } catch (error) {
      toast.error("Error updating card:", error);
    }
  };

  const handleCancelModifying = () => {
    setIsModifyingCard(false);
    onCloseModalCard();
  };

  // ============================================================================
  // title
  const titleRef = useRef(null);

  const handleChangeTitle = (newTitle) => {
    const newTitleValue = newTitle;

    setSelectedCard((prev) => ({
      ...prev,
      title: newTitleValue,
    }));

    if (newTitleValue !== originalCard.title) {
      setIsModifyingCard(true);
    } else {
      if (
        newTitleValue == originalCard.title &&
        selectedCard.status == originalCard.status &&
        selectedCard.priority == originalCard.priority &&
        selectedCard.description == originalCard.description
        // selectedCard.dateTimeValue == originalCard.dateTimeValue
      ) {
        setIsModifyingCard(false);
      }
    }
  };

  const handleEnterTitle = (e) => {
    handleChangeTitle(e.target.value.trim());
  };

  const handleUnfocus = () => {
    if (titleRef.current) {
      const inputElement = titleRef.current.querySelector("input");
      if (inputElement) {
        inputElement.blur();

        if (selectedCard.title.trim().length < 3) {
          setSelectedCard((prev) => ({
            ...prev,
            title: originalCard.title,
          }));

          if (
            selectedCard.status == originalCard.status &&
            selectedCard.priority == originalCard.priority &&
            selectedCard.description == originalCard.description
            // selectedCard.dateTimeValue == originalCard.dateTimeValue
          ) {
            setIsModifyingCard(false);
          }

          toast.error("You should name card's title with more 2 letters.");

          return;
        }
      }
    }
  };

  // ============================================================================
  // lastest updated time
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
      textColor: "#646010",
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
    if (roleOfBoard != "member" || userIsMemberOfCard) {
      setIsHoveredStatus(true);
    }
  };

  const handleMouseLeaveStatus = () => {
    if (roleOfBoard != "member" || userIsMemberOfCard) {
      setIsHoveredStatus(false);
    }
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
    if (roleOfBoard != "member" || userIsMemberOfCard) {
      checkIsOpenMenuPriorityThenClose();
      checkIsOpenDateTimePickerThenClose();
      checkIsOpenAssigneeThenClose();

      setIsOpenMenuStatus(!isOpenMenuStatus);
    }
  };

  const handleChangeStatus = (nameStatus, textColor, bgColor) => {
    setSelectedStatusToDisplay(nameStatus);
    setStatusTextColorToDisplay(textColor);
    setStatusBgColorToDisplay(bgColor);

    setSelectedCard({
      ...selectedCard,
      status: nameStatus != "not yet" ? nameStatus : "",
      statusTextColor: textColor,
      statusBgColor: bgColor,
    });

    setIsOpenMenuStatus(false);

    if (nameStatus !== originalCard.status) {
      setIsModifyingCard(true);
    } else {
      if (
        selectedCard.title == originalCard.title &&
        nameStatus == originalCard.status &&
        selectedCard.priority == originalCard.priority &&
        selectedCard.description == originalCard.description
        // selectedCard.dateTimeValue == originalCard.dateTimeValue
      ) {
        setIsModifyingCard(false);
      }
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
    if (roleOfBoard != "member" || userIsMemberOfCard) {
      setIsHoveredPriority(true);
    }
  };

  const handleMouseLeavePriority = () => {
    if (roleOfBoard != "member" || userIsMemberOfCard) {
      setIsHoveredPriority(false);
    }
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
    if (roleOfBoard != "member" || userIsMemberOfCard) {
      checkIsOpenMenuStatusThenClose();
      checkIsOpenDateTimePickerThenClose();
      checkIsOpenAssigneeThenClose();

      setIsOpenMenuPriority(!isOpenMenuPriority);
    }
  };

  const handleChangePriority = (namePriority, textColor, bgColor) => {
    setSelectedPriorityToDisplay(namePriority);
    setPriorityTextColorToDisplay(textColor);
    setPriorityBgColorToDisplay(bgColor);

    setSelectedCard({
      ...selectedCard,
      priority: namePriority != "not yet" ? namePriority : "",
      priorityTextColor: textColor,
      priorityBgColor: bgColor,
    });

    setIsOpenMenuPriority(false);

    if (namePriority !== originalCard.priority) {
      setIsModifyingCard(true);
    } else {
      if (
        selectedCard.title == originalCard.title &&
        selectedCard.status == originalCard.status &&
        namePriority == originalCard.priority &&
        selectedCard.description == originalCard.description
        // selectedCard.dateTimeValue == originalCard.dateTimeValue
      ) {
        setIsModifyingCard(false);
      }
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
    if (roleOfBoard != "member" || userIsMemberOfCard) {
      setIsHoveredDescriptionField(true);
    }
  };

  const handleLeaveDescriptionField = () => {
    if (roleOfBoard != "member" || userIsMemberOfCard) {
      setIsHoveredDescriptionField(false);
    }
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

    if (newDescription !== originalCard.description) {
      setIsModifyingCard(true);
    } else {
      if (
        selectedCard.title == originalCard.title &&
        selectedCard.status == originalCard.status &&
        selectedCard.priority == originalCard.priority &&
        newDescription == originalCard.description
        // selectedCard.dateTimeValue == originalCard.dateTimeValue
      ) {
        setIsModifyingCard(false);
      }
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

  // const dateValue = selectedCard.deadlineAt.split(" ")[0].split("-");
  // const [isOverdueDeadline, setIsOverdueDeadline] = useState(
  //   selectedCard.deadlineAt == ""
  //     ? null
  //     : new Date().getTime() >=
  //         new Date(dateValue[0], dateValue[1] - 1, dateValue[2]).getTime()
  // );
  const [isOverdueDeadline, setIsOverdueDeadline] = useState(
    selectedCard.deadlineAt != ""
      ? checkIsOverdue(selectedCard.deadlineAt)
      : null
  );

  const [valueDatePickerDayJS, setValueDatePickerDayJS] = useState(
    selectedCard.deadlineAt == "" ? null : dayjs(selectedCard.deadlineAt)
  );
  const [valueTimePickerDayJS, setValueTimePickerDayJS] = useState(
    selectedCard.deadlineAt == "" ? null : dayjs(selectedCard.deadlineAt)
  );

  const [valueDatePicker, setValueDatePicker] = useState("");
  const [valueTimePicker, setValueTimePicker] = useState("");

  const [valueNotifyBefore, setValueNotifyBefore] = useState(
    selectedCard.notifyBefore
  );
  const [valueNotifyUnit, setValueNotifyUnit] = useState(
    selectedCard.notifyUnit
  );

  const handleChangeValueNotifyBefore = (event) => {
    setValueNotifyBefore(event.target.value);
  };

  const handleChangeValueNotifyUnit = (event) => {
    setValueNotifyUnit(event.target.value);
    setValueNotifyBefore(event.target.value !== "minute" ? 1 : 0);
  };

  // Generate options for notifyBefore based on notifyUnit
  const getNotifyBeforeOptions = () => {
    switch (valueNotifyUnit) {
      case "minute":
        return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
      case "hour":
        return Array.from({ length: 23 }, (_, i) => i + 1); // [1, 2, 3, ..., 23]
      case "day":
        return Array.from({ length: 6 }, (_, i) => i + 1); // [1, 2, 3, ..., 6]
      case "week":
        return Array.from({ length: 53 }, (_, i) => i + 1); // [1, 2, 3, ..., 53]
      default:
        return [];
    }
  };

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
  const checkChangesOfDateTime = () => {
    if (
      valueTimePicker ||
      valueDatePicker ||
      valueNotifyBefore != originalCard.notifyBefore ||
      valueNotifyUnit != originalCard.notifyUnit
    ) {
      return true;
    }
    return false;
  };

  //
  const checkIsShowButtonRemoveDateTime = () => {
    if (checkChangesOfDateTime() || selectedCard.deadlineAt) {
      return false;
    }
    return true;
  };

  //
  const checkIsShowButtonNotifyBeforeAndNotifyUnit = () => {
    if (
      // originalCard.deadlineAt ||
      selectedCard.deadlineAt ||
      (valueTimePicker && valueDatePicker)
    ) {
      return true;
    }
    return false;
  };

  //
  const handleSaveDateAndTime = () => {
    if (checkChangesOfDateTime()) {
      let newDateTimeValue = "";

      if (valueDatePicker && !valueTimePicker) {
        if (originalCard.deadlineAt.split(" ").length > 1) {
          //
          newDateTimeValue = `${valueDatePicker} ${
            originalCard.deadlineAt.split(" ")[1]
          }`;
        } else {
          newDateTimeValue = `${valueDatePicker} 00:00`;
        }

        // console.log(
        //   "🚀 ~ 11111111111111111 ~ newDateTimeValue:",
        //   newDateTimeValue
        // );

        setValueDatePickerDayJS(dayjs(new Date(newDateTimeValue)));
        setIsOverdueDeadline(checkIsOverdue(newDateTimeValue));

        setSelectedCard((prev) => ({
          ...prev,
          deadlineAt: newDateTimeValue,
          notifyBefore: valueNotifyBefore,
          notifyUnit: valueNotifyUnit,
        }));
      } else if (!valueDatePicker && valueTimePicker) {
        if (originalCard.deadlineAt != "") {
          newDateTimeValue = `${
            originalCard.deadlineAt.split(" ")[0]
          } ${valueTimePicker}`;

          // console.log("🚀 ~ 222222 newDateTimeValue:", newDateTimeValue);

          setValueDatePickerDayJS(dayjs(new Date(newDateTimeValue)));
          setIsOverdueDeadline(checkIsOverdue(newDateTimeValue));

          setSelectedCard((prev) => ({
            ...prev,
            deadlineAt: newDateTimeValue,
            notifyBefore: valueNotifyBefore,
            notifyUnit: valueNotifyUnit,
          }));
        } else {
          toast.warn("You must pick the date, too.", {
            position: "bottom-left",
          });
          return;
        }
      } else if (!valueDatePicker && !valueTimePicker) {
        // console.log("🚀 ~ 3333333333");

        setValueTimePickerDayJS(dayjs(originalCard.deadlineAt));
        setIsOverdueDeadline(checkIsOverdue(originalCard.deadlineAt));

        setSelectedCard((prev) => ({
          ...prev,
          deadlineAt: originalCard.deadlineAt,
          notifyBefore: valueNotifyBefore,
          notifyUnit: valueNotifyUnit,
        }));
      } else {
        newDateTimeValue = `${valueDatePicker} ${valueTimePicker}`;

        // console.log("🚀 ~ 4444444444 newDateTimeValue", newDateTimeValue);

        setValueDatePickerDayJS(dayjs(new Date(newDateTimeValue)));
        setValueTimePickerDayJS(dayjs(new Date(newDateTimeValue)));

        setIsOverdueDeadline(checkIsOverdue(newDateTimeValue));

        setSelectedCard((prev) => ({
          ...prev,
          deadlineAt: newDateTimeValue,
          notifyBefore: valueNotifyBefore,
          notifyUnit: valueNotifyUnit,
        }));
      }

      // console.log(
      //   "🚀 ~ file: CardModal.jsx:906 ~ setSelectedCard ~ newDateTimeValue:",
      //   newDateTimeValue
      // );

      if (
        newDateTimeValue !== originalCard.dateTimeValue ||
        valueNotifyBefore !== originalCard.notifyBefore ||
        valueNotifyUnit !== originalCard.notifyUnit
      ) {
        setIsModifyingCard(true);
      } else {
        if (
          selectedCard.title == originalCard.title &&
          selectedCard.status == originalCard.status &&
          selectedCard.priority == originalCard.priority &&
          selectedCard.description == originalCard.description &&
          newDateTimeValue == originalCard.dateTimeValue &&
          valueNotifyBefore == originalCard.notifyBefore &&
          valueNotifyUnit == originalCard.notifyUnit
        ) {
          setIsModifyingCard(false);
        }
      }

      handleCloseDateTimePicker();
    } else {
      toast.warning("You haven't chosen date or time yet!");
    }
  };

  const handleRemoveDateAndTime = () => {
    setIsOverdueDeadline(null);
    setValueDatePickerDayJS(null);
    setValueTimePickerDayJS(null);
    setValueDatePicker("");
    setValueTimePicker("");
    setValueNotifyBefore(0);
    setValueNotifyUnit("minute");

    const newDateTimeValue = "";

    setSelectedCard((prev) => ({
      ...prev,
      deadlineAt: newDateTimeValue,
    }));

    if (
      selectedCard.title == originalCard.title &&
      selectedCard.status == originalCard.status &&
      selectedCard.priority == originalCard.priority &&
      selectedCard.description == originalCard.description &&
      newDateTimeValue == originalCard.dateTimeValue
    ) {
      setIsModifyingCard(false);
    } else {
      setIsModifyingCard(true);
    }

    handleCloseDateTimePicker();
  };

  const handleCancelDateAndTime = () => {
    setValueDatePickerDayJS(
      originalCard.deadlineAt == "" ? null : dayjs(originalCard.deadlineAt)
    );
    setValueTimePickerDayJS(
      originalCard.deadlineAt == "" ? null : dayjs(originalCard.deadlineAt)
    );
    setValueDatePicker("");
    setValueTimePicker("");
    setValueNotifyBefore(originalCard.notifyBefore);
    setValueNotifyUnit(originalCard.notifyUnit);
    setIsOverdueDeadline(
      originalCard.deadlineAt == ""
        ? null
        : checkIsOverdue(originalCard.deadlineAt)
    );

    setSelectedCard((prev) => ({
      ...prev,
      deadlineAt: originalCard.deadlineAt,
      notifyBefore: originalCard.notifyBefore,
      notifyUnit: originalCard.notifyUnit,
    }));

    if (
      selectedCard.title == originalCard.title &&
      selectedCard.status == originalCard.status &&
      selectedCard.priority == originalCard.priority &&
      selectedCard.description == originalCard.description
    ) {
      setIsModifyingCard(false);
    } else {
      setIsModifyingCard(true);
    }
  };

  //
  const formatDateToDisplay = (dateString) => {
    // Split the input string into date and time parts
    const [datePart, timePart] = dateString.split(" ");

    // Create a Date object from the datePart
    const [year, month, day] = datePart.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    // Format the date into '13 Aug 2024'
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);

    // Return the result as an array
    return [formattedDate, timePart];
  };

  // ============================================================================
  // member
  //
  const [isHoveredUserCardArea, setIsHoveredUserCardArea] = useState(null);
  const [isHoveredUserBoardArea, setIsHoveredUserBoardArea] = useState(null);

  const handleEnterUserCardArea = (user) => {
    setIsHoveredUserCardArea(user.userId);
  };

  const handleLeaveUserCardArea = () => {
    setIsHoveredUserCardArea(null);
  };

  const handleEnterUserBoardArea = (user) => {
    setIsHoveredUserBoardArea(user.userId);
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

  //
  // add/remove member feature
  // filteredMembers is the mixture between membersOfCard and membersOfBoard
  const [filteredMembers, setFilteredMembers] = useState([]);

  // handle member transfer between 2 lists via property cardInvited
  const handleTransferTheCard = (member, type) => {
    const updatedMember = {
      ...member,
      cardInvited: !member.cardInvited,
    };

    const newFilteredMembers = filteredMembers.map((member) =>
      member.userId === updatedMember.userId ? updatedMember : member
    );

    setFilteredMembers(newFilteredMembers);

    const notification = {
      actorId: loggedInUser._id,
      impactResistantId: member.userId,
      objectId: card._id,
    };

    if (type === "add") {
      // add user into card
      addMemberIntoCard(card._id, card.columnId, member, notification);

      // notify to that user
      socket.emit(
        "add-user-into-card",
        card.boardId,
        loggedInUser._id,
        newFilteredMembers
      );
    } else if (type === "remove") {
      // remove user from card
      const indexToRemove = card.members.findIndex(
        (member) => member.userId === member.userId
      );

      removeMemberFromCard(
        card._id,
        card.columnId,
        indexToRemove,
        member,
        notification
      );

      // notify to that user
      socket.emit(
        "remove-user-from-card",
        card.boardId,
        loggedInUser._id,
        newFilteredMembers
      );
    }
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
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============================================================================
  // ============================================================================
  return (
    <Modal open={true}>
      <div>
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
          {loading ? (
            <Box
              sx={{
                width: "100%",
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                fontWeight: "bold",
              }}
            >
              <CircularProgress />
              Loading Card...
            </Box>
          ) : (
            <Box>
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
                {roleOfBoard != "member" || userIsMemberOfCard ? (
                  <TextField
                    inputRef={(el) => {
                      titleRef.current = el?.parentNode;
                    }}
                    value={selectedCard?.title}
                    onChange={(ev) => handleChangeTitle(ev.target.value)}
                    onBlur={(ev) => {
                      handleEnterTitle(ev);
                    }}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter") {
                        handleEnterTitle(ev);
                        handleUnfocus();
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
                ) : (
                  <Box
                    sx={{
                      cursor: "context-menu",
                      mt: "-15px",
                      px: 0,
                      pl: 1.5,
                      height: "20px",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      borderRadius: "6px",
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "white" : "black",
                      bgcolor: "transparent",
                    }}
                  >
                    {selectedCard?.title}
                  </Box>
                )}

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
                      cursor: "context-menu",
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
                    ml: 1.5,
                    mt: 1,
                    height: "2px",
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_49454E
                        : theme.trelloCustom.COLOR_D9D9D9,
                  }}
                ></Box>
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
                {/* left side */}
                <Box
                  sx={{
                    flex: 3,
                  }}
                >
                  {/* status */}
                  <Box
                    sx={{
                      height: "45px",
                      display: "flex",
                      alignItems: "center",
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
                          cursor:
                            roleOfBoard != "member" || userIsMemberOfCard
                              ? "pointer"
                              : "context-menu",
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
                                selectedStatusToDisplay == item.name
                                  ? "selected"
                                  : ""
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
                                      selectedStatusToDisplay === item.name
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
                      height: "45px",
                      display: "flex",
                      alignItems: "center",
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
                          cursor:
                            roleOfBoard != "member" || userIsMemberOfCard
                              ? "pointer"
                              : "context-menu",
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
                                      selectedPriorityToDisplay === item.name
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

                  {/* Due date */}
                  {selectedCard.deadlineAt != "" && (
                    <Box
                      sx={{
                        height: "45px",
                        display: "flex",
                        alignItems: "center",
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
                        Due date
                      </Box>

                      <Box
                        sx={{
                          flex: 5,
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                        }}
                      >
                        <Box>
                          {formatDateToDisplay(selectedCard.deadlineAt)[0]}
                        </Box>
                        <FiberManualRecordIcon
                          sx={{
                            "&.MuiSvgIcon-root": {
                              width: ".5em",
                            },
                          }}
                        />
                        <Box>
                          {formatDateToDisplay(selectedCard.deadlineAt)[1]}
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {/* description */}
                  <Box
                    onMouseEnter={handleEnterDescriptionField}
                    onMouseLeave={handleLeaveDescriptionField}
                    sx={{
                      mt: 1,
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
                              descriptionCardToDisplay == ""
                                ? "none"
                                : "scroll",
                          }}
                          sx={{
                            cursor:
                              roleOfBoard != "member" || userIsMemberOfCard
                                ? "pointer"
                                : "context-menu",
                            width: "100%",
                            height:
                              descriptionCardToDisplay == "" ? "80px" : "200px",
                            py: 1,
                            px: 1.75,
                            border: "2px solid",
                            borderRadius: "6px",
                            borderColor: (theme) =>
                              theme.trelloCustom.COLOR_C0C0C0,
                            "&:hover": {
                              bgcolor: (theme) =>
                                roleOfBoard != "member" || userIsMemberOfCard
                                  ? theme.palette.mode === "dark"
                                    ? theme.trelloCustom.COLOR_281E38
                                    : theme.trelloCustom.COLOR_ECECEC
                                  : "transparent",
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

                  {/* comment component */}
                  <Box></Box>
                </Box>

                {/* right side */}
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
                            // left: "-400px",
                            // top: 0,
                            //
                            left: "55px",
                            top: "-107px",
                            //
                            position: "absolute",
                            width: "350px",
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
                            {/* title */}
                            <Box
                              sx={{
                                pl: 1,
                                fontSize: "1.25rem",
                                fontWeight: "bold",
                              }}
                            >
                              Assignee
                            </Box>

                            {/* buttons component */}
                            {/* close btn */}
                            <Box
                              onClick={() => handleCloseAssignee()}
                              sx={{
                                // height: "30px",
                                // width: "30px",
                                // cursor: "pointer",
                                // display: "flex",
                                // alignItems: "center",
                                // justifyContent: "center",
                                // borderRadius: "6px",
                                // "&:hover": {
                                //   bgcolor: (theme) =>
                                //     theme.palette.mode === "dark"
                                //       ? theme.trelloCustom.COLOR_281E38
                                //       : theme.trelloCustom.COLOR_D7D7D7,
                                // },

                                cursor: "pointer",
                                width: "70px",
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
                              {/* <CloseIcon /> */}
                              Close
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

                          {/* list members in card and board */}
                          <Box
                            sx={{
                              maxHeight: "300px",
                              overflow: "auto",
                            }}
                          >
                            {/* list members of card */}
                            {newFilteredMembers.filter(
                              (member) => member.cardInvited
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
                                        key={user.userId}
                                        onMouseEnter={() =>
                                          handleEnterUserCardArea(user)
                                        }
                                        onMouseLeave={() =>
                                          handleLeaveUserCardArea()
                                        }
                                        sx={{
                                          width: "100%",
                                          height: "60px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          px: 1,
                                          mb: 0.5,
                                          borderRadius: "6px",

                                          "&:hover": {
                                            bgcolor: (theme) =>
                                              theme.palette.mode === "dark"
                                                ? theme.trelloCustom
                                                    .COLOR_281E38
                                                : theme.trelloCustom
                                                    .COLOR_E6E6E6,
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
                                                ? theme.trelloCustom
                                                    .COLOR_F8F8F8
                                                : theme.trelloCustom
                                                    .COLOR_F8F8F8,
                                            bgcolor: (theme) =>
                                              theme.palette.mode === "dark"
                                                ? theme.trelloCustom
                                                    .COLOR_C200D3
                                                : theme.trelloCustom
                                                    .COLOR_C0C0C0,
                                          }}
                                        >
                                          {/* A */}
                                          {user.username
                                            .charAt(0)
                                            .toUpperCase()}
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
                                                    ? theme.trelloCustom
                                                        .COLOR_D7D7D7
                                                    : theme.trelloCustom
                                                        .COLOR_313131,
                                              }}
                                            >
                                              {/* afgh assd */}
                                              {user.username}
                                            </Box>

                                            {/* @ name */}
                                            <Box
                                              sx={{
                                                fontSize: ".85rem",
                                                color: (theme) =>
                                                  theme.palette.mode === "dark"
                                                    ? theme.trelloCustom
                                                        .COLOR_D7D7D7
                                                    : theme.trelloCustom
                                                        .COLOR_313131,
                                              }}
                                            >
                                              {/* @afgh_assd */}
                                              {user.email}
                                            </Box>
                                          </Box>

                                          {/* button remove  */}
                                          {(roleOfBoard !== "member" ||
                                            userIsMemberOfCard) &&
                                            isHoveredUserCardArea ===
                                              user.userId && (
                                              <Tooltip title="Remove user from this card">
                                                <Box
                                                  onClick={() =>
                                                    handleTransferTheCard(
                                                      user,
                                                      "remove"
                                                    )
                                                  }
                                                  sx={{
                                                    cursor: "pointer",
                                                    px: 0.5,
                                                    py: 0.5,
                                                    mr: 0.5,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: "8px",
                                                    "&:hover": {
                                                      bgcolor: (theme) =>
                                                        theme.palette.mode ===
                                                        "dark"
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
                                        key={user.userId}
                                        onMouseEnter={() =>
                                          handleEnterUserBoardArea(user)
                                        }
                                        onMouseLeave={() =>
                                          handleLeaveUserBoardArea()
                                        }
                                        sx={{
                                          width: "100%",
                                          height: "60px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          px: 1,
                                          mb: 0.5,
                                          borderRadius: "6px",

                                          "&:hover": {
                                            bgcolor: (theme) =>
                                              theme.palette.mode === "dark"
                                                ? theme.trelloCustom
                                                    .COLOR_281E38
                                                : theme.trelloCustom
                                                    .COLOR_E6E6E6,
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
                                                ? theme.trelloCustom
                                                    .COLOR_F8F8F8
                                                : theme.trelloCustom
                                                    .COLOR_F8F8F8,
                                            bgcolor: (theme) =>
                                              theme.palette.mode === "dark"
                                                ? theme.trelloCustom
                                                    .COLOR_C200D3
                                                : theme.trelloCustom
                                                    .COLOR_C0C0C0,
                                          }}
                                        >
                                          {/* A */}
                                          {user.username
                                            .charAt(0)
                                            .toUpperCase()}
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
                                                    ? theme.trelloCustom
                                                        .COLOR_D7D7D7
                                                    : theme.trelloCustom
                                                        .COLOR_313131,
                                                fontSize: "1.05rem",
                                              }}
                                            >
                                              {/* afgh assd */}
                                              {user.username}
                                            </Box>

                                            {/* @ name */}
                                            <Box
                                              sx={{
                                                fontSize: ".85rem",
                                                color: (theme) =>
                                                  theme.palette.mode === "dark"
                                                    ? theme.trelloCustom
                                                        .COLOR_D7D7D7
                                                    : theme.trelloCustom
                                                        .COLOR_313131,
                                              }}
                                            >
                                              {/* @afgh_assd */}
                                              {user.email}
                                            </Box>
                                          </Box>

                                          {/* button add  */}
                                          {(roleOfBoard !== "member" ||
                                            userIsMemberOfCard) &&
                                            isHoveredUserBoardArea ===
                                              user.userId && (
                                              <Tooltip title="Add user into this card">
                                                <Box
                                                  onClick={() =>
                                                    handleTransferTheCard(
                                                      user,
                                                      "add"
                                                    )
                                                  }
                                                  sx={{
                                                    cursor: "pointer",
                                                    px: 0.5,
                                                    py: 0.5,
                                                    mr: 0.5,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: "8px",
                                                    "&:hover": {
                                                      bgcolor: (theme) =>
                                                        theme.palette.mode ===
                                                        "dark"
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
                  {(roleOfBoard != "member" || userIsMemberOfCard) && (
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
                        Schedule
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
                              //
                              top: "0px",
                              left: "50px",
                              //
                              position: "absolute",
                              width: "360px",
                              gap: 1.25,
                              display: "flex",
                              flexDirection: "column",
                              px: 2,
                              pt: 2,
                              pb: 0.5,
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

                                  fontWeight: "bold",

                                  borderRadius: "6px",
                                  border: (theme) =>
                                    isOverdueDeadline
                                      ? `1px solid transparent`
                                      : `1px solid ${theme.trelloCustom.COLOR_268FB0}`,
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

                            {/* notify before & notify unit */}
                            {checkIsShowButtonNotifyBeforeAndNotifyUnit() && (
                              <Box
                                sx={{
                                  mt: 0.5,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 2,
                                }}
                              >
                                {/* Notify Before */}
                                <FormControl
                                  fullWidth
                                  sx={{
                                    "& .MuiFormLabel-root": {
                                      "&.MuiInputLabel-root": {
                                        mb: 1,
                                        pl: 0.25,
                                        fontWeight: "bold",
                                        fontSize: "1rem",
                                        color: (theme) =>
                                          theme.palette.mode === "dark"
                                            ? theme.trelloCustom.COLOR_D7D7D7
                                            : theme.trelloCustom.COLOR_313131,
                                      },
                                    },

                                    "& .MuiOutlinedInput-root": {
                                      fontSize: "1rem",
                                      height: "40px",

                                      color: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_D7D7D7
                                          : theme.trelloCustom.COLOR_313131,
                                      bgcolor: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_281E38
                                          : theme.trelloCustom.COLOR_E6E6E6,
                                    },
                                    "& .MuiOutlinedInput-root:hover": {
                                      bgcolor: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_463666
                                          : theme.trelloCustom.COLOR_E6E6E6,
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
                                >
                                  <InputLabel id="select-notify-before-label">
                                    Notifying time
                                  </InputLabel>

                                  <Select
                                    labelId="select-notify-before-label"
                                    id="select-notify-before"
                                    value={valueNotifyBefore}
                                    label="Notifying time"
                                    onChange={handleChangeValueNotifyBefore}
                                    sx={{
                                      "& .MuiOutlinedInput-input": {
                                        pl: 2,
                                      },
                                    }}
                                  >
                                    {getNotifyBeforeOptions().map((option) => (
                                      <MenuItem key={option} value={option}>
                                        {option}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>

                                {/* Notify unit */}
                                <FormControl
                                  fullWidth
                                  sx={{
                                    "& .MuiFormLabel-root": {
                                      "&.MuiInputLabel-root": {
                                        mb: 1,
                                        pl: 0.25,
                                        fontWeight: "bold",
                                        fontSize: "1rem",
                                        color: (theme) =>
                                          theme.palette.mode === "dark"
                                            ? theme.trelloCustom.COLOR_D7D7D7
                                            : theme.trelloCustom.COLOR_313131,
                                      },
                                    },

                                    "& .MuiOutlinedInput-root": {
                                      fontSize: "1rem",
                                      height: "40px",

                                      color: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_D7D7D7
                                          : theme.trelloCustom.COLOR_313131,
                                      bgcolor: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_281E38
                                          : theme.trelloCustom.COLOR_E6E6E6,
                                    },
                                    "& .MuiOutlinedInput-root:hover": {
                                      bgcolor: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? theme.trelloCustom.COLOR_463666
                                          : theme.trelloCustom.COLOR_E6E6E6,
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
                                >
                                  <InputLabel id="select-notify-unit-label">
                                    Unit of notifying time
                                  </InputLabel>

                                  <Select
                                    labelId="select-notify-unit-label"
                                    id="select-notify-unit"
                                    value={valueNotifyUnit}
                                    label="Unit of notifying time"
                                    onChange={handleChangeValueNotifyUnit}
                                    sx={{
                                      "& .MuiOutlinedInput-input": {
                                        pl: 2,
                                      },
                                    }}
                                  >
                                    <MenuItem value={"minute"}>minute</MenuItem>
                                    <MenuItem value={"hour"}>hour</MenuItem>
                                    <MenuItem value={"day"}>day</MenuItem>
                                    <MenuItem value={"week"}>week</MenuItem>
                                  </Select>
                                </FormControl>
                              </Box>
                            )}

                            {/* remove and save btn */}
                            <Box
                              sx={{
                                mt: 0.25,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                                mb:
                                  checkChangesOfDateTime() ||
                                  !checkIsShowButtonRemoveDateTime()
                                    ? 1.25
                                    : 0,
                                height:
                                  checkChangesOfDateTime() ||
                                  !checkIsShowButtonRemoveDateTime()
                                    ? "35px"
                                    : 0,
                              }}
                            >
                              {/* save btn */}
                              {checkChangesOfDateTime() && (
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
                                    bgcolor: (theme) =>
                                      theme.trelloCustom.COLOR_C985FF,
                                    borderColor: (theme) =>
                                      theme.palette.mode === "dark"
                                        ? "#555555"
                                        : "#1b71a7",
                                    "&:hover": {
                                      borderRadius: "20px",
                                      color: "white",
                                      bgcolor: (theme) =>
                                        theme.trelloCustom.COLOR_8C25DE,
                                    },
                                  }}
                                >
                                  Accept
                                </Box>
                              )}

                              {/* remove btn */}

                              {checkChangesOfDateTime() ? (
                                <Box
                                  onClick={() => handleCancelDateAndTime()}
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
                                  Cancel
                                </Box>
                              ) : checkIsShowButtonRemoveDateTime() ? null : (
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
                              )}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </div>
    </Modal>
  );
};

export default CardModal;
