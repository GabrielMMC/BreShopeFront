import React from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { URL } from '../../../../variables';
import { CircularProgress } from '@mui/material';
import AddProduct from './AddProduct';

const EditProduct = () => {
  const params = useParams()
  const id = params.id
  const [state, setState] = React.useState({
    data: {},
    redirect: false,
  })
  const token = useSelector(state => state.AppReducer.token);

  React.useEffect(() => {
    if (id !== null) {
      fetch(`${URL}api/get_product/${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'application/json',
        }
      })
        .then(async (response) => {
          const json = await response.json();
          return json;
        }).then(async (json) => {
          setState({ ...state, data: json, redirect: true })
        });
    }
  }, [id]);
  return (
    <>
      {!state.redirect ?
        <div className="d-flex justify-content-center p-5">
          {!state.redirect && <CircularProgress />}
        </div>
        :
        <AddProduct edit={state.data.product} />
      }
    </>
  )
}

export default EditProduct