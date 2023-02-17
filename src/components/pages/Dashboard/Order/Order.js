import React from 'react'
import MoreInfo from './MoreInfo'
// import Filter from 'utils/Filter'
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, InputAdornment, Pagination, TextField, Typography } from '@mui/material'
import { GET_FETCH } from '../../../../variables';
import { moneyMask } from '../../../utilities/masks/currency';
import dateMask from '../../../utilities/masks/date';
import Filter from '../../../utilities/Filter';
import { useSelector } from 'react-redux'

const Order = () => {
  const [orders, setOrders] = React.useState('')
  const [search, setSearch] = React.useState('')
  const [dateOf, setDateOf] = React.useState('')
  const [dateFor, setDateFor] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [allow, setAllow] = React.useState(true)
  const [pagination, setPagination] = React.useState({
    totalItems: '', pageNumber: 0, perPage: 10
  })
  const [options, setOptions] = React.useState({
    paid: { value: false, label: 'Pago', checked: false },
    failed: { value: false, label: 'Falha', checked: false },
    canceled: { value: false, label: 'Cancelado', checked: false },
    pending: { value: false, label: 'Pendente', checked: false },
  })
  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    const getData = async () => {
      setAllow(false); setLoading(true)
      console.log('datge', dateOf, dateFor)

      const status = getStatus()
      console.log('statr', status)
      const response = await GET_FETCH({
        url: `orders/?page=${pagination.pageNumber + 1}&status=${status ? status : ''}&dateOf=${dateOf ? dateOf : ''}
        &dateFor=${dateFor ? dateFor : ''}&search=${search}`, token
      })

      console.log('resp', response)
      setOrders(response.orders); setLoading(false)
      if (!pagination.totalItems) setPagination({ ...pagination, totalItems: response.pagination.total })
    }

    if (allow) getData()
  }, [pagination.pageNumber, search, allow])


  const handleStatus = (status) => {
    switch (status) {
      case "pending":
        return { style: { backgroundColor: "#FFFF66" }, status: 'PENDENTE' }

      case "paid":
        return { style: { backgroundColor: "#8AFF8A" }, status: 'PAGO' };

      case "failed":
        return { style: { backgroundColor: "#FF8A8A" }, status: 'FALHA' };

      case "canceled":
        return { style: { backgroundColor: "#FF8A8A" }, status: 'CANCELADO' };

      default:
        return null;
    }
  }

  const getStatus = () => {
    let keys = { ...options }; let status = ''
    keys = Object.keys(keys)
    keys.forEach(item => { if (options[item].value) status = item })
    return status
  }

  let timer
  const handleSearch = (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => { setSearch(value); setAllow(true); setPagination({ ...pagination, pageNumber: 0 }) }, 750)
  }

  return (
    <div className="row">
      <div className="col-md-4 col-12">
        <div className="d-flex">
          <div>
            <div className='d-flex'>
              <Typography className="small" style={{ fontSize: "1.2em" }}>PEDIDOS</Typography>
              <Filter setDateOf={setDateOf} setDateFor={setDateFor} dateOf={dateOf} dateFor={dateFor} options={options} setOptions={setOptions}
                setAllow={setAllow} setPagination={setPagination} setSearch={setSearch} />
            </div>
            <span className="text-muted">Saiba mais sobre o seus pedidos!</span>
          </div>

        </div>
        <div className='input-group my-3'>
          <div className='form-floating'>
            <input className='form-control' id='product' type='text' onChange={({ target }) => handleSearch(target.value)} required />
            <label htmlFor='product'>Buscar...</label>
          </div>
          <div className='d-flex align-items-center' style={{ backgroundColor: '#FFA235', width: '3rem', borderRadius: '0 .3rem .3rem 0' }}>
            <SearchIcon sx={{ color: '#FFF', margin: 'auto' }} />
          </div>

        </div>
      </div>
      <hr />
      {!loading ?
        <table className='table table-striped table-hover lead'>
          <thead>
            <tr>
              <td>Produtos</td>
              <td>Status</td>
              <td>Total</td>
              <td>Criado em</td>
              <td>Ações</td>
            </tr>
          </thead>
          <tbody>
            {orders && orders.map((item, index) => {
              const { style, status } = handleStatus(item.status)
              return (
                <tr key={index} style={{ whiteSpace: 'nowrap' }}>
                  <td>{item.products.map(item2 => (<span className='row m-auto'>{item2?.product?.name}</span>))}</td>
                  <td><span className='row m-auto status' style={style}>{status}</span></td>
                  <td>{moneyMask(item.amount)}</td>
                  <td>{dateMask(item.created_at)}</td>
                  <td><MoreInfo id={item.id} token={token} /></td>
                </tr>
              )
            }
            )}
          </tbody>
        </table>
        : <div className='d-flex justify-content-center p-5'><CircularProgress color='inherit' /></div>}
      {pagination && pagination.totalItems &&
        <div className='d-flex justify-content-end'>
          <Pagination shape="rounded" count={Math.ceil(pagination.totalItems / pagination.perPage)} page={pagination.pageNumber + 1} onChange={(e, page) => {
            window.scrollTo(0, 0); setPagination({ ...pagination, pageNumber: page - 1 }); setAllow(true)
          }
          } />
        </div>
      }
    </div>
  )
}

export default Order