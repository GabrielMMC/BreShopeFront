import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Dashboard/Profile";
import Home from "../pages/Home";
import Product from "../pages/Product";
import Breshop from "./Breshop/Breshop";
import GuestRoutes from "./GuestRoutes";
import AddProduct from "./Product/AddProduct";
import EditProduct from "./Product/EditProduct";
import ListProducts from "./Product/ListProducts";
import Address from "./User/Address";
import Payment from "../pages/Dashboard/Payment";
import Recipient from "./Breshop/Recipient";
import PaymentScreen from "../pages/Paymant/PaymentScreen";

const PrivateRoute = (props) => {
  const token = useSelector((state) => state.AppReducer.token);

  return token != null ? (
    <Home {...props}></Home>
  ) : (
    <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
  );
};

const LoginRoute = (props) => {
  const token = useSelector((state) => state.AppReducer.token);
  return token == null ? (
    <Login {...props} />
  ) : (
    <Navigate to={{ pathname: "/home", state: { from: props.location } }} />
  );
};

const RoutesContainer = () => {
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  let cartItems = localStorage.getItem("cart_items");

  user = JSON.parse(user);
  if (user == null || user === undefined) {
    user = {};
  }

  dispatch({ type: "login", payload: { token: token, user: user } });
  dispatch({ type: "cart_items", payload: cartItems ? JSON.parse(cartItems) : '' });

  return (
    <Routes>
      <Route path={"/login"} element={<LoginRoute />} />
      <Route path={"/register"} element={<Register />} />
      <Route path={"product/:id"} element={<Product />} />
      <Route path={"/payment"} element={<PaymentScreen />} />
      <Route path={"/home"} element={<PrivateRoute />} />
      <Route path={"/profile"} element={<Profile />}>
        <Route path={"address"} element={<Address />} />
        <Route path={"payment"} element={<Payment />} />
        <Route path={"breshop"} element={<Breshop />} />
        <Route path={"breshop/recipient"} element={<Recipient />} />
        <Route path={"products"} element={<ListProducts />} />
        <Route path={"product/add"} element={<AddProduct />} />
        <Route path={"product/edit/:id"} element={<EditProduct />} />
      </Route>
      <Route path={"/*"} element={<GuestRoutes />} />
    </Routes>
  );
};

export default RoutesContainer;
