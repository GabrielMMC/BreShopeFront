import React, { useCallback, useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../Reducers/AppActions';
import { useDispatch, useSelector } from 'react-redux';
import user4 from '../../assets/no_user.png';
import { MdExitToApp } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import logo from '../../assets/logo.png';
import { MdSearch } from 'react-icons/md';
import { STORAGE_URL } from '../../variables';
import Cart from './Cart';
import Wishlist from './Wishlist';
import noUser from '../../assets/no_user.png'

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
      <div className="w-principal d-flex justify-content-sm-between justify-content-center align-items-center m-auto">
        <div className="ms-3 d-none d-sm-block">
          <Link to={'/'}><img style={{ minWidth: 75, minHeight: 75, width: 75, height: 75 }} className='img-fluid' src={logo} alt='logo'></img></Link>
        </div>


        <div className='d-flex align-items-center'>
          <div className="input-group-with-icon">
            <input type="text" className='search-container' placeholder='Buscar por produtos ou lojas...' value={navSearch} onChange={handleSearchChange} />
          </div>

          <div className="d-flex me-sm-3">
            <Wishlist />
            <Cart open={cart} />
          </div>

          <div className="me-sm-3 bg-purple">
            <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
              <DropdownToggle className="btn header-item waves-effect" id="page-header-user-dropdown" tag="button">
                <img className="rounded-circle header-profile-user" src={user.file ? `${STORAGE_URL}/${user.file}` : noUser} onError={(e) => e.target.src = user4} height="50" width='50' style={{ objectFit: "cover", backgroundColor: '#fff' }} alt="Header Avatar" />
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


    // <nav className='navbar navbar-expand-lg navbar-dark w-100 bg-purple'>
    //   <div className="container-fluid w-principal d-flex align-items-center">
    //     {/* <div className="navbar-brand ms-3" style={{ maxWidth: 75, maxHeight: 75 }}> */}
    //     <Link className='navbar-brand' to='/'><img style={{ width: 75, height: 75 }} src={logo} alt='logo'></img></Link>
    //     {/* </div> */}
    //     <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    //       <span className="navbar-toggler-icon"></span>
    //     </button>
    //     {/* <div className="d-flex"> */}
    //     <div className="collapse navbar-collapse" id="navbarSupportedContent">
    //       <ul className="navbar-nav mb-2 mb-lg-0 d-flex ms-auto flex-reverse">
    //         <li className="nav-item">
    //           <div className="input-group-with-icon">
    //             <input type="text" className='search-container' placeholder='Buscar por produto ou loja...' value={navSearch} onChange={handleSearchChange} />
    //             <div className="icon-button">
    //               <MdSearch className='search-icon' size={25} color='#747474' />
    //             </div>
    //           </div>
    //         </li>

    //         <li className="nav-item align-items-center d-flex">
    //           <div className="d-flex me-3">
    //             <Wishlist />
    //             <Cart open={cart} />
    //           </div>
    //         </li>

    //         <li className="nav-item align-items-center d-flex">
    //           <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
    //             <DropdownToggle className="btn header-item waves-effect" id="page-header-user-dropdown" tag="button">
    //               <img className="rounded-circle header-profile-user" src={user.file ? `${STORAGE_URL}/${user.file}` : noUser} onError={(e) => e.target.src = user4} height="50" width='50' style={{ objectFit: "cover", backgroundColor: '#fff' }} alt="Header Avatar" />
    //             </DropdownToggle>
    //             <DropdownMenu end>
    //               {user.id ?
    //                 <>
    //                   <Link to={`/profile`} className='navlink'>
    //                     <DropdownItem className='dropdown-active'><CgProfile style={{ marginRight: 5 }} /> Minha Conta</DropdownItem>
    //                   </Link>
    //                   <DropdownItem onClick={logout_} className='navlink dropdown-active'>
    //                     <MdExitToApp style={{ marginRight: 5 }} />Sair
    //                   </DropdownItem>
    //                 </>
    //                 :
    //                 <>
    //                   <Link to={`/register`} className='navlink'>
    //                     <DropdownItem className='dropdown-active'><MdExitToApp style={{ marginRight: 5 }} /> Criar Conta</DropdownItem>
    //                   </Link>
    //                   <Link to={`/login`} className='navlink'>
    //                     <DropdownItem className='dropdown-active'><CgProfile style={{ marginRight: 5 }} />Entrar</DropdownItem>
    //                   </Link>
    //                 </>}
    //             </DropdownMenu>
    //           </Dropdown>
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    // </nav>
  );
}

export default Navbar;