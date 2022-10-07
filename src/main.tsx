import { MantineProvider } from '@mantine/core'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AppContextProvider } from './AppContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppContextProvider >
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
    </AppContextProvider>
  </React.StrictMode>
)
