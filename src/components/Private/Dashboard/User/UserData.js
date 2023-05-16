import React from "react"
import useForm from "../../../Utilities/useForm"
import cpfMask from "../../../Utilities/masks/cpf"
import { renderToast } from "../../../Utilities/Alerts"
import SavePreset from "../../../Utilities/SavePreset"
import { useDispatch, useSelector } from "react-redux"
import { Button, CircularProgress } from "@mui/material"
import { phoneMask, splitNumberv2 } from "../../../Utilities/masks/phone"
import { GET_FETCH, POST_FETCH_FORMDATA, STORAGE_URL, URL } from "../../../../variables"

const UserData = () => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const { form, setForm, errors, handleChange, handleBlur, setErrors, handleFileChange, setError, isValid } = useForm({
    name: '',
    email: '',
    phone: '',
    gender: '',
    document: '',
    gender_id: '',
    birthdate: '',
    file: { value: '', url: '' }
  })
  const [genders, setGenders] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [loadingSave, setLoadingSave] = React.useState(false)

  const dispatch = useDispatch()
  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    getData()
  }, [])

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  async function getData() {
    let response = await GET_FETCH({ url: `customers`, token })
    // console.log('response', response)

    if (response.status) {
      let newForm = { ...form }
      const phone = response.customer.phones.mobile_phone ? `${response.customer?.phones?.mobile_phone?.area_code}${response.customer?.phones?.mobile_phone?.number}` : null

      Object.keys({ ...response.customer }).forEach(item => {
        if (form.hasOwnProperty(item)) newForm = { ...newForm, [item]: response.customer?.[item] }
      })
      newForm.gender_id = response.user.gender_id
      newForm.gender = response.user.gender_id ? response.genders.filter(item => item.id === response.user.gender_id)[0].key : ''
      newForm.birthdate = response.customer.birthdate ? response.customer.birthdate.substring(0, 10) : ''
      newForm.document = response.customer.document ? cpfMask(response.customer.document).value : ''
      newForm.phone = phone ? phoneMask(phone).value : ''
      newForm.file = { value: '', url: response.user.file ? STORAGE_URL + response.user.file : '' }

      setForm(newForm)
      setGenders(response.genders)
    }

    setLoading(false)
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Saving-data-----------------------------
  const handleSave = async () => {
    const valid = isValid(['file'])

    if (valid) {
      setLoadingSave(true)
      let body = new FormData()
      const { area, number } = splitNumberv2(form.phone)

      body.append('number', number)
      body.append('area_code', area)
      body.append('name', form.name)
      body.append('email', form.email)
      body.append('gender', form.gender)
      body.append('file', form.file.value)
      body.append('document', form.document)
      body.append('birthdate', form.birthdate)
      body.append('gender_id', form.gender_id)

      try {
        let response = await POST_FETCH_FORMDATA({ url: `${URL}api/customers/update`, body, token })
        if (response.status) {
          localStorage.setItem("user", JSON.stringify(response.user))
          dispatch({ type: "user", payload: (response.user) });
          renderToast({ type: 'success', error: 'Dados atualizados com sucesso!' })
        }
        else renderToast({ type: 'error', error: response.message })
      } catch (error) {
        renderToast({ type: 'error', error: error })
      }
      setLoadingSave(false)
    }
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
  const handleDateChange = ({ target }) => {
    //Comparing the selected date with the current one along with its size
    //Ff it is greater or invalid, its value will be zeroed and the error appears to the user
    const { value } = { ...target }
    if (new Date(value) > new Date() || Array.from(value).length > 10) {
      setForm({ ...form, birthdate: '' })
      setError('birthdate', 'Data inválida')
    } else {
      setForm({ ...form, birthdate: value })
      setError('birthdate', null)
    }
  }

  const handleGenderChange = ({ target }) => {
    setForm({ ...form, gender_id: target.value, gender: genders.filter(item => item.id === target.value)[0].key })
    setErrors({ ...errors, gender_id: null, gender: null })
  }

  return (
    <>
      {!loading ?
        <form className="anime-left" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
          <h6 className="dash-title">Resumo da conta</h6>
          <div className="row align-items-end">
            {/* -------------------------Name------------------------- */}
            <div className='col-md-4 my-2'>
              <div className='form-floating'>
                <input className={`form-control ${errors?.name && 'is-invalid'}`} value={form.name} onChange={handleChange} onBlur={handleBlur} id='name' name='name' />
                <label htmlFor='name'>Nome*</label>
                <span className='error-message'>{errors?.name}</span>
              </div>
            </div>
            {/* -------------------------Email------------------------- */}
            <div className='col-md-4 my-2'>
              <div className="form-floating">
                <input className={`form-control ${errors?.email && 'is-invalid'}`} value={form.email} onChange={handleChange} onBlur={handleBlur} id='email' name='email' disabled />
                <label htmlFor='email'>Email*</label>
                <span className='error-message'>{errors?.email}</span>
              </div>
            </div>
            {/* -------------------------Image------------------------- */}
            <div className='col-md-4 my-2'>
              <div style={{ width: 100, height: 100, margin: 'auto' }}>
                <Button className='file-button' component="label">
                  {form.file?.url
                    ? <img src={form.file?.url} className='file-img h-100 w-100' />
                    : <p className='m-auto text-center'>Sua foto aqui</p>}
                  <input hidden onChange={handleFileChange} name='file' accept="image/*" multiple type="file" />
                </Button>
              </div>
            </div>
          </div>

          {/* -------------------------Document------------------------- */}
          <div className='col-md-12 my-2 mt-4'>
            <div className='form-floating'>
              <input className={`form-control ${errors?.document && 'is-invalid'}`} value={cpfMask(form.document).mask} onChange={handleChange} onBlur={handleBlur} id='document' name='document' maxLength={11} />
              <label htmlFor='document'>CPF*</label>
              <span className='error-message'>{errors?.document}</span>
              {console.log('errors', errors)}
            </div>
          </div>

          {/* -------------------------Birthdate------------------------- */}
          <div className="row my-4">
            <div className='col-md-4 my-2'>
              <div className='form-floating'>
                <input className={`form-control ${errors?.birthdate && 'is-invalid'}`} value={form.birthdate} onChange={handleDateChange} onBlur={handleBlur} id='birthdate' name='birthdate' type='date' />
                <label htmlFor='birthdate'>Nascimento*</label>
                <span className='error-message'>{errors?.birthdate}</span>
              </div>
            </div>

            {/* -------------------------Gender------------------------- */}
            <div className='col-md-4 my-2'>
              <div className='form-floating'>
                <select className={`form-control ${errors?.gender_id && 'is-invalid'}`} value={form.gender_id ?? ''} onChange={handleGenderChange} onBlur={handleBlur} id='gender_id' name='gender_id'>
                  {!form.gender_id && <option value=''>Escolha um gênero</option>}
                  {genders.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <label htmlFor='gender'>Sexo*</label>
                <span className='error-message'>{errors?.gender_id}</span>
              </div>
            </div>

            {/* -------------------------Phone------------------------- */}
            <div className='col-md-4 my-2'>
              <div className='form-floating'>
                <input className={`form-control ${errors?.phone && 'is-invalid'}`} value={form.phone ? phoneMask(form.phone).mask : ''} onChange={handleChange} onBlur={handleBlur} id='phone' name='phone' maxLength={11} />
                <label htmlFor='number'>Telefone*</label>
                <span className='error-message'>{errors?.phone}</span>
              </div>
            </div>
          </div>
          {/* -------------------------Buttons-section------------------------- */}
          <SavePreset backPath={'/profile'} handleSave={handleSave} loading={loadingSave} />
        </form>
        : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
    </>
  );
};

export default UserData;
