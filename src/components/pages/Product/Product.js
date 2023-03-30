import { Button, CircularProgress, Divider, Fade, Rating, ThemeProvider, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL, POST_FETCH, URL } from '../../../variables'
import Container from '../Container'
import { useSelector, useDispatch } from 'react-redux'
import { MdClose } from 'react-icons/md'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { moneyMask } from '../../utilities/masks/currency'
import ProductImages from './ProductImages'

const Product = () => {
  const [state, setState] = React.useState({
    shop: '',
    rating: 0,
    comment: '',
    product: '',
    loading: true,
    changeImg: true,
    imgSelected: '',
  })
  const [ratings, setRatings] = React.useState('')
  const [ratingsFilter, setRatingsFilter] = React.useState('')
  const [loadingCart, setLoadingCart] = React.useState(false)
  const params = useParams()
  const history = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector(state => state.AppReducer.token)
  const user = useSelector(state => state.AppReducer.user)

  React.useEffect(() => {
    fetch(`${URL}api/get_public_product/${params.id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        // 'Content-Type': 'application/json',
      }
    })
      .then(async (response) => {
        const resp = await response.json();
        setState({ ...state, product: resp.product, loading: false, shop: resp.product.owner })
        setRatings(resp.product.owner.ratings); setRatingsFilter(resp.product.owner.ratings)
        console.log('product', resp)
      })
  }, [])

  const submitComment = async (e) => {
    e.preventDefault()
    const response = await POST_FETCH({
      url: `${URL}api/store_rating`, token, body: { breshop_id: state.shop.id, comment: state.comment, rating: state.rating }
    })
    console.log('comment', response)
  }

  const getRating = (value) => {
    const rating = ratings.filter(item => item.rating === value).length
    return rating
  }

  const handleFilterRating = (value) => {
    console.log('ativou')
    const newRatings = ratings.filter(item => item.rating === value)
    if (value) setRatingsFilter(newRatings)
    else setRatingsFilter(ratings)
  }

  const handleAddCart = async () => {
    setLoadingCart(true)
    const response = await POST_FETCH({ url: `${API_URL}cart/create`, body: { product_id: state.product.id, quantity: 1 }, token })
    if (response?.status) {
      // window.scrollTo(0, 0)
      // dispatch({ type: 'cart_items', payload: { cart_items: response.cart_products } })
      dispatch({ type: 'toggle_cart', toggled: true })
    }
    setLoadingCart(false)
    console.log('resp', response)
  }

  return (
    <Container>
      <div className="bg-white mt-5 p-sm-5 rounded">
        {!state.loading ?
          <div>
            <div className="row">
              <div className="col-12 mb-3">
                <span className='product-title'>{state.product.name}</span>
              </div>

              <div className="col-lg-6">
                <ProductImages thumb={state.product.thumb} images={state.product.images} />
              </div>
              <div className="col-lg-6">
                <div className="d-flex align-content-around flex-wrap h-100">
                  <div className="col-12">
                    <p className='price'>{moneyMask(state.product.price)}</p>

                    <p className='product-subtitle'>
                      <strong>{moneyMask(state.product.price)}</strong> em até 12x de <strong>{moneyMask(state.product.price * (16.37 / 100))}</strong> sem juros no cartão
                      Ou em 1x no cartão com até <strong>5% OFF</strong>
                    </p>
                    <span className='product-subtitle'>Descrição: </span>
                    <p className='product-subtitle'>{state.product.description}</p>
                    <span className='product-subtitle'>Avaria: </span>
                    <p className='product-subtitle'>{state.product.damage_description ? state.product.damage_description : 'Produto não possui desgastes'}</p>

                    <span className='product-subtitle'>Tamanhos: </span>
                    <div className="d-flex">
                      <div className="me-2"><button className='rounded-button'>PP</button></div>
                      <div className="me-2"><button className='rounded-button'>P</button></div>
                      <div className="me-2"><button className='rounded-button'>M</button></div>
                      <div className="me-2"><button className='rounded-button'>G</button></div>
                      <div className="me-2"><button className='rounded-button'>GG</button></div>
                      <div className="me-2"><button className='rounded-button'>XL</button></div>
                    </div>

                    <p className='product-subtitle mt-3'>Estoque: {state.product.quantity > 0
                      ? <span className='success bold'>{state.product.quantity === 1 ? state.product.quantity + ' unidade' : state.product.quantity + ' unidades'}</span>
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
                      <Typography color="text.secondary">{state.shop.name}</Typography>
                      <Rating name="read-only" value={0} readOnly />
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

              {ratings.length > 0 ?
                <>
                  <div className="mb-5">
                    <span className="lead ms-2">Filtrar por:</span>
                    <span className="lead ms-2" onClick={() => handleFilterRating("1")}>Uma estrela ({getRating("1")}), </span>
                    <span className="lead ms-2" onClick={() => handleFilterRating("2")}>Duas estrelas ({getRating("2")}), </span>
                    <span className="lead ms-2" onClick={() => handleFilterRating("3")}>Três estrelas ({getRating("3")}), </span>
                    <span className="lead ms-2" onClick={() => handleFilterRating("4")}>Quatro estrelas ({getRating("4")}), </span>
                    <span className="lead ms-2" onClick={() => handleFilterRating("5")}>Cinco estrelas ({getRating("5")})</span>
                    <div className="d-flex align-items-center" onClick={() => handleFilterRating(null)}>
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
                </> : <Typography>Loja sem nenhum comentário registrado</Typography>}

              {/* -------------------------Do-a-comment-Section------------------------- */}
              <div className='col-12 my-5'>
                <div className="d-flex justify-content-start">
                  <div>
                    <img className='m-auto' style={{ width: 75, height: 75 }} src={`${URL}storage/photos/${user.file ? user.file : 'no_user.png'}`} alt="subject" />
                  </div>
                  <div className='ms-2'>
                    <Typography className='ms-1' color="text.secondary">{user.name}</Typography>
                    <Rating value={state.rating} onChange={(e, value) => setState({ ...state, rating: value })} />
                  </div>
                </div>
                <form className="input-group" onSubmit={(e) => submitComment(e)}>
                  <input type='area' className="mt-1 comment-input" value={state.comment} onChange={({ target }) => setState({ ...state, comment: target.value })} />
                  <Button type='submit'>Enviar</Button>
                </form>
              </div>
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