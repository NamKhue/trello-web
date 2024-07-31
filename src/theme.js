import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

const APP_BAR_HEIGHT = "48px";
const BOARD_BAR_HEIGHT = "75px";
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`;

const COLUMN_HEADER_HEIGHT = "50px";
const COLUMN_FOOTER_HEIGHT_UNACTIVE = "40px";
const COLUMN_FOOTER_HEIGHT_ACTIVE = "55px";

const MODAL_CARD_WIDTH = "650px";

// light
const COLOR_C200D3 = "#C200D3";
const COLOR_EAC9F5 = "#EAC9F5";
const COLOR_1E0734 = "#1E0734";
const COLOR_C284CD = "#C284CD";
const COLOR_790283 = "#790283";
const COLOR_B5BEC7 = "#B5BEC7";
const COLOR_7236AE = "#7236AE";
const COLOR_9357CF = "#9357CF";
const COLOR_7852A9 = "#7852A9";
const COLOR_D9D9D9 = "#D9D9D9";
const COLOR_F5F5F5 = "#F5F5F5";
const COLOR_FCFCFC = "#FCFCFC";
const COLOR_E0E0E0 = "#E0E0E0";
const COLOR_49454E = "#49454E";
const COLOR_818181 = "#818181";
const COLOR_F8F8F8 = "#F8F8F8";
const COLOR_EEEEEE = "#EEEEEE";
const COLOR_7115BA = "#7115BA";
const COLOR_C985FF = "#C985FF";
const COLOR_C78FFF = "#C78FFF";
const COLOR_E6E6E6 = "#E6E6E6";
const COLOR_313131 = "#313131";
const COLOR_C0C0C0 = "#C0C0C0";
const COLOR_DDADF0 = "#DDADF0";
const COLOR_5B2E88 = "#5B2E88";
const COLOR_EBD2FF = "#EBD2FF";
const COLOR_8025C0 = "#8025C0";
const COLOR_8A8A8A = "#8A8A8A";
const COLOR_E2E2E2 = "#E2E2E2";
const COLOR_ECECEC = "#ECECEC";
const COLOR_DDDDDD = "#DDDDDD";
const COLOR_8B8B8B = "#8B8B8B";
const COLOR_1C1B1F = "#1C1B1F";

// dark
const COLOR_13091B = "#13091B";
const COLOR_3C1C64 = "#3C1C64";
const COLOR_51247C = "#51247C";
const COLOR_281E38 = "#281E38";
const COLOR_1E252A = "#1E252A";
const COLOR_5D5D5D = "#5D5D5D";
const COLOR_D7D7D7 = "#D7D7D7";
const COLOR_200535 = "#200535";
const COLOR_272727 = "#272727";
const COLOR_8C25DE = "#8C25DE";
const COLOR_565656 = "#565656";
const COLOR_432065 = "#432065";
const COLOR_8A2DCB = "#8A2DCB";
const COLOR_6A2D96 = "#6A2D96";
const COLOR_411A61 = "#411A61";
const COLOR_463666 = "#463666";

// priority
const COLOR_268FB0 = "#268FB0";
const COLOR_D9F4F8 = "#D9F4F8";
const COLOR_E3590B = "#E3590B";
const COLOR_FFBA92 = "#FFBA92";
const COLOR_6F09AE = "#6F09AE";
const COLOR_CE85FB = "#CE85FB";

// status
const COLOR_188544 = "#188544";
const COLOR_CDF4DD = "#CDF4DD";
const COLOR_989212 = "#989212";
const COLOR_FFEB4F = "#FFEB4F";
const COLOR_DF0606 = "#DF0606";
const COLOR_FF9D9D = "#FF9D9D";

//
const theme = extendTheme({
  trelloCustom: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeightUnactive: COLUMN_FOOTER_HEIGHT_UNACTIVE,
    columnFooterHeightActive: COLUMN_FOOTER_HEIGHT_ACTIVE,
    MODAL_CARD_WIDTH: MODAL_CARD_WIDTH,

    // light
    COLOR_C200D3: COLOR_C200D3,
    COLOR_EAC9F5: COLOR_EAC9F5,
    COLOR_1E0734: COLOR_1E0734,
    COLOR_C284CD: COLOR_C284CD,
    COLOR_790283: COLOR_790283,
    COLOR_B5BEC7: COLOR_B5BEC7,
    COLOR_7236AE: COLOR_7236AE,
    COLOR_9357CF: COLOR_9357CF,
    COLOR_7852A9: COLOR_7852A9,
    COLOR_D9D9D9: COLOR_D9D9D9,
    COLOR_F5F5F5: COLOR_F5F5F5,
    COLOR_FCFCFC: COLOR_FCFCFC,
    COLOR_E0E0E0: COLOR_E0E0E0,
    COLOR_49454E: COLOR_49454E,
    COLOR_818181: COLOR_818181,
    COLOR_F8F8F8: COLOR_F8F8F8,
    COLOR_EEEEEE: COLOR_EEEEEE,
    COLOR_7115BA: COLOR_7115BA,
    COLOR_C985FF: COLOR_C985FF,
    COLOR_C78FFF: COLOR_C78FFF,
    COLOR_E6E6E6: COLOR_E6E6E6,
    COLOR_313131: COLOR_313131,
    COLOR_C0C0C0: COLOR_C0C0C0,
    COLOR_DDADF0: COLOR_DDADF0,
    COLOR_5B2E88: COLOR_5B2E88,
    COLOR_EBD2FF: COLOR_EBD2FF,
    COLOR_8025C0: COLOR_8025C0,
    COLOR_8A8A8A: COLOR_8A8A8A,
    COLOR_E2E2E2: COLOR_E2E2E2,
    COLOR_ECECEC: COLOR_ECECEC,
    COLOR_DDDDDD: COLOR_DDDDDD,
    COLOR_8B8B8B: COLOR_8B8B8B,
    COLOR_1C1B1F: COLOR_1C1B1F,

    // dark
    COLOR_13091B: COLOR_13091B,
    COLOR_3C1C64: COLOR_3C1C64,
    COLOR_51247C: COLOR_51247C,
    COLOR_281E38: COLOR_281E38,
    COLOR_1E252A: COLOR_1E252A,
    COLOR_5D5D5D: COLOR_5D5D5D,
    COLOR_D7D7D7: COLOR_D7D7D7,
    COLOR_200535: COLOR_200535,
    COLOR_272727: COLOR_272727,
    COLOR_8C25DE: COLOR_8C25DE,
    COLOR_565656: COLOR_565656,
    COLOR_432065: COLOR_432065,
    COLOR_8A2DCB: COLOR_8A2DCB,
    COLOR_6A2D96: COLOR_6A2D96,
    COLOR_411A61: COLOR_411A61,
    COLOR_463666: COLOR_463666,

    // priority
    COLOR_188544: COLOR_188544,
    COLOR_CDF4DD: COLOR_CDF4DD,
    COLOR_989212: COLOR_989212,
    COLOR_FFEB4F: COLOR_FFEB4F,
    COLOR_DF0606: COLOR_DF0606,
    COLOR_FF9D9D: COLOR_FF9D9D,

    // status
    COLOR_268FB0: COLOR_268FB0,
    COLOR_D9F4F8: COLOR_D9F4F8,
    COLOR_E3590B: COLOR_E3590B,
    COLOR_FFBA92: COLOR_FFBA92,
    COLOR_6F09AE: COLOR_6F09AE,
    COLOR_CE85FB: COLOR_CE85FB,
  },

  //
  colorSchemes: {},

  //
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

  //
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#d2d4dc",
            // backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#242735' : '#d2d4dc'),
            borderRadius: "8px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#c7c7c7",
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
          textTransform: "none",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: "0.875rem",
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          "&.MuiTypography-body1": {
            fontSize: "0.875rem",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: "0.875rem",
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.light,
          },
          "&:hover": {
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
          },
        }),
      },
    },
  },
});

export default theme;
