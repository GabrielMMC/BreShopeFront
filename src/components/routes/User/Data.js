import React from 'react'
import Input from '../Form/Input'
import { useSelector } from 'react-redux'
import SavePreset from '../Form/SavePreset'
import { CircularProgress, Divider, Typography } from '@mui/material'
import { GET_FETCH, MOUNT_FORM_DATA, PATCH_FETCH_FORMDATA, POST_FETCH_FORMDATA, SEED_STATE, URL } from '../../../variables'

const Data = () => {
  const [loading, setLoading] = React.useState(true)
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [edit, setEdit] = React.useState(false)
  const [id, setId] = React.useState(false)
  const token = useSelector(state => state.AppReducer.token);

  const [data, setData] = React.useState({
    birthdate: { label: 'Data de Nascimento*', value: "", error: false, col: 'col-sm-4', type: 'date', date: '' },
    gender: { label: 'Gênero*', value: "male", error: false, col: 'col-sm-4', type: 'select', fillOption: ['male', 'female'] },
    file: { label: 'Imagem*', value: "", error: false, col: 'col-sm-4 d-flex', type: 'file-rounded', url: '' },
    name: { label: 'Nome*', value: "", error: false, col: 'col-sm-6', type: 'text' },
    document: { label: 'CPF*', value: "", error: false, col: 'col-sm-6', type: 'cpf', mask: '' },
  })

  const [phone, setPhone] = React.useState({
    email: { label: 'Email*', value: "", error: false, col: 'col-sm-6', type: 'email' },
    number: { label: 'Número*', value: "", error: false, col: 'col-sm-6', type: 'phone+', mask: '' },
    area_code: { value: "", hidden: true },
  })

  React.useEffect(() => {
    getData()
  }, [])

  async function getData() {
    let response = await GET_FETCH({ url: `get_user_data`, token })
    let userData; let userPhone
    console.log(response)
    if (response.status) {
      userData = response.user_data
      userData = { ...userData, ...response.customer }
      userPhone = response.status ? response.customer.phones.mobile_phone : response.user_data
    }

    let editData = SEED_STATE({ state: data, respState: userData, setState: setData, setId })
    let editPhone = SEED_STATE({ state: phone, respState: [userData, userPhone], setState: setPhone })
    // if (editData && editPhone) setEdit(true)

    setLoading(false)
  }

  async function save(type) {
    setLoadingSave(false)
    let body = mountBody()
    let response

    switch (type) {
      case 'add':
        return response = await POST_FETCH_FORMDATA({ url: `${URL}api/store_user_data`, body, token })
      case 'update':
        return response = await PATCH_FETCH_FORMDATA({ url: 'update_user_data', body, token })
      default:
        return response
    }
    // setLoadingSave(false)
  }

  function mountBody() {
    let formBody = MOUNT_FORM_DATA({ form: [data, phone], id })
    return formBody
  }

  function renderInput(state, setState) {
    let keys = { ...state }
    keys = Object.keys(keys)

    return keys.map(item => (
      <div key={state[item].label} className={`${state[item].col} col-12 my-2 justify-content-center`}>
        <Input state={state} setState={(e) => setState(e)} item={item} edit={edit} />
      </div>
    ))
  }

  return (
    <div className="content mt-5 m-auto">
      {!loading ? <>
        <div className="row my-5 align-items-end">
          <Typography variant='h6'>Dados Gerais</Typography>
          {!loading && renderInput(data, setData)}
        </div>
        <Divider />
        <div className="row my-5">
          <Typography variant='h6'>Contato</Typography>
          {!loading && renderInput(phone, setPhone)}
        </div>

        <SavePreset save={(e) => save(e)} loading={loadingSave} edit={edit} />
      </> : <div className="d-flex justify-content-center p-5"><CircularProgress /></div>}
    </div>
  )
}

export default Data