import { useRef, useState } from 'react'
// import ContentCut from '@mui/icons-material/ContentCut'
// import Cloud from '@mui/icons-material/Cloud'
// import ContentCopyIcon from '@mui/icons-material/ContentCopy'
// import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import EditIcon from '@mui/icons-material/Edit'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import { useModal } from 'mui-modal-provider'
import {
  updateColumnDetailsAPI
} from '~/apis'

import ListCards from './ListCards/ListCards'
// import { mapOrder } from '~/utils/sorts'

// { column }
function Column({
  columns,
  column,
  createNewCard,
  deleteColumnDetails,
  deleteCardDetails,
  editCard,
}) {
  
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')
  const inputNewCardTitleRef = useRef(null)

  // dnd kit
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: column._id,
    data: { ...column }
  })
  
  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
  }
  
  // click/close
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDoubleClick = (event, column) => {
    if (event.detail === 2) {
      handleRenameColumn(column)
    }
  }

  const orderedCards = column.cards
  // const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
  
  


  // tương lai dùng react-hook form
  const addNewCard = () => {
    
    if (!newCardTitle) {
      toast.error("Please enter Card's Title", {
        position: 'bottom-right'
      })
      return
    }

    // check sự tồn tại/trùng lặp của dữ liệu thông tin đang được tạo
    // nếu tồn tại
    if (!column.cards.map(card => card.title).includes(newCardTitle)) {
      // tạo dữ liệu Card để gọi API
      const newCardData = {
        title: newCardTitle,
        columnId: column._id
      }
  
      // tương lai
      // dùng redux global store (redux)
      // lúc đó chỉ cần call api ở đây là xong
  
      // gọi API
      createNewCard(newCardData)
    }
    else {
      toast.info('This new infomation is existed', {
        position: 'bottom-right'
      })
      return
    }

    // kết thúc việc thêm Card mới & clear input
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }



  // xử lý xóa 1 column và toàn bộ card trong column đó
  const confirmDeleteColumn = useConfirm()

  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete Column?',
      description: 'This action will permanently delete this Column and its Cards! Are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'

      // dialogProps: { maxWidth: 'xs' },
      // confirmationButtonProps: { variant: 'outlined', color: 'info' },
      // cancellationButtonProps: { color: 'error' },
      // allowClose: false
    })
    .then(() => {
      // tương lai redux
      deleteColumnDetails(column._id)
    })
    .catch(() => {})
  }



  // đổi tên (title) của col
  // eslint-disable-next-line no-unused-vars
  let newColumnTitleEdit = ''
  
  const { showModal } = useModal()

  const handleRenameColumn = (column) => {

    column.title = column.title.trim()
    newColumnTitleEdit = column.title
    
    // mở modal
    const editColumnModal = showModal(ConfirmationDialog, {
      title: column.title,
      onConfirm: () => {
        newColumnTitleEdit = newColumnTitleEdit.trim()
        // check sự tồn tại/trùng lặp của dữ liệu thông tin đã được thay đổi
        // nếu tồn tại
        if (!columns.map(col => col.title).includes(newColumnTitleEdit)) {
          // set new data UI for column
          column.title = newColumnTitleEdit

          // call api update Board & DB
          updateColumnDetailsAPI(
            column._id,
            { title: column.title }
          ).then(res => {
            toast.success(res?.modifyColumnResult)
          })

          editColumnModal.hide()
        }
        else {
          // nếu dữ liệu y hệt
          if (newColumnTitleEdit === column.title) {
            toast.info('This new infomation is the same as the old ones')
          }
          else {
            toast.info('The infomation that you have been modified is existed')
          }
        }
      },
      onCancel: () => {
        editColumnModal.hide()
      }
    })

  }
  
  const ConfirmationDialog = ({ 
    title,
    onCancel,
    onConfirm,
    ...props 
  }) => (
    <Dialog
      sx={{
        maxWidth: 'false'
      }}
      {...props}
    >
      <div style={{
        width: 300,
        paddingLeft: '30px',
        paddingRight: '30px',
      }}>
        <DialogTitle
          style={{
            paddingLeft: '0',
          }}
          sx={{
            '& .MuiTypography-root': {
              margin: '0 auto'
            }
          }}
        >
          Edit Column
        </DialogTitle>

        <TextField
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              padding: '5px'
            }
          }}

          label="New title"
          autoFocus
          type="text"
          size='small'
          variant='outlined'
          defaultValue={title}
          onChange={(ev) => newColumnTitleEdit = ev.target.value}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault()

              onConfirm()
            }
          }}
        />

        <DialogActions
          sx={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          <Button onClick={onCancel} color="error">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant='outlined' color="info">
            Confirm
          </Button>
        </DialogActions>
      </div>

    </Dialog>
  )



  
  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box 
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 1,
          mr: 1,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trelloCustom.boardContentHeight} - ${theme.spacing(5)})`,
        }}
      >
        {/* header */}
        <Box sx={{
          pl: 1.5,
          pr: 1.5,
          color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'black'),
          height: (theme) => theme.trelloCustom.columnHeaderHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Typography
            onClick={() => handleDoubleClick(event, column)}
            variant='h6'
            sx={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {column?.title}
          </Typography>

          <Box
            data-no-dnd='true'
          >
            <Tooltip title="More options">
              <ExpandMoreIcon 
                sx={{
                  color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'black'),
                  // bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0b1723' : 'white'),
                  cursor: 'pointer',
                }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>

            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown',
              }}
              sx={{
                '& .MuiMenu-list': {
                  '& .MuiMenuItem-root': {
                    borderRadius: '5px',
                  },
                  paddingLeft: '5px',
                  paddingRight: '5px'
                }
              }}
            >
              <MenuItem
                onClick={() => handleRenameColumn(column)}
                sx={{
                  '&:hover': {
                    color: 'info.light',
                    '& .add-card-icon': {
                      color: 'info.light'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <EditIcon className='add-card-icon' fontSize="small" />
                </ListItemIcon>
                <ListItemText>Rename title</ListItemText>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  toggleOpenNewCardForm()

                  // // hack timing
                  // setTimeout(() => {
                  //   if (!openNewCardForm) {
                  //     inputNewCardTitleRef.current.children[1].children[0].focus()
                  //   }
                  // }, 100)
                }}
                sx={{
                  '&:hover': {
                    color: 'success.light',
                    '& .add-card-icon': {
                      color: 'success.light'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <AddCardIcon className='add-card-icon' fontSize="small" />
                </ListItemIcon>
                {
                  !openNewCardForm ? 
                  <ListItemText>
                    Add new card
                  </ListItemText>
                  : <ListItemText>
                    Close Add new card
                  </ListItemText>
                }
              </MenuItem>

              {/* <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <ContentCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <ContentPasteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem> */}
              
              <Divider />

              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .delete-forever-icon': {
                      color: 'warning.dark'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <DeleteForeverIcon className='delete-forever-icon' fontSize="small" />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>

              {/* <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem> */}
            </Menu>
            
          </Box>
        </Box>

        {/* list card */}
        <ListCards
          cards={orderedCards}

          deleteCardDetails={deleteCardDetails}
          editCard={editCard}
        />
        
        {/* footer */}
        <Box sx={{
          p: 1.5,
          color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'black'),
          height: (theme) => theme.trelloCustom.columnFooterHeight,
        }}>
          {
            !openNewCardForm
            ? <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button 
                sx={{ pl: 1.25 }}
                startIcon={<AddCardIcon />}
                onClick={toggleOpenNewCardForm}
              >
                Add new card
              </Button>
              <Tooltip title='Drag to move'>
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
            : <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TextField
                ref={inputNewCardTitleRef}
                label="Enter title of card"
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                data-no-dnd='true'
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') {
                    ev.preventDefault()

                    addNewCard()
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <CloseIcon
                      fontSize='small'
                      sx={{
                        color: newCardTitle ? '' : 'transparent',
                        cursor: newCardTitle ? 'pointer' : 'text',
                      }}
                      onClick={() => {
                        if (!newCardTitle) {
                          inputNewCardTitleRef.current.children[1].children[0].focus()
                        }
                        else {
                          setNewCardTitle('')

                          inputNewCardTitleRef.current.children[1].children[0].focus()
                        }
                      }}
                    />
                  )
                }}
                sx={{ 
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white'),
                  '& label': {
                    color: 'text.primary'
                  }, 
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                  }, 
                  '& label.Mui-focused': {
                    color: (theme) => (theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main),
                  },
                  '& .MuiInputLabel-root': {
                    '.Mui-focused': {
                      color: 'white',
                    },
                    color: (theme) => (theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main),
                  },
                  
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
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
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
                  data-no-dnd='true'
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
                  onClick={addNewCard}
                >
                  Add
                </Button>

                <CloseIcon
                  data-no-dnd='true'
                  fontSize='medium'
                  sx={{
                    // color: (theme) => theme.palette.error.main,
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
                  onClick={toggleOpenNewCardForm}
                />
              </Box>

            </Box>
          }

        </Box>
      </Box>
    </div>
  )
}

export default Column
