import { Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Form } from "react-router-dom";
import { FileDrop } from 'react-file-drop';
import { URL } from "../../../variables";
import styles from '../FileDrop/styles.css'

const Breshop = () => {
  const [state, setState] = React.useState({
    name: { value: "", error: false },
    cep: { value: "", error: false },
    state: { value: "", error: false },
    street: { value: "", error: false },
    number: { value: "", error: false },
    description: { value: "", error: false },
  });
  const token = useSelector((state) => state.AppReducer.token);
  console.log("token", token);

  const user = localStorage.getItem("user");
  console.log("id", user.name);
  React.useEffect(() => {
    fetch(`${URL}api/get_breshop/${1}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      //   body: JSON.stringify({ name: "teste" }),
    }).then(async (responseLog) => {
      console.log("resp", responseLog);
    });
  }, []);
  return (
    <div className="row mx-3">
      <div className="card">
        <div className="card-body" style={{ minHeight: "75vh" }}>
          <div className="p-5">
            <Typography variant='h4'>Vamos começar com os dados gerais da loja!</Typography>
          </div>
          <div className="row my-2">
            <div className="col-6">
                <TextField fullWidth label="Nome da Loja" value={state.name.value}
                onChange={(e) => setState({...state, name: {value: e.target.value, error: false}})}></TextField>
            </div>
            <div className="col-6">
              <TextField fullWidth label="Telefone" value={state.number.value}
                onChange={(e) => setState({...state, number: {value: e.target.value, error: false}})}></TextField>
            </div>
          </div>
          {/* ---------------------------------------------------------------------------------------------------------- */}
          <div className="row mt-4">
            <div className="col-4">
              <TextField fullWidth label="CEP" value={state.cep.value}
                onChange={(e) => setState({...state, cep: {value: e.target.value, error: false}})}></TextField>
            </div>
            <div className="col-4">
              <TextField fullWidth label="Estado" value={state.state.value}
                onChange={(e) => setState({...state, state: {value: e.target.value, error: false}})}></TextField>
            </div>
            <div className="col-4">
              <TextField fullWidth label="Rua" value={state.street.value}
                onChange={(e) => setState({...state, street: {value: e.target.value, error: false}})}></TextField>
            </div>

            <div className="col-12 mt-4">
              <TextField multiline rows={4} fullWidth label="Descrição" value={state.description.value}
              onChange={(e) => setState({...state, description: {value: e.target.value, error: false}})}></TextField>
            </div>
            <div style={styles} className="box">
              <FileDrop
                onFrameDragEnter={(event) => console.log('onFrameDragEnter', event)}
                onFrameDragLeave={(event) => console.log('onFrameDragLeave', event)}
                onFrameDrop={(event) => console.log('onFrameDrop', event)}
                onDragOver={(event) => console.log('onDragOver', event)}
                onDragLeave={(event) => console.log('onDragLeave', event)}
                onDrop={(files, event) => console.log('onDrop!', files, event)}
              >
                Drop some files here!
            </FileDrop>
            </div>        
          </div>
          {/* ---------------------------------------------------------------------------------------------------------- */}
          
          <div className="d-flex justify-content-end mt-5">
            <Button variant="contained">Salvar</Button>
          </div>      
        </div>
      </div>
    </div>
  );
};

export default Breshop;
