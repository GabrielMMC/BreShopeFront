import React from 'react';
import debit_card from '../../../assets/debit_card.png';
import boleto from '../../../assets/boleto.png';
import pix from '../../../assets/qr-code.png';
import credit_card from '../../../assets/discover.png';
import { Typography, CircularProgress } from '@mui/material';
import CardsModal from './CardsModal'
import { useSelector } from 'react-redux';
import './styles.css';
import { GET_FETCH } from '../../../variables';
import { moneyMask } from '../../utilities/masks/currency';
import Container from '../Container';
import Input from '../../routes/Form/Input';

const PaymentScreen = () => {
  const [total, setTotal] = React.useState('');
  const [addresses, setAddresses] = React.useState('');
  const [condominiuns, setCondominiuns] = React.useState('');
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [payment, setPayment] = React.useState({ method: '', body: '' });
  const [cartItems, setCartItems] = React.useState(
    useSelector((state) => state.AppReducer.cart_items)
  );
  const token = useSelector((state) => state.AppReducer.token);

  const fillMonth = ['01', '02', '03', '04', '05', '06', '07', '09', '10', '11', '12']
  const fillYear = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033']

  const [card, setCard] = React.useState({
    id: { value: "", type: 'text', hidden: true },
    holder_document: { label: 'CPF do Títular*', value: "", error: false, col: 'col-sm-6', type: 'cpf', mask: '' },
    number: { label: 'Número*', value: "", error: false, col: 'col-sm-6', type: 'card', mask: '', length: 16 },
    brand: { label: 'Bandeira*', value: "visa", error: false, col: 'col-sm-12', type: 'text', hidden: true },
    exp_month: { label: 'Mês*', value: "01", error: false, col: 'col-sm-4', type: 'select', fillOption: fillMonth },
    exp_year: { label: 'Ano*', value: "2023", error: false, col: 'col-sm-4', type: 'select', fillOption: fillYear },
    cvv: { label: 'CVV*', value: "", error: false, col: 'col-sm-4', type: 'number', length: 3 },
    holder_name: { label: 'Nome do Títular*', value: "", error: false, col: 'col-sm-12', type: 'text', },
  })

  const [address, setAddress] = React.useState({
    id: { value: "", type: 'text', hidden: true },
    zip_code: { label: 'CEP*', value: "", error: false, col: 'col-sm-6', type: 'cep' },
    state: { label: 'Estado*', value: "", error: false, col: 'col-sm-6', type: 'text', },
    city: { label: 'Cidade*', value: "", error: false, col: 'col-sm-12', type: 'text' },
    nbhd: { label: 'Bairro*', value: "", error: false, col: 'col-sm-4', type: 'text' },
    street: { label: 'Rua*', value: "", error: false, col: 'col-sm-4', type: 'text', },
    number: { label: 'Número*', value: "", error: false, col: 'col-sm-4', type: 'number' },
  })

  const [user, setUser] = React.useState({
    id: { value: "", type: 'date', hidden: true },
    birthdate: { label: 'Data de Nascimento*', value: "", error: false, col: 'col-sm-4', type: 'date', date: '' },
    gender: { label: 'Gênero*', value: "male", error: false, col: 'col-sm-4', type: 'select', fillOption: ['male', 'female'] },
    document: { label: 'CPF*', value: "", error: false, col: 'col-sm-4', type: 'cpf', mask: '' },
  })

  const [phone, setPhone] = React.useState({
    number: { label: 'Número*', value: "", error: false, col: 'col-sm-12', type: 'phone+', mask: '' },
    area_code: { value: "", hidden: true },
  })

  React.useEffect(() => {
    let tt = 0;
    cartItems &&
      cartItems.forEach((item) => {
        tt += item.price * (100 - item.discount_price) * item.quantity;
      });

    getAddresses(); setTotal(tt);
  }, []);

  const getAddresses = async () => {
    const response = await GET_FETCH({ url: `list_addresses?page=1`, token });
    console.log('addreses', response)
    if (response.status) setAddresses(response.addresses.data);
  };

  const handleSave = async () => {
    let items = [];
    cartItems.forEach((item) => {
      items = [
        ...items,
        {
          code: item.id,
          description: item.description,
          amount: item.price * (100 - item.discount_price),
          quantity: item.quantity,
        },
      ];
    });

    console.log('items', items);
  };

  const clearFields = () => {
    setPayment({ ...payment, body: '' });
  };

  function renderInput(state, setState) {
    let keys = { ...state }
    keys = Object.keys(keys)

    return keys.map((item, index) => (
      <div key={index} className={`${state[item].col} col-12 my-2 justify-content-center`}>
        <Input state={state} setState={setState} item={item} />
      </div>
    ))
  }

  return (
    <>
      <Container>
        <div className="row">
          <div className="col-9 p-4" style={{ borderRight: '5px solid #E8E8E8' }}>
            <p className="display-6">Dados do pagamento</p>
            <hr />

            {/* --------------------------Group-Section-------------------------- */}
            <div className="accordion" id="accordionExample">
              <div>
                <h2 className="accordion-header" id="headingOne">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <Typography>Endereço de entrega</Typography>
                  </button>
                </h2>
                <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    {/* --------------------------Address-Section-------------------------- */}
                    <div className="row">
                      {addresses ? (
                        addresses.map((item) => (
                          <div key={item.id} className="col-12 d-flex mb-3 p-3 bg-gray rounded ms-1">
                            <div className="me-3">
                              <Typography>{item.country} - {item.city} - {item.state}</Typography>
                              <Typography>{item.zip_code} - {item.line_1}</Typography>
                            </div>

                            <div className="ms-auto align-self-center">
                              <input type="radio" name="address" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="d-flex justify-content-center p-5">
                          <CircularProgress color="inherit" />
                        </div>
                      )}
                    </div>

                    <div className='mt-5'>
                      <Typography className='ms-1'>Selecione um endereço ou cadastre um agora!</Typography>
                      <div className='anime-left row'>{renderInput(address, setAddress)}</div>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>


              <div>
                <h2 className="accordion-header" id="headingTwo">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    <Typography>Formas de pagamento</Typography>
                  </button>
                </h2>
                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    {/* --------------------------Payment-Section-------------------------- */}
                    <form className="d-flex justify-content-around mt-2">
                      <div className="form-check">
                        <div className="d-flex m-auto" style={{ width: 50, height: 50 }}>
                          <img src={debit_card} alt="debit_card" className="img-fluid ms-1" htmlFor="debit" />
                        </div>
                        <label htmlFor="debit">Débito</label>
                        <input className="ms-2" id="debit" type="radio" name="defaultRadio" onChange={() => setPayment({ method: 'debit_card', body: '' })} />
                      </div>

                      <div className="form-check">
                        <div className="d-flex m-auto" style={{ width: 50, height: 50 }}>
                          <img src={boleto} alt="debit_card" className="img-fluid ms-1" htmlFor="boleto" />
                        </div>
                        <label htmlFor="boleto">Boleto</label>
                        <input className="ms-2" id="boleto" type="radio" name="defaultRadio" onChange={() => setPayment({ method: 'boleto', body: '' })} />
                      </div>

                      <div className="form-check">
                        <div className="d-flex m-auto" style={{ width: 50, height: 50 }}>
                          <img src={credit_card} alt="debit_card" className="img-fluid ms-1" htmlFor="credit" />
                        </div>
                        <label htmlFor="credit">Crédito</label>
                        <input className="ms-2" id="credit" type="radio" name="defaultRadio" onChange={() => setPayment({ method: 'credit_card', body: '' })} />
                      </div>

                      <div className="form-check">
                        <div className="d-flex m-auto" style={{ width: 50, height: 50 }}>
                          <img src={pix} alt="debit_card" className="img-fluid ms-1" htmlFor="pix" />
                        </div>
                        <label htmlFor="pix">Pix</label>
                        <input className="ms-2" id="pix" type="radio" name="defaultRadio" onChange={() => setPayment({ method: 'pix', body: '' })} />
                      </div>
                    </form>

                    {payment.method === 'credit_card' && (
                      <div className='mt-5'>
                        <div className="d-flex"><CardsModal /><Typography className='ms-1'> ou adicione um agora!</Typography></div>
                        <div className='anime-left row'>{renderInput(card, setCard)}</div>
                      </div>
                    )}
                  </div>
                  <hr />
                </div>


              </div>
              <div>
                <h2 className="accordion-header" id="headingThree">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                    <Typography>Dados Gerais</Typography>
                  </button>
                </h2>
                <div id="collapseThree" className="accordion-collapse collapse show" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <div className="row">
                      {renderInput(user, setUser)}
                    </div>
                    {renderInput(phone, setPhone)}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* --------------------------Products-Section-------------------------- */}
          <div className="d-flex align-content-between flex-wrap col-3 p-4">
            <div>
              <Typography>Produtos do carrinho</Typography>
              {cartItems &&
                cartItems.map((item) => (
                  <div className="product" key={item.id}>
                    <div className="d-flex">
                      <div className="rounded" style={{ width: '40%', height: '40%' }}>
                        <img src={JSON.parse(item.images)[0]} className="img-fluid" alt="product" />
                      </div>
                      <span className="small m-auto">{item.description}</span>
                    </div>

                    <div className="d-flex justify-content-around">
                      <span className="small">{item.name}</span>
                      <span className="small">{moneyMask(item.price * (100 - item.discount_price))}</span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="ms-auto d-flex">
              <p className="m-auto">Total: {moneyMask(total)}</p>
              <button style={{ cursor: 'pointer', padding: '1rem 2rem', flexGrow: '0', flexBasis: '1rem', }} className="normal-archor special ms-auto" disabled={loadingSave} onClick={handleSave}>
                {loadingSave ? (<CircularProgress size={20} color="inherit" />) : ('Finalizar')}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default PaymentScreen;
