import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ListColumns from './ListColumns/ListColumns';

import { mapOrder } from '~/utils/sorts';
import { 
  DndContext, 
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

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
  
  useEffect(() => {
    const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id');
    setOrderedColumns(orderedColumns);
  }, [board]);
  
  const handleDragEnd = (event) => {
    // console.log('handle event: ', event);
    
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
      console.log(dndOrderedColumns);

      // future use these below lines for updating data
      // const dndOrderedColumnsIds = dndOrderedColumns.map(col => col._id);

      // update columns
      setOrderedColumns(dndOrderedColumns);
    }
  };

  return (
    <DndContext 
      onDragEnd={handleDragEnd}
      sensors={sensors}
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
      </Box>
    </DndContext>
  )
}

export default BoardContent
