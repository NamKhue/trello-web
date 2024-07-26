import Box from "@mui/material/Box";
import Card from "./Card/Card";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// { cards }
function ListCards({ column, cards, deleteCardDetails, openModalDetailsCard }) {
  return (
    <SortableContext
      items={cards?.map((card) => card._id)}
      strategy={verticalListSortingStrategy}
    >
      <Box
        sx={{
          pl: 1.5,
          pr: 1.5,
          pb: 1,
          m: "0 5px",
          color: (theme) => (theme.palette.mode === "dark" ? "white" : "black"),
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflowX: "hidden",
          overflowY: "auto",
          maxHeight: (theme) => `calc(
          ${theme.trelloCustom.boardContentHeight} - 
          ${theme.spacing(5)} - 
          ${theme.trelloCustom.columnHeaderHeight} - 
          ${theme.trelloCustom.columnFooterHeight}
        )`,

          "&::-webkit-scrollbar": {
            width: "5px",
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
            column={column}
            cards={cards}
            card={card}
            deleteCardDetails={deleteCardDetails}
            openModalDetailsCard={openModalDetailsCard}
          />
        ))}
      </Box>
    </SortableContext>
  );
}

export default ListCards;
