import React from 'react'
import { Button, Typography, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
// import { mudarUser } from 'components/actions/AppActions'
import { GET_FETCH, POST_FETCH_FORMDATA, URL, STORAGE_URL, API_URL } from '../../../variables'

const Data = () => {
  const [loading, setLoading] = React.useState(true)
  const [loadingSave, setLoadingSave] = React.useState(false)

  const [name, setName] = React.useState('')
  const [document, setDocument] = React.useState('')
  const [documentDisabled, setDocumentDisabled] = React.useState(false)
  const [birthDate, setBirthDate] = React.useState('')
  const [gender, setGender] = React.useState('')
  const [file, setFile] = React.useState('')

  const [email, setEmail] = React.useState('')
  const [number, setNumber] = React.useState('')
  const history = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    const getData = async () => {
      const resp = await GET_FETCH({ url: `get_user_data`, token })
      console.log('customer', resp)
      setBirthDate(resp.customer.birthdate ? resp.customer?.birthdate.substring(0, 10) : ''); setGender(resp.customer?.gender); setFile({ url: `${STORAGE_URL}${resp.user?.file}` }); setDocumentDisabled(resp.customer.document ? true : false); setLoading(false)
      setEmail(resp.customer?.email); setName(resp.customer?.name); handleCpfChange(resp.customer?.document); handlePhoneChange(`${resp.customer?.phones?.mobile_phone.area_code}${resp.customer?.phones?.mobile_phone.number}`)
    }

    getData()
    console.log('token', token)
  }, [])

  const handleFileChange = (file) => {
    let fr = new FileReader()
    fr.onload = (e) => {
      setFile({ value: file, url: e.target.result })
    }
    fr.readAsDataURL(file)
  }

  const handleCpfChange = (value) => {
    value = value.replace(/\D/g, '')
    if (Array.from(value).length <= 11) { setDocument({ value, mask: value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4') }) }
  }

  const handlePhoneChange = (value) => {
    value = value.replace(/\D/g, '')
    if (Array.from(value).length <= 10) { setNumber({ value, mask: value.replace(/(\d{2})(\d{4})(\d{4})/g, '($1) $2 - $3') }) }
    if (Array.from(value).length === 11) { setNumber({ value, mask: value.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2 - $3') }) }
  }

  const handleSave = async (e) => {
    e.preventDefault(); setLoadingSave(true)
    let form = new FormData()
    const { area, numb } = splitNumber(number)

    form.append('name', name)
    form.append('document', document.value)
    form.append('gender', gender)
    form.append('file', file.value)
    form.append('email', email)
    form.append('number', numb)
    form.append('area_code', area)
    form.append('birthdate', birthDate)
    const resp = await POST_FETCH_FORMDATA({ url: `${URL}api/update_customer`, body: form })

    console.log('res', resp.user)
    if (resp) {
      localStorage.setItem("user", JSON.stringify(resp.user))
      dispatch({ type: "user", payload: (resp.user) });
      setLoadingSave(false)
    }
  }

  const splitNumber = (value) => {
    console.log('value', value)
    const area = value.mask.match(/\([^)\d]*(\d+)[^)\d]*\)/g)[0].replace(/\D/g, '')
    const numb = value.mask.substring(value.mask.indexOf(")") + 1).replace(/\D/g, '')

    return { area, numb }
  }

  return (
    <>
      <Typography className="small" style={{ fontSize: "1.2em" }}>RESUMO DA CONTA</Typography>
      {!loading ? <form onSubmit={(e) => { handleSave(e) }}>
        <div className='row align-items-end'>
          <div className='col-4'>
            <div className='form-floating'>
              <input className='form-control' id='name' type='text' value={name} onChange={({ target }) => setName(target.value)} required />
              <label htmlFor='name'>Nome*</label>
            </div>
          </div>

          <div className='col-4'>
            <div className='form-floating'>
              <input className='form-control' id='email' type='email' value={email} onChange={({ target }) => setEmail(target.value)} required />
              <label htmlFor='email'>Email*</label>
            </div>
          </div>

          <div className='col-4'>
            <div style={{ width: 100, height: 100, margin: 'auto' }}>

              <Button className='file-button' component="label">
                {file?.url
                  ? <img src={file.url} className='file-img' alt='profile' />
                  : <p className='m-auto text-center'>Escolher Imagem</p>}
                <input hidden onChange={(e) => handleFileChange(e.target.files[0])} accept="image/*" multiple type="file" />
              </Button>

            </div>
          </div>
        </div>

        <div className='col-12 mt-4'>
          <div className='form-floating'>
            <input className='form-control' id='doc' type='text' value={document?.mask} disabled={documentDisabled ? true : false} onChange={({ target }) => handleCpfChange(target.value)} required />
            <label htmlFor='doc'>CPF*</label>
          </div>
        </div>

        <div className='row mt-4'>
          <div className='col-4'>
            <div className='form-floating'>
              <input className='form-control' id='birth' type='date' value={birthDate} onChange={({ target }) => setBirthDate(target.value)} required />
              <label htmlFor='birth'>Nascimento*</label>
            </div>
          </div>
          <div className='col-4'>
            <div className='form-floating'>
              <select className='form-control' id='gender' type='text' value={gender} onChange={({ target }) => setGender(target.value)} required>
                <option value='male'>Masculino</option>
                <option value='female'>Feminino</option>
              </select>
              <label htmlFor='gender'>Sexo*</label>
            </div>
          </div>

          <div className='col-4'>
            <div className='form-floating'>
              <input className='form-control' id='number' type='text' value={number?.mask} onChange={({ target }) => handlePhoneChange(target.value)} required />
              <label htmlFor='number'>Telefone*</label>
            </div>
          </div>
        </div>

        <div className='d-flex mt-5'>
          <button style={{ cursor: "pointer", padding: "1rem 2rem", flexGrow: "0", flexBasis: '1rem' }} className="normal-archor special" onClick={() => history('/')}>
            Voltar
          </button>
          <button style={{ cursor: "pointer", padding: "1rem 2rem", flexGrow: "0", flexBasis: '1rem' }} className="normal-archor special ms-auto" type="submit">
            {loadingSave ? <CircularProgress color='inherit' size={20} /> : 'Enviar'}
          </button>
        </div>
      </form> : <div className="d-flex justify-content-center p-5"><CircularProgress color='inherit' /></div>}
    </>
  )
}

export default Data