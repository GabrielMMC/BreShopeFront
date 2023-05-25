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
import PixModal from "./PixModal"

// -------------------------------------------------------------------
//********************************************************************
// -------------------------Styles------------------------------------
const style = {
  position: "absolute",
  right: 0,
  width: '50%',
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
  const [isTimeout, setIsTimeout] = React.useState(false);
  const [remainingSeconds, setRemainingSeconds] = React.useState(false);
  const [test, setTest] = React.useState('2023-05-19T17:00:00.000000Z');

  const token = useSelector(state => state.AppReducer.token)

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    if (open) getData();
  }, [open])

  React.useEffect(() => {
    // console.log('renderizou')
    if (open) {
      if (!remainingSeconds && order?.method === 'pix') {
        const { seconds, timeout } = handleTimeoutPayment(order.created_at)
        setRemainingSeconds(seconds)
        setIsTimeout(timeout)
      }
      // console.log('uai', timeout, seconds)
      if (!isTimeout && order?.method === 'pix' && remainingSeconds) {
        setTimeout(() => {
          if (remainingSeconds - 1 <= 0) setIsTimeout(true)
          else setRemainingSeconds(remainingSeconds - 1)
          console.log('sec adjust', remainingSeconds - 1)
        }, 1000)
      }
    }
  }, [remainingSeconds, order])


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
        return { style: { backgroundColor: "#fff0be", color: '#7f742c', fontWeight: 700 }, status: 'Pendente' }

      case "paid":
        return { style: { backgroundColor: "#c7e7c8", color: '#3e6243', fontWeight: 700 }, status: 'Pago' };

      case "failed":
        return { style: { backgroundColor: "#ffc6cd", color: '#ac3b45', fontWeight: 700 }, status: 'Falha' };

      case "canceled":
        return { style: { backgroundColor: "#ffc6cd", color: '#ac3b45', fontWeight: 700 }, status: 'Cancelado' };

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

  const handleTimeoutPayment = (createdAt) => {
    // 2023-05-18T15:38:00.000000Z
    console.log('created at', createdAt)
    createdAt = new Date(createdAt); // Converte a string para um objeto Date
    let now = new Date(); // Obtém a data e hora atual
    console.log('created at', createdAt)

    let milisecondsDifference = now - createdAt; // Calcula a diferença em milissegundos
    let minutesDifference = milisecondsDifference / (1000 * 60); // Converte para minutos

    let timeout = minutesDifference > 5; // Verifica se mais de 5 minutos se passaram
    let seconds = Math.max(0, Math.floor((5 - minutesDifference) * 60)); // Calcula os segundos restantes

    return {
      timeout: timeout,
      seconds: seconds
    };
  };


  return (
    <div>
      <IconButton color='inherit' onClick={handleOpen}>
        <VisibilityIcon color='gray' size={17} />
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
                <span style={handleStatus(order.status).style} className="mb-3 text-center col-12 p-2 rounded">{handleStatus(order.status).status}</span>
                {order.charges.length > 0 ?
                  <>
                    {order.charges.map(item => {
                      const { style, status } = handleStatus(item.status)
                      return (
                        <div className="col-12 mb-3 rounded bg-gray">
                          <div className={`col-12 py-3 rounded mt-3 bg-gray`} style={{ whiteSpace: 'nowrap' }}>
                            <div className="d-flex align-items-center">
                              <span>Pago em: </span>
                              <span className="ms-2">{item.paid_at ? dateMask(item.paid_at) : '- / - / -'}</span>
                            </div>

                            <div className="d-flex mt-3 align-items-center">
                              <LocalAtmIcon size={20} />
                              <span className="ms-1">{moneyMask(item.amount)}</span>
                            </div>

                            <div className="d-flex mt-2 align-items-center">
                              <CreditCardIcon size={20} />
                              <span className="ms-1">Cartão de Crédito</span>
                              <div className="d-flex ms-2">{item.installments}X</div>
                            </div>

                            <span style={style} className="text-center row px-3 mt-2">{status}</span>
                          </div>
                        </div>
                      )
                    })}
                  </>
                  :
                  <div className="col-12 mb-3 rounded bg-gray">
                    <div className={`col-12 py-3 rounded mt-2 bg-gray`} style={{ whiteSpace: 'nowrap' }}>
                      <div className="d-flex align-items-center">
                        <p className="bolder">Pago em: </p>
                        <p className="ms-2">{order.paid_at ? dateMask(order.paid_at) : '- / - / -'}</p>
                      </div>

                      <div className="d-flex mt-3 align-items-center">
                        <LocalAtmIcon size={20} />
                        <p className="ms-1">{moneyMask(order.amount)}</p>
                      </div>

                      <div className="d-flex mt-2 align-items-center">
                        <CreditCardIcon size={20} />
                        <p className="ms-1">
                          {handleMethod(order.method)}
                        </p>

                        {order.method === 'pix' &&
                          <div className="ms-1">
                            {!isTimeout && order.status === 'pending'
                              ? <span className="align-items-center d-flex"> - em aberto <PixModal style={style} img={order.file} createdAt={order.created_at} totalTime={remainingSeconds} handleTimeoutPayment={handleTimeoutPayment} /></span>
                              : ' - pedido vencido'}
                          </div>
                        }
                        {order.installments &&
                          <div className="d-flex ms-2">{order.installments}X</div>
                        }
                      </div>
                    </div>
                  </div>}
                {order.products.map((item, index) => (
                  <div className="col-12 mb-3 bg-gray py-3 m-auto rounded" key={index}>
                    <p className="bolder" style={{ fontSize: 20 }}>{characterLimitMask(item.product?.name, 40)}</p>
                    <div className="d-flex flex-wrap my-2">
                      <img style={{ width: 175, height: 200, borderRadius: '.4rem', marginRight: 15 }} src={`${STORAGE_URL + item.product.thumb}`} />
                      {item.images.map(img => (
                        <div key={img?.file}>
                          <img style={{ width: 175, height: 200, borderRadius: '.4rem', marginRight: 15 }} src={`${STORAGE_URL + img?.file}`} />
                        </div>
                      ))}
                    </div>
                    <p className="bolder">Descrição: </p>
                    <p>{characterLimitMask(item.product?.description, 180)}</p>
                    <div className="mt-2">
                      <p className="bolder">Preço: </p>
                      <p>{moneyMask(item?.amount)} x {item?.quantity}Un</p>
                    </div>

                    <div className="d-flex mt-2">
                      <div className="ms-auto">
                        {item.delivered
                          ? <Button variant='contained' size='small' endIcon={<MdOutlineDone />} disabled>Produto recebido</Button>
                          : <Button variant='contained' size='small' endIcon={<MdOutlineDone />} onClick={() =>
                            setDelivered(delivered.map(item2 => { if (item2.id === item.product.id) item2.delivered = !item2.delivered; return item2 }))
                          }>{delivered.filter(item2 => item.product.id === item2.id)[0].delivered ? 'Cancelar recebimento' : 'Confirmar recebimento'}
                          </Button>}
                      </div>
                    </div>

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
