import React, { useCallback, useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { logout, mudarDados } from '../../components/actions/AppActions';
import { useDispatch, useSelector } from 'react-redux';
import user4 from '../../assets/no_user.png';
import { MdExitToApp } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { FaBars } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import { IconButton, Input } from '@mui/material';
import { MdSearch } from 'react-icons/md';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { GET_FETCH, STORAGE_URL } from '../../variables';
import Cart from './Cart';
import Wishlist from './Wishlist';

const Navbar = (props) => {
  const search = useSelector(store => store.AppReducer.search);
  const [menu, setMenu] = useState(false);
  const [cart, setCart] = useState(false);
  const [navSearch, setNavSearch] = useState(search);
  const history = useNavigate()
  const dispatch = useDispatch();
  const user = useSelector(store => store.AppReducer.user);

  let timer
  const handleSearchChange = (e) => {
    setNavSearch(e.target.value)
    clearTimeout(timer)
    timer = setTimeout(() => {
      history('/')
      dispatch({ type: 'search', payload: e.target.value })
    }, 750)
  }

  const toggle = useCallback(() => {
    setMenu(!menu)
  }, [menu]);

  const logout_ = useCallback(() => {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    dispatch(logout());
    history('/login')
  }, []);

  return (
    <nav className='w-100 bg-purple'>
      <div className="w-principal d-flex justify-content-between align-items-center m-auto">
        <div className="ms-3" style={{ maxWidth: 75, maxHeight: 75 }}>
          <Link to={'/'}><img className='img-fluid' src={logo} alt='logo'></img></Link>
        </div>


        <div className='d-flex align-items-center'>
          <div className="input-group-with-icon">
            <input type="text" className='search-container' placeholder='Buscar por produto ou loja...' value={navSearch} onChange={handleSearchChange} />
            <div className="icon-button">
              <MdSearch className='search-icon' size={25} color='#747474' />
            </div>
          </div>

          <div className="d-flex me-3">
            <Wishlist />
            <Cart open={cart} />
          </div>

          <div className="me-3 bg-purple">
            <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
              <DropdownToggle className="btn header-item waves-effect" id="page-header-user-dropdown" tag="button">
                <img className="rounded-circle header-profile-user" src={`${STORAGE_URL}/${user.file ? user.file : 'no_user.png'}`} onError={(e) => e.target.src = user4} height="50" width='50' style={{ objectFit: "cover", backgroundColor: '#fff' }} alt="Header Avatar" />
              </DropdownToggle>
              <DropdownMenu end>
                {user.id ?
                  <>
                    <Link to={`/profile`} className='navlink'>
                      <DropdownItem className='dropdown-active'><CgProfile style={{ marginRight: 5 }} /> Minha Conta</DropdownItem>
                    </Link>
                    <DropdownItem onClick={logout_} className='navlink dropdown-active'>
                      <MdExitToApp style={{ marginRight: 5 }} />Sair
                    </DropdownItem>
                  </>
                  :
                  <>
                    <Link to={`/register`} className='navlink'>
                      <DropdownItem className='dropdown-active'><MdExitToApp style={{ marginRight: 5 }} /> Criar Conta</DropdownItem>
                    </Link>
                    <Link to={`/login`} className='navlink'>
                      <DropdownItem className='dropdown-active'><CgProfile style={{ marginRight: 5 }} />Entrar</DropdownItem>
                    </Link>
                  </>}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;