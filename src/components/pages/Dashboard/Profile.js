import React from "react";
import { Outlet, useLocation } from 'react-router-dom'
import Container from "../Container";
import { useNavigate } from 'react-router-dom'
import Data from "./Data";
import './styles.css';

const Profile = () => {
  const location = useLocation()
  const history = useNavigate()

  return (
    <Container>
      <div className='box p-3'>
        <div className='row'>
          <div className='col-3'>
            <nav className="user-dash">
              <ul>
                <li className='hvr-grow' onClick={() => history('/profile')}>
                  <span />
                  <p className='small' style={{ color: 'black' }}>Dados Gerais</p>
                </li>
                <li className='hvr-grow' onClick={() => history('/profile/address')}>
                  <span />
                  <p className='small' style={{ color: 'black' }}>Endereços</p>
                </li>
                <li className='hvr-grow' onClick={() => history('/profile/payment')}>
                  <span />
                  <p className='small' style={{ color: 'black' }}>Cartões</p>
                </li>
                <li className='hvr-grow' onClick={() => history('/profile/orders')}>
                  <span />
                  <p className='small' style={{ color: 'black' }}>Pedidos</p>
                </li>
                <li className='hvr-grow' onClick={() => history('/profile/breshop')}>
                  <span />
                  <p className='small' style={{ color: 'black' }}>Minha loja</p>
                </li>
                <li className='hvr-grow' onClick={() => history('/profile/products')}>
                  <span />
                  <p className='small' style={{ color: 'black' }}>Meus produtos</p>
                </li>
              </ul>
            </nav>
          </div>
          <div className='col-9 p-sm-3'>
            {location.pathname === '/profile' ? <Data /> : <Outlet />}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
