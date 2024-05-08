import { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CloseIcon from '@mui/icons-material/Close'

import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Profiles from './Menus/Profiles'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import SwitchLightDarkMode from '~/components/SwitchLightDarkMode/SwitchLightDarkMode'

function AppBar() {
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef(null)

  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.trelloCustom.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0b1723' : 'white')
    }}>
      {/* left side */}
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
          {/* <Workspaces />
          <Recent />
          <Starred />
          <Templates /> */}
          <Button 
            variant="outlined"
            sx={{
              color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0b1723' : 'white'),
              '&.MuiButton-outlined': {
                borderColor: (theme) => (theme.palette.mode === 'dark' ? '#cacaca' : ''),
                // borderWidth: '0.25px'
              },
              '&.MuiButton-outlined:hover': {
                borderColor: (theme) => (theme.palette.mode === 'dark' ? 'white' : ''),
                // borderWidth: '2.5px'
              },
            }} 
          >
            Create
            <AddBoxIcon sx={{ ml: 1 }} />
          </Button>
        </Box>

        </Box>

      {/* right side */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        <TextField 
          ref={inputRef}
          sx={{ 
            minWidth: '150px', 
            maxWidth: '200px',
            // label 'Search'
            '& .MuiInputLabel-root': {
              color: (theme) => (theme.palette.mode === 'dark' ? '#cacaca' : 'primary.main'),
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
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
          }} 
          id="outlined-search" 
          label="Search" 
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)} 
          size='small' 
          InputProps={{
            // 64 - smt need to revise
            endAdornment: (
              <CloseIcon
                fontSize='small'
                sx={{
                  color: searchValue ? '' : 'transparent',
                  cursor: searchValue ? 'pointer' : 'text'
                }}
                onClick={() => {
                  if (!searchValue) {
                    inputRef.current.children[1].children[0].focus()
                  }
                  else {
                    setSearchValue('')

                    inputRef.current.children[1].children[0].focus()
                  }
                }}
              />
            )
          }}
        />

        <SwitchLightDarkMode />

        <Tooltip title="Notification">
          <Badge 
            color="secondary" 
            variant="dot" 
            sx={{ 
              cursor: 'pointer',
              '& .MuiBadge-badge': {
                bgcolor: 'red',
              }
            }}
          >
            <NotificationsNoneIcon />
          </Badge>
        </Tooltip>
        
        {/* <Tooltip title="Help">
          <Badge 
            sx={{ 
              cursor: 'pointer', 
              color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
            }}
          >
            <HelpOutlineIcon />
          </Badge>
        </Tooltip> */}

        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
