import React from 'react'
import Input from '../../routes/Form/Input'
import debit_card from '../../../assets/debit_card.png'
import boleto from '../../../assets/boleto.png'
import qrcode from '../../../assets/qr-code.png'
import discover from '../../../assets/discover.png'

const PayData = ({ form, setForm }) => {
  function renderForm() {
    let keys = { ...form }
    keys = Object.keys(keys)

    return keys.map(item => (
      <div key={form[item].label} className={`${form[item].col} col-12 my-2`}>
        <Input state={form} setState={(e) => setForm(e)} item={item} />
      </div>
    ))
  }

  return (
    <>
      <form className="d-flex">
        <div className="m-auto d-flex">
          <div className="ms-4 form-check">
            <div className='d-flex m-auto' style={{ width: 50, height: 50 }}>
              <img src={debit_card} alt="debit_card" className="img-fluid ms-1" htmlFor='debit' />
            </div>
            <label htmlFor="debit">Cartão de débito</label>
            <input className='ms-2' id='debit' type="radio" name='defaultRadio' onChange={() => console.log('pix')} />
          </div>

          <div className="ms-4 form-check">
            <div className='d-flex m-auto' style={{ width: 50, height: 50 }}>
              <img src={boleto} alt="debit_card" className="img-fluid ms-1" htmlFor='boleto' />
            </div>
            <label htmlFor="boleto">Boleto</label>
            <input className='ms-2' id='boleto' type="radio" name='defaultRadio' onChange={() => console.log('pix')} />
          </div>

          <div className="ms-4 form-check">
            <div className='d-flex m-auto' style={{ width: 50, height: 50 }}>
              <img src={discover} alt="debit_card" className="img-fluid ms-1" htmlFor='credit' />
            </div>
            <label htmlFor="credit">Cartão de crédito</label>
            <input className='ms-2' id='credit' type="radio" name='defaultRadio' onChange={() => console.log('pix')} />
          </div>

          <div className="ms-4 form-check">
            <div className='d-flex m-auto' style={{ width: 50, height: 50 }}>
              <img src={qrcode} alt="debit_card" className="img-fluid ms-1" htmlFor='pix' />
            </div>
            <label htmlFor="pix">Pix</label>
            <input className='ms-2' id='pix' type="radio" name='defaultRadio' onChange={() => console.log('pix')} />
          </div>
        </div>
      </form>
      {renderForm()}
    </>
  )
}

export default PayData