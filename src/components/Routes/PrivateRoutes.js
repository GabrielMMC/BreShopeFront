import React from 'react'
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
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Login from '../Pages/Auth/Login';

const PrivateRoutes = () => {
  const token = useSelector((state) => state.AppReducer.token);
  const AuthRoutes = (props) => {
    return token == null ? (
      // <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
      <Login {...props} />
    ) : (
      <Profile {...props} />
    );
  };

  return (
    <Routes>
      {token !== null ?
        <Route path={"/*"} element={<Profile />}>
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
          {/* <Route path={"recipient-orders"} element={<RecipientOrders />} /> */}
        </Route> :
        <Route path={"/*"} element={<Login />} />}
    </Routes>
  )
}

export default PrivateRoutes