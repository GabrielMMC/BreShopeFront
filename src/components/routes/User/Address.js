import React from 'react'
import { CircularProgress, IconButton, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { DELETE_FETCH, GET_FETCH, MOUNT_JSON_BODY, POST_FETCH, PUT_FETCH, SEED_STATE, URL, VALIDATE } from '../../../variables'
import Input from '../Form/Input'
import SavePreset from '../Form/SavePreset'
import { MdEdit, MdClose, MdAdd } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { renderAlert, renderToast, ToastContent } from '../../utilities/Alerts'

const Address = () => {
  const [loading, setLoading] = React.useState(true)
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [id, setId] = React.useState(false)
  const [data, setData] = React.useState('')
  const [edit, setEdit] = React.useState('')
  const [add, setAdd] = React.useState(false)
  const token = useSelector(state => state.AppReducer.token);

  const [address, setAddress] = React.useState({
    zip_code: { label: 'CEP*', value: "", error: false, col: 'col-sm-6', type: 'cep' },
    state: { label: 'Estado*', value: "", error: false, col: 'col-sm-6', type: 'text', },
    city: { label: 'Cidade*', value: "", error: false, col: 'col-sm-12', type: 'text' },
    nbhd: { label: 'Bairro*', value: "", error: false, col: 'col-sm-4', type: 'text' },
    street: { label: 'Rua*', value: "", error: false, col: 'col-sm-4', type: 'text', },
    number: { label: 'Número*', value: "", error: false, col: 'col-sm-4', type: 'number' },
  })

  React.useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    let response = await GET_FETCH({ url: `list_addresses/?page=${1}`, token })
    console.log('caiu', response)
    // if (response.user) {
    setData(response.addresses.data)

    // let editAddress = SEED_STATE({ state: data, respState: response.addresses.data, setState: setData, setId })

    // if (editAddress) setEdit(true)
    // }
    setLoading(false)
  }

  async function handleSave(type) {
    let validation = VALIDATE({ state: address, setState: setAddress })
    let body = MOUNT_JSON_BODY({ form: address, id })
    let response

    if (validation) {
      setLoadingSave(true)
      if (type === 'update') response = await PUT_FETCH({ url: 'update_user_address', body, token });
      else if (type === 'add') response = await POST_FETCH({ url: `${URL}api/store_user_address`, body, token });
      if (response) setLoadingSave(false)
    }
  }

  function renderInput(state, setState) {
    let keys = { ...state }
    keys = Object.keys(keys)

    return keys.map(item => (
      <div key={state[item].label} className={`${state[item].col} col-12 my-2 justify-content-center`}>
        <Input state={state} setState={setState} item={item} />
      </div>
    ))
  }

  const handleDelete = async (id) => {
    let response = await DELETE_FETCH({ url: `delete_address/${id}`, token })
    if (response.status) {
      let newData = data.filter(item => item.id !== id)
      setData(newData)
    } else renderToast({ type: 'error', error: 'Erro ao deletar endereço, tente novamente mais tarde' })
    console.log('teste', response)
  }

  return (
    <>
      <div className="content mt-5 m-auto">
        {!loading ? <>
          <div className="row my-5">
            <div className="d-flex align-items-center">
              <Typography variant='h6'>Adicionar Endereço</Typography>
              <button onClick={() => setAdd(!add)} className='rounded-button hvr-grow ms-2 d-flex align-items-center justify-content-center'>
                {add ? <FaTrash size={15} /> : <MdAdd size={20} />}
              </button>
            </div>
            {add && <div className='anime-left row'>{renderInput(address, setAddress)}</div>}
            {!add && <div className='anime-right mt-2'><Typography>Cadastre endereços para começar!</Typography></div>}
          </div>
        </> : <div className="d-flex justify-content-center p-5"><CircularProgress /></div>}

        <Typography variant='h6'>Endereços</Typography>
        <div className="d-flex">
          {data ? data.map(item => (
            <div className='d-flex mb-3 p-3 bg-gray rounded'>
              <div className='me-3'>
                <Typography>{item.country} - {item.city} - {item.state}</Typography>
                <Typography>{item.zip_code} - {item.line_1}</Typography>
              </div>
              <div className="ms-auto">
                <IconButton><MdEdit /></IconButton>
                <IconButton onClick={() => renderAlert({ id: item.id, deleteFunction: handleDelete, item: 'endereço', article: 'o' })}><MdClose />
                </IconButton>
              </div>
            </div>
          )) :
            <Typography>Sem endereços cadastrados</Typography>}
        </div>
        <SavePreset save={(e) => handleSave(e)} loading={loadingSave} edit={edit} />
      </div >
      <ToastContent />
    </>
  )
}

export default Address