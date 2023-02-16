import React from "react";
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from "../IndexPage/Navbar";
import Aside from "./Aside";
import Data from "./Data";
import './styles.css';

const Profile = () => {
  const location = useLocation()
  return (
    <div className='content'>
      <Navbar />
      <div className='container p-3'>
        <div className='row'>
          <div className='col-3'>
            <Aside />
          </div>
          <div className='col-9'>
            {location.pathname === '/profile' ? <Data /> : <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
