import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import Product from "../Pages/Product/Product";
import BreshopPublic from "../Pages/Breshop/Breshop";
import GuestRoutes from "./GuestRoutes";
import Building from "../Pages/Building";
import Profile from "../Private/Dashboard/Aside/Profile";
import Order from "../Private/Dashboard/Order/Order";
import PaymentScreen from "../Private/Paymant/PaymentScreen";
import AddSale from "../Private/Dashboard/Sale/AddSale";
import Address from "../Private/Dashboard/Address/Address";
import ListSales from "../Private/Dashboard/Sale/ListSales";
import EditSale from "../Private/Dashboard/Sale/EditSale";
import Payment from "../Private/Dashboard/Payment/Payment";
import Breshop from "../Private/Dashboard/Breshop/Breshop";
import AddProduct from "../Private/Dashboard/Product/AddProduct";
import EditProduct from "../Private/Dashboard/Product/EditProduct";
import ListProducts from "../Private/Dashboard/Product/ListProducts";
import Withdrawal from "../Private/Dashboard/Financial/Withdrawal";
import RecipientOrders from "../Private/Dashboard/Recipient/RecipientOrders";

const LoginRoute = (props) => {
  const token = useSelector((state) => state.AppReducer.token);
  return token == null ? (
    <Login {...props} />
  ) : (
    <Navigate to={{ pathname: "/", state: { from: props.location } }} />
  );
};

const RoutesContainer = () => {
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  let cartNotify = localStorage.getItem("cart_notify");
  let wishlistItems = localStorage.getItem("wishlist_items");
  let breshop = localStorage.getItem("breshop");

  user = JSON.parse(user);
  if (user == null || user === undefined) {
    user = {};
  }

  dispatch({ type: "login", payload: { token: token, user: user } });
  dispatch({ type: "wishlist_items", payload: JSON.parse(wishlistItems) });
  dispatch({ type: "cart_notify", payload: cartNotify });
  dispatch({ type: "breshop", payload: breshop ? JSON.parse(breshop) : null });

  return (
    <Routes>
      <Route path={"/login"} element={<LoginRoute />} />
      <Route path={"/register"} element={<Register />} />
      <Route path={"product/:id"} element={<Product />} />
      <Route path={"breshop/:id"} element={<BreshopPublic />} />
      <Route path={"/payment"} element={<PaymentScreen />} />
      <Route path={"/profile"} element={<Profile />}>
        <Route path={"address"} element={<Address />} />
        <Route path={"payment"} element={<Payment />} />
        <Route path={"orders"} element={<Order />} />
        <Route path={"breshop"} element={<Breshop />} />
        <Route path={"products"} element={<ListProducts />} />
        <Route path={"product/add"} element={<AddProduct />} />
        <Route path={"product/edit/:id"} element={<EditProduct />} />
        <Route path={"sales"} element={<ListSales />} />
        <Route path={"sale/add"} element={<AddSale />} />
        <Route path={"sale/edit/:id"} element={<EditSale />} />
        <Route path={"withdrawals"} element={<Withdrawal />} />
        <Route path={"recipient-orders"} element={<RecipientOrders />} />
      </Route>
      <Route path={"/*"} element={<GuestRoutes />} />
      <Route path={"/building/*"} element={<Building />} />
    </Routes>
  );
};

export default RoutesContainer;
