import React from "react";
import Navbar from "./Navbar";
import Card from './Card';
import { ThemeProvider, Typography } from "@mui/material";
import { URL } from '../../variables';
import Theme from '../routes/Theme/Theme';
import Slider from "react-slick";
import './Styles/style-card.css';
import './Private/SideBar/styles/index.css';
import './Private/SideBar/styles/bootstrap.css';
import Footer from "./Footer";
import { useSelector } from "react-redux";
import { settings } from "../utilities/Settings";
import { FaTshirt } from "react-icons/fa";
import SaleCard from "./SaleCard";

const Home = () => {
  const [state, setState] = React.useState({
    pageNumber: 1,
    products: [],
  })
  const categorys = [
    { label: 'CASUAIS', type: 'casual' }, { label: 'ESPORTIVOS', type: 'sport' }, { label: 'VINTAGE', type: 'casual' },
    { label: 'EVENTOS', type: 'casual' }, { label: 'LUXUOSOS', type: 'casual' }, { label: 'OLDSCHOOL', type: 'casual' }, { label: 'CASUAIS', type: 'casual' }, { label: 'ESPORTIVOS', type: 'sport' }, { label: 'VINTAGE', type: 'casual' },
    { label: 'EVENTOS', type: 'casual' }, { label: 'LUXUOSOS', type: 'casual' }, { label: 'OLDSCHOOL', type: 'casual' }, { label: 'CASUAIS', type: 'casual' }, { label: 'ESPORTIVOS', type: 'sport' }, { label: 'VINTAGE', type: 'casual' },
    { label: 'EVENTOS', type: 'casual' }, { label: 'LUXUOSOS', type: 'casual' }, { label: 'OLDSCHOOL', type: 'casual' }, { label: 'CASUAIS', type: 'casual' }, { label: 'ESPORTIVOS', type: 'sport' }, { label: 'VINTAGE', type: 'casual' },
    { label: 'EVENTOS', type: 'casual' }, { label: 'LUXUOSOS', type: 'casual' }, { label: 'OLDSCHOOL', type: 'casual' }
  ]
  const token = useSelector(state => state.AppReducer.token)
  console.log('token', token)

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

  return (
    <ThemeProvider theme={Theme}>
      <div className="bg-gray" style={{ overflowX: 'hidden', minHeight: '100vh' }}>
        <Navbar />
        <div className="content-home mt-3" style={{ minHeight: '45vh' }}>
          <Typography className="m-3" variant="h5" color="text.secondary">Produtos recomendados para você</Typography>
          <Slider {...settings}>
            {state.products && state.products.map(item => (
              <Card product={item}></Card>
            ))}
          </Slider>
        </div>

        <div className="content-purple">
          <div className="row">
            <div className="d-flex justify-content-center m-auto flex-wrap" style={{ maxWidth: 800 }}>
              {categorys.map(item => (
                <div className="d-flex justify-content-center align-items-center bg-white p-3 text-gray hvr-bounce-to-right" style={{ cursor: 'pointer', border: '1px solid #693B9F', width: 100 }}>
                  <div>
                    <div className="d-flex justify-content-center">
                      <FaTshirt className="m-auto" size={30} />
                    </div>
                    <Typography className="m-auto" variant="caption">{item.label}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="content-home" style={{ minHeight: '40vh' }}>
          <Typography className="m-3" variant="h5" color="text.secondary">Produtos postados recentemente</Typography>
          <div className="d-flex flex-wrap justify-content-center">
            {state.products && state.products.map(item => (
              <Card sales={false} product={item}></Card>
            ))}
          </div>
        </div>

        <div className="content-home" style={{ minHeight: '40vh' }}>
          <Typography className="m-3" variant="h5" color="text.secondary">Ofertas Especiais</Typography>
          <div className="d-flex flex-wrap justify-content-center">
            {state.products && state.products.map(item => (
              <Card sales={true} product={item}></Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Home;