import React from "react";
import { Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { URL } from "../../../variables";
import Input from "../Form/Input";

const Breshop = () => {
  const [edit, setEdit] = React.useState(false)
  const [state, setState] = React.useState({
    name: { label: 'Nome', value: "", error: false, col: 'col-6', type: 'text' },
    description: { label: 'Descrição', value: "", error: false, col: 'col-12', type: 'multiline', },
    file: { value: '', url: '', type: 'file' },
  });
  const [error, setError] = React.useState(false)
  const token = useSelector((state) => state.AppReducer.token);

  React.useEffect(() => {
    fetch(`${URL}api/get_breshop`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(async (response) => {
      let resp = await response.json();
      console.log("json", resp);
    });
  }, []);

  function renderInputs() {
    let keys = { ...state }
    keys = Object.keys(keys)

    return keys.map(item => (
      <div key={state[item].label} className={`${state[item].col} col-12 my-2 justify-content-center`}>
        <Input state={state} setState={(e) => setState(e)} item={item} edit={edit} />
      </div>
    ))
  }

  function storeShop() {
    let data = new FormData()
    data.append('name', state.name.value)
    data.append('description', state.description.value)
    data.append('file', state.file.file)

    console.log('caiu')

    fetch(`${URL}api/store_breshop`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: data
    }
    ).then(async (response) => {
      const resp = response.json()
      console.log('json', resp)
    })
  }

  function validate() {
    // const state2 = { ...state }
    // const keys = Object.keys(state2)
    // keys.forEach(item => {
    //   if (state2[item].value === '') state2[item].error = true
    // })
    // setState(state2)

    // keys.forEach(item => {
    //   if (state[item].error === true) {
    //     setError(true)
    //   } else {
    //     setError(false)
    //   }
    // })

    // if (!error) 
    storeShop()
  }

  const debounce = (func, wait) => {
    let timeout;

    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
        console.log('args', ...args)
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  function returnedFunction(e) {
    debounce(function () {
      console.log('ativou')
      // setState({...state, teste: e.target.value})
    }, 500);
  }

  return (
    <div className="row mx-3">
      <div className="card m-auto" style={{ maxWidth: 800 }}>
        <div className="card-body" style={{ minHeight: "75vh" }}>
          <div className="p-5">
            <Typography variant='h5'>CADASTRE SUA LOJA</Typography>
          </div>

          {/* ------------------------------Render inputs function------------------------------ */}
          {renderInputs()}

          <div className="col-12 mt-3">
            <img style={{ width: '100%', height: 200, borderRadius: 5 }} src={state.file ? state.file.url : `${URL}storage/fotos/no_banner.png`} alt='banner'></img>
          </div>

          <div className="d-flex justify-content-end mt-5">
            <Button variant="contained" onClick={validate}>Salvar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breshop;
