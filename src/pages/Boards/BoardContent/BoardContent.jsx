import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ListColumns from './ListColumns/ListColumns';

import Column from './ListColumns/Column/Column';
import Card from './ListColumns/Column/ListCards/Card/Card';

import { mapOrder } from '~/utils/sorts';
import { 
  DndContext, 
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';


const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
};

function BoardContent({ board }) {

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    } 
  });

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    } 
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    } 
  });

  // const sensors = useSensors(pointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor);
  
  const [orderedColumns, setOrderedColumns] = useState([]);
  
  // tại 1 thời điểm chỉ có 1 phần tử (item) đang được kéo (col hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  
  useEffect(() => {
    const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id');
    setOrderedColumns(orderedColumns);
  }, [board]);
  
  // trigger khi bắt đầu việc kéo 1 phần tử => drag
  const handleDragStart = (event) => {
    // console.log('handle drag start: ', event);

    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(event?.active?.data?.current?.columnId ? 'ACTIVE_DRAG_ITEM_TYPE_CARD' : 'ACTIVE_DRAG_ITEM_TYPE_COLUMN');
    setActiveDragItemData(event?.active?.data?.current);
  };
  
  // trigger khi kết thúc việc kéo 1 phần tử => thả ra/drop
  const handleDragEnd = (event) => {
    // console.log('handle drag end: ', event);
    
    const { active, over } = event;

    // check if not exist 'over'
    if (!over) return
    
    // check if 'over' != null
    if (active.id !== over.id) {
      // get the old index via active
      const oldIndex = orderedColumns.findIndex(col => col._id === active.id);
      // get the new index via over
      const newIndex = orderedColumns.findIndex(col => col._id === over.id);

      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      // console.log(orderedColumns);
      // console.log(dndOrderedColumns);

      // future use these below lines for updating data
      // const dndOrderedColumnsIds = dndOrderedColumns.map(col => col._id);

      // update columns
      setOrderedColumns(dndOrderedColumns);
    }

    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
  };

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        color: 'white',
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#2e3032' : '#1784f0'),
        width: '100%',
        height: (theme) => theme.trelloCustom.boardContentHeight,
        p: '10px',
      }}>
        {/* box column */}
        <ListColumns columns={orderedColumns} />

        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          
          {/* đang kéo column */}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {/* đang kéo card */}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
