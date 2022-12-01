import { Alert, Button, LinearProgress, ThemeProvider } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MOUNT_JSON_BODY, POST_PUBLIC_FETCH, URL } from '../../../variables'
import Input from '../../routes/Form/Input'
import Theme from '../../routes/Theme/Theme'
import Navbar from '../Navbar'
import Footer from '../Footer'

const Register = () => {
  const [form, setForm] = React.useState({
    name: { label: 'Nome*', value: "", error: false, col: 'col-sm-12', type: 'text' },
    email: { label: 'Email*', value: "", error: false, col: 'col-sm-12', type: 'email' },
    password: { label: 'Senha*', value: "", error: false, col: 'col-sm-12', type: 'password', },
    confirm_password: { label: 'Confirmar Senha*', value: "", error: false, col: 'col-sm-12', type: 'password' },
  })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)
  const history = useNavigate()

  function renderInput() {
    let keys = { ...form }
    keys = Object.keys(keys)

    return keys.map(item => (
      <div key={form[item].label} className={`${form[item].col} col-12 my-4`}>
        <Input state={form} setState={(e) => setForm(e)} item={item} />
      </div>
    ))
  }

  async function save() {
    setLoading(true)
    setError(false)
    let body = MOUNT_JSON_BODY({ form })
    let resp = await POST_PUBLIC_FETCH({ url: `${URL}api/register`, body })
    setLoading(false)
    if (resp.status) history('/'); else setError(true)
  }

  return (
    <ThemeProvider theme={Theme}>
      <div className='d-flex vh-100 align-items-center' style={{ overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
        <div className="p-sm-5 p-3 rounded shadow m-auto bg-white" style={{ width: 500 }}>
          <div style={{ height: '30%' }}>
            <img src={`${URL}storage/banner.png`} className='img-fluid' alt="logo" />
          </div>
          <div style={{ marginTop: loading ? 16 : 44 }}>
            {loading && <LinearProgress />}
            {error && <Alert variant="filled" severity="error">Ouve um erro, tente novamente mais tarde!</Alert>}
            {renderInput()}
          </div>
          <div className="d-flex justify-content-end mt-5">
            <Button variant='contained' size='large' onClick={() => save()}>Salvar</Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default Register