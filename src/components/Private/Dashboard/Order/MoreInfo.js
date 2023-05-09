import * as React from "react"
import Box from "@mui/material/Box"
import Fade from "@mui/material/Fade"
import Modal from "@mui/material/Modal"
import Backdrop from "@mui/material/Backdrop"
import { MdOutlineDone } from 'react-icons/md'
import CloseIcon from "@mui/icons-material/Close"
import dateMask from "../../../Utilities/masks/date"
import LocalAtmIcon from "@mui/icons-material/LocalAtm"
import CreditCardIcon from "@mui/icons-material/CreditCard"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { moneyMask } from "../../../Utilities/masks/currency"
import { GET_FETCH, POST_FETCH_FORMDATA, PUT_FETCH_FORMDATA, STORAGE_URL, URL } from "../../../../variables"
import characterLimitMask from "../../../Utilities/masks/characterLimit"
import { CircularProgress, IconButton, Button, Rating } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { useSelector } from "react-redux"
import { BiCommentCheck, BiCommentX, BiImageAdd } from 'react-icons/bi'
import { renderToast } from "../../../Utilities/Alerts"
import ImagesModal from "../../../Utilities/ImagesModal"

// -------------------------------------------------------------------
//********************************************************************
// -------------------------Styles------------------------------------
const style = {
  position: "absolute",
  left: "50%",
  width: "50%",
  minHeight: "100%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,

  '@media(max-width: 1000px)': {
    width: '90%',
    transform: 'initial',
    left: '5%',
  },
};

export default function MoreInfo(props) {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const [order, setOrder] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [delivered, setDelivered] = React.useState(false);
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loadingRate, setLoadingRate] = React.useState(false);

  const token = useSelector(state => state.AppReducer.token)

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    if (open) getData();
  }, [open])


  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  const getData = async () => {
    const response = await GET_FETCH({ url: `orders/${props.id}`, token: props.token });
    setOrder(response.order);
    setDelivered(response.order.products.map(item => {
      return {
        id: item.product.id,
        rating: 0,
        files: [],
        delivered: false,
        breshop_id: item.product.breshop_id,
        comment: { value: '', error: false },
      }
    }))
  };

  console.log('delivered', delivered)


  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
  const handleStatus = (status) => {
    switch (status) {
      case "pending":
        return { style: { backgroundColor: "#FFFF66" }, status: 'PENDENTE' }

      case "paid":
        return { style: { backgroundColor: "#8AFF8A" }, status: 'PAGO' };

      case "failed":
        return { style: { backgroundColor: "#FF8A8A" }, status: 'FALHA' };

      case "canceled":
        return { style: { backgroundColor: "#FF8A8A" }, status: 'CANCELADO' };

      default:
        return null;
    }
  }

  const handleMethod = (method) => {
    switch (method) {
      case "credit_card":
        return "Crédito"

      case "debit_card":
        return "Débito"

      case "boleto":
        return "Boleto"

      case "pix":
        return "Pix"

      default:
        return method;
    }
  }

  const handleDeliveredSubmit = async (validate, id) => {
    let response
    let body = new FormData()
    let ratingObj = delivered.filter(item => item.id === id)[0]

    body.append('product_id', id)
    body.append('order_id', order.id)
    body.append('breshop_id', ratingObj.breshop_id)

    if (validate) {
      if (!ratingObj.comment.value) ratingObj.comment.error = true

      body.append('rating', ratingObj.rating)
      body.append('comment', ratingObj.comment.value)
      ratingObj.files.forEach(item => { body.append('files[]', item.value) })

      if (ratingObj.comment.error) {
        setDelivered(delivered.map(item => {
          if (item.id === id) item.comment.error = true
          return item
        }))
      } else {
        setLoadingRate(true)
        response = await POST_FETCH_FORMDATA({ url: `${URL}api/order/products/rating/create`, body, token })
        console.log('response', response)
        if (response.status) {
          handleUpdateStatus(id)
          renderToast({ type: 'success', error: response.message })
        } else {
          renderToast({ type: 'error', error: response.message })
        }
        setLoadingRate(false)
      }
    } else {
      setLoadingSave(true)
      response = await POST_FETCH_FORMDATA({ url: `${URL}api/order/products/update`, body, token })
      console.log('response', response)
      if (response.status) {
        handleUpdateStatus(id)
        renderToast({ type: 'success', error: response.message })
      } else {
        renderToast({ type: 'error', error: response.message })
      }
      setLoadingSave(false)
    }
  }

  const handleUpdateStatus = (id) => {
    let newOrder = { ...order }
    newOrder.products.forEach(item => {
      if (item.product.id === id) item.delivered = true
    })
    setOrder(newOrder)
  }

  const handleRatingChange = (id, value) => {
    setDelivered(delivered.map(item => {
      if (item.id === id) item.rating = value
      return item
    }))
  }

  const handleCommentChange = (id, value) => {
    setDelivered(delivered.map(item => {
      if (item.id === id) {
        item.comment.value = value
        item.comment.error = ''
      }
      return item
    }))
  }

  const handleAddFiles = (id, files) => {
    console.log('files', files)
    const filePromises = []
    for (let i = 0; i < 4; i++) {
      if (files[i] !== undefined) {
        const fr = new FileReader()
        filePromises.push(new Promise((resolve) => {
          fr.onload = (e) => {
            resolve({ value: files[i], url: e.target.result, name: files[i].name })
          }
          fr.readAsDataURL(files[i])
        }))
      }
    }

    Promise.all(filePromises).then((fileDataArray) => {
      setDelivered(delivered.map(item => {
        if (item.id === id) {
          item.files = fileDataArray
        }
        return item
      }))
    })
  }


  return (
    <div>
      <IconButton color='success' onClick={handleOpen}>
        <VisibilityIcon size={17} />
      </IconButton>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        sx={{ overflowY: 'auto', height: '100%' }}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="d-flex">
              <div>
                <span className="lead">Detalhes do Pedido</span>
                <p className="text-muted">Visualize detalhes sobre o pedido!</p>
              </div>
              <div className="ms-auto">
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <hr />
            {order ?
              <div className="row">
                {order.charges.map((item, index) => {
                  const { style, status } = handleStatus(item.status)
                  return (
                    // <div key={index} className="row my-5 rounded" style={{ backgroundColor: "#DCDCDC" }}>
                    <div key={index} className='col-12 py-3 my-3 m-auto rounded bg-gray' style={{ whiteSpace: 'nowrap' }}>
                      <div className="d-flex">
                        <p>Pago em: </p>
                        <p className="ms-2">{item.paid_at ? dateMask(item.paid_at) : '- / - / -'}</p>
                      </div>

                      <div className="d-flex">
                        <LocalAtmIcon size={20} />
                        <p className="ms-1">{moneyMask(item.amount)}</p>
                      </div>

                      <div className="d-flex mt-2">
                        <CreditCardIcon size={20} />
                        <p className="ms-1">
                          {handleMethod(item.payment_method)}
                        </p>
                        {item.last_transaction.installments &&
                          <div className="d-flex ms-2">{item.last_transaction.installments}X</div>
                        }
                      </div>

                      <span style={style} className="m-1 text-center row status small">{status}</span>
                    </div>
                  )
                })}

                {order.products.map((item, index) => (
                  <div className="col-12 mt-3 bg-gray py-3 m-auto rounded" key={index}>
                    <p className="lead">{characterLimitMask(item.product?.name, 40)}</p>
                    <div className="d-flex">
                      {item.images.map(img => (
                        <div key={img?.file} style={{ width: 100, height: 100, marginRight: '1rem' }}>
                          <img className='w-100 h-100 rounded' src={`${STORAGE_URL + img?.file}`} />
                        </div>
                      ))}
                    </div>
                    <p className="small mt-1">{characterLimitMask(item.product?.description, 180)}</p>
                    <div className="d-flex align-items-center my-2">
                      <span className="bold">{moneyMask(10000)}</span>
                      <div className="ms-auto">
                        {item.delivered
                          ? <Button variant='contained' size='small' endIcon={<MdOutlineDone />} disabled>Produto recebido</Button>
                          : <Button variant='contained' size='small' endIcon={<MdOutlineDone />} onClick={() =>
                            setDelivered(delivered.map(item2 => { if (item2.id === item.product.id) item2.delivered = !item2.delivered; return item2 }))
                          }>{delivered.filter(item2 => item.product.id === item2.id)[0].delivered ? 'Cancelar recebimento' : 'Confirmar recebimento'}
                          </Button>}
                      </div>
                    </div>
                    <span className="text-center row" style={{ backgroundColor: '#FFF', height: '.1rem' }} />

                    {!item.delivered && delivered.map(item2 => {
                      if (item.product.id === item2.id && item2.delivered)
                        return (
                          <div key={item.product.id} className="row mt-3">
                            <div className="d-flex align-items-center">
                              <Rating value={item2.rating} onChange={({ target }) => handleRatingChange(item2.id, target.value)} />
                              <ImagesModal images={item2.files} />
                              <div className="ms-3 d-flex flex-wrap">
                                {item2.files.map(file => (
                                  <span className="ms-2 secondary" key={file.value.name}>{file.value.name}</span>
                                ))}
                              </div>
                            </div>
                            <textarea className={`${item2.comment.error && 'input-error'} comment-input`} value={item2.comment.value} onChange={({ target }) => handleCommentChange(item2.id, target.value)} cols="30" rows="5"></textarea>
                            <div className="d-flex">
                              <Button component="label" endIcon={<BiImageAdd />}>Envie Imagens
                                <input hidden onChange={({ target }) => handleAddFiles(item2.id, target.files)} accept="image/*" multiple type="file" />
                              </Button>
                              <div className="ms-auto">
                                <LoadingButton loading={loadingSave} onClick={() => handleDeliveredSubmit(false, item2.id)} loadingPosition="end" endIcon={<BiCommentX />}>Salvar sem feedback</LoadingButton>
                                <LoadingButton loading={loadingRate} onClick={() => handleDeliveredSubmit(true, item2.id)} loadingPosition="end" endIcon={<BiCommentCheck />}>Salvar</LoadingButton>
                              </div>
                            </div>
                          </div>
                        )
                    })
                    }
                  </div>
                )
                )}
              </div>
              : <div className="d-flex justify-content-center p-5">
                <CircularProgress color='inherit' />
              </div>}
          </Box>
        </Fade>
      </Modal >
    </div >
  );
}
