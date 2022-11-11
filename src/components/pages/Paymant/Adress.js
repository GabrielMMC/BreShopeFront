import React from 'react'
import Input from '../../routes/Input/Input'

const Adress = ({ form, setForm }) => {
  function renderForm() {
    let keys = { ...form }
    keys = Object.keys(keys)

    return keys.map(item => (
      <div key={form[item].label} className={`${form[item].col} col-12 my-2`}>
        <Input state={form} setState={(e) => setForm(e)} item={item} />
      </div>
    ))
  }

  return (
    renderForm()
  )
}

export default Adress