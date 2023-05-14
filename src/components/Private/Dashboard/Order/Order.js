import React from 'react'
import MoreInfo from './MoreInfo'
import { CircularProgress, Pagination } from '@mui/material'
import { GET_FETCH } from '../../../../variables';
import { moneyMask } from '../../../Utilities/masks/currency';
import dateMask from '../../../Utilities/masks/date';
import Filter from '../../../Utilities/Filter';
import { useSelector } from 'react-redux'
import { MdSearch } from 'react-icons/md'
import { renderToast } from '../../../Utilities/Alerts';
import Images from '../Product/Images';

const Order = () => {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const [orders, setOrders] = React.useState([])
  const [search, setSearch] = React.useState('')
  const [dateOf, setDateOf] = React.useState('')
  const [dateFor, setDateFor] = React.useState('')

  const [allow, setAllow] = React.useState(true)
  const [loading, setLoading] = React.useState(true)
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

      const status = getStatus()
      const response = await GET_FETCH({
        url: `orders?page=${pagination.pageNumber + 1}&status=${status ? status : ''}&dateOf=${dateOf ? dateOf : ''}
        &dateFor=${dateFor ? dateFor : ''}&search=${search}`, token
      })

      console.log('resp', response)
      setOrders(response.orders); setLoading(false)
      if (!pagination.totalItems) setPagination({ ...pagination, totalItems: response.pagination.total })
    }

    if (allow) getData()
  }, [pagination.pageNumber, search, allow])

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Getting-data----------------------------
  const getData = async () => {
    setAllow(false); setLoading(true)

    //Passing all values ​​to the search api, if they are empty they are ignored
    const status = getStatus()
    const response = await GET_FETCH({
      url: `orders/?page=${pagination.pageNumber + 1}&status=${status ? status : ''}
    &dateOf=${dateOf ? dateOf : ''}&dateFor=${dateFor ? dateFor : ''}&search=${search}`, token
    })
    // console.log('resp', response)

    // With status true, orders are saved, and they have item records, pagination is active
    if (response.status) {
      setOrders(response.orders)
      if (!pagination.totalItems) setPagination({ ...pagination, totalItems: response.pagination.total })
    }
    // With false status, the error toast is called
    else {
      renderToast({ type: 'error', error: 'Erro ao buscar pedidos, tente novamente mais tarde!' })
    }

    setLoading(false)
  }

  // -----------------------------------------------------------------
  //******************************************************************
  // -------------------------Other-functions-------------------------
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

  //Replacing the true value of each key of the options object by its own name, so that they can be used in the Pagar.me request
  const getStatus = () => {
    let status = ''
    Object.keys({ ...options }).forEach(item => { if (options[item].value) status = item })
    return status
  }

  //Timeout function to control each user polling interval, each time a new value is entered in the input, the count is reset, so
  // there has to be a pause to reset the pagination and set a new search value
  let timer
  const handleSearch = (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => { setSearch(value); setAllow(true); setPagination({ ...pagination, pageNumber: 0 }) }, 750)
  }

  return (
    <div className="row anime-left">
      {/* -------------------------search-and-filter------------------------- */}
      <div className="col-md-6 col-12 mb-5">
        <div className="d-flex">
          <div>
            <div className='d-flex align-items-center'>
              <h6 className="dash-title">Pedidos</h6>
              <Filter setDateOf={setDateOf} setDateFor={setDateFor} dateOf={dateOf} dateFor={dateFor} options={options} setOptions={setOptions}
                setAllow={setAllow} setPagination={setPagination} setSearch={setSearch} />
            </div>
            <p className='small mb-4'>Saiba mais sobre seus pedidos!</p>
          </div>

        </div>

        <div class="input-group-with-icon">
          <input class="form-control" type="text" placeholder="Buscar..." onChange={({ target }) => handleSearch(target.value)} required />
          <MdSearch className='search-icon' size={25} />
        </div>
      </div>
      {/* -------------------------Orders-table------------------------- */}
      {!loading ?
        <table className='table table-striped table-hover text-center'>
          <thead>
            <tr className='small' style={{ fontWeight: 500 }}>
              <td>PRODUTOS</td>
              <td>STATUS</td>
              <td>TOTAL</td>
              <td>CRIADO EM</td>
              <td>AÇÕES</td>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? orders.map((item, index) => {
              //Getting the status and style for order status
              const { style, status } = handleStatus(item.status)
              return (
                <tr key={index} style={{ whiteSpace: 'nowrap' }}>
                  <td><Images thumb={item.images[0]} images={item.images} /></td>
                  <td><span className='row m-auto status' style={style}>{status}</span></td>
                  <td>{moneyMask(item.amount)}</td>
                  <td>{dateMask(item.created_at)}</td>
                  <td><MoreInfo id={item.id} token={token} /></td>
                </tr>
              )
            }
            ) : <tr><td colSpan={5} className='text-center'>Sem dados encontrados!</td></tr>}
          </tbody>
        </table>
        : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>
      }
      {/* -------------------------Pagination------------------------- */}
      {pagination && pagination.totalItems &&
        <div className='d-flex justify-content-end'>
          <Pagination shape="rounded" color='primary' count={Math.ceil(pagination.totalItems / pagination.perPage)} page={pagination.pageNumber + 1}
            onChange={(e, page) => { window.scrollTo(0, 0); setPagination({ ...pagination, pageNumber: page - 1 }); setAllow(true) }} />
        </div>
      }
    </div>
  )
}

export default Order