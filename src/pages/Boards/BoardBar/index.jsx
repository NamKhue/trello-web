import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterListIcon from '@mui/icons-material/FilterList';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const MENU_STYLES = {
  color: (theme) => (theme.palette.mode === 'dark' ? '' : 'primary.main'),
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '' : '#6c6c6c14'),
  border: 'none',
  paddingX: 0.5,
  borderRadius: 0.5,
  '& .MuiSvgIcon-root': {
    color: (theme) => (theme.palette.mode === 'dark' ? '' : 'primary.main'),
  },
};

function BoardBar() {
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
        <Chip 
          sx={MENU_STYLES} 
          icon={<DashboardIcon />} 
          label="cootanasy" 
          onClick={() => {}}
        />
        <Chip 
          sx={MENU_STYLES} 
          icon={<LockPersonIcon />} 
          label="Public/Private workspace" 
          onClick={() => {}}
        />
        <Chip 
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
        />
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
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#d6d6d6' : 'primary.main'),
            },
            '& .MuiAvatar-circular': {
              color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '' : 'white'),
            },
          }}
        >
          <Tooltip title="cootanasy">
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="cootanasy">
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          </Tooltip>
          <Tooltip title="cootanasy">
            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          </Tooltip>
          <Tooltip title="cootanasy">
            <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
          </Tooltip>
          <Tooltip title="cootanasy">
            <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
