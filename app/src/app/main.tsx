import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Providers } from './providers/Providers'

import './globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
)
