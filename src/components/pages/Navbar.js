import React, { useCallback, useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { logout, mudarDados } from '../../components/actions/AppActions';
import { useDispatch, useSelector } from 'react-redux';

// users
import user4 from '../../assets/no_user.png';
import { MdExitToApp } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { FaBars } from 'react-icons/fa';

const Navbar = (props) => {
  const [menu, setMenu] = useState(false);
  const history = useNavigate()
  const dispatch = useDispatch();
  const user = useSelector(store => store.AppReducer.user);

  const toggled = useSelector(store => store.AppReducer.toggled)
  const collapsed = useSelector(store => store.AppReducer.collapsed)

  const handleCollapsedChange = (checked) => {
    dispatch(mudarDados({ collapsed: checked }));

  };

  const handleToggleSidebar = (value) => {
    // setToggled(value);
    dispatch(mudarDados({ toggled: value }));
  };

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
      <div className="ms-auto me-3 bg-purple">
        <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
          <DropdownToggle className="btn header-item waves-effect" id="page-header-user-dropdown" tag="button">
            <img className="rounded-circle header-profile-user" src={user4} onError={(e) => e.target.src = user4} height="50" width='50' style={{ objectFit: "cover", backgroundColor: '#fff' }} alt="Header Avatar" />
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