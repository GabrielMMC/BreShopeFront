import React from 'react'
import Input from '../../routes/Form/Input'
import debit_card from '../../../assets/debit_card.png'
import boleto from '../../../assets/boleto.png'
import qrcode from '../../../assets/qr-code.png'
import discover from '../../../assets/discover.png'
import { CircularProgress, Typography } from '@mui/material'
import { GET_FETCH, STORAGE_URL, URL } from '../../../variables'
import { useSelector } from 'react-redux'

const PayData = ({ form, setForm }) => {
  const [method, setMethod] = React.useState('')
  const [cards, setCards] = React.useState('')
  const token = useSelector(state => state.AppReducer.token);

  React.useEffect(() => {
    if (method === 'credit') getCards()
  }, [method])

  const getCards = async () => {
    const response = await GET_FETCH({ url: 'list_cards', token })
    if (response.status) setCards(response.cards.data)
    console.log('resp', response)
  }

  function renderForm() {
    let keys = { ...form }
    keys = Object.keys(keys)

    switch (method) {
      case 'credit':
        return (
          <>
            <Typography>Selecione um cartão cadastrado</Typography>
            <div className="d-flex flex-wrap">
              {cards ? cards.map(item => (
                <div key={item.id} className="row payment-card mb-5 m-auto">
                  <div className="col-12 mt-4 bg-dark" style={{ height: '2rem' }}></div>

                  <div className="d-flex">
                    <div style={{ width: '75px', marginTop: 5 }}>
                      <img className='img-fluid' src={`${STORAGE_URL}/brands/${item.brand}.png`} alt='brand' />
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
              )) : <div className="d-flex justify-content-center p-5"><CircularProgress /></div>}
            </div>
            {keys.map(item => (
              <div key={form[item].label} className={`${form[item].col} col-12 my-2 anime-left`}>
                <Input state={form} setState={(e) => setForm(e)} item={item} />
              </div>
            ))}
          </>
        )


      default:
        return null
    }
  }

  return (
    <>
      <Typography className='text-center'>Adicione uma forma de pagamento</Typography>
      <form className="d-flex mt-2">
        <div className="m-auto d-flex">
          <div className="ms-4 form-check">
            <div className='d-flex m-auto' style={{ width: 50, height: 50 }}>
              <img src={debit_card} alt="debit_card" className="img-fluid ms-1" htmlFor='debit' />
            </div>
            <label htmlFor="debit">Cartão de débito</label>
            <input className='ms-2' id='debit' type="radio" name='defaultRadio' onChange={() => setMethod('debit')} />
          </div>

          <div className="ms-4 form-check">
            <div className='d-flex m-auto' style={{ width: 50, height: 50 }}>
              <img src={boleto} alt="debit_card" className="img-fluid ms-1" htmlFor='boleto' />
            </div>
            <label htmlFor="boleto">Boleto</label>
            <input className='ms-2' id='boleto' type="radio" name='defaultRadio' onChange={() => setMethod('boleto')} />
          </div>

          <div className="ms-4 form-check">
            <div className='d-flex m-auto' style={{ width: 50, height: 50 }}>
              <img src={discover} alt="debit_card" className="img-fluid ms-1" htmlFor='credit' />
            </div>
            <label htmlFor="credit">Cartão de crédito</label>
            <input className='ms-2' id='credit' type="radio" name='defaultRadio' onChange={() => setMethod('credit')} />
          </div>

          <div className="ms-4 form-check">
            <div className='d-flex m-auto' style={{ width: 50, height: 50 }}>
              <img src={qrcode} alt="debit_card" className="img-fluid ms-1" htmlFor='pix' />
            </div>
            <label htmlFor="pix">Pix</label>
            <input className='ms-2' id='pix' type="radio" name='defaultRadio' onChange={() => setMethod('pix')} />
          </div>
        </div>
      </form>
      {renderForm()}
    </>
  )
}

export default PayData