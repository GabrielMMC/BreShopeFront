import React from 'react'
import logo from '../../../assets/logo.png'
import useForm from '../../Utilities/useForm'
import { useNavigate } from 'react-router-dom'
import { emailRegex } from '../../Utilities/masks/Regex'
import { POST_PUBLIC_FETCH, URL } from '../../../variables'
import { login, mudarDados } from "../../Reducers/AppActions"
import { BsGraphUp, BsSearch, BsHeart, BsBagCheck } from 'react-icons/bs'
import { IconButton, Button, LinearProgress, Alert } from '@mui/material'
import { MdVisibility, MdVisibilityOff, MdOutlineLogin } from 'react-icons/md'

const Register = () => {
  //States and hooks
  const { form, errors, handleChange, handleBlur, setErrors } = useForm({
    name: '',
    email: '',
    password: '',
    confirm_password: ''
  })
  const [errorMessage, setErrorMessage] = React.useState('')
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const history = useNavigate()

  //Save function
  const handleSave = async () => {
    let newErrors = {}
    setErrorMessage('')

    //Validating if there are blank fields
    Object.keys({ ...form }).forEach(item => { if (!form[item]) newErrors[item] = 'Campo em branco' })
    //Checking if the email has valid characters
    if (!emailRegex().test(form.email)) newErrors.email = 'Email inválido'
    if (form.password.length < 8) newErrors.password = 'A senha deve ter no mínimo 8 caracteres'
    if (form.password !== form.confirm_password) {
      newErrors.password = 'Senhas diferentes'
      newErrors.confirm_password = 'Senhas diferentes'
    }

    //If the errors object is empty, the request is made, otherwise the errors state is updated
    if (Object.keys(newErrors).length !== 0) setErrors(newErrors)
    else {
      setLoadingSave(true)
      const response = await POST_PUBLIC_FETCH({ url: `${URL}api/register`, body: form })
      // console.log('response', response)

      if (response.status) {
        //Storing variables in local storage
        history('/login')

        // history('/')
      } else {
        setErrorMessage(response.error.message)
      }
      setLoadingSave(false)
    }
  }

  return (
    <div className="d-flex vh-100">
      <div className="row col-12">
        <div className="col-md-7 d-flex align-items-center justify-content-center bg-gradient">
          <div className="d-flex justify-content-center flex-column">
            <div style={{ width: 300, height: 300, margin: 'auto' }}>
              <img src={logo} className='img-fluid pointer' alt="logo" onClick={() => history('/')} />
            </div>
            <div className='d-flex flex-column m-auto lead'>
              <p className='text-white my-2'><BsBagCheck /> Compre e venda</p>
              <p className='text-white my-2'><BsGraphUp /> Analíse seu negócio</p>
              <p className='text-white my-2'><BsSearch /> Garimpe peças</p>
              <p className='text-white my-2'><BsHeart /> Fidelize novos clientes</p>
            </div>
          </div>
        </div>
        <div className="col-md-5 d-flex align-items-center justify-content-center">
          <form className="anime-left w-100 mx-sm-4" style={{ maxWidth: 600 }} onSubmit={(e) => { e.preventDefault(); handleSave() }}>

            <div style={{ marginBottom: loadingSave ? 10 : 14 }}>
              {loadingSave && <LinearProgress />}
              {errorMessage && <Alert variant="filled" severity="error">{errorMessage}</Alert>}
            </div>

            <h6 className="dash-title">Crie sua conta!</h6>
            <div className="row mt-3">
              <div className="input-container p-0">
                <input className={`${errors?.name && 'input-error'}`} type='text' value={form.name} onChange={handleChange} onBlur={handleBlur} id='name' name='name' />
                <label htmlFor='name'>Nome* <span className='error'>{errors?.name}</span></label>
              </div>

              <div className="input-container p-0">
                <input className={`${errors?.email && 'input-error'}`} type='email' value={form.email} onChange={handleChange} onBlur={handleBlur} id='email' name='email' />
                <label htmlFor='email'>Email* <span className='error'>{errors?.email}</span></label>
              </div>

              <div className='input-container p-0'>
                <input className={`${errors?.password && 'input-error'}`} type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} onBlur={handleBlur} id='password' name='password' />
                <label htmlFor='password'>Senha* <span className='error'>{errors?.password}</span></label>
                <div className="icon-button">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </div>
              </div>

              <div className='input-container p-0'>
                <input className={`${errors?.confirm_password && 'input-error'}`} type={showConfirmPassword ? 'text' : 'password'} value={form.confirm_password} onChange={handleChange} onBlur={handleBlur} id='confirm_password' name='confirm_password' />
                <label htmlFor='confirm_password'>Confirme sua senha* <span className='error'>{errors?.confirm_password}</span></label>
                <div className="icon-button">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </div>
              </div>
            </div>

            <div className="d-flex mt-4 align-items-center">
              <span>Caso possua uma conta, <a className='link' onClick={() => history('/login')}>faça login</a></span>
              <div className="ms-auto">
                <Button type='submit' variant='contained' endIcon={<MdOutlineLogin />}>Salvar</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register