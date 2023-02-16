import React from 'react'
import { DELETE, get, post } from 'utils/requests'
import { API_URL, STORAGE_URL } from 'utils/variables'
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Button, Typography, IconButton, CircularProgress, } from "@mui/material";
import { useNavigate } from 'react-router-dom'
import cpfMask from 'utils/masks/cpf';
import cardMask from 'utils/masks/card';
import { POST_FETCH } from '../../../variables';

const Payment = () => {
  const fillMonth = ['01', '02', '03', '04', '05', '06', '07', '09', '10', '11', '12']
  const fillYear = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033']
  const history = useNavigate()

  const [loading, setLoading] = React.useState(true)
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [data, setData] = React.useState('')
  const [add, setAdd] = React.useState(false)

  const [cvv, setCvv] = React.useState('')
  const [name, setName] = React.useState('')
  const [brand, setBrand] = React.useState('')
  const [document, setDocument] = React.useState('')
  const [year, setYear] = React.useState('01')
  const [month, setMonth] = React.useState('2023')
  const [card, setCard] = React.useState({ value: '', mask: '', length: 16, cvv: 3 })

  React.useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const response = await get(`${API_URL}/cards`)

    setData(() => response.cards.data.map(item => {
      let firstDigits = Array.from(item.first_six_digits)
      let card = firstDigits.splice(0, 4).toString().replace(/,/g, '') + ' ' + firstDigits.toString().replace(/,/g, '') + '** **** ' + item.last_four_digits
      return { ...item, card }
    }))
    setLoading(false)
  }

  const handleSave = async () => {
    setLoading(true); setAdd(false); clearFields()
    const response = await POST_FETCH(`${API_URL}/cards/create`, JSON.stringify({
      cvv, exp_month: month, exp_year: year, holder_name: name, holder_document: document.value, number: card.value, brand: card.brand
    }))

    if (response) getData()
    console.log('reps', response)
  }

  const handleDelete = async (id) => {
    setLoading(true); setAdd(false); clearFields()
    const response = await DELETE(`${API_URL}/cards/delete/${id}`)
    if (response) getData()
  }

  const handleCvvChange = (value) => {
    console.log('cvv', card.cvv)
    if (Array.from(value).length <= card.cvv) setCvv(value)
  }

  const handleAdd = () => { setAdd(!add); clearFields() }
  const clearFields = () => { setName(''); setCard(''); setBrand(''); setDocument(''); setMonth(''); setYear(''); setCvv('') }

  return (
    <div>
      <Typography className="small" style={{ fontSize: "1.2em" }}>CARTÕES</Typography>
      {!loading ? <div className="d-flex flex-wrap">
        {data && data.map((item, index) => (
          <div key={index} className="row payment-card mb-5 m-auto">
            <div className="col-12 mt-4 bg-dark" style={{ height: '2rem' }}></div>

            <div className="d-flex">
              <div style={{ width: '75px', marginTop: 5 }}>
                <img className='img-fluid' src={`${STORAGE_URL}brands/${item.brand}.png`} alt='brand' />
              </div>
              <div className="ms-auto">
                <IconButton onClick={() => handleDelete(item.id)}><CloseIcon />
                </IconButton>
              </div>
            </div>

            <div className="col-12">
              <p>{item.holder_name}</p>
              <p>{item.number}</p>
              <div className="d-flex" style={{ fontSize: '.8rem' }}>
                <div className='d-flex'>
                  <p className='me-2'>Validade</p>
                  <p>{item.exp_month}/{item.exp_year}</p>
                </div>
              </div>
            </div>
          </div>
        )
        )}
      </div> : <div className="d-flex justify-content-center p-5"><CircularProgress color='inherit' /></div>}

      <div className="row my-5">
        <div className="d-flex align-items-center">
          <Typography variant='h6'>Adicionar Cartão</Typography>
          <button onClick={handleAdd} className='rounded-button hvr-grow ms-2 d-flex align-items-center justify-content-center'>
            {add ? <DeleteIcon size={15} /> : <AddIcon size={20} />}
          </button>
        </div>
        {
          add &&
          <form className='anime-left mt-3' onSubmit={(e) => { handleSave(e) }}>
            <div className="row align-items-end">
              <div className="col-6">
                <div className="form-floating">
                  <input className="form-control" id="name" type="text" value={name} onChange={({ target }) => setName(target.value)} required />
                  <label htmlFor="name">Nome do Títular*</label>
                </div>
              </div>

              <div className="col-6">
                <div className='input-group'>
                  <div className="form-floating">
                    <input className="form-control" id="card" type="text" value={card?.mask} onChange={({ target }) => { setCard(() => cardMask(target.value)); setCvv('') }} required />
                    <label htmlFor="card">Cartão*</label>
                  </div>
                  <div className='brand'><img src={`${STORAGE_URL}brands/${card.brand ? card.brand : 'nocard'}.png`} alt='brand'></img></div>
                </div>
              </div>
            </div>

            <div className='col-12 mt-4'>
              <div className="form-floating">
                <input className="form-control" id="document" type="text" value={document?.mask} onChange={({ target }) => setDocument(() => cpfMask(target.value))} required />
                <label htmlFor="document">CPF do Títular*</label>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-3">
                <div className="form-floating">
                  <select className="form-control" id="month" type="text" value={month} onChange={({ target }) => setMonth(target.value)} required>
                    {fillMonth.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <label htmlFor="month">Mês*</label>
                </div>
              </div>

              <div className="col-6">
                <div className="form-floating">
                  <select className="form-control" id="year" type="text" value={year} onChange={({ target }) => setYear(target.value)} required>
                    {fillYear.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <label htmlFor="year">Ano*</label>
                </div>
              </div>

              <div className="col-3">
                <div className="form-floating">
                  <input className="form-control" id="cvv" type="number" value={cvv} onChange={({ target }) => handleCvvChange(target.value)} />
                  <label htmlFor="cvv">CVV*</label>
                </div>
              </div>
            </div>

            <div className="d-flex mt-5">
              <button style={{ cursor: "pointer", padding: "1rem 2rem", flexGrow: "0", flexBasis: "1rem", }} className="normal-archor special" onClick={() => history("/")}>
                Voltar
              </button>
              <button style={{ cursor: "pointer", padding: "1rem 2rem", flexGrow: "0", flexBasis: "1rem", }} className="normal-archor special ms-auto" type="submit" disabled={loadingSave}>
                {loadingSave ? <CircularProgress size={20} color='inherit' /> : 'Enviar'}
              </button>
            </div>
          </form>
        }
        {!add && <div className='anime-right mt-2'><Typography>Cadastre cartões para começar!</Typography></div>}
      </div >
    </div >
  )
}

export default Payment