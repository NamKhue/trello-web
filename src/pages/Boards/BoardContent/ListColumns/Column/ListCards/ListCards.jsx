import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "./Card/Card";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function ListCards({
  startClickingCard,
  stopClickingCard,

  isDraggingDnD,
  openNewCardForm,

  roleOfBoard,

  cards,
  deleteCardDetails,

  handleCardClick,
}) {
  const [higherHeightOfColumn, setHigherOfNewColumnForm] = useState("10px");

  useEffect(() => {
    if (openNewCardForm) {
      setHigherOfNewColumnForm("50px");
    } else {
      setHigherOfNewColumnForm("10px");
    }
  }, [openNewCardForm]);

  return (
    <SortableContext
      items={cards?.map((card) => card._id)}
      strategy={verticalListSortingStrategy}
    >
      <Box
        sx={{
          outline: "none",
          pl: 1,
          pr: 1,
          pb: 1,
          mx: "5px",
          mb: !openNewCardForm ? "8px" : "12px",
          color: (theme) => (theme.palette.mode === "dark" ? "white" : "black"),
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflowX: "hidden",
          overflowY: "auto",
          maxHeight: (theme) =>
            roleOfBoard !== "member"
              ? `calc(
              ${theme.trelloCustom.boardContentHeight} - 
              ${theme.spacing(5)} - 
              ${theme.trelloCustom.columnHeaderHeight} - 
              ${theme.trelloCustom.columnFooterHeightActive} -
              ${higherHeightOfColumn}
            )`
              : `calc(
              ${theme.trelloCustom.boardContentHeight} - 
              ${theme.spacing(5)} - 
              ${theme.trelloCustom.columnHeaderHeight}
            )`,

          "&::-webkit-scrollbar": {
            width: !isDraggingDnD ? "4px" : "0px",
            height: "5px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#242735" : "#d2d4dc",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#1f222f" : "#b7bac2",
          },
        }}
      >
        {/* Card */}
        {cards?.map((card) => (
          <Card
            key={card._id}
            startClickingCard={startClickingCard}
            stopClickingCard={stopClickingCard}
            roleOfBoard={roleOfBoard}
            card={card}
            deleteCardDetails={deleteCardDetails}
            handleCardClick={handleCardClick}
          />
        ))}
      </Box>
    </SortableContext>
  );
}

export default ListCards;
