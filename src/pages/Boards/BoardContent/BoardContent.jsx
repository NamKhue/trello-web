import { useEffect, useState, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import { arrayMove } from "@dnd-kit/sortable";
import { cloneDeep, isEmpty } from "lodash";
// import { ConsoleLogger } from 'aws-amplify/utils'

import {
  DndContext,
  // PointerSensor,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  // closestCenter,
  // rectIntersection,
  pointerWithin,
  getFirstCollision,
} from "@dnd-kit/core";

import ListColumns from "./ListColumns/ListColumns";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import { MouseSensor, TouchSensor } from "~/customLibs/DndKitSensors";
import { generatePlaceholderCard } from "~/utils/formatters";
// import { mapOrder } from '~/utils/sorts'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

function BoardContent({
  board,
  cards,
  createNewColumn,
  createNewCard,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn,
  deleteColumnDetails,
  deleteCardDetails,
  openModalDetailsCard,
}) {
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: {
  //     distance: 10,
  //   }
  // })

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500,
    },
  });

  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState([]);

  // tại 1 thời điểm chỉ có 1 phần tử (item) đang được kéo (col hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);

  // lấy ra địa chỉ của column gốc ngay cả khi đang kéo thả card
  // vì ở handleDragOver  thì địa chỉ của column gốc đã bị thay đổi => dữ liệu gốc đó sẽ sai nếu tương lai gần sử dụng tiếp
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null);

  // điểm va chạm cuối cùng (xử lý thuật toán phát hiện va chạm) (37)
  const lastOverId = useRef(null);

  useEffect(() => {
    const orderedColumns = board.columns;
    // const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

    setOrderedColumns(orderedColumns);
  }, [board]);

  // tìm 1 column theo cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((col) =>
      col?.cards?.map((card) => card._id)?.includes(cardId)
    );
  };

  // function chung xử lý việc update state trong trường hợp di chuyển card giữa các columns khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumns((prevColumns) => {
      // console.log('prevColumns:', prevColumns)

      // tương tự với column gốc
      // activeColumn.cards = mapOrder(activeColumn.cards, activeColumn.cardOrderIds, '_id')
      // console.log('activeColumn.cards:', activeColumn.cards)

      // tìm vị trí mới (index) của cái overCard trong column đích đến (nơi mà activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      );

      // tìm vị trí cũ của cái activeCard trong column gốc
      const activeCardIndex = activeColumn?.cards?.findIndex(
        (card) => card._id === activeDraggingCardId
      );

      // logic tính toán 'cardIndex' mới (trên hoặc dưới của overCard) lấy chuẩn đầu ra từ code của thư viện
      // khá là khó hiểu
      let newCardIndex;
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;
      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1;

      // clone mảng orderedColumnsState cũ sang 1 mảng mới để xử lý data rồi return
      // cập nhật lại orderedColumnsState mới
      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(
        (col) => col._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (col) => col._id === overColumn._id
      );

      // console.log('nextActiveColumn:', nextActiveColumn)
      // console.log('nextOverColumn:', nextOverColumn)

      // column cũ
      if (nextActiveColumn) {
        // xóa card ở column active (column cũ), cái lúc mà kéo card ra khỏi nó để sang column khác
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );

        // 37.2
        // check xem column cũ có rỗng hay khong
        // nếu rỗng thì thêm 1 phần tử card đặc biệt phục vụ cho trường hợp kéo thả khi 1 col rỗng
        // thêm placeholder card
        if (isEmpty(nextActiveColumn.cards)) {
          // console.log('card cuối cùng bị kéo đi')
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
          nextActiveColumn.cardOrderIds.push(nextActiveColumn.cards[0]._id);
        }

        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        // nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id) => lỗi vì sai logic
        nextActiveColumn.cardOrderIds.splice(activeCardIndex, 1);
      }

      // column mới
      if (nextOverColumn) {
        // kiểm tra card đang kéo  có tồn tại ở overColumn hay khong
        // nếu có thì cần xóa
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );

        // console.log('nextOverColumn:', nextOverColumn)

        // đối với trường hợp dragEnd thì cần update lại cho đúng dữ liệu columnId trong card sau khi kéo thả card giữa 2 columns khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        };

        // console.log('activeDraggingCardData: ', activeDraggingCardData)
        // console.log('rebuild_activeDraggingCardData: ', rebuild_activeDraggingCardData)

        // tiếp theo là thêm card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        );

        // xóa cái Placeholder Card đi nếu col đã có ít nhất 1 phần tử có ý nghĩa (37.2)
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        );

        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );

        // console.log('nextOverColumn: ', nextOverColumn)
      }

      // console.log('nextColumns:', nextColumns)

      // sẽ chạy sau khi drag end xong
      // giờ xử lý API
      if (triggerFrom == "handleDragEnd") {
        // tương lai redux

        // cần xem lại vì sao chọn  oldColumnWhenDraggingCard  thay vì là  activeColumn

        // vì sau khi qua onDragOver
        // thì khi tới đoạn này, state của card đã được cập nhật dồi
        // => dữ liệu sẽ khong còn như ý muốn. vì thế mà cần  oldColumnWhenDraggingCard  được khởi tạo từ đầu và họat động song hành từ trên xuống
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard._id,
          nextOverColumn._id,
          nextColumns
        );
      }

      // console.log('nextColumns:', nextColumns)

      return nextColumns;
    });
  };

  // trigger khi bắt đầu việc kéo 1 phần tử => drag
  const handleDragStart = (event) => {
    // console.log('handle drag start: ', event)

    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? "ACTIVE_DRAG_ITEM_TYPE_CARD"
        : "ACTIVE_DRAG_ITEM_TYPE_COLUMN"
    );
    setActiveDragItemData(event?.active?.data?.current);

    // nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
  };

  // 1 lỗi nữa là không bắt được sự kiện khi di chuyển vs tốc độ quá nhanh
  // kết quả là sẽ nhân đôi card (dù sau đó chỉ di chuyển đc 1 cái gốc trong 2 cái)

  // trigger trong khi kéo (drag) 1 phần tử
  const handleDragOver = (event) => {
    // không làm gì thêm nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // console.log('event kéo thả column thì khong làm gì')
      return;
    }

    // nếu kéo card thì xử lý thêm để có thể kéo card  qua lại giữa các column
    // console.log('handle drag over ', event)

    const { active, over } = event;

    // cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm container) thì không làm gì => tránh crash trang
    if (!active || !over) return;

    // activeDraggingCardId là card đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    // overCard là card đang tương tác trên hoặc dưới so với card được kéo ở trên
    const { id: overCardId } = over;

    // tìm 2 columns bằng cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    // console.log('activeColumn', activeColumn)
    // console.log('overColumn', overColumn)

    // nếu không tồn tại 1 trong 2 columns thì return (không làm gì cả) => tránh crash
    if (!activeColumn || !overColumn) return;

    // xử lý logic khi 2 card nằm ở 2 column khác nhau
    // còn nếu kéo thả 2 card ở cùng 1 column thì khong làm gì
    if (activeColumn._id !== overColumn._id) {
      // overColumn.cards = mapOrder(overColumn.cards, overColumn.cardOrderIds, '_id')

      // console.log('overColumn', overColumn)
      // console.log('activeColumn', activeColumn)

      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        "handleDragOver"
      );
    }
  };

  // trigger khi kết thúc việc kéo 1 phần tử => thả ra/drop
  const handleDragEnd = (event) => {
    // console.log('handle drag end: ', event)

    const { active, over } = event;

    // đảm bảo nếu khong tồn tại 1 trong 2 thì sẽ khong làm gì
    // tránh bị crash
    if (!active || !over) return;

    // xử lý kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('kéo thả card')

      // activeDraggingCardId là card đang được kéo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;
      // overCard là card đang tương tác trên hoặc dưới so với card được kéo ở trên
      const { id: overCardId } = over;

      // tìm 2 columns bằng cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      // nếu không tồn tại 1 trong 2 columns thì return (không làm gì cả) tránh crash
      if (!activeColumn || !overColumn) return;

      // console.log('activeDragItemData:', activeDragItemData)
      // console.log('oldColumnWhenDraggingCard:', oldColumnWhenDraggingCard)

      // kéo thả trong giữa 2 columns
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // if (activeDragItemData.columnId !== overColumn._id) {   =>  sinh lỗi và đã fix để khong bị lỗi nếu vẫn sử dụng

        // console.log('hành động kéo thả card giữa 2 columns')

        // console.log('oldColumnWhenDraggingCard._id', oldColumnWhenDraggingCard._id)
        // console.log('activeDragItemData.columnId', activeDragItemData.columnId)

        // 2 cái  oldColumnWhenDraggingCard._id  và activeDragItemData.columnId  là khác  nhau

        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          "handleDragEnd"
        );
      }
      // kéo thả trong cùng 1 column
      else {
        // console.log('hành động kéo thả card trong cùng 1 column')

        // console.log('oldColumnWhenDraggingCard:', oldColumnWhenDraggingCard)

        // // sắp xếp oldColumnWhenDraggingCard.cards  theo  oldColumnWhenDraggingCard.cardOrderIds
        // oldColumnWhenDraggingCard.cards = mapOrder(oldColumnWhenDraggingCard.cards, oldColumnWhenDraggingCard.cardOrderIds, '_id')

        // console.log('oldColumnWhenDraggingCard:', oldColumnWhenDraggingCard)
        // console.log('overColumn:', overColumn)

        // console.log('activeDraggingCardId: ', activeDraggingCardId)
        // console.log('overCardId: ', overCardId)

        // get the old index via oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (card) => card._id === activeDragItemId
        );
        // get the new index via oldColumnWhenDraggingCard
        const newCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (card) => card._id === overCardId
        );

        // console.log('oldCardIndex: ', oldCardIndex)
        // console.log('newCardIndex: ', newCardIndex)

        // dùng arraymove vì thuật toán/logic kéo card trong cùng 1 column  giống hệt  kéo column trong 1 board
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        );
        const dndOrderedCardIds = dndOrderedCards.map((card) => card._id);

        // console.log('dndOrderedCards: ', dndOrderedCards)

        setOrderedColumns((prevColumns) => {
          // clone mảng orderedColumnsState cũ sang 1 mảng mới để xử lý data rồi return
          // cập nhật lại orderedColumnsState mới
          const nextColumns = cloneDeep(prevColumns);

          // tìm column mà đang thả vào
          const targetColumn = nextColumns.find(
            (col) => col._id === overColumn._id
          );

          // cập nhật 2 giá trị mới
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id);

          // console.log('nextColumns: ', nextColumns)
          // console.log('targetColumn: ', targetColumn)

          // trả về giá trị state mới (đúng những vị trí mới)
          return nextColumns;
        });

        // tương lai redux
        // cập nhật data
        moveCardInTheSameColumn(
          dndOrderedCards,
          dndOrderedCardIds,
          oldColumnWhenDraggingCard._id
        );
      }
    }

    // xử lý kéo thả column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // console.log('kéo thả column')

      // check if 'over' != null
      if (active.id !== over.id) {
        // get the old index via active
        const oldColumnIndex = orderedColumns.findIndex(
          (col) => col._id === active.id
        );
        // get the new index via over
        const newColumnIndex = orderedColumns.findIndex(
          (col) => col._id === over.id
        );

        // sắp xếp lại mảng columns ban đầu
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        );
        // const dndOrderedColumnsIds = dndOrderedColumns.map(col => col._id)
        // console.log(orderedColumns)
        // console.log(dndOrderedColumns)

        // update state => tránh delay hoặc flickering giao diện lúc kéo thả cần phải chờ gọi (small trick)
        setOrderedColumns(dndOrderedColumns);

        // tương lai redux
        // cập nhật data
        moveColumns(dndOrderedColumns);
      }
    }

    // những dữ liệu sau khi kéo thả luôn phải mặc định về null
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnWhenDraggingCard(null);
  };

  // 32
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  // custom lại thuật toán phát hiện va chạm tối ưu cho việc kéo thả nhiều columns
  // 37
  const collisionDetectionStrategy = useCallback(
    (args) => {
      // console.log('collisionDetectionStrategy')

      // trường hợp kéo column thì dùng thuật toán closestCorners
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }

      // tìm các điểm giao nhau (điểm va chạm) với con trỏ
      const pointerIntersections = pointerWithin(args);

      // console.log('pointerIntersections: ', pointerIntersections)

      // 37.1
      // nếu mảng pointerIntersections bị rỗng, return và khong làm gì
      // fix triệt để cái bug flickering của thư viện dndkit trong trường hợp:
      // - kéo 1 card có image cover lớn và kéo lên phía trên cùng ra khỏi khu vực kéo thả
      if (!pointerIntersections?.length) return;

      // update ở 37.1 - khong cần bước này nữa
      // !!pointerIntersections?.length   is the same as   pointerIntersections.length > 0
      // const intersections = !!pointerIntersections?.length
      //       ? pointerIntersections
      //       : rectIntersection(args)

      // tìm overId đầu tiên trong đám pointerIntersections ở trên
      let overId = getFirstCollision(pointerIntersections, "id");

      // console.log('overId: ', overId)

      if (overId) {
        // 37
        // đoạn này để fix cái flickering
        // nếu cái over là column thì sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện va chạm closestCenter hoặc closestCorners đều được
        // tuy nhiên ở đây nên dùng closestCorners vì độ mượt mà hơn

        // nếu khong có đoạn checkColumn này thì bug flickering vẫn fix được nhưng vẫn còn hiện tượng giật cực lag
        const checkColumn = orderedColumns.find((col) => col._id == overId);

        if (checkColumn) {
          // console.log('overId before: ', overId)

          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                );
              }
            ),
          })[0]?.id;

          // console.log('overId after: ', overId)
        }

        lastOverId.current = overId;
        return [{ id: overId }];
      }

      // nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType, orderedColumns]
  );

  return (
    <DndContext
      // cảm biến sensors (30)
      sensors={sensors}
      // closestCorners là thuật toán phát hiện va chạm theo các góc
      // nếu khong sử dụng thì card mà có cover image lớn  sẽ khong hoạt động (khong kéo qua column khác đc)
      // collisionDetection={closestCorners}

      // tự custom nâng cao thuật toán phát hiện va chạm (37)
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          color: "white",
          // backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#2e3032' : '#1784f0'),
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.trelloCustom.COLOR_3C1C64
              : theme.trelloCustom.COLOR_7852A9,
          width: "100%",
          height: (theme) => theme.trelloCustom.boardContentHeight,
          pl: 1.5,
          pr: 1.5,
          pb: 1,
        }}
      >
        {/* box column */}
        <ListColumns
          cards={cards}
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          deleteColumnDetails={deleteColumnDetails}
          deleteCardDetails={deleteCardDetails}
          openModalDetailsCard={openModalDetailsCard}
        />

        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}

          {/* đang kéo column */}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}

          {/* đang kéo card */}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
