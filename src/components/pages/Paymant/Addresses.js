import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { GET_CEP, GET_FETCH } from '../../../variables';
import setError from '../../utilities/Error';
import { useSelector } from 'react-redux'

const Addresses = ({ address, setAddress }) => {
  const [addresses, setAddresses] = React.useState('');
  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    getAddresses()
    setAddress({
      filled: { value: true },
      nbhd: { value: "", error: false },
      city: { value: "", error: false },
      state: { value: "", error: false },
      street: { value: "", error: false },
      number: { value: "", error: false },
      zip_code: { value: "", error: false, mask: "", length: 8 },
    })
  }, []);

  const getAddresses = async () => {
    const response = await GET_FETCH({ url: `list_addresses?page=1`, token });
    if (response.status) setAddresses(response.addresses.data);
  }

  const handleCEPChange = async (value) => {
    value = value.replace(/\D/g, '')

    if (Array.from(value).length < 8) {
      setAddress({ ...address, zip_code: { ...address.zip_code, value, mask: value.replace(/(\d{5})(\d{3})/g, '$1-$2'), error: false } })
    }

    if (Array.from(value).length === 8) {
      const resp = await GET_CEP(value)
      setAddress({
        ...address,
        state: { ...address.state, value: resp.uf, error: false },
        nbhd: { ...address.nbhd, value: resp.bairro, error: false },
        city: { ...address.city, value: resp.localidade, error: false },
        street: { ...address.street, value: resp.logradouro, error: false },
        zip_code: { ...address.zip_code, value, mask: value.replace(/(\d{5})(\d{3})/g, '$1-$2'), error: false }
      })
    }
  }

  const handleOpenInput = () => {
    const newAddress = { ...address }
    delete newAddress.id; delete newAddress.addressObj
    setAddress(newAddress)
  }

  return (
    <>
      {addresses ? (
        <>
          <div className="row">
            {addresses.map((item) => (
              <div key={item.id} className="col-12 d-flex mb-3 p-3 bg-gray rounded ms-1 pointer" onClick={() => setAddress({ ...address, id: { value: item.id }, addressObj: { ...item } })}>
                <div className="me-3">
                  <Typography>{item.country} - {item.city} - {item.state}</Typography>
                  <Typography>{item.zip_code} - {item.line_1}</Typography>
                </div>

                <div className="ms-auto align-self-center">
                  <input type="radio" onChange={() => setAddress({ ...address, id: { value: item.id } })} checked={address?.id?.value === item.id ? true : false} />
                </div>
              </div>
            ))}
          </div>

          <div className='mt-5'>
            <div className="d-flex">
              <p className='ms-1'>Selecione um endereço ou</p><p className='link-p ms-2' onClick={handleOpenInput}>cadastre um agora!</p>
            </div>
            {!address.id &&
              <form className='anime-left mt-3'>
                <div className="row align-items-end">
                  <div className="col-4">
                    <div className="form-floating">
                      <input className={`form-control ${address.zip_code.error && 'is-invalid'}`} id="cep" type="text" value={address.zip_code.mask}
                        onChange={({ target }) => handleCEPChange(target.value)}
                        onBlur={() => setError('zip_code', address, setAddress)} required />
                      <label htmlFor="cep">CEP*</label>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-floating">
                      <input className={`form-control ${address.state.error && 'is-invalid'}`} id="state" type="text" value={address.state.value} onChange={
                        ({ target }) => setAddress({ ...address, state: { ...address.state, value: target.value, error: false } })} onBlur={() => setError('state', address, setAddress)} required />
                      <label htmlFor="state">Estado*</label>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-floating">
                      <input className={`form-control ${address.city.error && 'is-invalid'}`} id="city" type="text" value={address.city.value} onChange={
                        ({ target }) => setAddress({ ...address, city: { ...address.city, value: target.value, error: false } })} onBlur={() => setError('city', address, setAddress)} required />
                      <label htmlFor="city">Cidade*</label>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-6">
                    <div className="form-floating">
                      <input className={`form-control ${address.nbhd.error && 'is-invalid'}`} id="nbhd" type="text" value={address.nbhd.value} onChange={
                        ({ target }) => setAddress({ ...address, nbhd: { ...address.nbhd, value: target.value, error: false } })} onBlur={() => setError('nbhd', address, setAddress)} required />
                      <label htmlFor="nbhd">Bairro*</label>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-floating">
                      <input className={`form-control ${address.street.error && 'is-invalid'}`} id="street" type="text" value={address.street.value} onChange={
                        ({ target }) => setAddress({ ...address, street: { ...address.street, value: target.value, error: false } })} onBlur={() => setError('street', address, setAddress)} required />
                      <label htmlFor="street">Rua*</label>
                    </div>
                  </div>

                  <div className="col-2">
                    <div className="form-floating">
                      <input className="form-control" id="number" type="number" value={address.number.value} onChange={
                        ({ target }) => setAddress({ ...address, number: { ...address.number, value: target.value, error: false } })} />
                      <label htmlFor="number">Número</label>
                    </div>
                  </div>
                </div>
              </form>}
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-center p-5">
          <CircularProgress />
        </div>
      )}
    </>
  )
}

export default Addresses