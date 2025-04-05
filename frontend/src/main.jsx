import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { Toaster } from 'react-hot-toast'
import { ProductProvider } from './context/FarmerContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <ProductProvider>
      <Toaster/>
      <App />
      </ProductProvider>
    </UserProvider>
  </StrictMode>,
)