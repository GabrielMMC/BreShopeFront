import RoutesContainer from './components/routes'
import { createTheme, ThemeProvider } from '@mui/material'
import { ToastContent } from './components/utilities/Alerts'
import './components/pages/Styles/style.css'

function App() {

  const Theme = createTheme({
    palette: {
      primary: { main: '#693B9F' },
      secondary: { main: '#1976d2' },
      yellow: { main: '#F5C469' },
    }
  })

  return (
    <div className="App">
      <ThemeProvider theme={Theme}>
        <RoutesContainer />
        <ToastContent />
      </ThemeProvider>
    </div>
  );
}

export default App;
