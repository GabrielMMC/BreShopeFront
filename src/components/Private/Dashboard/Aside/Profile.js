import React from "react";
import { Outlet, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import UserData from "../User/UserData";
import Container from "../../../Utilities/Container";
import ProfileMenu from "./ProfileMenu";
import Aside from "./Aside";
import './styles.css';

const Profile = () => {
  const [open, setOpen] = React.useState(false)
  const location = useLocation()
  const breshop = useSelector(state => state.AppReducer.breshop)
  console.log('breshop', breshop)

  return (
    <Container>
      <div className='box p-3'>
        <div className='row'>
          <ProfileMenu breshop={breshop} open={open} setOpen={setOpen} />
          <div className='col-md-3 d-md-block d-none'>
            <Aside breshop={breshop} />
          </div>
          <div className='col-md-9 p-0'>
            {location.pathname === '/profile' ? <UserData /> : <Outlet />}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
