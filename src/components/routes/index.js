import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Home from "../pages/Private/Home";

import GuestRoutes from "./GuestRoutes";

const PrivateRoute = (props) => {
  console.log('props', props)

  // const stream = useSelector(state => state.AppReducer.stream);
  const token = useSelector(state => state.AppReducer.token)

  return token != null ? (
    <Home {...props}></Home>) : (
    <Navigate to={{ pathname: '/login', state: { from: props.location } }} />
  )
};

const LoginRoute = (props) => {
  const token = useSelector(state => state.AppReducer.token);
  // print('token')
  return token == null ? (
    <Login {...props} />) : (
    <Navigate to={{ pathname: "/home", state: { from: props.location } }} />
  )
};

const RoutesContainer = () => {
  const dispatch = useDispatch(); let token = localStorage.getItem('token'); let user = localStorage.getItem('user'); user = JSON.parse(user); if (user == null || user == undefined) { user = {}; } console.log(token); dispatch({ type: 'login', payload: { token: token, user: user } });
  return (
    <Routes>
      <Route path={"/login"} element={<LoginRoute />} />
      <Route path={'/home'} element={<PrivateRoute />} >

      </Route>
      <Route path={"/*"} element={<GuestRoutes />} />
    </Routes>
  );
};

export default RoutesContainer;
