import React from "react"
import { MdOutlineClose } from 'react-icons/md'
import Modal from "@mui/material/Modal"
import { useSelector, useDispatch } from 'react-redux'
import Backdrop from "@mui/material/Backdrop"
import { useNavigate } from 'react-router-dom'
import CloseIcon from "@mui/icons-material/Close"
import { renderToast } from "../Utilities/Alerts"
import { DELETE_FETCH, GET_FETCH, PUT_FETCH, STORAGE_URL } from "../../variables"
import { CircularProgress, IconButton, Button, Badge } from "@mui/material"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { moneyMask } from "../Utilities/masks/currency"
import characterLimitMask from "../Utilities/masks/characterLimit"
import emptyBag from '../../assets/empty_bag.png'

// -------------------------------------------------------------------
//********************************************************************
// -------------------------Styles------------------------------------
// const style = {
//   // position: "absolute",
//   // left: "60%",
//   width: "%",
//   height: "100%",
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   '@media(max-width: 1200px)': {
//     width: '90%',
//     left: '5%',
//   },
// };

const Cart = () => {
  const [loading, setLoading] = React.useState(true)
  const [products, setProducts] = React.useState([])
  const [timeoutId, setTimeoutId] = React.useState(null);

  const history = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector(state => state.AppReducer.token)
  const toggled = useSelector(state => state.AppReducer.toggled)
  const notify = useSelector(state => state.AppReducer?.cart_notify)

  const getData = async () => {
    const response = await GET_FETCH({ url: 'cart', token })
    // console.log('resp cart', response)

    if (response.status) {
      setProducts(response.cart_products)
      localStorage.setItem("cart_notify", response.cart_products.length)
      dispatch({ type: 'cart_notify', payload: response.cart_products.length })
    }
    else {
      renderToast({ type: 'error', error: response.message })
    }

    setLoading(false)
  }

  // const handleQuantityChange = (value, id) => {
  //   if (value >= 0) {
  //     setProducts((oldProducts) => oldProducts.map(item => {
  //       if (item.product_id === id) item.quantity = value
  //       return item
  //     }))

  //     if (timeoutId) {
  //       clearTimeout(timeoutId);
  //     }

  //     setTimeoutId(() =>
  //       setTimeout(async () => {
  //         await PUT_FETCH({ url: 'cart/update', body: { product_id: id, quantity: value }, token })
  //       }, 750))
  //   }
  // }

  const handleDelete = async (id) => {
    setProducts(products.filter(item => item.product_id !== id))
    const response = await DELETE_FETCH({ url: `cart/delete/${id}`, token })
    if (response.status) {
      localStorage.setItem("cart_notify", notify - 1)
      dispatch({ type: 'cart_notify', payload: notify - 1 })
    }
  }

  const toggleOpen = () => {
    if (token) {
      setLoading(true)
      getData()
    }
    dispatch({ type: 'toggle_cart', toggled: !toggled })
  }

  return (
    <>
      <Badge badgeContent={notify > 0 ? notify : null} color="error">
        <button className="transparent-button m-auto" aria-label="Carrinho de compras" onClick={toggleOpen}>
          <ShoppingCartIcon sx={{ color: 'white' }} />
        </button>
      </Badge >

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={toggled}
        onClose={toggleOpen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className='modal-content ms-auto slide-in-left'>
          <div className="row h-100">
            <div className="d-flex align-content-between flex-wrap">
              <div className="w-100">
                <div className="d-flex align-items-center">
                  <p className='dash-title'>Carrinho de compras</p>
                  <div className="ms-auto">
                    <IconButton aria-label="Fechar" onClick={toggleOpen}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                </div>
                <hr className='mb-5' />

                {token ?
                  <>
                    {!loading ?
                      <>
                        {products.length !== 0 ?
                          products.map(item => (
                            <div key={item.product_id} className="row mb-4">
                              <div className="col-sm-4 position-relative">
                                <button onClick={() => handleDelete(item.product_id)} type='button' className="close-sale" style={{ margin: 0, marginRight: 3, marginTop: -8 }}>
                                  <MdOutlineClose color='#FFF' size={25} />
                                </button>
                                <img src={STORAGE_URL + item?.thumb} alt="product" className='img-fluid' />
                                {item.discount &&
                                  <div className='sale'>
                                    <p className='h6'>{item.discount}%</p>
                                  </div>}
                              </div>
                              <div className="col-sm-5">
                                <p>{item.name}</p>
                                <p className='small'>{characterLimitMask(item.description, 180)}</p>
                              </div>
                              <div className="col-sm-3">
                                <div className="d-flex input-group justify-content-end flex-nowrap">
                                  <button disabled className='cart-button' style={{ borderRadius: '.4rem 0 0 .4rem' }}>-</button>
                                  <input disabled className='form-control text-center' type="text" style={{ maxWidth: '3rem' }} value={item.quantity} />
                                  <button disabled className='cart-button' style={{ borderRadius: '0 .4rem .4rem 0' }}>+</button>
                                </div>
                                {item.discount ?
                                  <>
                                    <p className='bold'>
                                      <del>{moneyMask(item.price)}</del>
                                    </p>
                                    <p style={{ color: '#DC3545', fontWeight: 'bold' }}>
                                      {moneyMask(item.price - (item.price * (item.discount / 100)))}
                                    </p>
                                  </>
                                  : <p className='bold'>
                                    {moneyMask(item.price)}
                                  </p>
                                }
                              </div>
                            </div>
                          ))
                          :
                          <div className='row h-100'>
                            <div className='m-auto' style={{ width: '50%', height: '50%', margin: 'auto' }}>
                              <img className='img-fluid' src={emptyBag} />
                              <p className='dash-title text-center'>Sacola vazia...</p>
                              <p className='text-muted text-center'>Adicione produtos para ir à tela de pagamento</p>
                            </div>
                          </div>}
                      </>
                      : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
                  </>
                  :
                  <div className='row h-100'>
                    <div className='m-auto' style={{ width: '50%', height: '50%', margin: 'auto' }}>
                      <img className='img-fluid' src={emptyBag} />
                      <p className='dash-title text-center'>Sacola vazia...</p>
                      <p className='text-muted text-center'>Faça login para carregar seu carrinho!</p>
                    </div>
                  </div>}
              </div>

              <div className="ms-auto">
                <Button size='large' variant='contained' disabled={Boolean(products.length === 0)} onClick={() => { dispatch({ type: 'toggle_cart', toggled: false }); history('/payment') }} endIcon={<ShoppingCartCheckoutIcon />}>Ir para pagamento</Button>
              </div>
            </div>
          </div>
        </div>
      </Modal >
    </ >
  )
}

export default Cart