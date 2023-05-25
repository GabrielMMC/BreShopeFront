import { createTheme, ThemeProvider } from '@mui/material'
import { ToastContent } from './components/Utilities/Alerts'
import RoutesContainer from './components/Routes/RoutesContainer';

function App() {
  const Theme = createTheme({
    palette: {
      primary: { main: '#693B9F' },
      secondary: { main: '#1976d2' },
      yellow: { main: '#F5C469' },
      gray: { main: '#382F2D' },
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
