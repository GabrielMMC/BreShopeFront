import React from "react";
import { ProSidebar, Menu, MenuItem, SidebarFooter, SidebarContent, SubMenu } from "react-pro-sidebar";
import { NavLink } from "react-router-dom";
// import { useSelector, useDispatch } from 'react-redux';

const Aside = ({ collapsed }) => {
  // let user = useSelector(store => store.AppReducer.user);

  return (
    <nav className="user-dash">
      <ul>
        <li className='hvr-grow'>
          <span />
          <a className='small'><NavLink exact to="/profile" style={{ color: "#212529" }} activeStyle={{ fontWeight: "bold" }}>Dados Gerais</NavLink></a>
        </li>
        <li className='hvr-grow'>
          <span />
          <a className='small'><NavLink exact to="/profile/address" style={{ color: "#212529" }} activeStyle={{ fontWeight: "bold" }}>Endereços</NavLink></a>
        </li>
        <li className='hvr-grow'>
          <span />
          <a className='small'><NavLink exact to="/profile/payment" style={{ color: "#212529" }} activeStyle={{ fontWeight: "bold" }}>Cartões</NavLink></a></li>
        <li className='hvr-grow'>
          <span />
          <a className='small'><NavLink exact to="/profile/orders" style={{ color: "#212529" }} activeStyle={{ fontWeight: "bold" }}>Pedidos</NavLink></a></li>
      </ul>
    </nav>
  );
};

export default Aside;
