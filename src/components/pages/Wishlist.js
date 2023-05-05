import React from "react"
import { MdOutlineClose } from 'react-icons/md'
import Modal from "@mui/material/Modal"
import { useSelector, useDispatch } from 'react-redux'
import Backdrop from "@mui/material/Backdrop"
import { useNavigate } from 'react-router-dom'
import CloseIcon from "@mui/icons-material/Close"
import { renderToast } from "../utilities/Alerts"
import { DELETE_FETCH, GET_FETCH, PUT_FETCH, STORAGE_URL } from "../../variables"
import { CircularProgress, IconButton, Button, Badge } from "@mui/material"
import { moneyMask } from "../utilities/masks/currency"
import characterLimitMask from "../utilities/masks/characterLimit"
import emptyBag from '../../assets/empty_bag.png'
import FavoriteIcon from '@mui/icons-material/Favorite';

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

const Wishlist = () => {
  const [loading, setLoading] = React.useState(true)
  const [products, setProducts] = React.useState([])

  const history = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector(state => state.AppReducer.token)
  const toggled = useSelector(state => state.AppReducer.wishlist_toggled)
  const notify = useSelector(state => state.AppReducer?.wishlist_items?.length)

  const getData = async () => {
    const response = await GET_FETCH({ url: 'wishlists', token })

    if (response.status) {
      setProducts(response.wishlist_products)
      localStorage.setItem("wishlist_items", JSON.stringify(response.wishlist_products))
      dispatch({ type: 'wishlist_items', payload: response.wishlist_products })
    }
    else {
      renderToast({ type: 'error', error: response.message })
    }

    setLoading(false)
  }

  const handleDelete = async (id) => {
    const filtredProducts = products.filter(item => item.id !== id)
    setProducts(filtredProducts)
    const response = await DELETE_FETCH({ url: `wishlists/delete/${id}`, token })
    if (response.status) {
      localStorage.setItem("wishlist_items", JSON.stringify(filtredProducts))
      dispatch({ type: 'wishlist_items', payload: filtredProducts })
    }
  }

  const toggleOpen = () => {
    if (token) {
      setLoading(true)
      getData()
    }
    dispatch({ type: 'toggle_wishlist', toggled: !toggled })
  }

  return (
    <>
      <Badge badgeContent={notify} color="error">
        <button className="transparent-button m-auto" aria-label="Favoritos" onClick={toggleOpen}>
          <FavoriteIcon sx={{ color: 'white' }} />
        </button>
      </Badge>

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
                  <p className='dash-title'>Lista de desejos</p>
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
                        {products?.length !== 0 ?
                          products.map(item => (
                            <div key={item.id} className="row mb-4 pointer" onClick={() => { dispatch({ type: 'toggle_wishlist', toggled: false }); history(`product/${item.id}`) }}>
                              <div className="col-sm-4 position-relative">
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }} type='button' className="close-sale" style={{ margin: 0, marginRight: 3, marginTop: -8 }}>
                                  <MdOutlineClose color='#FFF' size={25} />
                                </button>
                                <img src={`${STORAGE_URL + item.thumb}`} className='img-fluid' alt="product" />
                                {item.discount &&
                                  <div className='sale'>
                                    <p className='h6'>{item.discount}%</p>
                                  </div>}
                              </div>
                              <div className="col-sm-8">
                                <div className="d-flex align-content-between flex-wrap h-100">
                                  <div className='w-100'>
                                    <p>{characterLimitMask(item.name, 40)}</p>
                                    <p className='small m-auto'>{characterLimitMask(item.description, 180)}</p>
                                  </div>
                                  <div className="w-100">
                                    <div className='align-self-start'>
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
                                </div>
                              </div>
                            </div>
                          ))
                          :
                          <div className='row h-100'>
                            <div className='m-auto' style={{ width: '50%', height: '50%', margin: 'auto' }}>
                              <div className="d-flex justify-content-center">
                                <FavoriteIcon sx={{ fontSize: 180, color: '#6C757D' }} />
                              </div>

                              <p className='dash-title text-center'>Sem nenhum desejo...</p>
                              <p className='text-muted text-center'>Adicione produtos à lista de desejos!</p>
                            </div>
                          </div>}
                      </>
                      : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
                  </>
                  :
                  <div className='row h-100'>
                    <div className='m-auto' style={{ width: '50%', height: '50%', margin: 'auto' }}>
                      <div className="d-flex justify-content-center">
                        <FavoriteIcon sx={{ fontSize: 180, color: '#6C757D' }} />
                      </div>

                      <p className='dash-title text-center'>Sem nenhum desejo...</p>
                      <p className='text-muted text-center'>Faça login para carregar sua lista!</p>
                    </div>
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </Modal >
    </ >
  )
}

export default Wishlist