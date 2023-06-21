import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button, CircularProgress } from "@mui/material"
import { URL, GET_FETCH, POST_FETCH_FORMDATA, STORAGE_URL } from "../../../../variables"
import useForm from "../../../Utilities/useForm"
import cpfMask from "../../../Utilities/masks/cpf"
import numberMask from "../../../Utilities/masks/clearString"
import SavePreset from "../../../Utilities/SavePreset"
import { renderToast } from "../../../Utilities/Alerts"

const Breshop = () => {
  const { form, setForm, errors, handleChange, handleBlur, setErrors, handleFileChange, isValid } = useForm({
    name: '',
    description: '',
    holder_document: '',
    account_check_digit: '',
    branch_check_digit: '',
    account_number: '',
    branch_number: '',
    bank: '',
    file: { value: '', url: '' }
  })
  const [edit, setEdit] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [dirtyRecipient, setDirtyRecipient] = React.useState({
    holder_document: '',
    account_check_digit: '',
    branch_check_digit: '',
    account_number: '',
    branch_number: '',
    bank: '',
  })

  const history = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    getData()
  }, [])

  async function getData() {
    let response = await GET_FETCH({ url: `get_breshop`, token })
    console.log('resp', response)

    if (response.status) {
      let newForm = { ...form }
      let newDirtyRecipient = { ...dirtyRecipient }
      Object.keys({ ...response.breshop }).forEach(item => {
        if (form.hasOwnProperty(item)) newForm = { ...newForm, [item]: response.breshop[item] }
      })

      Object.keys({ ...response.recipient.default_bank_account }).forEach(item => {
        if (form.hasOwnProperty(item)) {
          newForm = { ...newForm, [item]: response.recipient.default_bank_account[item] }
          newDirtyRecipient = { ...newDirtyRecipient, [item]: response.recipient.default_bank_account[item] }
        }
      })

      newForm.file = { value: '', url: response.breshop.file ? STORAGE_URL + '/' + response.breshop.file : '' }

      if (response.breshop.id) setEdit(true)
      // console.log('form', newForm)
      setForm(newForm)
      setDirtyRecipient(newDirtyRecipient)
    }

    setLoading(false)
  }

  const handleSave = async () => {
    const valid = isValid(['file'])

    if (valid) {
      setLoadingSave(true)
      let body = new FormData()
      let updateRecipient = false

      Object.keys({ ...dirtyRecipient }).forEach(item => {
        if (form[item] !== dirtyRecipient[item]) updateRecipient = true
      })

      Object.keys({ ...form }).forEach(item => {
        body.append(item, form[item])
      })

      body.append('banner', form.file.value)
      body.append('update_recipient', updateRecipient)

      try {
        let response = ''
        if (edit) response = await POST_FETCH_FORMDATA({ url: `${URL}api/update_breshop`, body, token })
        if (!edit) response = await POST_FETCH_FORMDATA({ url: `${URL}api/store_breshop`, body, token })
        // console.log('response', response)

        if (response.status) {
          !edit && dispatch({ type: 'breshop', payload: response.breshop })
          renderToast({ type: 'success', error: response.message })
          history('/profile/products')
        }
        else renderToast({ type: 'error', error: response.message })
      } catch (error) {
        renderToast({ type: 'error', error: error })
      }
      setLoadingSave(false)
    }
  }

  return (
    <>
      {!loading ?
        <form className="anime-left" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
          <h6 className="dash-title">Informações da loja</h6>
          <div className="row">
            <div className="col-12 my-2 p-0 px-sm-2">
              <div className="form-floating">
                <input className={`form-control ${errors?.name && 'is-invalid'}`} value={form.name} onChange={handleChange} onBlur={handleBlur} id='name' name='name' />
                <label htmlFor='name'>Nome*</label>
                <span className='error-message'>{errors?.name}</span>
              </div>
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-md-8 my-2 p-0 px-sm-2">
              <div className="form-floating">
                <textarea className={`form-control ${errors?.description && 'is-invalid'}`} value={form.description} onChange={handleChange} onBlur={handleBlur} id='description' name='description' style={{ minHeight: 150 }} />
                <label htmlFor='description'>Descrição*</label>
                <span className='error-message'>{errors?.description}</span>
              </div>
            </div>
            {/* -------------------------Image------------------------- */}
            <div className='col-md-4 my-2 p-0 px-sm-2'>
              <div style={{ width: 100, height: 100, margin: 'auto' }}>
                <Button className='file-button' component="label">
                  {form.file?.url
                    ? <img src={form.file?.url} className='file-img h-100 w-100' />
                    : <p className='m-auto text-center'>Foto da loja aqui</p>}
                  <input hidden onChange={handleFileChange} name='file' accept="image/*" multiple type="file" />
                </Button>
              </div>
            </div>
          </div>


          <h6 className="dash-title mt-5">Dados bancários</h6>
          <div className="row">
            <div className="col-sm-12 my-2 p-0 px-sm-2">
              <div className="form-floating">
                <input className={`form-control ${errors?.holder_document && 'is-invalid'}`} value={cpfMask(form.holder_document).mask} onChange={handleChange} onBlur={handleBlur} id='holder_document' name='holder_document' maxLength={11} />
                <label htmlFor='holder_document'>CPF*</label>
                <span className='error-message'>{errors?.holder_document}</span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-4 my-2 p-0 px-sm-2">
              <div className="form-floating">
                <input className={`form-control ${errors?.account_check_digit && 'is-invalid'}`} value={numberMask(form.account_check_digit)} onChange={handleChange} onBlur={handleBlur} id='account_check_digit' name='account_check_digit' maxLength={2} />
                <label htmlFor='account_check_digit'>Dígito da conta*</label>
                <span className='error-message'>{errors?.account_check_digit}</span>
              </div>
            </div>

            <div className="col-sm-4 my-2 p-0 px-sm-2">
              <div className="form-floating">
                <input className={`form-control ${errors?.branch_check_digit && 'is-invalid'}`} value={numberMask(form.branch_check_digit)} onChange={handleChange} onBlur={handleBlur} id='branch_check_digit' name='branch_check_digit' maxLength={1} />
                <label htmlFor='branch_check_digit'>Dígito da agência*</label>
                <span className='error-message'>{errors?.branch_check_digit}</span>

              </div>
            </div>

            <div className="col-sm-4 my-2 p-0 px-sm-2">
              <div className="form-floating">
                <input className={`form-control ${errors?.bank && 'is-invalid'}`} value={numberMask(form.bank)} onChange={handleChange} onBlur={handleBlur} id='bank' name='bank' maxLength={3} />
                <label htmlFor='bank'>Banco*</label>
                <span className='error-message'>{errors?.bank}</span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6 my-2 p-0 px-sm-2">
              <div className="form-floating">
                <input className={`form-control ${errors?.account_number && 'is-invalid'}`} value={numberMask(form.account_number)} onChange={handleChange} onBlur={handleBlur} id='account_number' name='account_number' maxLength={13} />
                <label htmlFor='account_number'>Número da conta*</label>
                <span className='error-message'>{errors?.account_number}</span>
              </div>
            </div>

            <div className="col-sm-6 my-2 p-0 px-sm-2">
              <div className="form-floating">
                <input className={`form-control ${errors?.branch_number && 'is-invalid'}`} value={numberMask(form.branch_number)} onChange={handleChange} onBlur={handleBlur} id='branch_number' name='branch_number' maxLength={4} />
                <label htmlFor='branch_number'>Número da agência*</label>
                <span className='error-message'>{errors?.branch_number}</span>
              </div>
            </div>
          </div>

          <SavePreset backPath={'/profile'} handleSave={handleSave} loading={loadingSave} />
        </form>
        : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
    </>
  );
};

export default Breshop;
