import React, { useCallback, useState } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar';
import { FaUserAlt, FaTruckMoving, FaBriefcase, FaFolderPlus, FaCog, FaChartLine, FaRegComments, FaRecycle, FaUserNinja, FaUserSecret, FaGem, FaShieldAlt } from 'react-icons/fa';
import sidebarBg from './assets/bg1.jpg';
import { NavLink } from 'react-router-dom';
import { MdCopyright } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import Logo from '../../../../assets/es-logo-branco.png';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';


const Aside = ({ image, collapsed, toggled, handleToggleSidebar }) => {
  // #084808
  let user = useSelector(store => store.AppReducer.user);


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
          {collapsed == true && <span>
            <img src={Logo} alt="" height='60' style={{
              height: '60px',
              width: '90%',
              objectFit: 'contain'
            }} />
          </span>}
          {collapsed == false && <i>
            <img className="img-fluid" src={Logo} alt="" height="100" style={{ height: '40px' }} />
          </i>}
        </div>
      </SidebarHeader>
      <SidebarContent style={{ background: '#222d32' }}>
        <Menu iconShape="square">

          <MenuItem icon={<FaGem />}><NavLink exact to="/home" activeStyle={{
            fontWeight: "bold",
            color: "white"
          }}>Dashboard</NavLink></MenuItem>

          {/* <MenuItem icon={<FaGem />}> {'Cadastros'}</MenuItem> */}
          {/* {<SubMenu title="Cadastros" icon={<FaFolderPlus />}>
            {<MenuItem  > <NavLink exact to="/home" activeStyle={{
              fontWeight: "bold",
              color: "white"
            }}>Teste</NavLink></MenuItem>}
            {<MenuItem  > <NavLink exact to="/home/list" activeStyle={{
              fontWeight: "bold",
              color: "white"
            }}>Usuários</NavLink></MenuItem>}
            {<MenuItem  > <NavLink exact to="/home/news/list" activeStyle={{
              fontWeight: "bold",
              color: "white"
            }}>NewsLetter</NavLink></MenuItem>}

          </SubMenu>} */}

            <MenuItem>
            <NavLink exact to="/home/breshop" activeStyle={{
              fontWeight: "bold",
              color: "white"
            }}><HomeIcon />
            </NavLink>
            </MenuItem>

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
