import { ThemeProvider } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {URL} from '../../variables'
import Theme from '../routes/Theme/Theme'

const Product = () => {
    const [state, setState] = React.useState({
    product: [],
  })
  const token = useSelector(state => state.AppReducer.token);
  const params = useParams()

  React.useEffect(() => {
    fetch(`${URL}api/get_product/${params.id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'application/json',
        }
      })
        .then(async (response) => {
          const resp = await response.json();
          setState({...state, product: resp.product})
        })
  }, [])

  return (
    <ThemeProvider theme={Theme}>
      <div className='card m-auto' style={{ maxWidth: 1000 }}>
        <div className="card-body">
          <div className="row mt-3">
            <div className="col-md-6 col-12 m-auto my-2">
              <div className="col-12">
                <div style={{ height: 350 }}>
                  <img src={`${URL}storage/${state.product.images[0].file}`} style={{width: 450, height: 450}} />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3 col-6 mt-2 m-auto">
                  <div style={{ height: 100 }}>
                    <FileDrop style={{ height: "100px !important" }} onDrop={(files, event) => changeFile(files[0], 1)}>
                      <Button style={{ color: '#666666', width: '100%', height: '100%', padding: 0 }} component="label">
                        {!state.files[1].url && <Typography variant='p' style={{ color: '#666666' }}>Escolha uma foto</Typography>}
                        {state.files[1].url && <img style={{ width: '100%', height: '100%', borderRadius: 5 }} alt='product' src={state.files[1].url ? state.files[1].url : `${URL}storage/products/no_product.jpg`}></img>}
                        <input hidden onChange={(e) => changeFile(e.target.files[0], 1)} accept="image/*" multiple type="file" />
                      </Button>
                    </FileDrop>
                  </div>
                </div>
                <div className="col-sm-3 col-6 mt-2 m-auto">
                  <div style={{ height: 100 }}>
                    <FileDrop style={{ height: "100px !important" }} onDrop={(files, event) => changeFile(files[0], 2)}>
                      <Button style={{ color: '#666666', width: '100%', height: '100%', padding: 0 }} component="label">
                        {!state.files[2].url && <Typography variant='p' style={{ color: '#666666' }}>Escolha uma foto</Typography>}
                        {state.files[2].url && <img style={{ width: '100%', height: '100%', borderRadius: 5 }} alt='product' src={state.files[2].url ? state.files[2].url : `${URL}storage/products/no_product.jpg`}></img>}
                        <input hidden onChange={(e) => changeFile(e.target.files[0], 2)} accept="image/*" multiple type="file" />
                      </Button>
                    </FileDrop>
                  </div>
                </div>
                <div className="col-sm-3 col-6 mt-2 m-auto">
                  <div style={{ height: 100 }}>
                    <FileDrop style={{ height: "100px !important" }} onDrop={(files, event) => changeFile(files[0], 3)}>
                      <Button style={{ color: '#666666', width: '100%', height: '100%', padding: 0 }} component="label">
                        {!state.files[3].url && <Typography variant='p' style={{ color: '#666666' }}>Escolha uma foto</Typography>}
                        {state.files[3].url && <img style={{ width: '100%', height: '100%', borderRadius: 5 }} alt='product' src={state.files[3].url ? state.files[3].url : `${URL}storage/products/no_product.jpg`}></img>}
                        <input hidden onChange={(e) => changeFile(e.target.files[0], 3)} accept="image/*" multiple type="file" />
                      </Button>
                    </FileDrop>
                  </div>
                </div>
                <div className="col-sm-3 col-6 mt-2 m-auto">
                  <div style={{ height: 100 }}>
                    <FileDrop style={{ height: "100px !important" }} onDrop={(files, event) => changeFile(files[0], 4)}>
                      <Button style={{ color: '#666666', width: '100%', height: '100%', padding: 0 }} component="label">
                        {!state.files[4].url && <Typography variant='p' style={{ color: '#666666' }}>Escolha uma foto</Typography>}
                        {state.files[4].url && <img style={{ width: '100%', height: '100%', borderRadius: 5 }} alt='product' src={state.files[4].url ? state.files[4].url : `${URL}storage/products/no_product.jpg`}></img>}
                        <input hidden onChange={(e) => changeFile(e.target.files[0], 4)} accept="image/*" multiple type="file" />
                      </Button>
                    </FileDrop>
                  </div>
                </div>
                <Typography className='mt-2' variant='p'>Recomendamos o uso de imagens com 450p X 450px</Typography>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="row">
                {renderInput()}
                {renderSize()}
              </div>
            </div>
          </div>         
        </div>
        <div className="d-flex m-2">
            <div className="align-self-center">
              <Button variant='contained' size='large' onClick={() => history('/home/products')} startIcon={<ReplyAllIcon />}> Voltar</Button>
            </div>
            <div className="align-self-center ms-auto">
              <LoadingButton variant='contained' size='large' loading={state.loading_save} onClick={() => edit ? store_product('update') : store_product('add')} loadingPosition="end" endIcon={<SaveIcon />}>Salvar</LoadingButton>
            </div>
          </div>
      </div >
    </ThemeProvider>
  )
}

export default Product