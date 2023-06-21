import React from "react"
import { useSelector } from "react-redux"
import useForm from "../../../Utilities/useForm"
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from '@mui/icons-material/Delete'
import SavePreset from "../../../Utilities/SavePreset"
import numberMask from "../../../Utilities/masks/clearString"
import { CircularProgress, IconButton } from "@mui/material"
import { renderAlert, renderToast } from "../../../Utilities/Alerts"
import { DELETE_FETCH, GET_CEP, GET_FETCH, POST_FETCH, URL } from "../../../../variables"
import cpfMask from "../../../Utilities/masks/cpf"
import cardMask from "../../../Utilities/masks/card"
import swal from "sweetalert";

const Payment = () => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const fillMonth = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const fillYear = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033']
  const { form, setForm, errors, handleChange, handleBlur, setErrors, resetForm, isValid } = useForm({
    number: '',
    cvv: '',
    holder_name: '',
    brand: '',
    exp_month: '01',
    year: '2023',
    holder_document: '',
  })

  const [add, setAdd] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [cards, setCards] = React.useState([])
  const [cardDetails, setCardDetails] = React.useState({ length: 16, cvv: 3 })
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [hasAddresses, setHasAddresses] = React.useState(false)

  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    getData()
  }, [])

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  const getData = async () => {
    const response = await GET_FETCH({ url: `cards`, token });
    // console.log("response", response);

    //Setting the addresses and shipping addresses accordingly with data length
    if (response.status) {
      setCards(response.cards.data)
      setHasAddresses(response.has_addresses.length === 0 ? false : true)
    }
    else renderToast({ type: 'error', error: response.message })

    setLoading(false);
  };

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Saving-data-----------------------------
  const handleSave = async () => {
    const valid = isValid([''])

    if (valid) {
      setLoadingSave(true)

      let response = await POST_FETCH({ url: `${URL}api/cards/create`, body: form, token })
      // console.log('response', response)

      if (response.status) {
        setCards(cards.concat(response.card))
        renderToast({ type: 'success', error: response.message })
        handleAdd()
      }
      else renderToast({ type: 'error', error: response.message })

      setLoadingSave(false)
    }
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Deleting-data---------------------------
  const handleDelete = async (id) => {
    let response = await DELETE_FETCH({ url: `cards/delete/${id}`, token })
    if (response.status) {
      setAdd(false); resetForm(); setCards(cards.filter(item => item.id !== id))
      renderToast({ type: 'success', error: response.message })
    } else {
      renderToast({ type: 'error', error: response.message })
    }
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
  const handleCardChange = ({ target }) => {
    const { brand, mask, length, cvv, value } = cardMask(target.value)

    cvv && length && setCardDetails({ cvv, length })
    setForm({ ...form, number: mask, brand, cvv: '' })
    setErrors({ ...errors, number: null, cvv: null })
  }

  //Function to show fields and clear them
  const handleAdd = () => {
    if (hasAddresses) { setAdd(!add); resetForm() }
    else {
      swal({
        title: `Dados incompletos`,
        text: `Por questões de segurança, preencha os dados de usuário e adicione algum endereço antes de prosseguir com o cadastro de cartão!`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
    }
  };

  return (
    // -------------------------Cards-Content-------------------------
    <div className='anime-left'>
      <h1 className="dash-title">Cartões</h1>
      {!loading ?
        <div className="d-flex justify-content-around flex-wrap">
          {cards.length > 0
            ? cards.map((item, index) => (
              <div key={index} className="row payment-card mb-3">
                <div className="col-md-12 my-2 mt-4 bg-dark" style={{ height: '2rem' }}></div>

                <div className="d-flex">
                  <div style={{ width: '75px', marginTop: 5 }}>
                    <img className='img-fluid' src={`${URL}brands/${item.brand.toLowerCase()}.png`} alt='brand' />
                  </div>
                  <div className="ms-auto">
                    <IconButton aria-label="Delete" onClick={() =>
                      renderAlert({ id: item.id, item: 'cartão', article: 'o', deleteFunction: handleDelete })}><CloseIcon />
                    </IconButton>
                  </div>
                </div>

                <div className="col-md-12 my-2">
                  <p>{item.holder_name}</p>
                  <p>**** **** **** {item.last_four_digits}</p>
                  <div className="d-flex" style={{ fontSize: '.8rem' }}>
                    <div className='d-flex'>
                      <p className='me-2'>Validade</p>
                      <p>{item.exp_month}/{item.exp_year}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
            : <p>Sem cartões cadastrados</p>}
        </div> : <div className="d-flex justify-content-center p-5"><CircularProgress /></div>}

      {/* -------------------------Card-fields-section------------------------- */}
      <div className="row my-5">
        <div className="d-flex align-items-center">
          <h1 className="dash-title">Adicionar cartão</h1>
          <button aria-label="Add" onClick={handleAdd} className='rounded-button hvr-grow ms-2 d-flex align-items-center justify-content-center'>
            {add ? <DeleteIcon size={15} /> : <AddIcon size={20} />}
          </button>
        </div>
        {// -------------------------Name----------------------------------
          add &&
          <form className='anime-left p-0 mt-3' onSubmit={(e) => { e.preventDefault(); handleSave(e) }}>
            <div className="row align-items-end">
              <div className="col-md-6 my-2 p-0 px-sm-2">
                <div className="form-floating">
                  <input className={`form-control ${errors?.holder_name && 'is-invalid'}`} value={form.holder_name} onChange={handleChange} onBlur={handleBlur} id='holder_name' name='holder_name' />
                  <label htmlFor='holder_name'>Nome*</label>
                  <span className='error-message'>{errors?.holder_name}</span>
                </div>
              </div>
              {/* -------------------------Card-------------------------- */}
              <div className="col-md-6 my-2 p-0 px-sm-2">
                <div className='input-group'>
                  <div className="form-floating">
                    <input className={`form-control ${errors?.number && 'is-invalid'}`} value={form.number} onChange={handleCardChange} onBlur={handleBlur} id='number' name='number' minLength={cardDetails.length} />
                    <label htmlFor='number'>Cartão*</label>
                    <span className='error-message'>{errors?.number}</span>
                  </div>
                  <div className='brand'><img src={`${URL}/brands/${form.brand ? form.brand.toLowerCase() : 'nocard'}.png`} alt='brand'></img></div>
                </div>
              </div>
            </div>
            {/* -------------------------Document------------------------ */}
            <div className='col-md-12 my-2 p-0 px-sm-2'>
              <div className="form-floating">
                <input className={`form-control ${errors?.holder_document && 'is-invalid'}`} value={cpfMask(form.holder_document).mask} onChange={handleChange} onBlur={handleBlur} id='holder_document' name='holder_document' maxLength={11} />
                <label htmlFor='holder_document'>CPF*</label>
                <span className='error-message'>{errors?.holder_document}</span>
              </div>
            </div>
            {/* -------------------------Month--------------------------- */}
            <div className="row">
              <div className="col-md-3 my-2 p-0 px-sm-2">
                <div className="form-floating">
                  <select className={`form-control ${errors?.exp_month && 'is-invalid'}`} value={form.exp_month} onChange={handleChange} onBlur={handleBlur} id='exp_month' name='exp_month'>
                    {fillMonth.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <label htmlFor='exp_month'>Mês*</label>
                  <span className='error-message'>{errors?.exp_month}</span>
                </div>
              </div>
              {/* -------------------------Year-------------------------- */}
              <div className="col-md-6 my-2 p-0 px-sm-2">
                <div className="form-floating">
                  <select className={`form-control ${errors?.exp_year && 'is-invalid'}`} value={form.exp_year} onChange={handleChange} onBlur={handleBlur} id='exp_year' name='exp_year'>
                    {fillYear.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <label htmlFor='exp_year'>Ano*</label>
                  <span className='error-message'>{errors?.exp_year}</span>
                </div>
              </div>
              {/* -------------------------CVV--------------------------- */}
              <div className="col-md-3 my-2 p-0 px-sm-2">
                <div className="form-floating">
                  <input className={`form-control ${errors?.cvv && 'is-invalid'}`} value={numberMask(form.cvv)} onChange={handleChange} onBlur={handleBlur} id='cvv' name='cvv' maxLength={cardDetails.cvv} />
                  <label htmlFor='cvv'>CVV*</label>
                  <span className='error-message'>{errors?.cvv}</span>
                </div>
              </div>
            </div>

            {/* -------------------------Buttons-section------------------------- */}
            <SavePreset backPath={'/profile'} handleSave={handleSave} loading={loadingSave} />
          </form>
        }
        {!add && <div className='anime-right mt-2'><p>Cadastre cartões para começar!</p></div>}
      </div >
    </div>
  );
};

export default Payment;
