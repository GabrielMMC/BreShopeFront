import React from 'react'
import AddSale from './AddSale'
import { useSelector } from 'react-redux'
import { CircularProgress } from '@mui/material'
import { GET_FETCH } from '../../../../variables'
import { renderToast } from '../../../utilities/Alerts'
import { useParams, useNavigate } from 'react-router-dom'

export const EditSale = () => {
  const [data, setData] = React.useState('')

  const params = useParams()
  const history = useNavigate()
  const token = useSelector(state => state.AppReducer.token);

  React.useEffect(() => {
    const getData = async () => {
      const response = await GET_FETCH({ url: `sales/${params.id}`, token })
      if (response.status) {
        setData(response.sale)
      } else {
        renderToast({ type: 'error', error: response.message })
        history('/profile/sales')
      }
    }

    getData()
  }, []);
  return (
    <>
      {data ?
        <AddSale edit={data} />
        :
        <div className="d-flex justify-content-center p-5">
          <CircularProgress />
        </div>
      }
    </>
  )
}
