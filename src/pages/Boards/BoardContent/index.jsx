import Box from '@mui/material/Box';

function BoardContent() {
  return (
    <Box px={2} sx={{
      color: 'white',
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#2e3032' : '#1784f0'),
      width: '100%',
      height: (theme) => `calc(100vh - (${theme.trelloCustom.appBarHeight} + ${theme.trelloCustom.boardBarHeight}))`,
      display: 'flex',
      alignItems: 'center',
    }}>
      Board content
    </Box>
  )
}

export default BoardContent
