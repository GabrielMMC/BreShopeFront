import React from "react";
import { Outlet, useLocation } from 'react-router-dom'
import Container from "../Container";
import Navbar from "../Navbar";
import Aside from "./Aside";
import Data from "./Data";
import './styles.css';

const Profile = () => {
  const location = useLocation()
  return (
    <Container>
      <div className='row'>
        <div className='col-3'>
          <Aside />
        </div>
        <div className='col-9'>
          {location.pathname === '/profile' ? <Data /> : <Outlet />}
        </div>
      </div>
    </Container>
  );
};

export default Profile;
