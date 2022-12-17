import { CircularProgress, TextField, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { GET_FETCH, MOUNT_JSON_BODY, POST_FETCH, PUT_FETCH, SEED_STATE, URL } from '../../../variables'
import Input from '../Form/Input'
import SavePreset from '../Form/SavePreset'

const PaymantData = () => {
  const [loading, setLoading] = React.useState(false)
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [edit, setEdit] = React.useState(false)
  const [id, setId] = React.useState(false)
  const token = useSelector(state => state.AppReducer.token);

  const fillMonth = ['1', '2', '3']
  const fillYear = ['24', '25', '26']

  const [address, setAddress] = React.useState({
    holder_document: { label: 'CPF do Títular*', value: "", error: false, col: 'col-sm-6', type: 'cpf', mask: '' },
    number: { label: 'Número*', value: "", error: false, col: 'col-sm-6', type: 'card', mask: '' },
    brand: { label: 'Bandeira*', value: "visa", error: false, col: 'col-sm-12', type: 'text', hidden: true },
    exp_month: { label: 'Mês*', value: "", error: false, col: 'col-sm-4', type: 'select', fillOption: fillMonth },
    exp_year: { label: 'Ano*', value: "", error: false, col: 'col-sm-4', type: 'select', fillOption: fillYear },
    cvv: { label: 'CVV*', value: "", error: false, col: 'col-sm-4', type: 'text', length: 3 },
    holder_name: { label: 'Nome do Títular*', value: "", error: false, col: 'col-sm-12', type: 'text', },
  })

  React.useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    let response = await GET_FETCH({ url: 'list_cards', token })
    console.log('response', response)
    let card = response.cards

    let editAddress = SEED_STATE({ state: address, respState: card, setState: setAddress, setId })

    if (editAddress) setEdit(true)
    setLoading(false)
  }

  async function save(type) {
    let body = mountBody()
    let response

    if (type === 'update') response = await PUT_FETCH({ url: 'update_user_address', body, token });
    else if (type === 'add') response = await POST_FETCH({ url: `${URL}api/store_card`, body, token });

    if (response) setLoadingSave(false)
  }

  function mountBody() {
    setLoadingSave(true)
    let formBody = MOUNT_JSON_BODY({ form: address, id })
    return formBody
  }

  function renderInput(state, setState) {
    let keys = { ...state }
    keys = Object.keys(keys)

    return keys.map(item => (
      <div key={state[item].label} className={`${state[item].col} col-12 my-2 justify-content-center`}>
        <Input state={state} setState={(e) => setState(e)} item={item} />
      </div>
    ))
  }

  return (
    <div className="content mt-5 m-auto">
      {!loading ? <>
        <div className="row my-5">
          <Typography variant='h6'>Cartões Disponíveis</Typography>
          {renderInput(address, setAddress)}
        </div>

        <SavePreset save={(e) => save(e)} loading={loadingSave} edit={edit} />
      </> : <div className="d-flex justify-content-center p-5"><CircularProgress /></div>}
    </div>
  )
}

export default PaymantData