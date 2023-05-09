import React from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import useForm from "../../../Utilities/useForm"
import { CircularProgress } from "@mui/material"
import { AiOutlinePercentage } from 'react-icons/ai'
import { renderToast } from "../../../Utilities/Alerts"
import SavePreset from "../../../Utilities/SavePreset"
import { getDate } from "../../../Utilities/masks/getDate"
import numberMask from "../../../Utilities/masks/clearString"
import { GET_FETCH, POST_FETCH, PUT_FETCH, URL } from "../../../../variables"
import PreviewCard from "../../../Pages/Card/PreviewCard"


const AddSale = ({ edit }) => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const { form, setForm, errors, handleChange, handleBlur, setErrors, resetError } = useForm({
    discount: '',
    end_date: '',
    start_date: '',
    products: [],
  })
  const [loading, setLoading] = React.useState(true)
  const [products, setProducts] = React.useState([])
  const [loadingSave, setLoadingSave] = React.useState(false)

  const history = useNavigate()
  const token = useSelector(state => state.AppReducer.token);

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  React.useEffect(() => {
    getData()

    if (edit) {
      setForm({
        discount: edit.discount,
        end_date: edit.end_date,
        start_date: edit.start_date,
        products: edit.products,
      })
    }

  }, [])

  async function getData() {
    let response = await GET_FETCH({ url: `sales/data`, token })
    // console.log('response', response)

    if (response.status) {
      setProducts(response.products)
    }

    setLoading(false)
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Saving-data-----------------------------
  const handleSave = async () => {
    let newErrors = {}

    //Validating if there are blank fields
    Object.keys({ ...form }).forEach(item => {
      if (!form[item]) newErrors[item] = 'Campo em branco'
    })

    //Validating if the array of products is empty
    if (form.products.length === 0) newErrors.products = 'Adicione ao menos um produto'

    //Calling requests to save or change the promotion if the errors object does not contain any keys
    if (Object.keys(newErrors).length === 0) {
      setLoadingSave(true)

      let response = ''
      if (edit) response = await PUT_FETCH({ url: `sales/update`, body: { ...form, id: edit.id }, token })
      else response = await POST_FETCH({ url: `${URL}api/sales/create`, body: form, token })
      // console.log('response', response)

      //Rendering toast and redirect according to request status
      if (response.status) {
        renderToast({ type: 'success', error: response.message })
        setTimeout(() => history('/profile/sales'), 1000)
      }
      else renderToast({ type: 'error', error: response.message })

      setLoadingSave(false)
    }
    else {
      setErrors(newErrors)
    }
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
  const handleSelectProduct = (id) => {
    //Checking if the selected product is already in the inserted list
    if (!form.products.filter(item => item.id === id)[0] && id) {
      setForm({ ...form, products: [...form.products, products.filter(item => item.id === id)[0]] })
    }
    resetError('products')
  }

  const handleRemoveProduct = (id) => {
    setForm({ ...form, products: form.products.filter(item => item.id !== id) })
  }

  return (
    <>
      {!loading ?
        <form className="anime-left" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
          <h6 className="dash-title">Adicionar promoção</h6>
          <div className="row my-3">
            {/* -------------------------Start_date------------------------- */}
            <div className="col-sm-6">
              <div className="form-floating">
                <input className={`form-control ${errors?.start_date && 'is-invalid'}`} value={form.start_date} onChange={(e) => {
                  handleChange(e)
                  // If the final date is greater than the chosen one, it will be reset.
                  if (e.target.value > form.end_date) setForm({ ...form, start_date: e.target.value, end_date: '' })
                }} onBlur={handleBlur} type='date' id='start_date' name='start_date' min={getDate('yyyy-mm-dd')} />
                <label htmlFor='start_date'>Começa em*</label>
                <span className='small error'>{errors?.start_date}</span>
              </div>
            </div>
            {/* -------------------------End-date------------------------- */}
            <div className="col-sm-6">
              <div className="form-floating">
                <input className={`form-control ${errors?.end_date && 'is-invalid'}`} value={form.end_date} onChange={handleChange} onBlur={handleBlur} type='date' id='end_date' name='end_date' min={form.start_date || getDate('yyyy-mm-dd')} />
                <label htmlFor='end_date'>Termina em*</label>
                <span className='small error'>{errors?.end_date}</span>
              </div>
            </div>
          </div>

          <div className="row my-3">
            {/* -------------------------Discount------------------------- */}
            <div className="col-sm-4">
              <div className="input-group">
                <div className="form-floating">
                  <input className={`form-control ${errors?.discount && 'is-invalid'}`} value={numberMask(form.discount)} onChange={(e) => {
                    if (e.target.value !== '00') handleChange(e)
                  }} onBlur={handleBlur} id='discount' name='discount' maxLength={2} />
                  <label htmlFor='discount'>Desconto*</label>
                </div>
                <span className="input-group-text" id="basic-addon1"><AiOutlinePercentage /></span>
              </div>
              <span className='small error'>{errors?.discount}</span>
            </div>
            {/* -------------------------Products------------------------- */}
            <div className="col-sm-8">
              <div className="form-floating">
                <select className={`form-control ${errors?.products && 'is-invalid'}`} onChange={({ target }) => handleSelectProduct(target.value)} id='products' name='products' maxLength={2}>
                  <option value="">Selecione um produto</option>
                  {products.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <label htmlFor='products'>Produtos*</label>
                <span className='small error'>{errors?.products}</span>
              </div>
            </div>
            {/* -------------------------Buttons------------------------- */}
            <div className="d-flex flex-wrap">
              {form.products.map(item => (
                <div key={item.id}>
                  <PreviewCard discount={form.discount} product={item} handleRemoveProduct={handleRemoveProduct} />
                </div>
              ))}
            </div>
          </div>

          <SavePreset backPath={'/profile'} handleSave={handleSave} loading={loadingSave} />
        </form>
        : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
    </>
  );
};

export default AddSale;