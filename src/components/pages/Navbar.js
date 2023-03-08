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
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { GET_FETCH, STORAGE_URL } from '../../variables';
import Cart from './Cart';

const Navbar = (props) => {
  const [menu, setMenu] = useState(false);
  const [cart, setCart] = useState(false);
  const history = useNavigate()
  const dispatch = useDispatch();
  const user = useSelector(store => store.AppReducer.user);

  const token = useSelector(state => state.AppReducer.token)
  const toggled = useSelector(store => store.AppReducer.toggled)
  const collapsed = useSelector(store => store.AppReducer.collapsed)

  const handleCollapsedChange = (checked) => {
    dispatch(mudarDados({ collapsed: checked }));

  };

  const handleToggleSidebar = (value) => {
    // setToggled(value);
    dispatch(mudarDados({ toggled: value }));
  };

  const handleToggleCart = async () => {
    setCart(!cart)
    if (cart) {
      const response = await GET_FETCH({ url: 'cart', token })
      console.log('resp cart', response)
    }
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
    <nav className='navlink bg-purple'>
      <div className="ms-3" style={{
        color: '#ececf1'
      }} onClick={() => {
        if (window.innerWidth <= 768) {
          handleToggleSidebar(!toggled)

        }
        else {
          handleCollapsedChange(!collapsed)

        }
      }}>
        <FaBars />
      </div>

      <div className="ms-3" style={{ maxWidth: 75, maxHeight: 75 }}>
        <Link to={'/'}><img className='img-fluid' src={logo} alt='logo'></img></Link>
      </div>

      <div className="d-flex me-3 ms-auto bg-white rounded p-1">
        <Input fullWidth placeholder='Buscar...' endAdornment={<SearchIcon />} onChange={(e) => console.log('dev')}></Input>
      </div>

      <div className="d-flex me-3">
        <IconButton><FavoriteIcon sx={{ color: 'white' }} /></IconButton>
        <Cart open={cart} handleToggleCart={handleToggleCart} />
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
                  <DropdownItem><CgProfile style={{ marginRight: 5 }} /> Minha Conta</DropdownItem>
                </Link>
                <DropdownItem onClick={logout_} className='navlink'>
                  <MdExitToApp style={{ marginRight: 5 }} />Sair
                </DropdownItem>
              </>
              :
              <>
                <Link to={`/register`} className='navlink'>
                  <DropdownItem><MdExitToApp style={{ marginRight: 5 }} /> Criar Conta</DropdownItem>
                </Link>
                <Link to={`/login`} className='navlink'>
                  <DropdownItem><CgProfile style={{ marginRight: 5 }} />Entrar</DropdownItem>
                </Link>
              </>}
          </DropdownMenu>
        </Dropdown>
      </div>
    </nav>
  );
}

export default Navbar;