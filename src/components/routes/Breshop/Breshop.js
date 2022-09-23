import React from "react";
import { useSelector } from "react-redux";
import { URL } from "../../../variables";

const Breshop = () => {
  const token = useSelector((state) => state.AppReducer.token);
  console.log("token", token);

  const user = localStorage.getItem("user");
  console.log("id", user.name);
  React.useEffect(() => {
    fetch(`${URL}api/get_breshop/${1}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      //   body: JSON.stringify({ name: "teste" }),
    }).then(async (responseLog) => {
      console.log("resp", responseLog);
    });
  }, []);
  return <div>Breshop</div>;
};

export default Breshop;
