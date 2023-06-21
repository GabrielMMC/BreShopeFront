import React from "react"
import { useSelector } from "react-redux"
import useForm from "../../../Utilities/useForm"
import AddIcon from '@mui/icons-material/Add'
import EditIcon from "@mui/icons-material/Edit"
import cepMask from "../../../Utilities/masks/cep"
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from '@mui/icons-material/Delete'
import SavePreset from "../../../Utilities/SavePreset"
import numberMask from "../../../Utilities/masks/clearString"
import { CircularProgress, IconButton } from "@mui/material"
import { renderAlert, renderToast } from "../../../Utilities/Alerts"
import { DELETE_FETCH, GET_CEP, GET_FETCH, POST_FETCH, URL } from "../../../../variables"

const Address = () => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const { form, setForm, setField, errors, handleChange, handleBlur, setErrors, setError, resetError, resetForm, isValid } = useForm({
    zip_code: '',
    neighborhood: '',
    complement: '',
    city: '',
    state: '',
    street: '',
    number: ''
  })
  const [add, setAdd] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [addresses, setAddresses] = React.useState([])
  const [hasNumber, setHasNumber] = React.useState(true)
  const [loadingSave, setLoadingSave] = React.useState(false)

  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    getData()
  }, [])

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  const getData = async () => {
    const response = await GET_FETCH({ url: `addresses`, token });
    // console.log("response", response);

    //Setting the addresses and shipping addresses accordingly with data length
    if (response.status) { setAddresses(response.addresses) }
    else renderToast({ type: 'error', error: response.message })

    setLoading(false);
  };

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Saving-data-----------------------------
  const handleSave = async () => {
    const valid = isValid(['id', 'complement', !hasNumber && 'number'])

    if (valid) {
      setLoadingSave(true)

      let response = await POST_FETCH({ url: `${URL}api/addresses/${form.id ? 'update' : 'create'}`, body: form, token })
      // console.log('response', response)

      if (response.status) {
        !form.id && setAddresses(addresses.concat(response.address))
        renderToast({ type: 'success', error: response.message })
        handleAdd()
      }
      else renderToast({ type: 'error', error: response.message })

      setLoadingSave(false)
    }
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Editing-data----------------------------
  const handleEdit = async (item) => {
    let line = item.line_1.split(',')
    setAdd(true); setHasNumber(line[0] ? true : false);
    setForm({
      ...form,
      id: item.id,
      city: item.city,
      state: item.state,
      zip_code: item.zip_code,
      complement: item?.line_2,
      number: line[0],
      neighborhood: line[1],
      street: line[2],
    })
  };

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Deleting-data---------------------------
  const handleDelete = async (id) => {
    setLoading(true)
    let response = await DELETE_FETCH({ url: `addresses/delete/${id}`, token })
    if (response.status) {
      setAdd(false); resetForm(); setAddresses(addresses.filter(item => item.id !== id))
      renderToast({ type: 'success', error: response.message })
    } else {
      renderToast({ type: 'error', error: response.message })
    }
    setLoading(false)
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
  const handleCepChange = async ({ target }) => {
    const value = target.value.replace(/\D/g, '')

    // The value is converted into an array and if its size is equal to eight, the postal code search function is activated
    if (Array.from(value).length === 8) {
      setField('zip_code', value)
      const response = await GET_CEP(value)
      if (response) {
        setForm({ ...form, state: response.uf, city: response.localidade, neighborhood: response.bairro, street: response.logradouro, zip_code: response.cep })
        setErrors({ ...errors, state: null, city: null, neighborhood: null, street: null, zip_code: null })
      } else {
        resetForm(); setError('zip_code', 'CEP inválido')
      }
    }
    // If the value is less than eight, the mask is applied
    if (Array.from(value).length < 8) {
      setField('zip_code', value)
      resetError('zip_code');
    }
  }

  const handleHasNumberChange = () => {
    setHasNumber(!hasNumber); resetError('number'); setField('number', '')
  }

  //Function to show fields and clear them
  const handleAdd = () => {
    setAdd(!add); resetForm(); setHasNumber(true)
  };

  return (
    <div className='anime-left'>
      <h1 className="dash-title">Endereços</h1>
      {!loading ? (
        <>
          {/* -------------------------Personal-address-section------------------------- */}
          <div className="row">
            {/* Counter of shipping addresses and personal addresses */}
            {addresses.length > 0 ? (addresses.map((item) => (
              <div key={item.id} className="col-md-12 my-2 p-0 px-sm-2 d-flex mb-3 p-3 bg-gray rounded">
                <div className="me-3">
                  <p>{item.country} - {item.city} - {item.state}</p>
                  <p>{item.zip_code} - {item.line_1}</p>
                </div>
                <div className="ms-auto" style={{ whiteSpace: "nowrap" }}>
                  <IconButton aria-label='Edit' onClick={() => handleEdit(item)}><EditIcon /></IconButton>
                  {addresses.length != 1 &&
                    <IconButton aria-label='Delete' onClick={() => renderAlert({ id: item.id, item: 'endereço', article: 'o', deleteFunction: handleDelete })}><CloseIcon /></IconButton>}
                </div>
              </div>
            )
            )
            ) : (<div><p>Sem endereços cadastrados</p></div>)}
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-center p-5"><CircularProgress /></div>
      )}
      {/* -------------------------Address-fields------------------------- */}
      <div className="row">
        <div className="d-flex align-items-center mt-5">
          <h1 className="dash-title">Adicionar endereço</h1>
          <button aria-label='Add' onClick={handleAdd} className='rounded-button hvr-grow ms-2 d-flex align-items-center justify-content-center'>
            {add ? <DeleteIcon size={15} /> : <AddIcon size={20} />}
          </button>
        </div>
      </div>
      {add &&
        <form className='anime-left' onSubmit={(e) => { e.preventDefault(); handleSave(e) }}>
          <div className="row align-items-end">
            {/* -------------------------Zip-code------------------------- */}
            <div className="col-md-4 my-2 p-0 px-sm-2">
              <div className="form-floating">
                <input className={`form-control ${errors?.zip_code && 'is-invalid'}`} value={cepMask(form.zip_code)} onChange={handleCepChange} onBlur={handleBlur} id='zip_code' name='zip_code' disabled={Boolean(form.id)} maxLength={8} />
                <label htmlFor='zip_code'>CEP* </label>
                <span className='error-message'>{errors?.zip_code}</span>
              </div>
            </div>
            {/* -------------------------State------------------------- */}
            <div className="col-md-4 my-2 p-0 px-sm-2">
              <div className="form-floating">
                <input className={`form-control ${errors?.state && 'is-invalid'}`} value={form.state} onChange={handleChange} onBlur={handleBlur} id='state' name='state' disabled={Boolean(form.id)} />
                <label htmlFor='state'>Estado*</label>
                <span className='error-message'>{errors?.state}</span>
              </div>
            </div>
            {/* -------------------------City------------------------- */}
            <div className="col-md-4 my-2 p-0 px-sm-2">
              <div className="form-floating">
                <input className={`form-control ${errors?.city && 'is-invalid'}`} value={form.city} onChange={handleChange} onBlur={handleBlur} id='city' name='city' disabled={Boolean(form.id)} />
                <label htmlFor='city'>Cidade*</label>
                <span className='error-message'>{errors?.city}</span>
              </div>
            </div>
          </div>
          {/* -------------------------Neighborhood------------------------- */}
          <div className="row">
            <div className="col-md-6 my-2 p-0 px-sm-2">
              <div className="form-floating">
                <input className={`form-control ${errors?.neighborhood && 'is-invalid'}`} value={form.neighborhood} onChange={handleChange} onBlur={handleBlur} id='neighborhood' name='neighborhood' disabled={Boolean(form.id)} />
                <label htmlFor='neighborhood'>Bairro*</label>
                <span className='error-message'>{errors?.neighborhood}</span>
              </div>
            </div>
            {/* -------------------------Complement------------------------- */}
            <div className="col-md-6 my-2 p-0 px-sm-2">
              <div className="form-floating">
                <input className={`form-control ${errors?.complement && 'is-invalid'}`} value={form.complement} onChange={handleChange} id='complement' name='complement' />
                <label htmlFor='complement'>Complemento</label>
                <span className='error-message'>{errors?.complement}</span>
              </div>
            </div>
          </div>

          <div className="row">
            {/* -------------------------Street------------------------- */}
            <div className="col-md-5 my-2 p-0 px-sm-2">
              <div className="form-floating">
                <input className={`form-control ${errors?.street && 'is-invalid'}`} value={form.street} onChange={handleChange} onBlur={handleBlur} id='street' name='street' disabled={Boolean(form.id)} />
                <label htmlFor='street'>Rua*</label>
                <span className='error-message'>{errors?.street}</span>
              </div>
            </div>
            {/* -------------------------Number------------------------- */}
            <div className="col-md-7 my-2 p-0 px-sm-2">
              <div className="d-flex">
                <div className="form-floating">
                  <input className={`form-control ${errors?.number && 'is-invalid'}`} value={numberMask(form.number)} onChange={handleChange} onBlur={hasNumber ? handleBlur : null} disabled={!hasNumber || Boolean(form.id)} id='number' name='number' />
                  <label htmlFor='number'>Número{hasNumber && '*'}</label>
                  <span className='error-message'>{errors?.number}</span>
                </div>

                <div className="form-check ms-3">
                  <input className="form-check-input" type="checkbox" value={!hasNumber} checked={!hasNumber} onChange={handleHasNumberChange} id="flexCheckDefault" disabled={Boolean(form.id)} />
                  <label className="form-check-label" htmlFor="flexCheckDefault">Sem número</label>
                </div>
              </div>
            </div>
          </div>
          {/* -------------------------Buttons-section------------------------- */}
          <SavePreset backPath={'/profile'} handleSave={handleSave} loading={loadingSave} />
        </form>}
    </div>
  );
};

export default Address;
