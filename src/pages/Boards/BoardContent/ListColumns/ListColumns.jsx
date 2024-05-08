import { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { toast } from 'react-toastify'

import Column from './Column/Column'

function ListColumns({
  columns,
  createNewColumn,
  createNewCard,
  deleteColumnDetails,
  deleteCardDetails,
  editCard,
}) {
  
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const inputNewColumnTitleRef = useRef(null)

  // tương lai dùng react-hook form
  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error("Please enter Column's Title")
      return
    }

    // check sự tồn tại/trùng lặp của dữ liệu thông tin đang được tạo
    // nếu tồn tại
    if (!columns.map(col => col.title).includes(newColumnTitle)) {
      // tạo dữ liệu Column để gọi API
      const newColumnData = {
        title: newColumnTitle
      }

      // tương lai
      // dùng redux global store (redux)
      // lúc đó chỉ cần call api ở đây là xong

      // gọi API
      createNewColumn(newColumnData)
    }
    else {
      toast.info('This new infomation is existed')
      return
    }

    // kết thúc việc thêm Column mới & clear input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

  return (
    <SortableContext 
      items={columns?.map(col => col._id)}
      strategy={horizontalListSortingStrategy}
    >
      {/* list of columns */}
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
        {columns?.map(column => 
          <Column
            key={column._id}
            columns={columns}
            column={column}
            
            createNewCard={createNewCard}
            deleteColumnDetails={deleteColumnDetails}
            deleteCardDetails={deleteCardDetails}
            editCard={editCard}
          />
        )}

        {/* 'add new column' button */}
        {
          !openNewColumnForm
          ? <Box
            onClick={toggleOpenNewColumnForm}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d'
            }}
          >
            <Button 
              startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? theme.palette.background.paper : '#2b60ab')
                },
                width: '100%',
                justifyContent: 'flex-start',
                pl: 3
              }}
            >
              Add new column
              </Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ffffff3d'),
            display: 'flex',
            flexDirection: 'column', 
            gap: 1
          }}>
            <TextField 
              ref={inputNewColumnTitleRef}
              label="Enter title of column"
              type="text"
              size='small' 
              variant='outlined'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                  // Do code here
                  ev.preventDefault()

                  addNewColumn()
                }
              }}
              InputProps={{
                endAdornment: (
                  <CloseIcon
                    fontSize='small'
                    sx={{
                      color: newColumnTitle ? 'white' : 'transparent',
                      cursor: newColumnTitle ? 'pointer' : 'text',
                    }}
                    onClick={() => {
                      if (!newColumnTitle) {
                        inputNewColumnTitleRef.current.children[1].children[0].focus()
                      }
                      else {
                        setNewColumnTitle('')

                        inputNewColumnTitleRef.current.children[1].children[0].focus()
                      }
                    }}
                  />
                )
              }}
              sx={{ 
                // label 'Search'
                '& label': {
                  color: 'white'
                }, 
                '& input': {
                  color: 'white'
                }, 
                '& label.Mui-focused': {
                  color: 'white'
                },
                // '& .MuiInputLabel-root': {
                //   color: (theme) => (theme.palette.mode === 'dark' ? '#cacaca' : 'primary.main'),
                // },
                // '& .MuiInputLabel-root.Mui-focused': {
                //   color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
                // },
                
                // border outline
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: (theme) => (theme.palette.mode === 'dark' ? '#cacaca' : 'primary.main'),
                  },
                  '&:hover fieldset': {
                    borderColor: (theme) => (theme.palette.mode === 'dark' ? '#cacaca' : 'primary.main'),
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: (theme) => (theme.palette.mode === 'dark' ? '#cacaca' : 'primary.main'),
                  },
                },
              }}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Button
                variant='contained'
                // color='success'
                size='small'
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => (theme.palette.mode === 'dark' ? '#555555' : '#1b71a7'),
                  color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'white'),
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#555555' : '#1b71a7'),
                  '&:hover': {
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? theme.palette.background.paper : '#0d4d75'),
                    borderColor: (theme) => (theme.palette.mode === 'dark' ? theme.palette.background.paper : '#0d4d75'),
                  }
                }}
                onClick={addNewColumn}
              >
                Add column
              </Button>

              <CloseIcon
                fontSize='medium'
                sx={{
                  borderRadius: '6px',
                  padding: '2px',
                  cursor: 'pointer',
                  color: (theme) => theme.palette.error.main,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#6b0e0e59' : '#ffbcbc'),
                  '&:hover': {
                    color: 'white',
                    bgcolor: (theme) => theme.palette.error.main,
                  }
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        }
        
      </Box>
    </SortableContext>
  )
}

export default ListColumns
