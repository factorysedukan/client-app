import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Routing from './components/Routing/Routing'
import { ThemeProvider } from '@mui/material/styles';
import theme from './assets/Theme'
function App() {
  const [count, setCount] = useState(0)
 
  return (
    <ThemeProvider theme={theme}>
    <div className="App" style={{background:'white'}}>
      
      <Routing/>
    </div>
    </ThemeProvider>
  )
}

export default App
