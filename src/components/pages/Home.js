import React from "react";
import Navbar from "./Navbar";
import Card from './Card';
import { CircularProgress, Pagination } from "@mui/material";
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
import BreshopCard from "./BreshopCard";
import CardSkeleton from "./CardSkeleton";

const Home = () => {
  const [types, setTypes] = React.useState('')
  const [styles, setStyles] = React.useState('')
  const [products, setProducts] = React.useState([])
  const [saleProducts, setSaleProducts] = React.useState([])
  const [breshops, setBreshops] = React.useState([])
  const [materials, setMaterials] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [saleLoading, setSaleLoading] = React.useState(false)

  const [selectedTypes, setSelectedTypes] = React.useState([])
  const [selectedStyles, setSelectedStyles] = React.useState([])
  // const [price, setPrice] = React.useState('')
  const [selectedMaterials, setSelectedMaterials] = React.useState([])
  const [productPagination, setProductPagination] = React.useState({
    totalItems: '', pageNumber: 0, perPage: 15
  })
  const [salePagination, setSalePagination] = React.useState({
    totalItems: '', pageNumber: 0, perPage: 15
  })
  const [breshopPagination, setBreshopPagination] = React.useState({
    totalItems: '', pageNumber: 0, perPage: 15
  })

  const saleRef = React.useRef(null);
  const breshopRef = React.useRef(null);

  const search = useSelector(store => store.AppReducer.search);

  React.useEffect(() => {
    if (!loading) {
      getData()
      getSaleProducts()
    }
  }, [selectedTypes, selectedMaterials, selectedStyles])

  React.useEffect(() => {
    if (!loading) {
      setLoading(true)
      salePagination.pageNumber === 0 ? getSaleProducts() : setSalePagination({ ...salePagination, pageNumber: 0 })
      breshopPagination.pageNumber === 0 ? getBreshops() : setBreshopPagination({ ...breshopPagination, pageNumber: 0 })
      productPagination.pageNumber === 0 ? getData() : setProductPagination({ ...productPagination, pageNumber: 0 })
    }
  }, [search])

  React.useEffect(() => {
    getData()
  }, [productPagination.pageNumber])

  React.useEffect(() => {
    getSaleProducts()
  }, [salePagination.pageNumber])

  React.useEffect(() => {
    getBreshops()
  }, [breshopPagination.pageNumber])

  const getData = async () => {
    setLoading(true)
    const styleIds = selectedStyles.map(item => item.id)
    const typeIds = selectedTypes.map(item => item.id)
    const materialIds = selectedMaterials.map(item => item.id)
    const response = await GET_PUBLIC_FETCH({
      url: `${URL}api/get_all_products?search=${search}&page=${productPagination.pageNumber}&types=${typeIds}&styles=${styleIds}&materials=${materialIds}`
    })
    // console.log('resp', response)
    if (response.status) {
      setTypes(response.types)
      setStyles(response.styles)
      setProducts(response.products)
      setMaterials(response.materials)
      setProductPagination({ ...productPagination, totalItems: response.pagination.total_pages })
    }
    setLoading(false)
  }

  const getSaleProducts = async () => {
    setSaleLoading(true)
    const styleIds = selectedStyles.map(item => item.id)
    const typeIds = selectedTypes.map(item => item.id)
    const materialIds = selectedMaterials.map(item => item.id)
    const response = await GET_PUBLIC_FETCH({
      url: `${URL}api/public/products/sale?search=${search}&page=${salePagination.pageNumber + 1}&types=${typeIds}&styles=${styleIds}&materials=${materialIds}`
    })
    // console.log('resp sale', response)
    setSaleProducts(response.sale_products)
    setSalePagination({ ...salePagination, totalItems: response.pagination.total_pages })
    setSaleLoading(false)
  }


  const getBreshops = async () => {
    const response = await GET_PUBLIC_FETCH({
      url: `${URL}api/public/breshops?search=${search}&page=${breshopPagination.pageNumber + 1}`
    })
    // console.log('resp breshop', response)
    setBreshops(response.breshops)
    setBreshopPagination({ ...breshopPagination, totalItems: response.pagination.total_pages })
  }

  return (
    <>
      <Navbar />
      <div style={{ background: 'linear-gradient(to bottom, #693B9F, #8C4EBE, #A57BD5)', minHeight: '40vh' }}>
        <div className="row w-principal p-5 m-auto">
          <div className='col-4' style={{ borderRadius: '56% 44% 66% 40% / 30% 33% 67% 70%', backgroundColor: '#FFF', height: 400 }}>
            <img src={art} alt="woman-art" className='h-100 d-flex justify-content-center m-auto' />
          </div>
          <div className="col-8 text-center m-auto">
            <p className='main-title text-white'>Conheça a nossa plataforma e começe a garimpar!</p>
            <p className='subtitle text-white'>A plataforma atualmente se encontra em ambiente de testes</p>
            <p className='small text-white'>Agradeço se reportar os bugs encontrados, de resto, <del>ta liberada a bagunça</del></p>
            {/* dedo no cu e gritaria */}
          </div>
        </div>
      </div>
      <div className='w-principal m-auto my-5'>

        <div className="my-5">
          <h6 className="title ms-3">Produtos postados recentemente</h6>
          <div className="row">
            <div className="col-md-2">
              <Accordion styles={styles} types={types} materials={materials}
                selectedStyles={selectedStyles} setSelectedStyles={setSelectedStyles}
                selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes}
                selectedMaterials={selectedMaterials} setSelectedMaterials={setSelectedMaterials} />
            </div>

            <div className='col-md-10'>
              {!loading ?
                <>
                  <div className="d-flex flex-wrap justify-content-center">
                    {products.length > 0 ?
                      products.map(item => (
                        <div key={item.id}>
                          <Card product={item} />
                        </div>
                      ))
                      : <p className="ms-4 lead">{search ? `Sem registros de ${search}` : 'Sem produtos cadastrados'}</p>}
                  </div>

                  {products.length > 0 && productPagination.totalItems &&
                    <div className='d-flex justify-content-center mt-3'>
                      <Pagination color='yellow' shape="rounded" count={Math.ceil(productPagination.totalItems / productPagination.perPage)}
                        page={productPagination.pageNumber + 1} onChange={(e, page) => {
                          window.scrollTo(0, 0); setProductPagination({ ...productPagination, pageNumber: page - 1 })
                        }
                        } />
                    </div>}
                </>
                : <div className='d-flex flex-wrap justify-content-center'><CardSkeleton totalItems={9} /></div>}
            </div>
          </div>
        </div>

        <div className="my-5 py-5" ref={saleRef}>
          <h6 className="title ms-3">Promoções disponíveis</h6>
          <div className="row">
            <div className="col-12">
              {!saleLoading ?
                <>
                  <div className="d-flex flex-wrap justify-content-center">
                    {saleProducts.length > 0 ?
                      saleProducts.map(item => (
                        <div key={item.id}>
                          <Card product={item} />
                        </div>
                      ))
                      : <p className="ms-4 lead">{search ? `Sem registros de ${search}` : 'Sem promoções cadastradas'}</p>}
                  </div>

                  {saleProducts.length > 0 && salePagination.totalItems &&
                    <div className='d-flex justify-content-center mt-3'>
                      <Pagination color='yellow' shape="rounded" count={Math.ceil(salePagination.totalItems / salePagination.perPage)}
                        page={salePagination.pageNumber + 1} onChange={(e, page) => {
                          saleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          setSalePagination({ ...salePagination, pageNumber: page - 1 })
                        }
                        } />
                    </div>}
                </> : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
            </div>
          </div>
        </div>

        <div className="my-5 py-5">
          <h6 className="title ms-3">Categorias mais visitadas</h6>
          <div className="row justify-content-center">
            <CategoryCard title='Casual' icon={FaTshirt} />
            <CategoryCard title='Luxuoso' icon={GiDress} />
            <CategoryCard title='Urbano' icon={IoIosGlasses} />
            <CategoryCard title='Surfe' icon={GiUnderwearShorts} />
            <CategoryCard title='Rocker' icon={GiGuitar} />
          </div>
        </div>

        <div className="my-5 py-5" ref={breshopRef}>
          <h6 className="title ms-3">Lojas populares</h6>
          <div className="d-flex flex-wrap m-3 pointer">
            {breshops.length > 0 ?
              breshops.map(item => (
                <div key={item.id}>
                  <BreshopCard shop={item} />
                </div>
              ))
              : <p className="ms-4 lead">{search ? `Sem registros de ${search}` : 'Sem lojas cadastradas'}</p>}
          </div>

          {breshops.length > 0 && breshopPagination.totalItems &&
            <div className='d-flex justify-content-center mt-3'>
              <Pagination color='yellow' shape="rounded" count={Math.ceil(breshopPagination.totalItems / breshopPagination.perPage)}
                page={breshopPagination.pageNumber + 1} onChange={(e, page) => {
                  breshopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  setBreshopPagination({ ...breshopPagination, pageNumber: page - 1 })
                }
                } />
            </div>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;