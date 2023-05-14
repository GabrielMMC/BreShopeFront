import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import Product from "../Pages/Product/Product";
import BreshopPublic from "../Pages/Breshop/Breshop";
import { useSelector } from "react-redux";
import Building from "../Pages/Building";
import NotFound from "../Pages/NotFound";
import HomeWrapper from "../Pages/Home";

const GuestRoutes = () => {
  const LoginRoute = (props) => {
    const token = useSelector((state) => state.AppReducer.token);
    return token == null ? (
      <Login {...props} />
    ) : (
      <Navigate to={{ pathname: "/", state: { from: props.location } }} />
    );
  };

  return (
    <Routes>
      <Route path={"/"} element={<HomeWrapper />} />
      <Route path={"login"} element={<LoginRoute />} />
      <Route path={"register"} element={<Register />} />
      <Route path={"product/:id"} element={<Product />} />
      <Route path={"breshop/:id"} element={<BreshopPublic />} />
      <Route path={"building/*"} element={<Building />} />
      <Route path={"*"} element={<NotFound />} />
    </Routes>
  );
};

export default GuestRoutes;
