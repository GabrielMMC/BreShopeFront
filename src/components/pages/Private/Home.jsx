import React, { useEffect, useState } from 'react';
import { URL } from '../../../variables';
import { useSelector, useDispatch } from 'react-redux';
import Aside from './SideBar/Aside';

import { mudarDados } from '../../../components/actions/AppActions';
// import { Route, Switch } from 'react-router';
import { BrowserRouter, Route, Routes, Switch, Redirect, Router, useParams, useMatch, useLocation, Outlet } from "react-router-dom";


import Request from './Request';

import Header from './Header';
// import { BrowserRouter } from 'react-router-dom';
import './SideBar/styles/index.css';
import './SideBar/styles/App.scss';
import './SideBar/styles/bootstrap.css';
import { MemoryRouter } from 'react-router-dom';






const Home = (props) => {
    const toggled = useSelector(store => store.AppReducer.toggled)
    const collapsed = useSelector(store => store.AppReducer.collapsed)
    const user = useSelector(store => store.AppReducer.user);
    const token = useSelector(store => store.AppReducer.token);

    const dispatch = useDispatch();
    const [loading_home, setLoadingHome] = useState(false);
    const [image, setImage] = useState(true);
    // const [toggled, setToggled] = useState(false);
    const handleCollapsedChange = (checked) => {
        dispatch(mudarDados({ collapsed: checked }));

    };

    const GetRole = async () => {
        let response = await Request.Post(`auth/user`)
        if (!response) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            dispatch({ type: 'logout', payload: {} });
        }
        else if (response.message == "Unauthenticated.") {
            localStorage.removeItem('token'); localStorage.removeItem('user');
            dispatch({ type: 'logout', payload: {} });
            return;
        }
        else {
            dispatch({ type: 'login', payload: { token: token, user: response['user'] } });

        }

    }



    const handleToggleSidebar = (value) => {
        // setToggled(value);
        dispatch(mudarDados({ toggled: value }));
    };



    useEffect(() => {
        const event = (e) => {
            if (window.innerWidth <= 768) {
                dispatch(mudarDados({ toggled: false, collapsed: false }));

            }
            else {

                dispatch(mudarDados({ toggled: true, collapsed: true }));

            }
        };
        window.addEventListener('resize', event)
        if (window.innerWidth <= 768) {
            dispatch(mudarDados({ toggled: false, collapsed: false }));
        }
        else {
            dispatch(mudarDados({ toggled: true, collapsed: true }));
        }
        // GetRole();

        return () => {
            window.removeEventListener('resize', event);

            // Anything in here is fired on component unmount.
        }
    }, [])
    const params = useParams();
    const location = useLocation()
    const marginLeft = (toggled == false || window.innerWidth <= 768) ? 0 : (collapsed == false ? 270 : 80);
    console.log(location);
    const url = location.pathname
    return (
        <div className={`app ${toggled ? 'toggled' : ''}`}>
            <Aside
                image={image}
                collapsed={collapsed}
                toggled={toggled}

                handleToggleSidebar={handleToggleSidebar}
                handleCollapsedChange={handleCollapsedChange}

            />
            <Header
                image={image}
                toggled={toggled}
                collapsed={collapsed}
                handleToggleSidebar={handleToggleSidebar}
                handleCollapsedChange={handleCollapsedChange}
            />
            <div className="content-page" >
                <div className="content" style={{ marginLeft: marginLeft, transition: 'all 0.3s ', paddingBottom: 100, background: '#f8f8fa' }}>
                    <div className="container-fluid">
                        {/* <Route exact path={`${url}`} render={(props2) => <Dashboard {...props2} />} />
                            <Route exact path={`${url}/teste`} render={(props2) => <Dashboard2 {...props2} />} /
                            >
                            <Route exact path={`${url}/edit/:id`} render={(props2) => <EditUser {...props2} />} /
                            > */}
                        <Outlet />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Home;