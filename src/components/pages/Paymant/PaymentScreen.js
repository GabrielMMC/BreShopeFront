import React from 'react'
import debit_card from '../../../../../assets/debit_card.png'
import boleto from '../../../../../assets/boleto.png'
import pix from '../../../../../assets/qr-code.png'
import credit_card from '../../../../../assets/discover.png'
import Navbar from 'pages/Guest/IndexPage/Navbar'
import { Typography, CircularProgress } from '@mui/material'
import { API_URL } from 'utils/variables'
import { get } from 'utils/requests'
import CardsModal from './CardsModal'
import { useSelector } from 'react-redux'
import { moneyMask } from 'utils/masks/currency'
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import './styles.css'

const PaymentScreen = () => {
 const [total, setTotal] = React.useState('')
 const [addresses, setAddresses] = React.useState('')
 const [condominiuns, setCondominiuns] = React.useState('')
 const [loadingSave, setLoadingSave] = React.useState(false)
 const [payment, setPayment] = React.useState({ method: '', body: '' })
 const [cartItems, setCartItems] = React.useState(useSelector(state => state.AppReducer.cart_items))

 React.useEffect(() => {
  let tt = 0
  cartItems.forEach(item => { tt += item.price * (100 - item.discount_price) * item.quantity })

  getAddresses(); getCondominiuns(); setTotal(tt)
 }, [])

 const getAddresses = async () => {
  const response = await get(`${API_URL}/addresses`)
  if (response.status) setAddresses(response.addresses)
 }

 const getCondominiuns = async () => {
  const response = await get(`${API_URL}/admin/condominium`)
  if (response.condominium) setCondominiuns(response.condominium)
 }

 const handleSave = async () => {
  let items = []
  cartItems.forEach(item => {
   items = [...items, { code: item.id, description: item.description, amount: item.price * (100 - item.discount_price), quantity: item.quantity }]
  })

  console.log('items', items)
 }

 const clearFields = () => { setPayment({ ...payment, body: '' }) }

 return (
  <>
   <div className="content">
    <Navbar />
    <div className="container">
     <div className="row">

      <div className="col-9 p-3" style={{ borderRight: '5px solid #E8E8E8' }}>
       <p className='display-6'>Dados do pagamento</p>
       <hr />
       {/* --------------------------Address-Section-------------------------- */}
       <div>
        <Typography>Endereço de entrega</Typography>
        <div className="row">
         {addresses ? addresses.map((item) => (
          <div key={item.id} className="col-12 d-flex mb-3 p-3 bg-gray rounded">
           <div className="me-3">
            <Typography>{item.country} - {item.city} - {item.state}</Typography>
            <Typography>{item.zip_code} - {item.line_1}</Typography>
           </div>

           <div className="ms-auto align-self-center">
            <input type="radio" name='address' />
           </div>
          </div>
         )
         ) : <div className="d-flex justify-content-center p-5"><CircularProgress color='inherit' /></div>}
        </div>
       </div>
       <hr />

       {/* --------------------------Payment-Section-------------------------- */}
       <div>
        <Typography>Formas de pagamento</Typography>
        <form className="d-flex justify-content-around mt-2">
         <div className="form-check">
          <div className='d-flex m-auto' style={{ width: 50, height: 50 }}>
           <img src={debit_card} alt="debit_card" className="img-fluid ms-1" htmlFor='debit' />
          </div>
          <label htmlFor="debit">Débito</label>
          <input className='ms-2' id='debit' type="radio" name='defaultRadio' onChange={() => setPayment({ method: 'debit_card', body: '' })} />
         </div>

         <div className="form-check">
          <div className='d-flex m-auto' style={{ width: 50, height: 50 }}>
           <img src={boleto} alt="debit_card" className="img-fluid ms-1" htmlFor='boleto' />
          </div>
          <label htmlFor="boleto">Boleto</label>
          <input className='ms-2' id='boleto' type="radio" name='defaultRadio' onChange={() => setPayment({ method: 'boleto', body: '' })} />
         </div>

         <div className="form-check">
          <div className='d-flex m-auto' style={{ width: 50, height: 50 }}>
           <img src={credit_card} alt="debit_card" className="img-fluid ms-1" htmlFor='credit' />
          </div>
          <label htmlFor="credit">Crédito</label>
          <input className='ms-2' id='credit' type="radio" name='defaultRadio' onChange={() => setPayment({ method: 'credit_card', body: '' })} />
         </div>

         <div className="form-check">
          <div className='d-flex m-auto' style={{ width: 50, height: 50 }}>
           <img src={pix} alt="debit_card" className="img-fluid ms-1" htmlFor='pix' />
          </div>
          <label htmlFor="pix">Pix</label>
          <input className='ms-2' id='pix' type="radio" name='defaultRadio' onChange={() => setPayment({ method: 'pix', body: '' })} />
         </div>
        </form>

        {payment.method === 'credit_card' &&
         <div className="d-flex align-items-center">
          <Typography><CardsModal /> ou adicione um agora!</Typography>
         </div>
        }
       </div>
       <hr />

       {/* --------------------------Group-Section-------------------------- */}
       <div>
        <Typography>Informações sobre o grupo</Typography>
        <div className="row">
         <div className="col-4">
          <div className="form-floating">
           <select className="form-control" id="group" type="text" required>
            {condominiuns
             ? <option hidden value={condominiuns[0].id}>{condominiuns[0].condominium}</option>
             : <option>Sem grupos disponíveis</option>
            }

            {condominiuns && condominiuns.map(item => (<option key={item.id} value={item.id}>{item.condominium}</option>))}
           </select>
           <label htmlFor="group">Grupos*</label>
          </div>
         </div>

         <div className="col-4">
          <div className="form-floating">
           <input className="form-control" id="name" type="text" required />
           <label htmlFor="name">Nome Completo*</label>
          </div>
         </div>

         <div className="col-4">
          <div className="form-floating">
           <input className="form-control" id="name" type="text" required />
           <label htmlFor="name">Contato*</label>
          </div>
         </div>
        </div>


       </div>
      </div>

      {/* --------------------------Products-Section-------------------------- */}
      <div class="d-flex align-content-between flex-wrap col-3 p-3">
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

     </div>
    </div>
   </div>
  </>
 )
}

export default PaymentScreen