import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Check from '@mui/icons-material/Check'

function Recent() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Button
        id="basic-button-recent"
        aria-controls={open ? 'basic-menu-recent' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
        sx={{
          color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0b1723' : 'white')
        }} 
      >
        Recent
      </Button>
      <Menu
        id="basic-menu-recent"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-recent',
        }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemText inset>Single</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemText inset>1.15</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemText inset>Double</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Check />
          </ListItemIcon>
          Custom: 1.2
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemText>Add space before paragraph</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemText>Add space after paragraph</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemText>Custom spacing...</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Recent
