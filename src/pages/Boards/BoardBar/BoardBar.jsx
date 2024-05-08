import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LockPersonIcon from '@mui/icons-material/LockPerson'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'

import { capitalizeFirstLetter } from '~/utils/formatters'

const MENU_STYLES = {
  color: (theme) => (theme.palette.mode === 'dark' ? '' : 'primary.main'),
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '' : '#6c6c6c14'),
  border: 'none',
  paddingX: 0.5,
  borderRadius: 0.5,
  '& .MuiSvgIcon-root': {
    color: (theme) => (theme.palette.mode === 'dark' ? '' : 'primary.main'),
  },
}

function BoardBar({ board }) {

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trelloCustom.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0b1723' : ''),
      borderTop: (theme) => theme.palette.mode === 'dark' ? '1px solid #777777' : '1px solid #1976d2',
      borderBottom: (theme) => theme.palette.mode === 'dark' ? '1px solid #777777' : '1px solid #1976d2',
    }}>
      {/* left side */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
      }}>
        <Tooltip title={board?.description}>
          <Chip 
            sx={MENU_STYLES} 
            icon={<DashboardIcon />} 
            label={board?.title}
            onClick={() => {}}
          />
        </Tooltip>
        <Chip 
          sx={MENU_STYLES} 
          icon={<LockPersonIcon />} 
          label={capitalizeFirstLetter(board?.type)}
          onClick={() => {}}
        />
        {/* <Chip 
          sx={MENU_STYLES} 
          icon={<AddToDriveIcon />} 
          label="Add to google drive" 
          onClick={() => {}}
        />
        <Chip 
          sx={MENU_STYLES} 
          icon={<BoltIcon />} 
          label="Automation" 
          onClick={() => {}}
        />
        <Chip 
          sx={MENU_STYLES} 
          icon={<FilterListIcon />} 
          label="Filters" 
          onClick={() => {}}
        /> */}
      </Box>
      
      {/* right side */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button 
          variant="outlined"
          sx={{
            color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
            '&.MuiButton-root': {
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#cacaca' : 'primary.main'),
            },
            '&.MuiButton-root:hover': {
              borderColor: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
            },
          }}
        >
          <PersonAddAltIcon sx={{ mr: 1 }} />
          Invite
        </Button>

        <AvatarGroup 
          max={4}
          sx={{
            '& .MuiAvatar-root': {
              border: '2px solid',
              width: 34,
              height: 34,
              fontSize: 16,
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#d6d6d6' : '#5399de'),
            },
            '& .MuiAvatar-circular': {
              color: (theme) => (theme.palette.mode === 'dark' ? '#0b1723' : 'white'),
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '' : '#a4b0de'),
            },
          }}
        >
          <Tooltip title="cootanasy">
            <Avatar alt="Remy Sharp" />
          </Tooltip>
          <Tooltip title="cootanasy">
            <Avatar alt="Travis Howard" />
          </Tooltip>
          <Tooltip title="cootanasy">
            <Avatar alt="Cindy Baker" />
          </Tooltip>
          <Tooltip title="cootanasy">
            <Avatar alt="Agnes Walker" />
          </Tooltip>
          <Tooltip title="cootanasy">
            <Avatar alt="Trevor Henderson" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
