import React from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { GET_FETCH, MOUNT_FORM_DATA, PATCH_FETCH_FORMDATA, POST_FETCH_FORMDATA, SEED_STATE, URL } from "../../../variables";
import SavePreset from "../Form/SavePreset";
import useForm from "../../utilities/useForm";
import cpfMask from "../../utilities/masks/cpf";
import numberMask from "../../utilities/masks/clearString";
import { FileDrop } from 'react-file-drop';

const Breshop = () => {
  const { form, setForm, errors, handleChange, handleBlur, setErrors, handleFileChange } = useForm({
    name: '',
    document: '',
    account_check_digit: '',
    branch_check_digit: '',
    account_number: '',
    branch_number: '',
    bank: '',
    file: { value: '', url: '' }
  })
  const [loading, setLoading] = React.useState(false)
  const [loadingSave, setLoadingSave] = React.useState(false)
  const [edit, setEdit] = React.useState(false)
  const token = useSelector(state => state.AppReducer.token);

  React.useEffect(() => {
    // getData()
  }, [])

  async function getData() {
    let response = await GET_FETCH({ url: `get_user_data`, token })
    if (response.status) {
      console.log('resp', response)
      let userData = response.breshop

      // let editData = SEED_STATE({ state: breshop, respState: userData, setState: setBreshop, setId })
      // if (editData) setEdit(true)
    }

    setLoading(false)
  }

  const handleSave = async () => {
    // setLoadingSave(true)
    let body = []
    let newErrors = {}

    Object.keys({ ...form }).forEach(item => {
      if (form[item]) body = [...body, { [item]: form[item] }]
      else newErrors[item] = 'Campo em branco'
    })

    if (newErrors) setErrors(newErrors)
    console.log('body', body, newErrors)
    let response

    if (edit) PATCH_FETCH_FORMDATA({ url: 'update_breshop', body, token })
    else if (edit) response = await POST_FETCH_FORMDATA({ url: `${URL}api/store_breshop`, body, token })

    // if (response) setLoadingSave(false)
  }

  console.log('form', form)

  return (
    <form className="anime-left" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
      <h6 className="dash-title">Informações da loja</h6>
      <div className="row mb-5">
        <div className="col-12 my-3">
          <div className="form-floating">
            <input className={`form-control ${errors?.name && 'is-invalid'}`} value={form.name} onChange={handleChange} onBlur={handleBlur} id='name' name='name' />
            <label htmlFor='name'>Nome*</label>
            <span className='small error'>{errors?.name}</span>
          </div>
        </div>

        <div className="col-12 my-3">
          <div className="form-floating">
            <textarea className={`form-control ${errors?.name && 'is-invalid'}`} value={form.name} onChange={handleChange} onBlur={handleBlur} id='name' name='name' style={{ minHeight: 100 }} />
            <label htmlFor='name'>Nome*</label>
            <span className='small error'>{errors?.name}</span>
          </div>
        </div>

        <div className='my-3' style={{ height: 360, width: '100%' }}>
          <div className='h-100 w-100'>
            <Button className='square-file-button' fullWidth component="label">
              {form.file.url
                ? <img src={form.file.url} className='h-100 w-100' />
                : <p className='m-auto text-center'>Banner da loja</p>}
              <input hidden onChange={handleFileChange} name='file' accept="image/*" multiple type="file" />
            </Button>
          </div>
        </div>
      </div>


      <h6 className="dash-title">Dados bancários</h6>
      <div className="row my-4">
        <div className="col-sm-6">
          <div className="form-floating">
            <input className={`form-control ${errors?.name && 'is-invalid'}`} value={form.name} onChange={handleChange} onBlur={handleBlur} id='name' name='name' />
            <label htmlFor='name'>Nome*</label>
            <span className='small error'>{errors?.name}</span>
          </div>
        </div>

        <div className="col-sm-6">
          <div className="form-floating">
            <input className={`form-control ${errors?.document && 'is-invalid'}`} value={cpfMask(form.document).mask} onChange={handleChange} onBlur={handleBlur} id='document' name='document' maxLength={11} />
            <label htmlFor='document'>CPF*</label>
            <span className='small error'>{errors?.document}</span>
          </div>
        </div>
      </div>

      <div className="row my-4">
        <div className="col-sm-4">
          <div className="form-floating">
            <input className={`form-control ${errors?.account_check_digit && 'is-invalid'}`} value={numberMask(form.account_check_digit)} onChange={handleChange} onBlur={handleBlur} id='account_check_digit' name='account_check_digit' maxLength={2} />
            <label htmlFor='account_check_digit'>Dígito da conta*</label>
            <span className='small error'>{errors?.account_check_digit}</span>
          </div>
        </div>

        <div className="col-sm-4">
          <div className="form-floating">
            <input className={`form-control ${errors?.branch_check_digit && 'is-invalid'}`} value={numberMask(form.branch_check_digit)} onChange={handleChange} onBlur={handleBlur} id='branch_check_digit' name='branch_check_digit' maxLength={1} />
            <label htmlFor='branch_check_digit'>Dígito da agência*</label>
            <span className='small error'>{errors?.branch_check_digit}</span>

          </div>
        </div>

        <div className="col-sm-4">
          <div className="form-floating">
            <input className={`form-control ${errors?.bank && 'is-invalid'}`} value={numberMask(form.bank)} onChange={handleChange} onBlur={handleBlur} id='bank' name='bank' maxLength={3} />
            <label htmlFor='bank'>Banco*</label>
            <span className='small error'>{errors?.bank}</span>
          </div>
        </div>
      </div>

      <div className="row my-4">
        <div className="col-sm-6">
          <div className="form-floating">
            <input className={`form-control ${errors?.account_number && 'is-invalid'}`} value={numberMask(form.account_number)} onChange={handleChange} onBlur={handleBlur} id='account_number' name='account_number' maxLength={13} />
            <label htmlFor='account_number'>Número da conta*</label>
            <span className='small error'>{errors?.account_number}</span>
          </div>
        </div>

        <div className="col-sm-6">
          <div className="form-floating">
            <input className={`form-control ${errors?.branch_number && 'is-invalid'}`} value={numberMask(form.branch_number)} onChange={handleChange} onBlur={handleBlur} id='branch_number' name='branch_number' maxLength={4} />
            <label htmlFor='branch_number'>Número da agência*</label>
            <span className='small error'>{errors?.branch_number}</span>
          </div>
        </div>
      </div>
      <SavePreset save={() => handleSave('save')} loading={loadingSave} edit={edit} />
    </form>
  );
};

export default Breshop;
