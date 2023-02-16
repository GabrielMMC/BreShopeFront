import { Button, CircularProgress, Divider, Fade, Rating, ThemeProvider, Typography } from '@mui/material'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { POST_FETCH, URL } from '../../variables'
import Container from './Container'
import { useSelector } from 'react-redux'

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
  const params = useParams()
  const history = useNavigate()
  const token = useSelector(state => state.AppReducer.token)

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
    // setTimeout(() => { setState({ ...state, changeImg: false }) }, 200);
    return state.product.images.map(item => (
      <div className="col-sm-3 col-6 mt-2">
        <div onClick={() => { setState({ ...state, imgSelected: { id: item.id, file: item.file }, changeImg: !state.changeImg }) }} style={{ height: 100, cursor: 'pointer' }}>
          {item.file && <img style={{ width: '100%', height: '100%', borderRadius: 5, border: item.id === state.imgSelected.id && '2px solid yellow' }} alt='product' src={`${URL}storage/${item.file}`}></img>}
        </div>
      </div>
    ))
  }

  const submitComment = async (e) => {
    e.preventDefault()
    const response = await POST_FETCH({
      url: `${URL}api/store_rating`, token, body: { breshop_id: state.shop.id, comment: state.comment, rating: state.rating }
    })
    console.log('comment', response)
  }

  return (
    <Container>
      <div className="m-auto bg-white mt-5 p-sm-5 m-5 rounded" style={{ maxWidth: 1000 }}>
        {!state.loading ?
          <div>
            <div className="row mx-3">
              <div className="col-md-6 col-12 m-auto my-2">
                <div className="col-12" style={{ minHeight: 350 }}>
                  <Fade in={state.changeImg}><img src={`${URL}storage/${state.imgSelected ? state.imgSelected.file : state.product.images[0].file}`} style={{ width: 400, height: 400, borderRadius: 10, transitionDuration: '0.5s' }} alt='product' /></Fade>
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
                    </div>
                  </div>
                  <Rating value={state.rating} onChange={(e, value) => setState({ ...state, rating: value })} />

                </div>
              </div>
              <form className="input-group" onSubmit={(e) => submitComment(e)}>
                <input type='area' className="mt-1 comment-input" value={state.comment} onChange={({ target }) => setState({ ...state, comment: target.value })} />
                <Button type='submit'>Enviar</Button>
              </form>
            </div>

            <div className="row mt-5">
              <div className="d-flex mt-3">
                <div className="justify-content-start">
                  <Button variant='contained'>Voltar</Button>
                </div>

                <div className="ms-auto">
                  <Button variant='contained' className='mx-2'>Adicionar ao carrinho</Button>
                  <Button variant='contained' onClick={() => history(`/paymant/${params.id}`)}>Comprar agora</Button>
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