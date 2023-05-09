import React from 'react'
import logo from '../../../assets/logo.png'
import useForm from '../../Utilities/useForm'
import { useNavigate } from 'react-router-dom'
import { emailRegex } from '../../Utilities/masks/Regex'
import { POST_PUBLIC_FETCH, URL } from '../../../variables'
import { mudarDados } from "../../Reducers/AppActions"
import { BsGraphUp, BsSearch, BsHeart, BsBagCheck } from 'react-icons/bs'
import { IconButton, Button, LinearProgress, Alert } from '@mui/material'
import { MdVisibility, MdVisibilityOff, MdOutlineLogin } from 'react-icons/md'
import { useDispatch } from 'react-redux'

const Login = () => {
  //States and hooks
  const { form, errors, handleChange, handleBlur, setErrors } = useForm({
    email: '',
    password: ''
  })
  const [errorMessage, setErrorMessage] = React.useState('')
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  const history = useNavigate()
  const dispatch = useDispatch()

  //Save function
  const handleSave = async () => {
    let newErrors = {}
    setErrorMessage('')

    //Validating if there are blank fields
    Object.keys({ ...form }).forEach(item => { if (!form[item]) newErrors[item] = 'Campo em branco' })
    //Checking if the email has valid characters
    if (!emailRegex().test(form.email)) newErrors.email = 'Email inválido'

    //If the errors object is empty, the request is made, otherwise the errors state is updated
    if (Object.keys(newErrors).length !== 0) setErrors(newErrors)
    else {
      setLoadingSave(true)
      const response = await POST_PUBLIC_FETCH({ url: `${URL}api/auth/login`, body: form })
      // console.log('response', response)

      if (response.status) {
        //Storing variables in local storage
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("breshop", JSON.stringify(response.user.breshop));
        localStorage.setItem("cart_notify", response.cart_notify);
        localStorage.setItem("wishlist_items", JSON.stringify(response.wishlist_products));

        dispatch({ type: 'login', payload: { token: response.access_token, user: response.user } });
        dispatch({ type: 'breshop', payload: response.user.breshop });
        dispatch({ type: 'cart_notify', payload: response.cart_notify })
        dispatch({ type: 'wishlist_items', payload: response.wishlist_products })


        history('/')
      } else {
        setErrorMessage(response.message)
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
              <p className='text-white'><BsBagCheck /> Compre e venda</p>
              <p className='text-white'><BsGraphUp /> Analíse seu negócio</p>
              <p className='text-white'><BsSearch /> Garimpe peças</p>
              <p className='text-white'><BsHeart /> Fidelize novos clientes</p>
            </div>
          </div>
        </div>
        <div className="col-md-5 d-flex align-items-center justify-content-center">
          <form className="anime-left w-100 mx-4" style={{ maxWidth: 600 }}>

            <div style={{ marginBottom: loadingSave ? 10 : 14 }}>
              {loadingSave && <LinearProgress />}
              {errorMessage && <Alert variant="filled" severity="error">{errorMessage}</Alert>}
            </div>

            <h6 className="dash-title">Faça login para continuar!</h6>
            <div className="row mt-3">
              <div className="input-container">
                <input className={`${errors?.email && 'input-error'}`} type='email' value={form.email} onChange={handleChange} onBlur={handleBlur} id='email' name='email' />
                <label htmlFor='email'>Email* <span className='error'>{errors?.email}</span></label>
              </div>

              <div className='input-container'>
                <input className={`${errors?.password && 'input-error'}`} type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} onBlur={handleBlur} id='password' name='password' />
                <label htmlFor='password'>Senha* <span className='error'>{errors?.password}</span></label>
                <div className="icon-button">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </div>
              </div>
            </div>

            <div className="d-flex mt-4 align-items-center">
              <span>Caso não possua uma conta, <a className='link' onClick={() => history('/register')}>registre-se</a></span>
              <div className="ms-auto">
                <Button variant='contained' endIcon={<MdOutlineLogin />} onClick={handleSave}>Entrar</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login