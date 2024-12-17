import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { UserDataProvider } from './Components/Context/UserData.context.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <UserDataProvider>
    <App />
  </UserDataProvider>
)
