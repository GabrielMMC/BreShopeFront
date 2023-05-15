import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import GuestRoutes from "./GuestRoutes";
import PaymentScreen from "../Private/Paymant/PaymentScreen";
import PrivateRoutes from "./PrivateRoutes";
import NotFound from "../Pages/NotFound";

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
      <Route path={"/*"} element={<GuestRoutes />} />
      <Route path={"/payment"} element={<PaymentScreen />} />
      <Route path={"/profile/*"} element={<PrivateRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesContainer;
