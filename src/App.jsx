import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';

import { useColorScheme } from '@mui/material/styles';

// import ToggleButton from '@mui/material/ToggleButton';
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


// function ColorToggleButton() {
//   const { mode, setMode } = useColorScheme();

//   const handleChange = (event) => {
//     setMode(event.target.value);
//   };

//   return (
    
//       <ToggleButtonGroup
//         color="primary"
//         value={mode}
//         exclusive
//         onChange={handleChange}
//       >
//         <ToggleButton value="light">
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <LightModeIcon fontSize='small' /> Light
//           </Box>
//         </ToggleButton>
//         <ToggleButton value="dark">
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <DarkModeIcon fontSize='small' /> Dark
//           </Box>
//         </ToggleButton>
//         <ToggleButton value="system">
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <SettingsBrightnessIcon fontSize='small' /> System
//           </Box>
//         </ToggleButton>
//       </ToggleButtonGroup>
    
//   );
// }

function SwitchLightDarkMode() {
  const { mode, setMode } = useColorScheme();

  const handleChange = (event) => {
    setMode(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="label-select-light-dark-mode">Mode</InputLabel>
      <Select
        labelId="label-select-light-dark-mode"
        id="select-light-dark-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        <MenuItem value="light">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LightModeIcon fontSize='small' /> Light
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DarkModeIcon fontSize='small' /> Dark
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsBrightnessIcon fontSize='small' /> System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
}

function App() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/* <ColorToggleButton /> */}
      <Box sx={{
        backgroundColor: 'primary.light',
        width: '100%',
        height: (theme) => theme.trelloCustom.appBarHeight,
        display: 'flex',
        alignItems: 'center',
      }}>
        <SwitchLightDarkMode />
      </Box>

      <Box sx={{
        backgroundColor: 'primary.dark',
        width: '100%',
        height: (theme) => theme.trelloCustom.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
      }}>
        Board bar
      </Box>
        
      <Box sx={{
        backgroundColor: 'primary.main',
        width: '100%',
        height: (theme) => `calc(100vh - (${theme.trelloCustom.appBarHeight} + ${theme.trelloCustom.boardBarHeight}))`,
        display: 'flex',
        alignItems: 'center',
      }}>

      </Box>
    </Container>
  )
}

export default App
