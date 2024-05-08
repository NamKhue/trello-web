// import React from 'react'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'

// libs for flash noti
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// cấu hình MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm'

// modal
import ModalProvider from 'mui-modal-provider'

import App from './App.jsx'
import theme from './theme.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <CssVarsProvider theme={theme}>
    <ConfirmProvider
      defaultOptions={{
        dialogProps: { maxWidth: 'xs' },
        confirmationButtonProps: { variant: 'outlined', color: 'info' },
        cancellationButtonProps: { color: 'error' },
        allowClose: false
      }}
    >
      <CssBaseline />
      
      <ModalProvider>
        <App />
      </ModalProvider>

      <ToastContainer position='bottom-left' theme='colored' />
      
    </ConfirmProvider>
  </CssVarsProvider>
)
