import React from 'react'
import SaveIcon from '@mui/icons-material/Save';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

const SavePreset = (props) => {
  const history = useNavigate()

  return (
    <div className="d-flex m-2">
      <div className="align-self-center">
        <Button variant='contained' size='large' onClick={() => history('/home/products')} startIcon={<ReplyAllIcon />}> Voltar</Button>
      </div>
      <div className="align-self-center ms-auto">
        <LoadingButton variant='contained' size='large' loading={props.loading} onClick={() => props.edit ? props.save('update') : props.save('add')} loadingPosition="end" endIcon={<SaveIcon />}>Salvar</LoadingButton>
      </div>
    </div>
  )
}

export default SavePreset