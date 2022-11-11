import { Avatar, Button, Chip, CircularProgress, Divider, Fade, Rating, ThemeProvider, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { URL } from '../../variables'
import Navbar from './Navbar'
import Theme from '../routes/Theme/Theme'
import { FileDrop } from 'react-file-drop'
import Footer from './Footer'

const Product = () => {
  const [state, setState] = React.useState({
    product: '',
    imgSelected: '',
    loading: true,
    changeImg: true,
    shop: '',
  })
  const params = useParams()
  const history = useNavigate()

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
        console.log('product', resp)
      })
  }, [])

  function renderImages() {
    console.log('product', state.product.images)
    // setTimeout(() => { setState({ ...state, changeImg: false }) }, 200);
    return state.product.images.map(item => (
      <div className="col-sm-3 col-6 mt-2">
        <div onClick={() => { setState({ ...state, imgSelected: { id: item.id, file: item.file }, changeImg: !state.changeImg }) }} style={{ height: 100, cursor: 'pointer' }}>
          {item.file && <img style={{ width: '100%', height: '100%', borderRadius: 5, border: item.id === state.imgSelected.id && '2px solid yellow' }} alt='product' src={`${URL}storage/${item.file}`}></img>}
        </div>
      </div>
    ))
  }

  return (
    <ThemeProvider theme={Theme}>
      <div className='bg-light vh-100'>
        <Navbar />
        <div className="m-auto bg-white mt-5 p-5 rounded" style={{ maxWidth: 1000 }}>
          {!state.loading ?
            <div>
              <div className="row mx-3">
                <div className="col-md-6 col-12 m-auto my-2">
                  <div className="col-12" style={{ minHeight: 350 }}>
                    <Fade in={state.changeImg}><img src={`${URL}storage/${state.imgSelected ? state.imgSelected.file : state.product.images[0].file}`} style={{ width: 450, height: 450, borderRadius: 10, transitionDuration: '0.5s' }} alt='product' /></Fade>
                  </div>
                  <div className="row">
                    {state.product && renderImages()}
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <Typography variant='h5'>{state.product.name}</Typography>
                  <Typography variant='h4'>R$: {state.product.price}</Typography>
                  <Typography variant='body1'>Descrição</Typography>
                  <Typography variant='body2'>{state.product.description}</Typography>
                  <Typography variant='body1'>Avaria</Typography>
                  <Typography variant='body2'>{state.product.damage_description}</Typography>
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
              <div className="row">
                <div className="d-flex justify-content-center mb-5">
                  <Typography color="text.secondary" variant='h5'>Comentários</Typography>
                </div>
                <div className='col-12'>
                  <div className="d-flex justify-content-start">
                    <div>
                      <img className='m-auto' style={{ width: 75, height: 75 }} src={`${URL}storage/photos/no_user.png`} alt="subject" />
                    </div>
                    <div>
                      <div className='d-flex mb-2'>
                        <Typography color="text.secondary">Usuario</Typography>
                      </div>
                      <div>
                        <Rating name="read-only" value={0} readOnly />
                      </div>
                    </div>

                  </div>
                </div>
                <div className="col-12 mt-1" style={{ backgroundColor: '#EBEBEB', borderRadius: 30, minHeight: 100 }}>
                  <Typography align='left' color="text.secondary" className='m-3'>Comentário</Typography>
                </div>
              </div>

              <div className="row">
                <div className="d-flex mt-3">
                  <div className="justify-content-start">
                    <Button variant='contained'>Voltar</Button>
                  </div>

                  <div className="ms-auto">
                    <Button variant='contained' className='mx-2'>Adicionar ao carrinho</Button>
                    <Button variant='contained'>Finalizar compra</Button>
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
        {/* <div className="d-flex m-2">
            <div className="align-self-center">
              <Button variant='contained' size='large' onClick={() => history('/home/products')} startIcon={<ReplyAllIcon />}> Voltar</Button>
            </div>
            <div className="align-self-center ms-auto">
              <LoadingButton variant='contained' size='large' loading={state.loading_save} onClick={() => edit ? store_product('update') : store_product('add')} loadingPosition="end" endIcon={<SaveIcon />}>Salvar</LoadingButton>
            </div>
          </div> */}
        {/* <Footer /> */}
      </div >
    </ThemeProvider >
  )
}

export default Product