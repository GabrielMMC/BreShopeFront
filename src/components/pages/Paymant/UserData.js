import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import cpfMask from '../../utilities/masks/cpf'
import phoneMask from '../../utilities/masks/phone'
import { GET_FETCH } from '../../../variables'
import setError from '../../utilities/Error'

const UserData = ({ user, setUser }) => {
  const [documentDisabled, setDocumentDisabled] = React.useState(false)
  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    getUser()
    setUser({
      filled: { value: true },
      birth: { value: "", error: false },
      gender: { value: "", error: false },
      condominium_id: { value: "", error: false },
      phone: { value: "", error: false, mask: "", length: 10 },
      document: { value: "", error: false, mask: "", length: 11 },
    })
  }, [])

  const getUser = async () => {

    const resp = await GET_FETCH({ url: 'get_user_data', token })
    console.log('resp', resp)
    const phone = `${resp.customer?.phones?.mobile_phone?.area_code}${resp.customer?.phones?.mobile_phone?.number}`

    if (resp.customer) setUser({
      filled: { value: true },
      birth: { value: resp.customer?.birthdate ? resp.customer?.birthdate.substring(0, 10) : '' },
      phone: { value: phone, mask: phone ? phoneMask(phone).mask : '', length: 10 },
      gender: { value: resp.customer?.gender === 'male' ? 'Masculino' : 'Feminino' },
      document: { value: resp.customer?.document, mask: resp.customer?.document ? cpfMask(resp.customer?.document).mask : '', length: 11 },
    })
  }

  console.log('usr')
  return (
    <>
      <Typography>Dados gerais</Typography>
      {user
        ?
        <form>
          <div className="row">
            <div className='col-sm-12'>
              <div className='form-floating'>
                <input className={`form-control ${user.document.error && 'is-invalid'}`} id='doc' type='text' value={user.document.mask} disabled={documentDisabled ? true : false}
                  onChange={({ target }) => setUser({ ...user, document: { ...user.document, value: cpfMask(target.value).value, mask: cpfMask(target.value).mask, error: false } })}
                  onBlur={() => setError('document', user, setUser)} required />
                <label htmlFor='doc'>CPF*</label>
              </div>
            </div>
          </div>

          <div className='row mt-4'>
            <div className='col-sm-4'>
              <div className='form-floating'>
                <input className={`form-control ${user.birth.error && 'is-invalid'}`} id='birth' type='date' value={user.birth.value}
                  onChange={({ target }) => setUser({ ...user, birth: { ...user.birth, value: target.value, error: false } })}
                  onBlur={() => setError('birth', user, setUser)} required />
                <label htmlFor='birth'>Nascimento*</label>
              </div>
            </div>
            <div className='col-sm-4'>
              <div className='form-floating'>
                <select className={`form-control ${user.gender.error && 'is-invalid'}`} id='gender' type='text' value={user.gender.value}
                  onChange={({ target }) => setUser({ ...user, gender: { ...user.gender, value: target.value, error: false } })}
                  onBlur={() => setError('gender', user, setUser)} required>
                  <option value='male'>Masculino</option>
                  <option value='female'>Feminino</option>
                </select>
                <label htmlFor='gender'>Sexo*</label>
              </div>
            </div>

            <div className='col-sm-4'>
              <div className='form-floating'>
                <input className={`form-control ${user.phone.error && 'is-invalid'}`} id='number' type='text' value={user.phone.mask}
                  onChange={({ target }) => setUser({ ...user, phone: { ...user.phone, value: phoneMask(target.value).value, mask: phoneMask(target.value).mask, error: false } })}
                  onBlur={() => setError('phone', user, setUser)} required />
                <label htmlFor='number'>Telefone*</label>
              </div>
            </div>
          </div>
        </form>
        :
        <div className="d-flex justify-content-center p-5"><CircularProgress /></div>}
    </>
  )
}

export default UserData