import React from 'react';
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarFooter, SidebarContent, SubMenu } from 'react-pro-sidebar';
import { FaGem, FaShoppingCart } from 'react-icons/fa';
import { HiHome } from 'react-icons/hi';
import sidebarBg from './assets/bg1.jpg';
import { NavLink } from 'react-router-dom';
import { MdCopyright } from 'react-icons/md';
import Logo from '../../../../assets/es-logo-branco.png';
import HomeIcon from '@mui/icons-material/Home';
// import { useSelector, useDispatch } from 'react-redux';


const Aside = ({ image, collapsed, toggled, handleToggleSidebar }) => {
  // let user = useSelector(store => store.AppReducer.user);


  return (
    <ProSidebar
      image={image ? sidebarBg : false}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      style={{ position: 'fixed' }}
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader style={{ background: '#222d32', height: 70 }}>
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: "center",
            alignItems: 'center'
          }}
        >
          {collapsed === true && <span>
            <img src={Logo} alt="" height='60' style={{
              height: '60px',
              width: '90%',
              objectFit: 'contain'
            }} />
          </span>}
          {collapsed === false && <i>
            <img className="img-fluid" src={Logo} alt="" height="100" style={{ height: '40px' }} />
          </i>}
        </div>
      </SidebarHeader>
      <SidebarContent style={{ background: '#222d32' }}>
        <Menu iconShape="circle">

          <MenuItem icon={<FaGem />}><NavLink exact to="/home" activeStyle={{
            fontWeight: "bold",
            color: "white"
          }}>Dashboard</NavLink></MenuItem>

          <MenuItem icon={<HiHome />}>
            <NavLink exact to="/home/breshop" activeStyle={{
              fontWeight: "bold",
              color: "white"
            }}>Loja
            </NavLink>
          </MenuItem>

          <MenuItem icon={<FaShoppingCart />}>
            <NavLink exact to="/home/products" activeStyle={{
              fontWeight: "bold",
              color: "white"
            }}>Produtos
            </NavLink>
          </MenuItem>

          {/* <SubMenu title="Produtos" icon={<FaShoppingCart />}>
            <MenuItem icon={<HomeIcon />}>
              <NavLink exact to="/home/product/add" activeStyle={{
                fontWeight: "bold",
                color: "white"
              }}>Cadastrar
              </NavLink>
            </MenuItem>

            <MenuItem icon={<HomeIcon />}>
              <NavLink exact to="/home/products" activeStyle={{
                fontWeight: "bold",
                color: "white"
              }}>Lista
              </NavLink>
            </MenuItem>
          </SubMenu> */}
        </Menu>
      </SidebarContent>

      <SidebarFooter style={{ textAlign: 'center', background: '#222d32' }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: '20px 24px',
          }}
        >
          <a
            href="http://www.verdaz.com.br"
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
          >
            <MdCopyright />
            <span> {'CopyRight 2022 MeetES'}</span>
          </a>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default Aside;
