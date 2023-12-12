import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import Box from '@mui/material/Box';

import { useColorScheme } from '@mui/material/styles';

function SwitchLightDarkMode() {
    const { mode, setMode } = useColorScheme();
  
    const handleChange = (event) => {
      setMode(event.target.value);
    };
  
    return (
      <FormControl 
        size="small" 
        sx={{ minWidth: '120px' }}
      >
        <InputLabel 
          id="label-select-light-dark-mode"
          sx={{ 
            color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
            '&.Mui-focused': {
              color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
            },
          }}
        >
          Mode
        </InputLabel>
        <Select
          labelId="label-select-light-dark-mode"
          id="select-light-dark-mode"
          value={mode}
          label="Mode"
          onChange={handleChange}
          sx={{
            color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
            },
            '.MuiSvgIcon-root': {
              color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'primary.main'),
            },
          }}
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

export default SwitchLightDarkMode
