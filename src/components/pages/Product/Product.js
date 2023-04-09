import { LoadingButton } from '@mui/lab'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL, GET_FETCH, POST_FETCH, URL } from '../../../variables'
import Container from '../Container'
import { useSelector, useDispatch } from 'react-redux'
import { MdClose } from 'react-icons/md'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { moneyMask } from '../../utilities/masks/currency'
import ProductImages from './ProductImages'
import PromotionCountdown from './PromotionCountdown'
import ImagesModal from '../Paymant/ImagesModal'
import Card from '../Card'
import { Button, CircularProgress, Rating, Pagination, Typography } from '@mui/material'

const Product = () => {
  const [isCalled, setIsCalled] = React.useState(false);
  const [waitTime, setWaitTime] = React.useState(5000); // tempo de espera em milissegundos (5 segundos)

  const [search, setsearch] = React.useState('')
  const [ratings, setRatings] = React.useState([])
  const [product, setProduct] = React.useState('')
  const [breshop, setBreshop] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [loadingCart, setLoadingCart] = React.useState(false)
  const [breshopProducts, setBreshopProducts] = React.useState([])
  const [breshopPagination, setBreshopPagination] = React.useState({
    totalItems: '', pageNumber: 0, perPage: 15
  })
  const [ratingPagination, setRatingPagination] = React.useState({
    totalItems: '', pageNumber: 1, perPage: 1, lastPage: 1
  })

  const params = useParams()
  const dispatch = useDispatch()
  const token = useSelector(state => state.AppReducer.token)


  React.useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight * 0.8 && !isCalled && ratingPagination.pageNumber !== ratingPagination.lastPage) {
        setRatingPagination({ ...ratingPagination, pageNumber: ratingPagination.pageNumber + 1 });
        setIsCalled(true);
        setTimeout(() => {
          setIsCalled(false);
        }, waitTime);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isCalled, waitTime]);

  React.useEffect(() => {
    getData()
  }, [])

  React.useEffect(() => {
    if (!loading) getRatings()
  }, [breshop])

  React.useEffect(() => {
    if (!loading && product.breshop_id) {
      breshopPagination.pageNumber === 0 ? getBreshopProducts() : setBreshopPagination({ ...breshopPagination, pageNumber: 0 })
    }
  }, [breshopPagination.pageNumber, product])

  React.useEffect(() => {
    if (!loading && product.breshop_id) getRatings()
  }, [ratingPagination.pageNumber])

  const getData = async () => {
    const response = await GET_FETCH({ url: `get_public_product/${params.id}` })
    // console.log('product', response)
    setProduct(response.product)
    setBreshop(response.product.owner)
    setLoading(false)
  }

  console.log('paginatiop', ratingPagination)
  const getRatings = async () => {
    const response = await GET_FETCH({ url: `public/breshops/${product.breshop_id}/ratings?page=${ratingPagination.pageNumber}` })
    // console.log('product', response)
    setRatings([...ratings, ...response.ratings])
    setRatingPagination({ ...ratingPagination, lastPage: response.pagination.last_page })
    // setLoading(false)
  }

  const getBreshopProducts = async () => {
    const response = await GET_FETCH({ url: `public/breshops/${product.breshop_id}/products?page=${breshopPagination.pageNumber}` })
    // console.log('breshops products', response)
    setBreshopProducts(response.breshop_products)
    setBreshopPagination({ ...breshopPagination, totalItems: response.pagination.total_pages })
  }

  const handleAddCart = async () => {
    setLoadingCart(true)
    const response = await POST_FETCH({ url: `${API_URL}cart/create`, body: { product_id: product.id, quantity: 1 }, token })
    // console.log('resp', response)
    if (response?.status) {
      dispatch({ type: 'toggle_cart', toggled: true })
    }
    setLoadingCart(false)
  }

  return (
    <Container>
      <div className="bg-white mt-5 p-sm-5 rounded">
        {!loading ?
          <div>
            <div className="row">

              <div className="col-lg-6">
                <ProductImages thumb={product.thumb} images={product.images} />
              </div>
              <div className="col-lg-6">
                <div className="d-flex align-content-between flex-wrap h-100">
                  <div className="col-12">
                    <span className='product-title'>{product.name}</span>

                    {product?.sale?.discount ?
                      <div className='d-flex align-items-center'>
                        <p className='me-2 no-discount'>
                          <del>{moneyMask(product.price)}</del>
                        </p>
                        <p className='price' style={{ color: '#DC3545' }}>
                          {moneyMask(product.price - (product.price * (product.sale.discount / 100)))}
                        </p>
                        <PromotionCountdown expirationDate={product.sale.end_date} />
                      </div>
                      : <p className='price'>{moneyMask(product.price)}</p>
                    }

                    <p className='product-subtitle'>
                      <strong>{moneyMask(product.price)}</strong> em até 12x de <strong>{moneyMask(product.price * (16.37 / 100))}</strong> sem juros no cartão
                      Ou em 1x no cartão com até <strong>5% OFF</strong>
                    </p>
                    <span className='product-subtitle'>Descrição: </span>
                    <p className='product-subtitle'>{product.description}</p>
                    <span className='product-subtitle'>Avaria: </span>
                    <p className='product-subtitle'>{product.damage_description ? product.damage_description : 'Produto não possui desgastes'}</p>

                    <span className='product-subtitle'>Tamanhos: </span>
                    <div className="d-flex">
                      <div className="me-2"><button className='rounded-button'>PP</button></div>
                      <div className="me-2"><button className='rounded-button'>P</button></div>
                      <div className="me-2"><button className='rounded-button'>M</button></div>
                      <div className="me-2"><button className='rounded-button'>G</button></div>
                      <div className="me-2"><button className='rounded-button'>GG</button></div>
                      <div className="me-2"><button className='rounded-button'>XL</button></div>
                    </div>

                    <p className='product-subtitle mt-3'>Estoque: {product.quantity > 0
                      ? <span className='success bold'>{product.quantity === 1 ? product.quantity + ' unidade' : product.quantity + ' unidades'}</span>
                      : <span className='error bold'>Esgotado</span>}
                    </p>

                  </div>
                  <div className="col-12">
                    <div className="d-flex justify-content-end">
                      <LoadingButton variant='contained' onClick={handleAddCart} endIcon={<ShoppingCartIcon />} loading={loadingCart} loadingPosition="end">Adicionar ao carrinho</LoadingButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-6 m-auto">
                <div className="d-flex justify-content-center">
                  <div>
                    <img className='m-auto' style={{ width: 75, height: 75 }} src={`${URL}storage/photos/no_user.png`} alt="subject" />
                  </div>
                  <div>
                    <div className='d-flex mb-2'>
                      <Typography color="text.secondary">{breshop.name}</Typography>
                      <Rating name="read-only" value={breshop.average_rating} precision={0.1} readOnly />
                    </div>
                    <div>
                      <Button variant='outlined' className='mx-2'>Chat</Button>
                      <Button variant='outlined'>Loja</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <Typography color="text.secondary">Avaliações</Typography>
                <Typography color="text.secondary">Vendas</Typography>
                <Typography color="text.secondary">Comentarios</Typography>
              </div>
            </div>
            <hr />

            {/* -------------------------Other-products-section------------------------- */}
            <div className="row my-5">
              <Typography color="text.secondary" variant='h5'>Outros produtos da loja</Typography>

              {!loading ?
                <>
                  <div className="d-flex flex-wrap">
                    {breshopProducts.length > 0 ?
                      breshopProducts.map(item => (
                        <div key={item.id}>
                          <Card product={item} />
                        </div>
                      ))
                      : <p className="ms-4 lead">{search ? `Sem registros de ${search}` : 'Sem produtos cadastrados'}</p>}
                  </div>

                  {breshopProducts.length > 0 && breshopPagination.totalItems &&
                    <div className='d-flex justify-content-center mt-3'>
                      <Pagination color='yellow' shape="rounded" count={Math.ceil(breshopPagination.totalItems / breshopPagination.perPage)}
                        page={breshopPagination.pageNumber + 1} onChange={(e, page) => {
                          window.scrollTo(0, 0); setBreshopPagination({ ...breshopPagination, pageNumber: page - 1 })
                        }
                        } />
                    </div>}
                </>
                : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
            </div>
            {/* -------------------------Comments-Section------------------------- */}
            <div className="row">
              <div className="d-flex justify-content-center mb-5">
                <Typography color="text.secondary" variant='h5'>Comentários da Loja</Typography>
              </div>
              {ratings.length > 0 ?
                <>
                  <div className="mb-5">
                    {/* <span className="lead ms-2">Filtrar por:</span>
                    <span className="lead ms-2">Uma estrela ({getRating("1")}), </span>
                    <span className="lead ms-2">Duas estrelas ({getRating("2")}), </span>
                    <span className="lead ms-2">Três estrelas ({getRating("3")}), </span>
                    <span className="lead ms-2">Quatro estrelas ({getRating("4")}), </span>
                    <span className="lead ms-2">Cinco estrelas ({getRating("5")})</span> */}
                    <div className="d-flex align-items-center">
                      <span className='lead ms-2' style={{ color: '#FF0000' }}>Eliminar filtro</span>
                      <MdClose color='red' />
                    </div>
                  </div>

                  {ratings.map(item => (
                    <div className="row  my-3" key={item.id}>
                      <div className="d-flex justify-content-start">
                        <div>
                          <img className='m-auto rounded-50' style={{ width: 75, height: 75 }}
                            src={`${URL}storage/${item.user.file ? item.user.file : 'no_user.png'}`} alt="subject" />
                        </div>
                        <div className='ms-2'>
                          <Typography className='ms-1' color="text.secondary">{item.user.name}</Typography>
                          <div className="d-flex align-items-center">
                            <Rating value={item.rating} readOnly />
                            <ImagesModal images={item.images} />
                          </div>
                        </div>
                      </div>

                      <div className="col-12 mt-2">
                        <p>{item.comment}</p>
                      </div>
                    </div>
                  )
                  )}
                </> : <Typography>Loja sem nenhum comentário registrado</Typography>}
            </div>

            {/* -------------------------Buttons-Section------------------------- */}
            <div className="row mt-5">
              <div className="d-flex mt-3">
                <div className="justify-content-start">
                  <Button variant='contained'>Voltar</Button>
                </div>
              </div>
            </div>
          </div>
          :
          <div className="p-5 d-flex justify-content-center">
            <CircularProgress />
          </div>
        }
      </div>
    </Container>
  )
}

export default Product