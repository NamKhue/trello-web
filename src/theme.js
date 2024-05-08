import { experimental_extendTheme as extendTheme} from '@mui/material/styles'

const APP_BAR_HEIGHT = '58px'
const BOARD_BAR_HEIGHT = '60px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`

const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '50px'

const theme = extendTheme({
  trelloCustom: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT,
  },
  colorSchemes: {},
  // components: {
  //   MuiCssBaseline: {
  //     styleOverrides: {
  //       body: {
  //         '*::-webkit-scrollbar': {
  //           height: '6px',
  //         },
  //         '*::-webkit-scrollbar-thumb': {
  //           backgroundColor: '#bdc3c7',
  //           borderRadius: '8px',
  //         },
  //         '*::-webkit-scrollbar-thumb:hover': {
  //           backgroundColor: '#989a9c',
  //         },
  //       },
  //     },
  //   },
  //   MuiButton: {
  //     styleOverrides: {
  //       root: {
  //         textTransform: 'none',
  //         borderWidth: '0.5px',
  //       },
  //     },
  //   },
  //   MuiInputLabel: {
  //     styleOverrides: {
  //       root: {
  //         fontSize: '0.875rem',
  //       },
  //     },
  //   },
  //   MuiOutlinedInput: {
  //     styleOverrides: {
  //       root: {
  //         fontSize: '0.875rem',
  //       },
  //     },
  //   },
  // },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#d2d4dc',
            // backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#242735' : '#d2d4dc'),
            borderRadius: '8px',
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#c7c7c7',
            // backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1f222f' : '#b7bac2'),
          },

          // '&::-webkit-scrollbar-thumb': {
          //   backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#242735' : '#d2d4dc'),
          // },
          // '&::-webkit-scrollbar-thumb:hover': {
          //   backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1f222f' : '#b7bac2'),
          // },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: '0.875rem',
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': {
            fontSize: '0.875rem',
          }
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: '0.875rem',
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.light,
          },
          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
          },
        }),
      },
    },
  },
})

export default theme
