import React from 'react';
import { Typography, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { POST_FETCH, URL } from '../../../variables';
import { moneyMask } from '../../utilities/masks/currency';
import Container from '../Container';
import { MdClose, MdCheck } from 'react-icons/md';
import './styles.css';
import Methods from './Methods';
import UserData from './UserData';
import ChargeModal from './ChargeModal';
import Addresses from './Addresses';

const PaymentScreen = () => {
  const [total, setTotal] = React.useState('')
  const [pendent, setPendent] = React.useState('')
  const [loadingSave, setLoadingSave] = React.useState(false)

  const [user, setUser] = React.useState('')
  const [card, setCard] = React.useState('')
  const [method, setMethod] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [charge, setCharge] = React.useState('')

  const [errors, setErrors] = React.useState({ address: false, payment: false, user: false })
  const [cartItems, setCartItems] = React.useState(useSelector(state => state.AppReducer.cart_items))
  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    let tt = 0
    cartItems && cartItems.forEach(item => { tt += item.price * (100 - item.discount_price) * item.quantity })
    setTotal(tt); setPendent(tt)
  }, [])

  const handleSave = async () => {
    let errorPayment = false
    if (method == 'credit_card' || method == 'debit_card' || method == 'multi_payment') {
      errorPayment = !verifyData(card, setCard, true)
      Object.keys(card).forEach(item => { if (card[item].error && !card.id) errorPayment = true })
    }

    let errorAddress = !verifyData(address, setAddress, true)
    Object.keys(address).forEach(item => { if (address[item].error && !address.id) errorAddress = true })

    let errorUser = !verifyData(user, setUser, true)
    Object.keys(user).forEach(item => { if (user[item].error && !user.id) errorUser = true })

    setErrors({ address: errorAddress, payment: errorPayment, user: errorUser })

    if (!errorAddress && !errorPayment && !errorUser) {
      let items = []
      let cardBody = {}
      let customer = {}
      let addressBody = {}

      cartItems.forEach(item => {
        items = [...items, {
          "id": item.id,
          "description": item.description,
          "quantity": item.quantity,
          "amount": item.price * (100 - item.discount_price),
        }]
      })

      Object.keys(card).forEach(item => { cardBody = { ...cardBody, [item]: card[item].value } })
      Object.keys(user).forEach(item => { customer = { ...customer, [item]: user[item].value } })
      Object.keys(address).forEach(item => { addressBody = { ...addressBody, [item]: address[item].value } })


      let payment = {}
      let shipping = {}

      if (address.id) addressBody = address.addressObj
      shipping = {
        "address_id": addressBody?.id,
        "address": {
          ...addressBody
        }
      }

      if (method === 'credit_card' || method === 'debit_card' || method === 'multi_payment') {
        if (Array.isArray(card)) {
          payment = []
          cardBody = []

          card.forEach((object, index) =>
            Object.keys(object).forEach(key =>
              cardBody[index] = { ...cardBody[index], [key]: object[key].value }
            ))

          cardBody.forEach(item => item.id ?
            payment = [
              ...payment, {
                "card_id": item.id,
                "amount": item.amount,
                "payment_method": 'credit_card',
                "installments": item.installments,
              }] :
            payment = [
              ...payment, {
                "card": { ...item },
                "amount": item.amount,
                "payment_method": 'credit_card',
                "installments": item.installments,
              }])

        } else {
          payment = cardBody.id ? {
            "card_id": cardBody.id,
            "payment_method": method,
            "installments": cardBody.installments
          } : {
            "card": cardBody,
            "payment_method": method,
            "installments": cardBody.installments,
          }
        }
      } else payment = { "payment_method": method }

      console.log('payment', payment, shipping, customer)

      const typePayment = method === 'multi_payment' ? 'multi_payment' : 'payment'
      const response = await POST_FETCH({ url: `${URL}api/orders/create`, token, body: { items, shipping, customer, [typePayment]: payment } })
      console.log('response', response)
      // if (response) setCharge(response.order.charges[0].last_transaction)
    } else {
      console.log('errors', { address: errorAddress, payment: errorPayment, user: errorUser }, address)
    }
  }

  const verifyData = (state, setState, setError) => {
    let valid = true

    if (Array.isArray(state)) {
      let state2 = [...state]
      let cardOneId = false; let filledOne = false
      let cardTwoId = false; let filledTwo = false

      state2.forEach(object => {
        Object.keys(object).forEach(key => {
          if (!object.id && (!object[key].value || (object[key].length ? Array.from(object[key].value).length < object[key].length : false))) {
            valid = false
            if (setError && !object.id) object[key].error = true
          }
        })
      })

      if (setError) setState(state2)

      if (state2[0].id) cardOneId = true; if (state2[0].filled) filledOne = true
      if (state2[1].id) cardTwoId = true; if (state2[1].filled) filledTwo = true
      if (cardOneId && cardTwoId) valid = true
      if (filledOne && filledTwo) return valid
      else return false

    } else {
      let state2 = { ...state }

      Object.keys(state).forEach(item => {
        if (!state[item].value || (state[item].length ? Array.from(state[item].value).length < state[item].length : false)) {
          valid = false

          if (setError && !state.id) state2[item].error = true
        }
      })

      if (setError) setState(state2)

      if (state.id) valid = true
      if (state.filled) return valid
      else return false
    }
  }

  return (
    <Container>
      <div className="row">

        <div className="col-9 p-3" style={{ borderRight: '5px solid #E8E8E8' }}>
          <p className='display-6'>Dados do pagamento</p>
          <hr />

          {/* --------------------------Address-Section-------------------------- */}
          <div className="accordion" id="accordionExample">
            <div>
              <h2 className="accordion-header" id="headingOne">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                  <span>Endereço de entrega</span>
                  {verifyData(address, false) ? <MdCheck color='#4BB543' size={20} /> : <MdClose color='#FF0000' size={20} />}
                  {errors.address && <span className='small ms-2' style={{ color: '#FF0000' }}>Verifique todos os campos!</span>}
                </button>
              </h2>
              <div id="collapseOne" className='accordion-collapse collapse' collapse aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <Addresses address={address} setAddress={setAddress} />
                </div>
              </div>
              <hr />
            </div>

            {/* --------------------------Payment-Section-------------------------- */}
            <div>
              <h2 className="accordion-header" id="headingTwo">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  <span>Formas de pagamento</span>
                  {(method === 'credit_card' || method === 'debit_card' || method === 'multi_payment') && (verifyData(card, false)
                    ? <MdCheck color='#4BB543' size={20} />
                    : <MdClose color='#FF0000' size={20} />
                  )}
                  {(method !== 'credit_card' && method !== 'debit_card' && method !== 'multi_payment') && (method !== ''
                    ? <MdCheck color='#4BB543' size={20} />
                    : <MdClose color='#FF0000' size={20} />
                  )}
                  {errors.payment && <span className='small ms-2' style={{ color: '#FF0000' }}>Verifique todos os campos!</span>}
                </button>
              </h2>
              <div id="collapseTwo" className='accordion-collapse collapsing' aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <Methods card={card} setCard={setCard} method={method} setMethod={setMethod} total={total} />
                </div>
              </div>
            </div>
            <hr />

            {/* --------------------------Group-Section-------------------------- */}
            <div>
              <h2 className="accordion-header" id="headingThree">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                  <span>Dados Gerais</span>
                  {verifyData(user, false) ? <MdCheck color='#4BB543' size={20} /> : <MdClose color='#FF0000' size={20} />}
                  {errors.user && <span className='small ms-2' style={{ color: '#FF0000' }}>Verifique todos os campos!</span>}
                </button>
              </h2>
              <div id="collapseThree" className='accordion-collapse collapse show' aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <UserData user={user} setUser={setUser} />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* --------------------------Products-Section-------------------------- */}
        <div className="d-flex align-content-between flex-wrap col-3 p-3">
          <div>
            <Typography>Produtos do carrinho</Typography>
            {cartItems && cartItems.map(item => (
              <div className='product' key={item.id}>
                <div className="d-flex">
                  <div className='rounded' style={{ width: '40%', height: '40%' }}>
                    <img src={JSON.parse(item.images)[0]} className='img-fluid' alt="product" />
                  </div>
                  <span className='small m-auto'>{item.description}</span>
                </div>

                <div className='d-flex justify-content-around'>
                  <span className='small'>{item.name}</span>
                  <span className="small">{moneyMask(item.price * (100 - item.discount_price))}</span>
                </div>

              </div>
            ))}
          </div>

          <div className='ms-auto d-flex'>
            <p className='m-auto'>Total: {moneyMask(total)}</p>
            <button style={{ cursor: "pointer", padding: "1rem 2rem", flexGrow: "0", flexBasis: "1rem", }} className="normal-archor special ms-auto" disabled={loadingSave} onClick={handleSave}>
              {loadingSave ? <CircularProgress size={20} color='inherit' /> : 'Finalizar'}
            </button>
          </div>
        </div>

        {charge && <ChargeModal charge={charge} method={method} />}
      </div>
    </Container>
  );
};

export default PaymentScreen;
