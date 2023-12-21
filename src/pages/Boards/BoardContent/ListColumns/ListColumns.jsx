import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Column from './Column/Column';

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

function ListColumns({ columns }) {
  return (
    <SortableContext items={columns?.map(col => col._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { ml: 1, mr: 1 },
      }}>
        {/* list of columns */}
        {columns?.map(column => <Column key={column._id} column={column} />)}

      </Box>
    </SortableContext>
  )
}

export default ListColumns
