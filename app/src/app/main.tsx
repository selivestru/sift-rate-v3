import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Providers } from './providers/Providers'

import '@fontsource-variable/geist/wght.css'
import './globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
)
