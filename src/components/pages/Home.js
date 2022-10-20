import React from "react";
import Navbar from "./Navbar";
import Card from './Card';
import { Typography } from "@mui/material";

const Home = () => {
  return (
    <div style={{overflowX: 'hidden', height: '100vh'}}>
      <Navbar />
        <div className="row bg-white" style={{height: '40vh'}}>
          <div className="d-flex justify-content-center rounded my-3">
          <div className="col-8 bg-light" style={{maxWidth: 1000}}>
            <Typography className="m-3" variant="h5" color="text.secondary">Produtos recomendados para você</Typography>
            <div className="d-flex">
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            </div>
          </div>         
          </div>
        </div>

        <div className="row bg-white" style={{height: '40vh'}}>
          <div className="d-flex justify-content-center rounded my-3">
          <div className="col-8 bg-light" style={{maxWidth: 1000}}>
          <Typography className="m-3" variant="h5" color="text.secondary">Produtos recomendados para você</Typography>
            <div className="d-flex align-items-center">
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            </div>
          </div>         
          </div>
        </div>
    </div>
  );
};

export default Home;