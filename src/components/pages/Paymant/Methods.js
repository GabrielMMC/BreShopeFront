import React from 'react'
import CardsModal from './CardsModal';
import mastercard from '../../../assets/master.png'
import visa from '../../../assets/visa.png'
import pix from '../../../assets/qr-code.png';
import boleto from '../../../assets/boleto.png';
import credit_card from '../../../assets/discover.png';
import debit_card from '../../../assets/debit_card.png';
import CardPayment from './CardPayment';
import MultiPayment from './MultiPayment';
import { moneyMask } from '../../utilities/masks/currency';
import Installments from '../../utilities/Installments';

const Methods = ({ card, setCard, method, setMethod, total }) => {
  let cardPreset = {
    filled: { value: true },
    brand: { value: "visa", error: false },
    exp_month: { value: "01", error: false },
    holder_name: { value: "", error: false },
    exp_year: { value: "2023", error: false },
    cvv: { value: "", error: false, length: 3 },
    holder_document: { value: "", error: false, mask: '', length: 11 },
    number: { value: "", error: false, mask: '', length: 16 },
  }

  const multiPreset = [{
    filled: { value: true },
    brand: { value: "visa", error: false },
    exp_month: { value: "01", error: false },
    holder_name: { value: "", error: false },
    exp_year: { value: "2023", error: false },
    cvv: { value: "", error: false, length: 3 },
    number: { value: "", error: false, mask: '', length: 16 },
    holder_document: { value: "", error: false, mask: '', length: 11 },
    installments: { value: "", error: false, total: Installments(total / 2) },
    amount: { value: (total / 2) * (16.37 / 100), error: false, mask: moneyMask((total / 2) * (1 + 16.37 / 100), true) },
  },
  {
    filled: { value: true },
    brand: { value: "visa", error: false },
    exp_month: { value: "01", error: false },
    holder_name: { value: "", error: false },
    exp_year: { value: "2023", error: false },
    cvv: { value: "", error: false, length: 3 },
    number: { value: "", error: false, mask: '', length: 16 },
    holder_document: { value: "", error: false, mask: '', length: 11 },
    installments: { value: "", error: false, total: Installments(total / 2) },
    amount: { value: (total / 2) * (16.37 / 100), error: false, mask: moneyMask((total / 2) * (1 + 16.37 / 100), true) },
  }]

  return (
    <>
      <form className="d-flex justify-content-around mt-2">
        {/* -------------------------Pix-Radio------------------------- */}
        <div className="form-check pointer" onClick={() => setMethod('pix')}>
          <div className="d-flex m-auto" style={{ width: 50, height: 50 }}>
            <img src={pix} alt={'pix'} className="img-fluid ms-1" htmlFor={'pix'} onChange={() => ''} />
          </div>
          <label htmlFor={'pix'}>Pix</label>
          <input className="ms-2" id={'pix'} type="radio" name="defaultRadio" checked={method === 'pix'} />
        </div>

        {/* -------------------------Debit-Radio------------------------- */}
        <div className="form-check pointer" onClick={() => { setCard(cardPreset); setMethod('debit_card') }}>
          <div className="d-flex m-auto" style={{ width: 50, height: 50 }}>
            <img src={debit_card} alt={'debit_card'} className="img-fluid ms-1" htmlFor={'debit_card'} onChange={() => ''} />
          </div>
          <label htmlFor={'debit_card'}>Débito</label>
          <input className="ms-2" id={'debit_card'} type="radio" name="defaultRadio" checked={method === 'debit_card'} />
        </div>

        {/* -------------------------Boleto-Radio------------------------- */}
        <div className="form-check pointer" onClick={() => setMethod('boleto')}>
          <div className="d-flex m-auto" style={{ width: 50, height: 50 }}>
            <img src={boleto} alt={'boleto'} className="img-fluid ms-1" htmlFor={'boleto'} onChange={() => ''} />
          </div>
          <label htmlFor={'boleto'}>Boleto</label>
          <input className="ms-2" id={'boleto'} type="radio" name="defaultRadio" checked={method === 'boleto'} />
        </div>

        {/* -------------------------Credit-Radio------------------------- */}
        <div className="form-check pointer" onClick={() => { setCard({ ...cardPreset, installments: { value: 1, error: false } }); setMethod('credit_card') }}>
          <div className="d-flex m-auto" style={{ width: 50, height: 50 }}>
            <img src={credit_card} alt={'credit_card'} className="img-fluid ms-1" htmlFor={'credit_card'} onChange={() => ''} />
          </div>
          <label htmlFor={'credit_card'}>Crédito</label>
          <input className="ms-2" id={'credit_card'} type="radio" name="defaultRadio" checked={method === 'credit_card'} />
        </div>

        {/* -------------------------Multi-Payment-Radio------------------------- */}
        <div className="form-check pointer" onClick={() => { setCard(multiPreset); setMethod('multi_payment') }}>
          <div className="d-flex">
            <div className="d-flex m-auto" style={{ width: 50, height: 50 }}>
              <img src={visa} alt={'multi_payment'} className="img-fluid ms-1" htmlFor={'multi_payment'} onChange={() => ''} />
            </div>

            <div className="d-flex m-auto" style={{ width: 50, height: 50 }}>
              <img src={mastercard} alt={'multi_payment'} className="img-fluid ms-1" htmlFor={'multi_payment'} onChange={() => ''} />
            </div>
          </div>
          <label htmlFor={'multi_payment'}>Multi Pagamento</label>
          <input className="ms-2" id={'multi_payment'} type="radio" name="defaultRadio" checked={method === 'multi_payment'} />
        </div>
      </form>

      <MultiPayment method={method} card={card} setCard={setCard} />
      <CardPayment method={method} card={card} setCard={setCard} total={total} />
    </>
  )
}

export default Methods