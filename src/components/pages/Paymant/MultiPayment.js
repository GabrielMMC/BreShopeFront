import React from 'react'
import { STORAGE_URL } from '../../../variables'
import setError from '../../utilities/Error'
import Installments from '../../utilities/Installments'
import cardMask from '../../utilities/masks/card'
import cpfMask from '../../utilities/masks/cpf'
import { moneyMask } from '../../utilities/masks/currency'
import CardsModal from './CardsModal'

const MultiPayment = ({ method, card, setCard }) => {
  const [indexCard, setIndexCard] = React.useState(0)

  const fillMonth = ['01', '02', '03', '04', '05', '06', '07', '09', '10', '11', '12']
  const fillYear = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033']

  const handleOpenInput = () => {
    const newCard = [...card]
    delete newCard[indexCard].id; delete newCard[indexCard].cardObj

    setCard(newCard)
  }

  const handleChange = (value, item, mask) => {
    let newCard = [...card]
    newCard[indexCard][item].error = false
    newCard[indexCard][item].value = value
    if (mask) newCard[indexCard][item].mask = mask(value).mask ? mask(value).mask : mask(value)

    setCard(newCard)
  }

  const handleAmountChange = (value, item, mask) => {
    let newCard = [...card]
    value = value.replace(/\D/g, '')
    newCard[indexCard][item].error = false
    newCard[indexCard][item].value = value
    newCard[indexCard].installments.value = 1
    newCard[indexCard].installments.total = Installments(value)

    console.log('installments', newCard[indexCard].installments.total)

    if (mask) newCard[indexCard][item].mask = mask(value).mask ? mask(value).mask : mask(value)

    setCard(newCard)
  }

  console.log('card arr', card)

  return (
    <>
      {method === 'multi_payment' &&
        <div className='mt-5 row'>
          <div className="col-md-6">
            <div className="d-flex">
              <CardsModal card={card} setCard={setCard} /><p className='ms-2'> ou </p><p className='link-p ms-2' onClick={handleOpenInput}>adicione um agora!</p>
            </div>
          </div>

          <div className="col-md-6 d-flex">
            <div className="ms-auto d-flex" style={{ whiteSpace: 'nowrap' }}>
              <div className="form-check pointer ms-2">
                <label htmlFor='cardOne'>Primeiro cartão</label>
                <input className="ms-2" id='cardOne' type="radio" name="multiPaymentRadio" onClick={() => setIndexCard(0)} defaultChecked />
              </div>

              <div className="form-check pointer ms-2">
                <label htmlFor='cardTwo'>Segundo cartão</label>
                <input className="ms-2" id='cardTwo' type="radio" name="multiPaymentRadio" onClick={() => setIndexCard(1)} />
              </div>
            </div>

          </div>

          {Array.isArray(card) && !card[indexCard].id ?
            <form className='anime-left mt-3'>
              <div className="row align-items-end">
                <div className="col-sm-6">
                  <div className="form-floating">
                    <input className={`form-control ${card[indexCard].holder_name.error && 'is-invalid'}`} id="name" type="text" value={card[indexCard].holder_name.value}
                      onChange={({ target }) => handleChange(target.value, 'holder_name')}
                      onBlur={() => setError('holder_name', card, setCard, indexCard)} required />
                    <label htmlFor="name">Nome do Títular*</label>
                  </div>
                </div>
                {console.log(' osc sdralgo de cartão', card)}
                <div className="col-sm-6">
                  <div className='input-group'>
                    <div className="form-floating">
                      <input className={`form-control ${card[indexCard].number.error && 'is-invalid'}`} id="card" type="text" value={card[indexCard].number.mask}
                        onChange={({ target }) => {
                          const { brand, mask, length, cvv, value } = cardMask(target.value)

                          let newCard = [...card]
                          newCard[indexCard].number.mask = mask
                          newCard[indexCard].number.value = value
                          newCard[indexCard].number.error = false
                          newCard[indexCard].number.length = length

                          newCard[indexCard].brand.value = brand
                          newCard[indexCard].cvv.length = cvv
                          newCard[indexCard].cvv.value = ''

                          Array.from(target.value).length <= newCard[indexCard].number.length ? newCard[indexCard].number.value = target.value : newCard[indexCard].number.value = newCard[indexCard].number.value
                          setCard(newCard)
                        }}
                        onBlur={() => setError('number', card, setCard, indexCard)} required />
                      <label htmlFor="card">Cartão*</label>
                    </div>
                    <div className='brand'><img src={`${STORAGE_URL}brands/${card[indexCard].brand.value ? card[indexCard].brand.value : 'nocard'}.png`} alt='brand'></img></div>
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className='col-12'>
                  <div className="form-floating">
                    <input className={`form-control ${card[indexCard].holder_document.error && 'is-invalid'}`} id="document" type="text" value={card[indexCard].holder_document.mask}
                      onChange={({ target }) => handleChange(target.value, 'holder_document', cpfMask)}
                      onBlur={() => setError('holder_document', card, setCard, indexCard)} required />
                    <label htmlFor="document">CPF do Títular*</label>
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-3">
                  <div className="form-floating">
                    <select className={`form-control ${card[indexCard].exp_month.error && 'is-invalid'}`} id="month" type="text" value={card[indexCard].exp_month.value}
                      onChange={({ target }) => handleChange(target.value, 'exp_month')}
                      onBlur={() => setError('exp_month', card, setCard, indexCard)} required>
                      {fillMonth.map(item => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                    <label htmlFor="month">Mês*</label>
                  </div>
                </div>

                <div className="col-6">
                  <div className="form-floating">
                    <select className={`form-control ${card[indexCard].exp_year.error && 'is-invalid'}`} id="year" type="text" value={card[indexCard].exp_year.value}
                      onChange={({ target }) => handleChange(target.value, 'exp_year')}
                      onBlur={() => setError('exp_year', card, setCard, indexCard)} required>
                      {fillYear.map(item => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                    <label htmlFor="year">Ano*</label>
                  </div>
                </div>

                <div className="col-3">
                  <div className="form-floating">
                    <input className={`form-control ${card[indexCard].cvv.error && 'is-invalid'}`} id="cvv" type="number" value={card[indexCard].cvv.value}
                      onChange={({ target }) => {
                        let newCard = [...card]
                        newCard[indexCard].cvv.error = false
                        Array.from(target.value).length <= newCard[indexCard].cvv.length ? newCard[indexCard].cvv.value = target.value : newCard[indexCard].cvv.value = newCard[indexCard].cvv.value
                        setCard(newCard)
                      }}
                      onBlur={() => setError('cvv', card, setCard, indexCard)} required />
                    <label htmlFor="cvv">CVV*</label>
                  </div>
                </div>
              </div>

              <div className="row my-4">
                <div className="col-sm-6">
                  <div className="form-floating">
                    <input className={`form-control ${card[indexCard].number.error && 'is-invalid'}`} id="amount" type="text" value={card[indexCard].amount.mask}
                      onChange={({ target }) => handleAmountChange(target.value, 'amount', moneyMask)}
                      onBlur={() => setError('amount', card, setCard, indexCard)} required />
                    <label htmlFor="amount">Valor do cartão*</label>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form-floating">
                    <select className={`form-control ${card[indexCard].number.error && 'is-invalid'}`} id="installments" type="text" value={card[indexCard].installments.value}
                      onChange={({ target }) => handleChange(target.value, 'installments')}
                      onBlur={() => setError('installments', card, setCard, indexCard)} required>
                      {card[indexCard].installments.total.map(item => (
                        <option key={item.convert} value={item.value}>
                          {item.value + 'X - '}{moneyMask(item.convert)}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="installments">Valor da Parcela*</label>
                  </div>
                </div>
              </div>
            </form>
            :
            <div className="row">
              <div className="col-sm-6">
                <div className="form-floating">
                  <input className={`form-control ${card[indexCard].number.error && 'is-invalid'}`} id="amount" type="text" value={card[indexCard].amount.mask}
                    onChange={({ target }) => handleAmountChange(target.value, 'amount', moneyMask)}
                    onBlur={() => setError('amount', card, setCard, indexCard)} required />
                  <label htmlFor="amount">Valor do cartão*</label>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-floating">
                  <select className={`form-control ${card[indexCard].number.error && 'is-invalid'}`} id="installments" type="text" value={card[indexCard].installments.value}
                    onChange={({ target }) => handleChange(target.value, 'installments')}
                    onBlur={() => setError('installments', card, setCard, indexCard)} required>
                    {card[indexCard].installments.total.map(item => (
                      <option key={item.convert} value={item.value}>
                        {item.value + 'X - '}{moneyMask(item.convert)}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="installments">Valor da Parcela*</label>
                </div>
              </div>
            </div>
          }


          {Array.isArray(card) && card[indexCard].cardObj &&
            <div className="col-12 bg-gray rounded p-3 anime-left">
              <div className="d-flex">
                <p>Cartão: </p>
                <p className='ms-2'>**** **** **** {card[indexCard].cardObj.last_four_digits}</p>
                <p className='ms-4'>Validade: </p>
                <p className='ms-2'>{card[indexCard].cardObj.exp_month}/{card[indexCard].cardObj.exp_year}</p>
              </div>
            </div>}
        </div>}
    </>
  )
}

export default MultiPayment