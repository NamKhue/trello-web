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
  color: 'primary.main',
  // bgcolor: 'primary',
  border: 'none',
  paddingX: 0.5,
  borderRadius: 0.5,
  '& .MuiSvgIcon-root': {
    color: 'primary.main',
  },
  '&:hover': {
    // bgcolor: 'primary.50',
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
      borderTop: '1px solid #00bfa5'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button variant="outlined">
          <PersonAddAltIcon sx={{ mr: 1 }} />
          Invite
        </Button>

        <AvatarGroup 
          max={4}
          sx={{
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
            }
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
