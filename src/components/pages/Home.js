import React from "react";
import Navbar from "./Navbar";
import Card from './Card';
import { Box, ThemeProvider, Typography } from "@mui/material";
import { URL } from '../../variables';
import Theme from '../routes/Theme/Theme';
// import { Carousel } from 'react-responsive-carousel';
// import Slider from "react-slick";
import Slider from "react-slick";
import './Styles/style-card.css';
import './Private/SideBar/styles/index.css';
import './Private/SideBar/styles/App.scss';
import './Private/SideBar/styles/bootstrap.css';
import Footer from "./Footer";

const Home = () => {
  const [state, setState] = React.useState({
    pageNumber: 1,
    products: [],
  })

  React.useEffect(() => {
    fetch(`${URL}api/get_all_products?page=${state.pageNumber}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
        // 'Content-Type': 'application/json'
      }
    }).then(async (response) => {
      let resp = await response.json()
      setState({ ...state, products: resp.products })
      console.log('resp', resp)
    })
  }, [])

  const renderProducts = () => {
    return state.products.map(item => (
      <div className="col-md-2 col-sm-3 col-6 m-2" style={{ padding: '0 !important' }} key={item.id}>
        <Card product={item}></Card>
      </div>
    ))
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      }
    ]
  }

  return (
    <ThemeProvider theme={Theme}>
      <div style={{ overflowX: 'hidden', minHeight: '100vh' }}>
        <Navbar />
        <div className="row bg-white" style={{ height: '40vh' }}>
          <div className="d-flex justify-content-center rounded my-3">
            <div className="col-12 bg-light" style={{ maxWidth: 1000 }}>
              <Typography className="m-3" variant="h5" color="text.secondary">Produtos recomendados para você</Typography>
              <Slider {...settings}>
                {renderProducts()}
              </Slider>
            </div>
          </div>
        </div>

        <div className="row bg-white" style={{ minHeight: '40vh' }}>
          <div className="d-flex justify-content-center rounded my-3">
            <div className="col-12 bg-light" style={{ maxWidth: 1000 }}>
              <Typography className="m-3" variant="h5" color="text.secondary">Produtos postados recentemente</Typography>
              <div className="row">
                {renderProducts()}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Home;