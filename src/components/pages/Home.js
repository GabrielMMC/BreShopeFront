import React from "react";
import Navbar from "./Navbar";
import Card from './Card';
import { CircularProgress } from "@mui/material";
import { GET_PUBLIC_FETCH, URL } from '../../variables';
import Slider from "react-slick";
import './Private/SideBar/styles/index.css';
import Footer from "./Footer";
import { useSelector } from "react-redux";
import { settings } from "../utilities/Settings";
import { FaTshirt } from "react-icons/fa";
import { RiTShirt2Line } from "react-icons/ri";
import { GiDress } from "react-icons/gi";
import { GiGuitar } from "react-icons/gi";
import { GiUnderwearShorts } from "react-icons/gi";
import { IoIosGlasses } from "react-icons/io";
import art from '../../assets/art.png'
import Accordion from "./Accordion/Accordion";
import CategoryCard from "./CategoryCard";

const Home = () => {
  const [state, setState] = React.useState({
    pageNumber: 1,
    products: [],
  })
  const [types, setTypes] = React.useState('')
  const [styles, setStyles] = React.useState('')
  const [products, setProducts] = React.useState('')
  const [materials, setMaterials] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  const [selectedTypes, setSelectedTypes] = React.useState([])
  const [selectedStyles, setSelectedStyles] = React.useState([])
  // const [price, setPrice] = React.useState('')
  const [selectedMaterials, setSelectedMaterials] = React.useState([])

  React.useEffect(() => {
    getData()
  }, [selectedTypes, selectedMaterials, selectedStyles])

  const getData = async () => {
    setLoading(true)
    const styleIds = selectedStyles.map(item => item.id)
    const typeIds = selectedTypes.map(item => item.id)
    const materialIds = selectedMaterials.map(item => item.id)
    const response = await GET_PUBLIC_FETCH({
      url: `${URL}api/get_all_products?page=${state.pageNumber}&types=${typeIds}&styles=${styleIds}&materials=${materialIds}`
    })
    console.log('resp', response)
    if (response.status) {
      setTypes(response.types)
      setStyles(response.styles)
      setProducts(response.products)
      setMaterials(response.materials)
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <div style={{ background: 'linear-gradient(to bottom, #693B9F, #8C4EBE, #A57BD5)', minHeight: '40vh' }}>
        <div className="row w-principal p-5 m-auto">
          <div className='col-4' style={{ borderRadius: '56% 44% 66% 40% / 30% 33% 67% 70%', backgroundColor: '#FFF', height: 400 }}>
            <img src={art} alt="woman-art" className='h-100 d-flex justify-content-center m-auto' />
          </div>
          <div className="col-8 text-center m-auto text-white">
            <p className='main-title'>Conheça a nossa plataforma e começe a garimpar!</p>
            <p className='subtitle'>A plataforma atualmente se encontra em ambiente de testes</p>
            <p className='small'>Agradeço se reportar os bugs encontrados, de resto, <del>ta liberada a bagunça</del></p>
            {/* dedo no cu e gritaria */}
          </div>
        </div>
      </div>
      <div className='w-principal m-auto'>
        <div className="row my-5">
          <h6 className="title mx-4">Produtos postados recentemente</h6>
          <div className="col-md-2">
            <Accordion styles={styles} types={types} materials={materials}
              selectedStyles={selectedStyles} setSelectedStyles={setSelectedStyles}
              selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes}
              selectedMaterials={selectedMaterials} setSelectedMaterials={setSelectedMaterials} />
          </div>

          <div className='col-md-10'>
            {!loading ?
              <div className="d-flex flex-wrap justify-content-center pointer">
                {products && products.map(item => (
                  <div key={item.id}>
                    <Card sales={false} product={item} />
                  </div>
                ))}
              </div>
              : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
          </div>
        </div>

        <h6 className="title mx-4 mt-5">Categorias mais visitadas</h6>
        <div className="row justify-content-center">
          <CategoryCard title='Casual' icon={FaTshirt} />
          <CategoryCard title='Luxuoso' icon={GiDress} />
          <CategoryCard title='Urbano' icon={IoIosGlasses} />
          <CategoryCard title='Surfe' icon={GiUnderwearShorts} />
          <CategoryCard title='Rocker' icon={GiGuitar} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;