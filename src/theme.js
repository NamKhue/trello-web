import { blueGrey, deepOrange, orange, teal } from '@mui/material/colors';
import { experimental_extendTheme as extendTheme} from '@mui/material/styles';

const theme = extendTheme({
  trelloCustom: {
    appBarHeight: '64px',
    boardBarHeight: '58px',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange,
      },
    },
    dark: {
      palette: {
        primary: blueGrey,
        secondary: orange,
      },
    },
  },
});

export default theme;