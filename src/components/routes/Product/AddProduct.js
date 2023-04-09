import { Button, IconButton, Typography } from '@mui/material';
import React from 'react';
import { FileDrop } from 'react-file-drop';
import { API_URL, GET_FETCH, PATCH_FETCH_FORMDATA, POST_FETCH_FORMDATA, PUT_FETCH_FORMDATA, URL } from '../../../variables';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MdClose, { MdClosedCaptionOff, MdOutlineClose } from 'react-icons/md'
import SaveIcon from '@mui/icons-material/Save';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import setError from '../../utilities/Error';
import { moneyMask } from '../../utilities/masks/currency';
import SavePreset from '../Form/SavePreset';
import { CircularProgress } from '@mui/material'
import { renderAlert, renderToast } from '../../utilities/Alerts';

const AddProduct = ({ edit }) => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const [hasDamage, setHasDamage] = React.useState(false)
  const [size, setSize] = React.useState({
    PP: false,
    P: false,
    M: false,
    G: false,
    GG: false,
    XG: false
  })

  const [form, setForm] = React.useState({
    name: { value: "", error: false },
    size: { value: "", error: false },
    damage: { value: "", error: false },
    description: { value: "", error: false },
    price: { value: "", mask: "", error: false },
    type: { value: "", error: false },
    styles: { value: "", error: false, selected: [] },
    materials: { value: "", error: false, selected: [] },
    thumb: { value: "", url: "" },
    files: [],
  })

  const history = useNavigate();
  const [loading, setLoading] = React.useState(true)
  const [loadingSave, setLoadingSave] = React.useState(false)
  const token = useSelector(state => state.AppReducer.token);

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  React.useEffect(() => {
    const getData = async () => {
      const response = await GET_FETCH({ url: 'get_data', token })
      // console.log('resp', response)

      if (edit) {
        let sizes = { ...size }
        Object.keys({ ...sizes }).forEach(item => { if (item === edit.size) sizes[item] = true })
        setSize(sizes)

        setForm({
          name: { ...form.name, value: edit.name },
          size: { ...form.size, value: edit.size },
          thumb: { ...form.thumb, url: edit.thumb },
          damage: { ...form.damage, value: edit.damage },
          description: { ...form.description, value: edit.description },
          type: { ...form.type, value: edit.type_id, fillOption: response.types },
          price: { ...form.price, value: edit.price, mask: moneyMask(edit.price) },
          styles: { ...form.styles, value: edit.styles[edit.styles.length - 1], selected: edit.styles, fillOption: response.styles },
          materials: { ...form.materials, value: edit.materials[edit.materials.length - 1], selected: edit.materials, fillOption: response.materials },
          files: edit.images,
        })
        if (edit.damage) setHasDamage(true)
      } else {
        setForm({
          ...form,
          filled: { value: true },
          type: { ...form.type, fillOption: response.types },
          styles: { ...form.styles, fillOption: response.styles },
          materials: { ...form.materials, fillOption: response.materials },
        })
      }
      setLoading(false)
    }

    getData()
  }, [])

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Saving-data-----------------------------
  const handleSave = async () => {
    let form2 = { ...form }
    let emptyError = false

    let formData = new FormData()
    Object.keys({ ...form }).forEach(item => {
      if (form[item].value || item === 'files' || (item === 'damage' && !hasDamage) || (edit && item === 'thumb')) formData.append(item, form[item].value)
      else { form2[item].error = true; emptyError = true; console.log('item erro', item) }
    })

    form.files.forEach(item => { formData.append('files[]', item.value) })
    form.styles.selected.forEach(item => { formData.append('styles[]', item) })
    form.materials.selected.forEach(item => { formData.append('materials[]', item) })

    if (!emptyError) {
      setLoadingSave(true)
      let response
      if (edit) {
        formData.append('product_id', edit.id)
        response = await POST_FETCH_FORMDATA({ url: `${API_URL}update_product`, body: formData, token })
      } else {
        response = await POST_FETCH_FORMDATA({ url: `${API_URL}store_product`, body: formData, token })
      }
      // console.log('resp', response)
      if (response.status) {
        renderToast({ type: 'success', error: response.message })
        setTimeout(() => history('/profile/products'), 1000)
      } else {
        renderToast({ type: 'error', error: response.message })
      }
      setLoadingSave(false)
    } else {
      setForm(form2)
    }
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
  function handleChangeFile(files) {
    const filePromises = []
    for (let i = 0; i < 4; i++) {
      if (files[i] !== undefined) {
        const fr = new FileReader()
        filePromises.push(new Promise((resolve) => {
          fr.onload = (e) => {
            resolve({ value: files[i], url: e.target.result })
          }
          fr.readAsDataURL(files[i])
        }))
      }
    }

    Promise.all(filePromises).then((fileDataArray) => {
      const updatedForm = { ...form }
      updatedForm.files = fileDataArray
      setForm(updatedForm)
    })
  }

  const handleChangeThumb = (file) => {
    let form2 = { ...form }

    let fr = new FileReader()
    fr.onload = (e) => {
      form2.thumb = { ...form2.thumb, value: file, url: e.target.result, noFile: true }
      setForm(form2)
    }
    fr.readAsDataURL(file)
  }

  const handleSizeChange = (key) => {
    let size2 = { ...size }
    Object.keys({ ...size }).forEach(item => {
      if (item === key) size2[item] = !size2[item]
      else size2[item] = false
    })

    setSize(size2)
    setForm({ ...form, size: { ...form.size, value: size2[key] ? key : '', error: false } })
  }

  const handleArrayChange = (value, type) => {
    let selected = form[type].selected
    if (selected.filter(item => item === value).length === 0) selected = [...selected, value]

    setForm({ ...form, [type]: { ...form[type], value, selected, error: false } })
  }

  const handleDamageChange = () => {
    setHasDamage(!hasDamage)
    setForm({ ...form, damage: { value: '', error: false } })
  }

  return (
    <div className="row">
      <p className='dash-title'>{edit ? 'Edição de produto' : 'Cadastro de produto'}</p>

      {!loading ?
        <>
          {/* -------------------------Thumb-image------------------------- */}
          <div className="row mb-4">
            <div className="col-xl-6 mt-3">
              <div className='m-auto' style={{ height: 450, width: 450 }}>
                <FileDrop onDrop={(files, event) => handleChangeThumb(files[0])}>
                  <Button style={{ color: '#666666', width: '100%', height: '100%', padding: 0 }} component="label">
                    {!form.thumb.url &&
                      <Typography variant='p' style={{ color: '#666666' }}>Arraste ou escolha a capa do produto</Typography>}
                    {form.thumb.url &&
                      <img className='w-100 h-100 rounded' alt='product' src={edit ? (form.thumb.noFile ? form.thumb.url : `${URL}storage/${form.thumb.url}`) : form.thumb.url}></img>}
                    <input hidden onChange={(e) => handleChangeThumb(e.target.files[0])} accept="image/*" multiple type="file" />
                  </Button>
                </FileDrop>
              </div>
            </div>
            {/* -------------------------Other-images------------------------- */}
            <div className="col-xl-6 mt-3 rounded">
              <div className='m-auto' style={{ height: 450, width: 450 }}>
                <FileDrop onDrop={(files, event) => handleChangeFile(files)}>
                  <Button style={{ color: '#666666', width: '100%', height: '100%', padding: 0 }} component="label">
                    {form.files.length === 0 ?
                      <Typography variant='p' style={{ color: '#666666' }}>Arraste ou escolha até quatro imagens</Typography>
                      :
                      <div className="d-flex flex-wrap h-100 w-100" onClick={(e) => { e.stopPropagation(); e.preventDefault() }}>
                        {form.files.map((item, index) => (
                          <div style={{ width: 223, height: 223 }} key={index}>
                            <div className="d-flex h-100">
                              <img alt='file' src={edit ? (item.url ? item.url : `${URL}storage/${item.file}`) : item.url} className='w-100 h-100' />
                              <div className="p-absolute">
                                <button className='close-absolute' onClick={() => {
                                  setForm({
                                    ...form, files: form.files.filter(file => file.id ? file.id !== item.id : file.url !== item.url)
                                  })
                                }}>
                                  <MdOutlineClose size={20} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                        )}
                      </div>
                    }
                    <input hidden onChange={(e) => handleChangeFile(e.target.files)} accept="image/*" multiple type="file" />
                  </Button>
                </FileDrop>
              </div>
            </div>
            {/* -------------------------Button-image------------------------- */}
            <div className="col-12 my-3">
              <Button fullWidth sx={{ backgroundColor: '#e8e8e8' }} component="label">
                {<Typography variant='p' style={{ color: '#666666' }}>Escolha o restante das imagens</Typography>}
                <input hidden onChange={(e) => handleChangeFile(e.target.files)} accept="image/*" multiple type="file" />
              </Button>
              <Typography className='mt-2' variant='p'>Recomendamos o uso de imagens com no mínimo 500px X 500px</Typography>
            </div>
          </div>

          {/* -------------------------Types------------------------- */}
          <div className="row">
            <div className="col-sm-4">
              <div className="form-floating">
                <select id='type' className={`form-control ${form.type.error && 'is-invalid'}`} value={form.type.value}
                  onChange={(e) => setForm({ ...form, type: { ...form.type, value: e.target.value, error: false } })}>
                  <option value={''}>Selecione uma opção</option>
                  {form.type.fillOption && form.type.fillOption.map(item => (<option key={item.id} value={item.id}>{item.name}</option>))}
                </select>
                <label htmlFor='type'>Tipo de roupa</label>
              </div>
            </div>
            {/* -------------------------Styles------------------------- */}
            <div className="col-sm-4">
              <div className="form-floating">
                <select id='style' className={`form-control ${form.styles.error && 'is-invalid'}`} value={form.styles.value}
                  onChange={(e) => handleArrayChange(e.target.value, 'styles')}>
                  <option value={''}>Selecione uma opção</option>
                  {form.styles.fillOption && form.styles.fillOption.map(item => (<option key={item.id} value={item.id}>{item.name}</option>))}
                </select>
                <label htmlFor='style'>Estilo da roupa</label>
              </div>
            </div>
            {/* -------------------------Materials------------------------- */}
            <div className="col-sm-4">
              <div className="form-floating">
                <select id='material' className={`form-control ${form.materials.error && 'is-invalid'}`} value={form.materials.value}
                  onChange={(e) => handleArrayChange(e.target.value, 'materials')}>
                  <option value={''}>Selecione uma opção</option>
                  {form.materials.fillOption && form.materials.fillOption.map(item => (<option key={item.id} value={item.id}>{item.name}</option>))}
                </select>
                <label htmlFor='material'>Material</label>
              </div>
            </div>
          </div>
          {/* -------------------------Selected-styles------------------------- */}
          {form.styles.selected.length > 0 &&
            <div className="d-flex mt-3 align-items-center flex-wrap">
              <Typography className='me-3'>Estilos selecionados: </Typography>
              {form.styles.selected.map(item => {
                const name = form.styles.fillOption.filter(style => style.id === item)[0].name
                return (
                  <div key={item} className="d-flex align-items-center bg-gray px-2 my-2 me-2 rounded" style={{ backgroundColor: '#f1f1f1' }}>
                    <span className='small' key={item}>{name.toUpperCase()}</span>
                    <IconButton color='error' onClick={() => setForm({ ...form, styles: { ...form.styles, selected: form.styles.selected.filter(style => style !== item) } })}>
                      <MdOutlineClose size={20} />
                    </IconButton>
                  </div>
                )
              })}
            </div>}
          {/* -------------------------Selected-materials------------------------- */}
          {form.materials.selected.length > 0 &&
            <div className="d-flex mt-3 align-items-center flex-wrap">
              <Typography className='me-3'>Materiais selecionados: </Typography>
              {form.materials.selected.map(item => {
                const name = form.materials.fillOption.filter(material => material.id === item)[0].name
                return (
                  <div key={item} className="d-flex align-items-center bg-gray px-2 me-2 rounded" style={{ backgroundColor: '#f1f1f1' }}>
                    <span className='small' key={item}>{name.toUpperCase()}</span>
                    <IconButton color='error' onClick={() => setForm({ ...form, materials: { ...form.materials, selected: form.materials.selected.filter(style => style !== item) } })}>
                      <MdOutlineClose size={20} />
                    </IconButton>
                  </div>
                )
              })}
            </div>}
          {/* -------------------------Name------------------------- */}
          <div className="row my-3">
            <div className="col-sm-6">
              <div className="form-floating">
                <input className={`form-control ${form.name.error && 'is-invalid'}`} id="name" type="text" value={form.name.value}
                  onChange={({ target }) => setForm({ ...form, name: { ...form.name, value: target.value, error: false } })}
                  onBlur={() => setError('name', form, setForm)} required />
                <label htmlFor="name">Nome*</label>
              </div>
            </div>
            {/* -------------------------Price------------------------- */}
            <div className="col-sm-6">
              <div className="form-floating">
                <input className={`form-control ${form.price.error && 'is-invalid'}`} id="price" type="text" value={form.price.mask}
                  onChange={({ target }) => setForm({ ...form, price: { ...form.price, value: target.value.replace(/\D/g, ''), mask: moneyMask(target.value), error: false } })}
                  onBlur={() => setError('price', form, setForm)} required />
                <label htmlFor="price">Preço*</label>
              </div>
            </div>
          </div>
          {/* -------------------------Description------------------------- */}
          <div className="row my-3">
            <div className="col-12">
              <div className="form-floating">
                <textarea className={`form-control ${form.description.error && 'is-invalid'}`} name="text" id="description" rows="10" value={form.description.value}
                  onChange={({ target }) => setForm({ ...form, description: { ...form.description, value: target.value, error: false } })}
                  onBlur={() => setError('description', form, setForm)} style={{ minHeight: 150 }} />
                <label htmlFor="description">Descrição*</label>
              </div>
            </div>
            {/* -------------------------Sizes------------------------- */}
            {Object.keys({ ...size }).map((item, index) => (
              <div className="col-2 text-center rounded my-3" key={item}>
                <Button fullWidth color={size[item] ? 'success' : (form.size.error ? 'error' : 'inherit')} sx={{ backgroundColor: '#f1f1f1' }} endIcon={size[item] ? <CheckIcon /> : <CloseIcon />}
                  onClick={() => handleSizeChange(item)}>
                  {item}
                </Button>
              </div>
            ))}
            {/* -------------------------Damage-description-check------------------------- */}
            <div className="col-12 mt-3">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={hasDamage} onChange={handleDamageChange} />
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Possui avaria</label>
              </div>
              {/* -------------------------Damage-description------------------------- */}
              <div className="form-floating">
                <textarea disabled={Boolean(!hasDamage)} className={`form-control ${form.damage.error && 'is-invalid'}`} name="text" id="description" rows="10" value={form.damage.value}
                  onChange={({ target }) => setForm({ ...form, damage: { ...form.damage, value: target.value, error: false } })}
                  onBlur={() => setError('damage', form, setForm)} style={{ minHeight: 150 }} />
                <label htmlFor="description">Avaria*</label>
              </div>
            </div>
            {/* -------------------------Buttons------------------------- */}
            <SavePreset backPath={'/profile'} handleSave={handleSave} loading={loadingSave} />
          </div>
        </>
        : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
    </div >
  )
}

export default AddProduct