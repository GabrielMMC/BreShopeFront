import React from "react";
import { ProSidebar, Menu, MenuItem, SidebarFooter, SidebarContent, SubMenu } from "react-pro-sidebar";
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux';

const Aside = ({ collapsed }) => {
  const history = useNavigate()
  // let user = useSelector(store => store.AppReducer.user);

  return (
    <nav className="user-dash">
      <ul>
        <li className='hvr-grow' onClick={() => history('/profile')}>
          <span />
          <a className='small' style={{ color: 'black' }}>Dados Gerais</a>
        </li>
        <li className='hvr-grow' onClick={() => history('/profile/address')}>
          <span />
          <a className='small' style={{ color: 'black' }}>Endereços</a>
        </li>
        <li className='hvr-grow' onClick={() => history('/profile/payment')}>
          <span />
          <a className='small' style={{ color: 'black' }}>Cartões</a>
        </li>
        <li className='hvr-grow' onClick={() => history('/profile/orders')}>
          <span />
          <a className='small' style={{ color: 'black' }}>Pedidos</a>
        </li>
        <li className='hvr-grow' onClick={() => history('/profile/breshop')}>
          <span />
          <a className='small' style={{ color: 'black' }}>Minha loja</a>
        </li>
        <li className='hvr-grow' onClick={() => history('/profile/products')}>
          <span />
          <a className='small' style={{ color: 'black' }}>Meus produtos</a>
        </li>
      </ul>
    </nav>
  );
};

export default Aside;
