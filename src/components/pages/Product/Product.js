import { Button, CircularProgress, Divider, Fade, Rating, ThemeProvider, Typography } from '@mui/material'
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

const Product = () => {
  const [ratings, setRatings] = React.useState('')
  const [product, setProduct] = React.useState('')
  const [breshop, setBreshop] = React.useState('')
  const [ratingsFilter, setRatingsFilter] = React.useState('')
  const [loadingCart, setLoadingCart] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  const params = useParams()
  const dispatch = useDispatch()
  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    const getData = async () => {
      const response = await GET_FETCH({ url: `get_public_product/${params.id}` })
      console.log('product', response)
      setProduct(response.product)
      setBreshop(response.product.owner)
      setRatings(response.product.owner.ratings)
      setRatingsFilter(response.product.owner.ratings)
      setLoading(false)
    }

    getData()
  }, [])

  const getRating = (value) => {
    const rating = ratings.filter(item => item.rating === value).length
    return rating
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
            <Divider className='my-5' />
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
            <Divider className='my-5' />

            {/* -------------------------Comments-Section------------------------- */}
            <div className="row">
              <div className="d-flex justify-content-center mb-5">
                <Typography color="text.secondary" variant='h5'>Comentários da Loja</Typography>
              </div>
              {/* 
              {ratings.length > 0 ?
                <>
                  <div className="mb-5">
                    <span className="lead ms-2">Filtrar por:</span>
                    <span className="lead ms-2">Uma estrela ({getRating("1")}), </span>
                    <span className="lead ms-2">Duas estrelas ({getRating("2")}), </span>
                    <span className="lead ms-2">Três estrelas ({getRating("3")}), </span>
                    <span className="lead ms-2">Quatro estrelas ({getRating("4")}), </span>
                    <span className="lead ms-2">Cinco estrelas ({getRating("5")})</span>
                    <div className="d-flex align-items-center">
                      <span className='lead ms-2' style={{ color: '#FF0000' }}>Eliminar filtro</span>
                      <MdClose color='red' />
                    </div>
                  </div>

                  {ratingsFilter.map(item => (
                    <div className="row  my-3" key={item.id}>
                      <div className="d-flex justify-content-start">
                        <div>
                          <img className='m-auto' style={{ width: 75, height: 75 }}
                            src={`${URL}storage/photos/${item.user.file ? item.user.file : 'no_user.png'}`} alt="subject" />
                        </div>
                        <div className='ms-2'>
                          <Typography className='ms-1' color="text.secondary">{item.user.name}</Typography>
                          <Rating value={item.rating} />
                        </div>
                      </div>

                      <div className="col-12">
                        <Typography>{item.comment}</Typography>
                      </div>
                    </div>
                  )
                  )}
                </> : <Typography>Loja sem nenhum comentário registrado</Typography>} */}
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