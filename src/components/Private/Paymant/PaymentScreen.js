import React from 'react'
import Methods from './Methods'
import UserData from './UserData'
import Addresses from './Addresses'
import ChargeModal from './ChargeModal'
import { LoadingButton } from '@mui/lab'
import { useNavigate } from 'react-router-dom'
import { MdClose, MdCheck } from 'react-icons/md'
import Container from '../../Utilities/Container'
import { renderToast } from '../../Utilities/Alerts'
import { useDispatch, useSelector } from 'react-redux'
import { splitNumber } from '../../Utilities/masks/phone'
import { moneyMask } from '../../Utilities/masks/currency'
import { getInterest } from '../../Utilities/Installments'
import { API_URL, POST_FETCH, STORAGE_URL } from '../../../variables'
import { Typography, CircularProgress, Skeleton } from '@mui/material'
import './styles.css';

const PaymentScreen = () => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const [total, setTotal] = React.useState('')
  const [pendent, setPendent] = React.useState('')
  const [interest, setInterest] = React.useState('')
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [loadingShipping, setLoadingShipping] = React.useState(true)
  const [shippingsTotal, setShippingsTotal] = React.useState([])

  //Each state will be filled in its section
  const [user, setUser] = React.useState('')
  const [card, setCard] = React.useState('')
  const [method, setMethod] = React.useState('credit_card')
  const [address, setAddress] = React.useState('')
  const [charge, setCharge] = React.useState('')

  const [cartItems, setCartItems] = React.useState('')
  const [errors, setErrors] = React.useState({ address: false, payment: false, user: false })

  const history = useNavigate()
  const dispatch = useDispatch()
  const contentRef = React.useRef()
  const token = useSelector(state => state.AppReducer.token)
  const wishlistItems = useSelector(state => state.AppReducer.wishlist_items)
  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  React.useEffect(() => {
    contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })

    if (cartItems.length > 0) {
      let finalPrice = ''
      //Object to filter and group sales products
      let shipping = {
        temp: [],
        result: []
      }

      cartItems.forEach(item => {
        //Sum of price with discount and quantity
        const price = Number(item.price);
        if (item.discount) {
          const discount = item.discount / 100;
          finalPrice += price - price * discount;
        } else {
          finalPrice += price
        }
        finalPrice = Math.round(finalPrice)

        // Shipping.temp does not contain the promotion id, it is added and created an item object within shipping.result
        // if (!shipping.temp.includes(item.provider_sale_id)) {
        //   //Adding delivery price to total
        //   tt += Number(item.delivery_price.replace('.', ''))
        //   shipping.temp.push(item.provider_sale_id)
        //   shipping.result.push({ description: item.sale.name, amount: item.delivery_price, id: item.product_id })
        // }
      })
      console.log('values', cartItems, finalPrice)
      //Setting states
      setTotal(finalPrice)
      setInterest(getInterest("1", finalPrice))
      setShippingsTotal(shipping.result)
      //Creating objects with total value in case the multipayment option is chosen
      setPendent([{ value: finalPrice, total: 0 }, { value: finalPrice, total: 0 }])
      setLoadingShipping(false)
    }
  }, [cartItems])

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Saving-data-----------------------------
  const handleSave = async () => {
    let errorPayment = false
    //validating the payment section, case has empty or wrong values is returned true for error variable
    if (method == 'credit_card' || method == 'debit_card' || method == 'multi_payment') {
      errorPayment = !verifyData(card, setCard, true)
      Object.keys(card).forEach(item => { if (card[item].error && !card.id) errorPayment = true })
    }

    //validating the address section, case has empty or wrong values is returned true for error variable
    let errorAddress = !verifyData(address, setAddress, true)
    Object.keys(address).forEach(item => { if (address[item].error && !address.id) errorAddress = true })

    //validating the user section, case has empty or wrong values is returned true for error variable
    let errorUser = !verifyData(user, setUser, true)
    Object.keys(user).forEach(item => { if (user[item].error && !user?.id) errorUser = true })


    //validating the multi payment section, case has empty or wrong values is returned true for error variable
    if (method === 'multi_payment') {
      if (Number(card[0].amount.value) + Number(card[1].amount.value) !== total) {
        errorPayment = true
        renderToast({ type: 'error', error: 'Verifique o saldo utilizado no multi pagamento!' })
      }
    }

    setErrors({ address: errorAddress, payment: errorPayment, user: errorUser })

    //If does not have errors, the backend objects will be monted
    if (!errorAddress && !errorPayment && !errorUser) {
      let items = []
      let cardBody = {}
      let customer = {}
      let addressBody = {}
      setLoadingSave(true)

      //Items object
      cartItems.forEach(item => {
        const price = item.discount ? item.price * (1 - (item.discount / 100)) : item.price

        items = [...items, {
          "id": item.product_id,
          "breshop_id": item.breshop_id,
          "description": item.description,
          "shipping_amount": item.delivery_price,
          "quantity": item.quantity ? item.quantity : 1,
          "discount": item.discount ?? null,
          "amount": Math.round(price),
        }]
      })

      //Separating each key from the object and assigning them their value, ex: {number: {value: '10'}} to {number: '10'}
      Object.keys(card).forEach(item => { cardBody = { ...cardBody, [item]: card[item].value } })
      Object.keys(user).forEach(item => { customer = { ...customer, [item]: user[item].value } })
      Object.keys(address).forEach(item => { addressBody = { ...addressBody, [item]: address[item].value } })

      //Spliting the area code from number
      const { area, numb } = splitNumber(user.phone)
      customer = { ...customer, area, number: numb }

      let payment = {}
      let shipping = {}
      let shippingAmount = 0
      shippingsTotal.forEach(item => shippingAmount += Number(item.amount.replace('.', '')))

      //Creating shipping object according to the filled fields or id
      if (address.id) addressBody = address.addressObj
      shipping = {
        "address_id": addressBody?.id,
        "amount": shippingAmount,
        "address": {
          ...addressBody
        }
      }

      //If the payment method chosen is credit, debit or multi payment, the object created will be different
      if (method === 'credit_card' || method === 'debit_card' || method === 'multi_payment') {
        //if card is array it means that the method is multi payment, then it will have to be created with foreach
        if (Array.isArray(card)) {
          payment = []
          cardBody = []
          //Tranforming each key in value
          card.forEach((object, index) =>
            Object.keys(object).forEach(key =>
              cardBody[index] = { ...cardBody[index], [key]: object[key].value }
            ))

          //Creating the array according to filled inputs or card id
          cardBody.forEach(item => item.id ?
            //Card id structure
            payment = [
              ...payment, {
                "card_id": item.id,
                "card": { ...item },
                "amount": Number(item.amount),
                "payment_method": 'credit_card',
                "installments": item.installments,
              }] :
            //Filled inputs structure
            payment = [
              ...payment, {
                "card": { ...item },
                "amount": Number(item.amount),
                "payment_method": 'credit_card',
                "installments": item.installments,
              }])

        } else {
          //Creating the object according to filled inputs or card id, but not with card array
          payment = cardBody.id ? {
            //Card id structure
            "card_id": cardBody.id,
            "card": cardBody,
            "payment_method": method,
            "installments": cardBody.installments
          } : {
            //Filled inputs structure
            "card": cardBody,
            "payment_method": method,
            "installments": cardBody.installments,
          }
        }
      }
      //If the payment method chosen is pix or bill
      else payment = { "payment_method": method }

      //Request with objects and methods created above
      const typePayment = method === 'multi_payment' ? 'multi_payment' : 'payment'
      const response = await POST_FETCH({ url: `${API_URL}orders/create`, body: { items, shipping, customer, [typePayment]: payment }, token })
      // console.log('response', response)

      //If it work, will be opened the payment modal if the method was pix or bill
      if (response.status) {
        dispatch({ type: "wishlist_items", payload: wishlistItems.filter(item => !cartItems.some(cartItem => cartItem.product_id === item.id)) });
        dispatch({ type: "cart_notify", payload: 0 });

        if (method === 'pix' || method === 'boleto') {
          setCharge(response.order.charges[0].last_transaction)
        }
        else {
          renderToast({ type: 'success', error: 'Pedido gerado com sucesso!' });
          history('/profile/orders')
        }
        dispatch({ type: 'cart_items', payload: [] })
      }

      else renderToast({ type: 'error', error: response.message })
      setTimeout(setLoadingSave(false), 2000)

    } else {
      // console.log('errors', { address: errorAddress, payment: errorPayment, user: errorUser }, address)
    }

  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
  //Validating data from each item state passed as parameter
  const verifyData = (state, setState, setError) => {
    let valid = true
    //If state is array it means that is multi payment card
    if (Array.isArray(state)) {
      let state2 = [...state]
      let cardOneId = false; let filledOne = false
      let cardTwoId = false; let filledTwo = false

      //Validating every key from each object
      state2.forEach(object => {
        Object.keys(object).forEach(key => {
          //if does not exist id and value is empty or to small according to length, will return error
          if (!object.id && (!object[key].value || (object[key].length ? Array.from(object[key].value).length < object[key].length : false))) {
            valid = false
            if (setError && !object.id) object[key].error = true
          }
        })
      })

      if (setError) setState(state2)
      //Separating the structure of each saved card to validate whether it was chosen with ids or filling fields
      if (state2[0].id) cardOneId = true; if (state2[0].filled) filledOne = true
      if (state2[1].id) cardTwoId = true; if (state2[1].filled) filledTwo = true
      if (cardOneId && cardTwoId) valid = true
      if (filledOne && filledTwo) return valid
      else return false

    } else {
      //If state is not an array
      let state2 = { ...state }

      //Validating every key from each object
      Object.keys(state).forEach(item => {
        //if does not exist id and value is empty or to small according to length, will return error
        if (!state[item].value || (state[item].length ? Array.from(state[item].value).length < state[item].length : false)) {
          valid = false

          if (setError && !state.id) state2[item].error = true
        }
      })

      if (setError) setState(state2)
      //Separating the structure of each saved state to validate whether it was chosen with ids or filling fields
      if (state.id) valid = true
      if (state.filled) return valid
      else return false
    }
  }

  //Mounting return from address selected or filled in address section to confirmation section
  const getAddress = () => {
    if (address.filled) {
      //If it has addressObj, it means it was chosen
      if (address.addressObj) {
        return address.addressObj.zip_code + ' - ' + address.addressObj.line_1
      }
      //Else it means that was filled
      if (address.zip_code.value && address.number.value && address.nbhd.value && address.street.value) {
        return address.zip_code.value + ' - ' + address.number.value + ', ' + address.nbhd.value + ', ' + address.street.value
      }
    }
  }

  return (
    <Container>
      <div className="box" ref={contentRef}>
        <div className="row">

          <div className="col-lg-9 col-12 p-4 divider">
            <p className='dash-title'>Dados do pagamento</p>
            <hr />

            {/* --------------------------Address-Section-------------------------- */}
            <div className="accordion" id="accordionExample">
              <div>
                <h2 className="accordion-header" id="headingOne">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                    {verifyData(address, false)
                      ? <span className='status-payment bg-success' />
                      : <span className='status-payment bg-error' />}
                    <span>Endereço de entrega</span>
                    {/* {errors.address && <span className='small ms-2' style={{ color: '#DC3545' }}>Verifique todos os campos!</span>} */}
                  </button>
                </h2>
                <div id="collapseOne" className='accordion-collapse collapsing' aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <Addresses address={address} setAddress={setAddress} />
                  </div>
                </div>
                <hr />
              </div>

              {/* --------------------------Payment-Section-------------------------- */}
              <div>
                <h2 className="accordion-header" id="headingTwo">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                    {(method === 'credit_card' || method === 'debit_card' || method === 'multi_payment') && (verifyData(card, false)
                      ? <span className='status-payment bg-success' />
                      : <span className='status-payment bg-error' />
                    )}
                    {(method !== 'credit_card' && method !== 'debit_card' && method !== 'multi_payment') && (method !== ''
                      ? <span className='status-payment bg-success' />
                      : <span className='status-payment bg-error' />
                    )}
                    <span>Formas de pagamento</span>
                    {/* {errors.payment && <span className='small ms-2' style={{ color: '#DC3545' }}>Verifique todos os campos!</span>} */}
                  </button>
                </h2>
                <div id="collapseTwo" className='accordion-collapse collapse show' aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <Methods card={card} setCard={setCard} method={method} setMethod={setMethod} total={total} pendent={pendent} setPendent={setPendent} setInterest={setInterest} />
                  </div>
                </div>
              </div>
              <hr />

              {/* --------------------------Group-Section-------------------------- */}
              <div>
                <h2 className="accordion-header" id="headingThree">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    {verifyData(user, false)
                      ? <span className='status-payment bg-success' />
                      : <span className='status-payment bg-error' />}
                    <span>Dados Gerais</span>
                    {/* {errors.user && <span className='small ms-2' style={{ color: '#DC3545' }}>Verifique todos os campos!</span>} */}
                  </button>
                </h2>
                <div id="collapseThree" className='accordion-collapse collapsing' aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <UserData user={user} setUser={setUser} setCart={setCartItems} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* --------------------------Products-Section-------------------------- */}
          <div className='d-flex align-content-between flex-wrap col-lg-3 p-4'>
            <div className='w-100'>
              <p className='bold'>Produtos do carrinho</p>
              <div className="cart-section">
                {!loadingShipping ?
                  cartItems.map(item => (
                    <div className='product m-auto mt-3' key={item.id} style={{ maxWidth: 350, minWidth: 200 }}>
                      <div className="d-flex flex-wrap">
                        <div className="col-6">
                          <div className="position-relative" style={{ maxWidth: 150 }}>
                            <img src={`${STORAGE_URL + item.thumb}`} className='img-fluid' alt="product" />
                            {item.discount &&
                              <div className='sale'>
                                <p className='h6'>{item.discount}%</p>
                              </div>}
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-content-between flex-wrap h-100">
                            <div className='w-100'>
                              <p>{item.name}</p>
                              <p className='small m-auto'>{item.description}</p>
                            </div>
                            <div className="w-100">
                              {/* <p className='bold'>{moneyMask(item.price)} x {item.quantity}Un</p> */}

                              <div className='mx-2 align-self-start'>
                                {item.discount ?
                                  <>
                                    <p className='bold'>
                                      <del>{moneyMask(item.price)}</del>
                                    </p>
                                    <p style={{ color: '#DC3545', fontWeight: 'bold' }}>
                                      {moneyMask(item.price - (item.price * (item.discount / 100)))}
                                    </p>
                                  </>
                                  : <p className='bold'>
                                    {moneyMask(item.price)}
                                  </p>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                  : <Skeleton className='product' variant="rectangular" height={100} />}
              </div>
            </div>

            {/* --------------------------Shipping-Section-------------------------- */}
            <div className='row'>
              {!loadingShipping ?
                <>
                  <div className="row">
                    <p className='bolder'>Endereço de entrega:</p>
                    <p className='small'>{getAddress() ?? 'Sem endereço de entrega'}</p>
                  </div>
                  <div className="row">
                    {shippingsTotal.map(item => (
                      <p className='small' key={item.id}>{item.description}: {moneyMask(item.amount)}</p>
                    ))}
                  </div>
                </>
                :
                <div className="row">
                  <Skeleton className='rounded' variant="rectangular" />
                  <Skeleton className='rounded col-6 mt-2' variant="rectangular" height={20} />
                </div>}

              {/* --------------------------Total-Section-------------------------- */}
              {!loadingShipping ?
                <>
                  <div className="mt-3">
                    <p className='bolder'>Produtos + frete: </p>
                    <p>{moneyMask(total)}</p>
                  </div>

                  {/* --------------------------Interest-Section-------------------------- */}
                  {card && Array.isArray(card) &&
                    <div className='row mt-3'>
                      <p className='bolder'>Créditos: </p>
                      {card.map((item, index) => (
                        <p key={index}>{moneyMask(item.amount.value)} + {moneyMask(item.installments.interest)}</p>))}
                      <p>Em pendente: {moneyMask(total - (Number(card[0].amount.value) + Number(card[1].amount.value)))}</p>
                    </div>
                  }
                  {card && !Array.isArray(card) && <div className="row my-2">
                    <p className='bolder'>Créditos: </p>
                    <p>{moneyMask(total)} + {moneyMask(interest)}</p>
                  </div>
                  }

                  <div className="my-3 lead" style={{ fontWeight: 'bold' }}>
                    {method !== 'credit_card' && method !== 'multi_payment'
                      ? <p style={{ fontSize: 24 }}>Total: {moneyMask(total)}</p>
                      : <p style={{ fontSize: 24 }}>Total: {moneyMask((Array.isArray(card) ? card[0].installments.interest + card[1].installments.interest + total : total + interest))}</p>
                    }
                  </div>
                </>
                : <div className="row my-3">
                  <Skeleton className='rounded' variant="rectangular" />
                  <Skeleton className='rounded col-6 mt-2' variant="rectangular" height={20} />

                  <Skeleton className='rounded mt-4' variant="rectangular" height={30} />
                </div>}
              <hr />

              {/* --------------------------Button-Section-------------------------- */}
              <div className='d-flex justify-content-end mt-3'>
                <LoadingButton variant='contained' loading={loadingSave} onClick={handleSave} loadingPosition="end" endIcon={<MdCheck />}>Finalizar</LoadingButton>
              </div>
            </div>
          </div>

          {charge && <ChargeModal charge={charge} method={method} />}
        </div>
      </div>
    </Container>
  )
}

export default PaymentScreen