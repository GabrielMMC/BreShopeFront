import { Button, ThemeProvider, Typography } from '@mui/material';
import React from 'react';
import { FileDrop } from 'react-file-drop';
import { URL } from '../../../variables';
import Input from '../Input/Input';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Theme from '../Theme/Theme';

const AddProduct = ({ edit }) => {
  const [state, setState] = React.useState({
    name: { label: 'Nome*', value: "", error: false, col: 'col-sm-12', type: 'text' },
    price: { label: 'Preço*', value: "", error: false, col: 'col-sm-6', type: 'price', },
    material: { label: 'Material*', value: "", error: false, col: 'col-sm-6', type: 'text' },
    description: { label: 'Descrição*', value: "", error: false, col: 'col-sm-12', type: 'multiline', },
    quantity: { label: 'Quantidade*', value: "", error: false, col: 'col-sm-12', type: 'number' },
    damage: { label: 'Avaria', value: "", error: false, col: 'col-sm-12', type: 'text' },
    files: [{ value: '', url: '' }, { value: '', url: '' }, { value: '', url: '' }, { value: '', url: '' }, { value: '', url: '' }],
    loading: true,
    loading_save: false,
  })
  const [size, setSize] = React.useState({
    pp: false,
    p: false,
    m: false,
    g: false,
    gg: false,
    xg: false
  })
  const history = useNavigate();
  const token = useSelector(state => state.AppReducer.token);
  let user = localStorage.getItem('user');
  user = JSON.parse(user);

  function renderInput() {
    const state2 = { ...state }
    let keys = Object.keys(state2)
    keys = keys.filter(item => item === 'name' || item === 'material' || item === 'description' || item === 'damage' || item === 'price' || item === 'quantity')
    return (
      keys.map(item => (
        <Input state={state} setState={(e) => setState(e)} item={item} />
      ))
    )
  }

  function renderSize() {
    const sizes = { ...size }
    const keys = Object.keys(sizes)
    return (
      keys.map(item => (
        <div className="col-2 text-center rounded">
          <Button fullWidth color={size[item] ? 'success' : 'error'} sx={{ backgroundColor: '#f1f1f1' }} endIcon={size[item] ? <CheckIcon /> : <CloseIcon />} onClick={() => setSize({ ...size, [item]: !size[item] })}>
            {item}
          </Button>
        </div>
      ))
    )
  }

  function changeFile(file, index) {
    let fr = new FileReader()
    fr.onload = (e) => {
      let file2 = { ...state }
      file2.files[index] = { value: file, url: e.target.result }
      setState(file2)
    }
    fr.readAsDataURL(file)
  }

  function formatReal(int) {
    var tmp = int;
    tmp = tmp.replace(/[R|\s]+/g, "").replace(/[$|\s]+/g, "")
    if (tmp.length > 6)
      tmp = tmp.replace(/[,|\s]+/g, ".");

    return tmp;
  }

  function store_product() {
    setState({ ...state, loading_save: true })
    let price = state.price.value
    price = formatReal(price)
    let data = new FormData()
    data.append('user_id', user.id)
    data.append('name', state.name.value)
    data.append('price', parseFloat(price))
    data.append('material', state.material.value)
    data.append('damage', state.damage.value)
    data.append('description', state.description.value)
    data.append('quantity', state.quantity.value)

    data.append('pp', size.pp)
    data.append('p', size.p)
    data.append('m', size.m)
    data.append('g', size.g)
    data.append('gg', size.gg)
    data.append('xg', size.xg)

    state.files.forEach(item => {
      data.append('files[]', item.value)
    })

    // let keys = Object.keys({ ...size })
    // keys.forEach(item => {
    //   data.append('sizes[]', JSON.stringify({ [item]: size[item] }))
    // })

    console.log('sizes', data.getAll('sizes[]'))

    fetch(`${URL}api/store_product`, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application-json',
        'Authorization': `Bearer ${token}`
      },
      body: (data),
    }).then(async (response) => {
      const resp = response.json()
      console.log('resp', resp)
      setState({ ...state, loading_save: false })
    })
  }

  return (
    <ThemeProvider theme={Theme}>
      <div className='card m-auto' style={{ maxWidth: 1000 }}>
        <div className="card-body">
          <div className="row mt-3">
            <Typography variant='h5'>CADASTRO DE PRODUTO</Typography>
            <div className="col-md-6 col-12 m-auto my-2">
              <div className="col-12">
                <div style={{ height: 350 }}>
                  <FileDrop onDrop={(files, event) => changeFile(files[0], 0)}>
                    <Button style={{ color: '#666666', width: '100%', height: '100%', padding: 0 }} component="label">
                      {!state.files[0].url && <Typography variant='p' style={{ color: '#666666' }}>Arraste a foto ou escolha um arquivo</Typography>}
                      {state.files[0].url && <img style={{ width: '100%', height: '100%', borderRadius: 5 }} alt='product' src={state.files[0].url ? state.files[0].url : `${URL}storage/products/no_product.jpg`}></img>}
                      <input hidden onChange={(e) => changeFile(e.target.files[0], 0)} accept="image/*" multiple type="file" />
                    </Button>
                  </FileDrop>
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

export default AddProduct