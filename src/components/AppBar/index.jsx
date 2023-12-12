import Box from '@mui/material/Box';
import SwitchLightDarkMode from '~/components/SwitchLightDarkMode/index'
import AppsIcon from '@mui/icons-material/Apps';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import Typography from '@mui/material/Typography';
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Profiles from './Menus/Profiles'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddBoxIcon from '@mui/icons-material/AddBox';

function AppBar() {
  return (
    <Box px={2} sx={{
      width: '100%',
      color: 'primary.main',
      height: (theme) => theme.trelloCustom.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        <AppsIcon />
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}>
          <SvgIcon component={TrelloIcon} fontSize='small' inheritViewBox />
          <Typography variant="span" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            Trello
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
          <Button variant="outlined">
            Create
            <AddBoxIcon sx={{ ml: 1 }} />
          </Button>
        </Box>

        </Box>

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <TextField sx={{ minWidth: '140px' }} id="outlined-search" label="Search..." type="search" size='small' />
        
        <SwitchLightDarkMode />

        <Tooltip title="Notification">
          <Badge color="secondary" variant="dot" sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon sx={{ color: 'primary.main' }} />
          </Badge>
        </Tooltip>
        
        <Tooltip title="Help">
          <Badge sx={{ cursor: 'pointer', color: 'primary.main' }}>
            <HelpOutlineIcon />
          </Badge>
        </Tooltip>

        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
