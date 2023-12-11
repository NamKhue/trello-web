import Box from '@mui/material/Box';
import SwitchLightDarkMode from '../../components/SwitchLightDarkMode/index'

function AppBar() {
  return (
    <Box sx={{
        backgroundColor: 'primary.light',
        width: '100%',
        height: (theme) => theme.trelloCustom.appBarHeight,
        display: 'flex',
        alignItems: 'center',
      }}>
        <SwitchLightDarkMode />
      </Box>
  )
}

export default AppBar
