import { ThemeProvider } from '@mui/material'
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Theme from '../../routes/Theme/Theme'
import Navbar from '../Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { mudarDados } from '../../actions/AppActions'
import Aside from '../Private/SideBar/Aside'
import Data from '../../routes/User/Data'
import Footer from '../Footer'

const Profile = () => {
  const toggled = useSelector(store => store.AppReducer.toggled)
  const collapsed = useSelector(store => store.AppReducer.collapsed)

  const dispatch = useDispatch();
  const handleCollapsedChange = (checked) => {
    dispatch(mudarDados({ collapsed: checked }));
  };

  const handleToggleSidebar = () => {
    dispatch(mudarDados({ toggled: !toggled }));
  };

  React.useEffect(() => {
    const event = (e) => {
      if (window.innerWidth <= 768) {
        dispatch(mudarDados({ toggled: false, collapsed: false }));

      }
      else {
        dispatch(mudarDados({ toggled: true, collapsed: true }));
      }
    };

    return () => {
      window.removeEventListener('resize', event);
    }
  }, [])
  const location = useLocation()
  console.log('toggled', toggled, collapsed);
  return (
    <ThemeProvider theme={Theme}>
      <Navbar />
      <div className={`app ${toggled && 'toggled'}`}>
        <Aside collapsed={collapsed} toggled={toggled} handleToggleSidebar={handleToggleSidebar} handleCollapsedChange={handleCollapsedChange} />
        <div className="content-page">
          <div className="container-fluid">
            {location.pathname === '/profile' ? <Data /> : <Outlet />}
          </div>
        </div>
      </div>
      <Footer />
    </ThemeProvider>
  )
}

export default Profile