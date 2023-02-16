import React from "react";
import { API_URL } from "utils/variables";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Button, Typography, IconButton, CircularProgress, } from "@mui/material";
import { DELETE_FETCH, GET_CEP, GET_FETCH, POST_FETCH, URL } from "../../../variables";
import { useSelector } from "react-redux";

const Address = () => {
  const [loading, setLoading] = React.useState(true);
  const [loadingSave, setLoadingSave] = React.useState(false);

  const [id, setId] = React.useState("")
  const [cep, setCep] = React.useState("");
  const [nbhd, setNbhd] = React.useState("");
  const [data, setData] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [number, setNumber] = React.useState("");

  const [shippingAddress, setShippingAddress] = React.useState(false);
  const [add, setAdd] = React.useState("");
  const history = useNavigate();
  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const resp = await GET_FETCH({ url: `list_address?page=1`, token });
    setData(resp.addresses); setLoading(false); setShippingAddress(() => resp.addresses.length === 0 ? false : true)
    console.log("address", resp);
  };

  const handleAdd = () => {
    setAdd(!add); clearFields()
  };

  const handleDelete = async (id) => {
    setLoading(true)
    let response = await DELETE_FETCH(`${API_URL}/addresses/delete/${id}`)
    if (response.status) { setAdd(false); clearFields(); getData() }
    console.log('response', response, id)
    // if (response.status) {
    //   let newData = data.filter(item => item.id !== id)
    //   setData(newData)
    // } else renderToast({ type: 'error', error: 'Erro ao deletar endereço, tente novamente mais tarde' })
  };

  const handleEdit = async (item) => {
    let line = item.line_1.split(',')
    console.log('item', item)
    setAdd(true); setCep(item.zip_code.replace(/(\d{5})(\d{3})/g, '$1-$2')); setCity(item.city); setState(item.state)
    setNumber(line[0]); setNbhd(line[1]); setStreet(line[2]); setId(item.id)
  };

  const handleSave = async (e) => {
    setLoading(true); e.preventDefault();
    let response = false

    if (id) {
      response = POST_FETCH(`${API_URL}/addresses/update`, JSON.stringify({
        state, city, street, number, id, zip_code: cep, neighborhood: nbhd, shipping_address: shippingAddress
      }))
    } else {
      response = POST_FETCH(`${API_URL}/addresses/create`, JSON.stringify({
        state, city, street, number, zip_code: cep, neighborhood: nbhd, shipping_address: shippingAddress
      }))
    }

    if (response.address || !response.status) { setAdd(false); clearFields(); getData() }
    else console.log('error')
  };

  const handleCEPChange = async (value) => {
    value = value.replace(/\D/g, '')

    if (Array.from(value).length === 8) {
      const resp = await GET_CEP(value)
      setState(resp.uf); setCity(resp.localidade); setNbhd(resp.bairro); setStreet(resp.logradouro)
    }
    if (Array.from(value).length <= 8) setCep(value.replace(/(\d{5})(\d{3})/g, '$1-$2'))
  }

  const clearFields = () => { setCep(''); setCity(''); setState(''); setNumber(''); setNbhd(''); setStreet(''); setId('') }

  return (
    <>
      {!loading ? (
        <>
          <div className="row">
            <Typography className="small" style={{ fontSize: "1.2em" }}>ENDEREÇO PESSOAL</Typography>
            {data.length > 0 ? (data.map((item) => {
              let count = 0
              data.forEach(item => { if (!item.shipping_address) count += 1 })
              return (
                <>
                  {!item.shipping_address &&
                    <div key={item.id} className="col-12 d-flex mb-3 p-3 bg-gray rounded">
                      <div className="me-3">
                        <Typography>{item.country} - {item.city} - {item.state}</Typography>
                        <Typography>{item.zip_code} - {item.line_1}</Typography>
                      </div>
                      <div className="ms-auto" style={{ whiteSpace: "nowrap" }}>
                        <IconButton onClick={() => handleEdit(item)}><EditIcon /></IconButton>
                      </div>
                    </div>}
                  {count === 0 && <div><Typography>Sem endereço cadastrado</Typography></div>}
                </>
              )
            })
            ) : (<div><Typography>Sem endereço cadastrado</Typography></div>)}
          </div>

          <div className="row mt-5">
            <Typography className="small" style={{ fontSize: "1.2em" }}>ENDEREÇOS PARA ENTREGA</Typography>
            {data.length > 0 ? (data.map((item) => {
              let count = 0
              data.forEach(item => { if (item.shipping_address) count += 1 })
              return (
                <>
                  {item.shipping_address &&
                    <div key={item.id} className="col-12 d-flex mb-3 p-3 bg-gray rounded">
                      <div className="me-3">
                        <Typography>{item.country} - {item.city} - {item.state}</Typography>
                        <Typography>{item.zip_code} - {item.line_1}</Typography>
                      </div>
                      <div className="ms-auto" style={{ whiteSpace: "nowrap" }}>
                        <IconButton onClick={() => handleEdit(item)}><EditIcon /></IconButton>
                        <IconButton onClick={() => handleDelete(item.id)}><CloseIcon /></IconButton>
                      </div>
                    </div>}
                  {count === 0 && <div><Typography>Sem endereços cadastrados</Typography></div>}
                </>
              )
            })
            ) : (<div><Typography>Sem endereços cadastrados</Typography></div>)}
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-center p-5"><CircularProgress color='inherit' /></div>
      )}

      <div className="d-flex align-items-center mt-5">
        <Typography className="small" style={{ fontSize: "1.2em" }}>ADICIONAR ENDEREÇO</Typography>
        <button onClick={handleAdd} className='rounded-button hvr-grow ms-2 d-flex align-items-center justify-content-center'>
          {add ? <DeleteIcon size={15} /> : <AddIcon size={20} />}
        </button>
        {add && !id &&
          <div className='d-flex ms-auto anime-left'>
            <div className="form-check form-switch me-3">
              <input className="form-check-input" type="checkbox" role="switch" id="switch1" disabled={data.length !== 0 ? true : false} value={!shippingAddress}
                checked={!shippingAddress} readOnly />
              <label className="form-check-label" htmlFor="switch1" >Endereço próprio</label>
            </div>

            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="switch2" disabled={data.length === 0 ? true : false} value={shippingAddress}
                checked={shippingAddress} readOnly />
              <label className="form-check-label" htmlFor="switch2" >Endereço de entrega</label>
            </div>
          </div>
        }
      </div>
      {add &&
        <form className='anime-left mt-3' onSubmit={(e) => { handleSave(e) }}>
          <div className="row align-items-end">
            <div className="col-4">
              <div className="form-floating">
                <input className="form-control" id="cep" type="text" value={cep} onChange={({ target }) => handleCEPChange(target.value)} required />
                <label htmlFor="cep">CEP*</label>
              </div>
            </div>

            <div className="col-4">
              <div className="form-floating">
                <input className="form-control" id="state" type="text" value={state} onChange={({ target }) => setState(target.value)} required />
                <label htmlFor="state">Estado*</label>
              </div>
            </div>

            <div className="col-4">
              <div className="form-floating">
                <input className="form-control" id="city" type="text" value={city} onChange={({ target }) => setCity(target.value)} required />
                <label htmlFor="city">Cidade*</label>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-6">
              <div className="form-floating">
                <input className="form-control" id="nbhd" type="text" value={nbhd} onChange={({ target }) => setNbhd(target.value)} required />
                <label htmlFor="nbhd">Bairro*</label>
              </div>
            </div>

            <div className="col-4">
              <div className="form-floating">
                <input className="form-control" id="street" type="text" value={street} onChange={({ target }) => setStreet(target.value)} required />
                <label htmlFor="street">Rua*</label>
              </div>
            </div>

            <div className="col-2">
              <div className="form-floating">
                <input className="form-control" id="number" type="number" value={number} onChange={({ target }) => setNumber(target.value)} />
                <label htmlFor="number">Número</label>
              </div>
            </div>
          </div>

          <div className="d-flex mt-5">
            <button style={{ cursor: "pointer", padding: "1rem 2rem", flexGrow: "0", flexBasis: "1rem", }} className="normal-archor special" onClick={() => history("/")}>
              Voltar
            </button>
            <button style={{ cursor: "pointer", padding: "1rem 2rem", flexGrow: "0", flexBasis: "1rem", }} className="normal-archor special ms-auto" type="submit" disabled={loadingSave}>
              {loadingSave ? <CircularProgress size={20} color='inherit' /> : 'Enviar'}
            </button>
          </div>
        </form>}
      {!add && <div className='anime-right mt-2'><Typography>Cadastre endereços para começar!</Typography></div>}
    </>
  );
};

export default Address;
