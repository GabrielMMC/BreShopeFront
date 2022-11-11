import React from 'react'
import Container from '../Container'
import StepperMUI from '../Stepper'
import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { useNavigate, useParams } from 'react-router-dom'
import PayData from './PayData'
import Confirm from './Confirm'
import Adress from './Adress'
import { MOUNT_JSON_BODY, POST_FETCH, URL } from '../../../variables'
import { useSelector } from 'react-redux'

const Paymant = () => {
  const [page, setPage] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const history = useNavigate();
  const params = useParams();
  const token = useSelector(state => state.AppReducer.token);
  const steps = ['Dados de entrega', 'Informações de pagamento', 'Confirmação']

  const [adress, setAdress] = React.useState({
    cep: { label: 'CEP*', value: "", error: false, col: 'col-sm-6', type: 'cep' },
    state: { label: 'Estado*', value: "", error: false, col: 'col-sm-6', type: 'text', },
    city: { label: 'Cidade*', value: "", error: false, col: 'col-sm-4', type: 'text' },
    street: { label: 'Rua*', value: "", error: false, col: 'col-sm-4', type: 'text', },
    number: { label: 'Número*', value: "", error: false, col: 'col-sm-4', type: 'number' },
  })

  const fillOption = ['1x - 20,99', '2x - 10,99', '3x - 7,99', '4x - 5,99']
  const [paymant, setPaymant] = React.useState({
    name: { label: 'Nome impresso no cartão*', value: "", error: false, col: 'col-sm-6', type: 'text' },
    number: { label: 'Número*', value: "", error: false, col: 'col-sm-6', type: 'number', },
    validity: { label: 'Validade*', value: "", error: false, col: 'col-sm-4', type: 'number' },
    cvv: { label: 'CVV*', value: "", error: false, col: 'col-sm-4', type: 'number', },
    date: { label: 'Data de nascimento*', value: "", error: false, col: 'col-sm-4', type: 'number' },
    cpf: { label: 'CPF do títular*', value: "", error: false, col: 'col-sm-6', type: 'number' },
    paymant: { label: 'Forma de pagamento*', value: "", error: false, col: 'col-sm-6', type: 'select', fillOption },
  })

  function verifyPage(action) {
    if (action === 'prev') {
      if (page > 0) {
        setPage(page - 1)
      } else {
        history(`/product/${params.id}`)
      }
    }
    if (action === 'next') {
      if (page < 2) {
        setPage(page + 1)
      } else {
        sendData()
      }
    }
  }

  async function sendData() {
    let adr = MOUNT_JSON_BODY({ form: adress })
    let pay = MOUNT_JSON_BODY({ form: paymant })
    let body = { adress: { ...adr }, paymant: { ...pay } }
    let transition = await POST_FETCH({ url: `${URL}api/store_order`, body, token })
    console.log('transition', transition)
  }

  function renderPage() {
    switch (page) {
      case 0:
        return <Adress form={adress} setForm={(e) => setAdress(e)} />

      case 1:
        return <PayData form={paymant} setForm={(e) => setPaymant(e)} />

      case 2:
        return <Confirm />

      default:
        return null
    }
  }

  return (
    <Container>
      <StepperMUI steps={steps} page={page} />
      <div className="row">
        {renderPage()}
      </div>
      <div className="d-flex mt-5">
        <div className="align-self-center">
          <Button variant='contained' size='large' onClick={() => verifyPage('prev')} startIcon={<ReplyAllIcon />}>Voltar</Button>
        </div>
        <div className="align-self-center ms-auto">
          <LoadingButton variant='contained' size='large' loading={loading} onClick={() => verifyPage('next')} loadingPosition="end" endIcon={<SaveIcon />}>{page === 2 ? 'Concluir' : 'Próximo'}</LoadingButton>
        </div>
      </div>
    </Container >
  )
}

export default Paymant