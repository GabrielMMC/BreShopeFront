import React from 'react';
import { Button, TextField, Typography } from "@mui/material";
import { FileDrop } from 'react-file-drop';
import styles from '../FileDrop/styles.css';

const Input = ({state, setState, item}) => {

  function changeFile(file){
    let fr = new FileReader()
    fr.onload = (e) => {
      setState({ ...state, [item]: { ...state[item], value: file, url: e.target.result } })
    }
    fr.readAsDataURL(file)
  }

  function pesquisaCep(e){
    let state2 = {...state}
    state2.cep.value = e.target.value
    state2.cep.error = false
    state2.state.error = false
    state2.city.error = false
    setState(state2)

    if (Array.from(e.target.value).length >= 8) {
      validaCep();
    } else if (e.target.value == '') {
      clearCEP()
    }
  }

  async function validaCep() {
    const endereco = await fetch(`https://viacep.com.br/ws/${state.cep.value}/json/`)
      .then(response => {
        return response;
      })
      .catch((error) => {
        clearCEP();
        setState({ ...state, [item]: { ...state[item], value: '', error: true, msg: 'CEP inválido' } })
      })
    const data = await endereco.json();
    if (data.hasOwnProperty('erro')) {
      clearCEP();
      setState({ ...state, [item]: { ...state[item], value: '', error: true, msg: 'CEP não encontrado!' } })
    } else {
      setState({
        ...state,
        city: { ...state.city, value: data.localidade, disabled: true },
        state: { ...state.state, value: data.uf, disabled: true },
      })
    }
  }

  function clearCEP() {
    let state2 = { ...state };
    let form = Object.keys(state2)
    const filter = form.filter(item => item == 'cep' || item == 'state' || item == 'city')
    filter.forEach(item => {
      state2[item].value = '';
      state2[item].disabled = false;
    })
    setState(state2);
  }

  const phoneMaskBrazil = (e) => {
    var element = e.target;
    var isAllowed = /\d|Backspace|Tab/;
    if (!isAllowed.test(e.nativeEvent.data)) e.preventDefault();

    var inputValue = element.value;
    if(inputValue.length < 16){
      inputValue = inputValue.replace(/\D/g, "");
      inputValue = inputValue.replace(/(^\d{2})(\d)/, "($1) $2");
      inputValue = inputValue.replace(/(\d{4,5})(\d{4}$)/, "$1-$2");

      setState({ ...state, [item]: { ...state[item], value: inputValue, error: false } });
    }
  };

  function render(){
    switch (state[item].type) {
      case 'text':
        return(
            <TextField fullWidth error={state[item].error} label={state[item].label} value={state[item].value} onChange={(e) => setState({ ...state, [item]: { ...state[item], value: e.target.value, error: false } })}></TextField>
        )

        case 'cep':
        return(
            <TextField fullWidth error={state[item].error} label={state[item].label} value={state[item].value} onChange={(e) => pesquisaCep(e)}></TextField>
        )

        case 'number':
        return(
            <TextField fullWidth error={state[item].error} label={state[item].label} value={state[item].value} onChange={(e) => phoneMaskBrazil(e)}></TextField>
        )

        case 'file':
        return(
          <div style={styles}>
          <FileDrop
            // onFrameDragEnter={(event) => console.log('onFrameDragEnter', event)}
            // onFrameDragLeave={(event) => console.log('onFrameDragLeave', event)}
            // onDragOver={(event) => console.log('onDragOver', event)}
            // onDragLeave={(event) => console.log('onDragLeave', event)}
            onDrop={(files, event) => changeFile(files[0])}
          >           
            <Button style={{color: '#666666', width: '100%', height: '100%'}} component="label">
            <Typography variant='p' style={{color: '#666666'}}>Arraste o banner da loja ou escolha um arquivo</Typography>
              <input hidden onChange={(e) => changeFile(e.target.files[0])} accept="image/*" multiple type="file" />
            </Button>
        </FileDrop>
        </div>
        )

        case 'multiline':
        return(
            <TextField fullWidth multiline rows={4} error={state[item].error} label={state[item].label} value={state[item].value} onChange={(e) => setState({ ...state, [item]: { ...state[item], value: e.target.value, error: false } })}></TextField>
        )

      default:
        break;
    }
  }
  return(
    <div className={`${state[item].col} my-3`}>
      {render()}
    </div>
  )
}

export default Input