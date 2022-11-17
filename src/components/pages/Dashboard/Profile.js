import { ThemeProvider } from '@mui/material'
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Theme from '../../routes/Theme/Theme'
import Navbar from '../Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { mudarDados } from '../../actions/AppActions'
import Aside from '../Private/SideBar/Aside'

const Profile = () => {
  const toggled = useSelector(store => store.AppReducer.toggled)
  const collapsed = useSelector(store => store.AppReducer.collapsed)

  const dispatch = useDispatch();
  const handleCollapsedChange = (checked) => {
    dispatch(mudarDados({ collapsed: checked }));

  };

  const handleToggleSidebar = (value) => {
    // setToggled(value);
    dispatch(mudarDados({ toggled: value }));
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
    window.addEventListener('resize', event)
    if (window.innerWidth <= 768) {
      dispatch(mudarDados({ toggled: false, collapsed: false }));
    }
    else {
      dispatch(mudarDados({ toggled: true, collapsed: true }));
    }
    // GetRole();

    return () => {
      window.removeEventListener('resize', event);

      // Anything in here is fired on component unmount.
    }
  }, [])
  const location = useLocation()
  const marginLeft = (!toggled || window.innerWidth <= 768) ? 0 : (!collapsed ? 270 : 80);
  console.log(location);
  return (
    <ThemeProvider theme={Theme}>
      <Navbar />
      <div className={`app ${toggled ? 'toggled' : ''}`}>
        <Aside
          collapsed={collapsed}
          toggled={toggled}
          handleToggleSidebar={handleToggleSidebar}
          handleCollapsedChange={handleCollapsedChange}
        />
        <div className="content-page">
          <div className="content mt-5 m-auto" style={{ marginLeft: marginLeft }}>
            <div className="container-fluid">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default Profile