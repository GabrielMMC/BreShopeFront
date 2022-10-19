import React from 'react';
import { Button, TextField, Typography } from "@mui/material";
import { FileDrop } from 'react-file-drop';
import CurrencyInput from 'react-currency-input';
import styles from '../FileDrop/styles.css';

const Input = ({ state, setState, item }) => {

  function changeFile(file) {
    let fr = new FileReader()
    fr.onload = (e) => {
      setState({ ...state, [item]: { ...state[item], value: file, url: e.target.result } })
    }
    fr.readAsDataURL(file)
  }

  function pesquisaCep(e) {
    let state2 = { ...state }
    state2.cep.value = e.target.value
    state2.cep.error = false
    state2.state.error = false
    state2.city.error = false
    setState(state2)

    if (Array.from(e.target.value).length >= 8) {
      validaCep();
    } else if (e.target.value === '') {
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
    const filter = form.filter(item => item === 'cep' || item === 'state' || item === 'city')
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
    if (inputValue.length < 16) {
      inputValue = inputValue.replace(/\D/g, "");
      inputValue = inputValue.replace(/(^\d{2})(\d)/, "($1) $2");
      inputValue = inputValue.replace(/(\d{4,5})(\d{4}$)/, "$1-$2");

      setState({ ...state, [item]: { ...state[item], value: inputValue, error: false } });
    }
  };

  function render() {
    switch (state[item].type) {
      case 'text':
        return (
          <form class="form-floating">
            <input className={`form-control ${state[item].error && 'is-invalid'}`} value={state[item].value} onChange={(e) => setState({ ...state, [item]: { ...state[item], value: e.target.value, error: false } })} id="floatingInputValue" />
            <label for="floatingInputValue">{state[item].label}</label>
          </form>
        )

      case 'cep':
        return (
          <form class="form-floating">
            <input className={`form-control ${state[item].error && 'is-invalid'}`} value={state[item].value} onChange={(e) => pesquisaCep(e)} id="floatingInputValue" />
            <label for="floatingInputValue">{state[item].label}</label>
          </form>
        )

      case 'number':
        return (
          <form class="form-floating">
            <input className={`form-control ${state[item].error && 'is-invalid'}`} value={state[item].value} onChange={(e) => phoneMaskBrazil(e)} id="floatingInputValue" />
            <label for="floatingInputValue">{state[item].label}</label>
          </form>
        )

      case 'file':
        return (
          <div style={{ height: 100 }}>
            <FileDrop
              // onFrameDragEnter={(event) => console.log('onFrameDragEnter', event)}
              // onFrameDragLeave={(event) => console.log('onFrameDragLeave', event)}
              // onDragOver={(event) => console.log('onDragOver', event)}
              // onDragLeave={(event) => console.log('onDragLeave', event)}
              onDrop={(files, event) => changeFile(files[0])}
            >
              <Button style={{ color: '#666666', width: '100%', height: '100%' }} component="label">
                <Typography variant='p' style={{ color: '#666666' }}>Arraste a foto ou escolha um arquivo</Typography>
                <input hidden onChange={(e) => changeFile(e.target.files[0])} accept="image/*" multiple type="file" />
              </Button>
            </FileDrop>
          </div>
        )

      case 'multiline':
        return (
          <form class="form-floating">
            <textarea style={{ height: 150 }} className={`form-control ${state[item].error && 'is-invalid'}`} value={state[item].value} onChange={(e) => setState({ ...state, [item]: { ...state[item], value: e.target.value, error: false } })} id="floatingTextarea" />
            <label for="floatingTextarea">{state[item].label}</label>
          </form>
        )

      case 'price':
        return (
          <form className='form-floating'>
            <CurrencyInput
              className={`form-control ${state[item].error && 'is-invalid'}`}
              prefix="R$"
              id="floatingInputValue"
              name="input-name"
              decimalsLimit={2}
              decimalSeparator="."
              groupSeparator="."
              value={state[item].value}
              onChange={(e) => setState({ ...state, [item]: { ...state[item], value: e, error: false } })}
            />
            <label for="floatingInputValue">{state[item].label}</label>
            {console.log('price', state[item].value)}
          </form>
        )

      default:
        break;
    }
  }
  return (
    <div className={`${state[item].col} col-12 my-2`}>
      {render()}
    </div>
  )
}

export default Input