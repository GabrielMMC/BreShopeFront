import React from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { GET_FETCH, MOUNT_FORM_DATA, PATCH_FETCH_FORMDATA, POST_FETCH_FORMDATA, SEED_STATE, URL } from "../../../variables";
import Input from "../Form/Input";
import SavePreset from "../Form/SavePreset";

const Breshop = () => {
  const [loading, setLoading] = React.useState(false)
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [edit, setEdit] = React.useState(false)
  const [id, setId] = React.useState(false)
  const token = useSelector(state => state.AppReducer.token);

  const [breshop, setBreshop] = React.useState({
    name: { label: 'Nome', value: "", error: false, col: 'col-sm-12', type: 'text' },
    description: { label: 'Descrição', value: "", error: false, col: 'col-sm-12', type: 'multiline', },
    file: { label: 'Imagem*', value: "", error: false, col: 'col-sm-12', type: 'file', url: '' },
  });

  React.useEffect(() => {
    // getData()
  }, [])

  async function getData() {
    let response = await GET_FETCH({ url: `get_user_data`, token })
    if (response.status) {
      console.log('resp', response)
      let userData = response.breshop

      let editData = SEED_STATE({ state: breshop, respState: userData, setState: setBreshop, setId })
      if (editData) setEdit(true)
    }

    setLoading(false)
  }

  async function save(type) {
    setLoadingSave(true)
    let body = mountBody()
    let response

    if (type === 'update') PATCH_FETCH_FORMDATA({ url: 'update_breshop', body, token })
    else if (type === 'add') response = await POST_FETCH_FORMDATA({ url: `${URL}api/store_breshop`, body, token })

    if (response) setLoadingSave(false)
  }

  function mountBody() {
    let formBody = MOUNT_FORM_DATA({ form: [breshop], id })
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
        <div className="row my-5">
          <Typography variant='h6'>Dados da sua Loja</Typography>
          {renderInput(breshop, setBreshop)}
        </div>

        <SavePreset save={(e) => save(e)} loading={loadingSave} edit={edit} />
      </> : <div className="d-flex justify-content-center p-5"><CircularProgress /></div>}
    </div>
  );
};

export default Breshop;
