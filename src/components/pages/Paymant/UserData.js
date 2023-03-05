import React from 'react'
import { useSelector } from 'react-redux'
import setError from '../../utilities/Error'
import { GET_FETCH } from '../../../variables'
import cpfMask from '../../utilities/masks/cpf'
import phoneMask from '../../utilities/masks/phone'
import { CircularProgress, Typography } from '@mui/material'

//Props coming from the PaymentScreen
const UserData = ({ user, setUser }) => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const [condominiuns, setCondominiuns] = React.useState('')
  const [documentDisabled, setDocumentDisabled] = React.useState(false)

  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    getCondominiuns()
    //Filling user state from PaymentScreen
    setUser({
      filled: { value: true },
      birth: { value: "", error: false },
      gender: { value: "", error: false },
      condominium_id: { value: "", error: false },
      phone: { value: "", error: false, mask: "", length: 10 },
      document: { value: "", error: false, mask: "", length: 11 },
    })
  }, [])

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  const getCondominiuns = async () => {
    const resp = await GET_FETCH({ url: 'get_user_data', token })
    //If the request returns true, the user state will be updated with the avaible data
    if (resp.status) {
      const phone = `${resp.customer?.phones?.mobile_phone?.area_code}${resp.customer?.phones?.mobile_phone?.number}`
      const birthdate = resp.customer?.birthdate
      const gender = resp.customer?.gender
      const document = resp.customer?.document

      if (resp.condominiuns) setCondominiuns(resp.condominiuns)
      if (resp.customer) setUser({
        filled: { value: true },
        //Formating user birth to dd/mm/aaaa
        birth: { value: birthdate && birthdate.substring(0, 10) },
        //Formating use phone to (ddd)nnnnn-nnnn
        phone: { value: phone, mask: phone && phoneMask(phone).mask, length: 10 },
        gender: { value: gender && (gender === 'male' ? 'Masculino' : 'Feminino') },
        //Formating user document to nnn.nnn.nnn-nn
        document: { value: document, mask: document && cpfMask(document).mask, length: 11 },
      })
    }

  }
  return (
    <>
      <Typography>Informações sobre o grupo</Typography>
      {condominiuns && user
        ?
        <form>
          <div className="row">
            {/* --------------------------Groups-------------------------- */}
            <div className="col-sm-6 my-2">
              <div className="form-floating">
                <select className="form-control" id="group" type="text" onChange={({ target }) => setUser({ ...user, condominium_id: { value: target.value } })} required>
                  {condominiuns
                    ? <option hidden value={condominiuns[0].id}>{condominiuns[0].condominium}</option>
                    : <option>Sem grupos disponíveis</option>
                  }

                  {condominiuns && condominiuns.map(item => (<option key={item.id} value={item.id}>{item.condominium}</option>))}
                </select>
                <label htmlFor="group">Grupos*</label>
              </div>
            </div>
            {/* --------------------------Document-------------------------- */}
            <div className='col-sm-6 my-2'>
              <div className='form-floating'>
                <input className={`form-control ${user.document.error && 'is-invalid'}`} id='doc' type='text' value={user.document.mask} disabled={documentDisabled ? true : false}
                  onChange={({ target }) => setUser({ ...user, document: { ...user.document, value: cpfMask(target.value).value, mask: cpfMask(target.value).mask, error: false } })}
                  onBlur={() => setError('document', user, setUser)} required />
                <label htmlFor='doc'>CPF*</label>
              </div>
            </div>
          </div>
          {/* --------------------------Birthdate-------------------------- */}
          <div className='row mt-4'>
            <div className='col-sm-4 my-2'>
              <div className='form-floating'>
                <input className={`form-control ${user.birth.error && 'is-invalid'}`} id='birth' type='date' value={user.birth.value}
                  onChange={({ target }) => setUser({ ...user, birth: { ...user.birth, value: target.value, error: false } })}
                  onBlur={() => setError('birth', user, setUser)} required />
                <label htmlFor='birth'>Nascimento*</label>
              </div>
            </div>
            {/* --------------------------Gender-------------------------- */}
            <div className='col-sm-4 my-2'>
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
            {/* --------------------------Phone-------------------------- */}
            <div className='col-sm-4 my-2'>
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
        <div className="d-flex justify-content-center p-5"><CircularProgress color='inherit' /></div>}
    </>
  )
}

export default UserData