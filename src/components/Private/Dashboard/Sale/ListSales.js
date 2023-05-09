import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MdEdit, MdDelete, MdSearch, MdSave } from 'react-icons/md'
import { CircularProgress, IconButton, Pagination, Button } from '@mui/material'
import { DELETE_FETCH, GET_FETCH } from '../../../../variables'
import { renderAlert, renderToast } from '../../../Utilities/Alerts'
import Filter from '../../../Utilities/Filter'
import dateMask from '../../../Utilities/masks/date'
import Images from '../Product/Images'

function ListSales() {
  const [allow, setAllow] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [dateOf, setDateOf] = React.useState('')
  const [dateFor, setDateFor] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [sales, setSales] = React.useState(null)
  const [pagination, setPagination] = React.useState({
    totalItems: '', pageNumber: 0, perPage: 10
  })

  const history = useNavigate()
  const token = useSelector(state => state.AppReducer.token)

  let timeout
  const handleSearch = (value) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => { setSearch(value); setPagination({ ...pagination, pageNumber: 0 }) }, 750)
  }

  React.useEffect(() => {
    if (allow) getData()
  }, [pagination.pageNumber, allow, search])

  const getData = async () => {
    setLoading(true)
    const response = await GET_FETCH({
      url: `sales?page=${pagination.pageNumber + 1}&dateOf=${dateOf ? dateOf : ''}&dateFor=${dateFor ? dateFor : ''}&search=${search}`, token
    })
    // console.log('resp', response)

    setPagination({ ...pagination, totalItems: response.pagination.total_pages }); setSales(response.sales); setLoading(false);
  }

  const handleDelete = async (id) => {
    const response = await DELETE_FETCH({ url: `sales/${id}`, token })
    console.log('delete', response)

    if (response.status) getData()
    else renderToast({ type: 'error', error: response.message })
  }

  return (
    <div className='anime-left'>
      <div className="row mb-5">
        <div className='col-sm-6'>
          <div className="d-flex align-items-center">
            <h6 className="dash-title">Promoções</h6>
            <Filter setAllow={setAllow} pagination={pagination} setPagination={setPagination} setSearch={setSearch}
              setDateFor={setDateFor} setDateOf={setDateOf} dateFor={dateFor} dateOf={dateOf} />
          </div>
          <p className='small mb-4'>Encontre todas suas promoções cadastradas!</p>

          <div className="input-group-with-icon">
            <input className="form-control" type="text" placeholder="Buscar..." onChange={({ target }) => handleSearch(target.value)} required />
            <MdSearch className='search-icon' size={25} />
          </div>
        </div>

        <div className="col-sm-6">
          <div className="d-flex ms-auto align-items-end justify-content-end h-100">
            <Button variant='contained' endIcon={<MdSave />} onClick={() => history('/profile/sale/add')} size='large'>Adicionar promoção</Button>
          </div>
        </div>
      </div>

      {!loading ?
        <table className='table table-hover table-striped text-center'>
          <thead>
            <tr className='small' style={{ fontWeight: 500 }}>
              <td>PRODUTOS</td>
              <td>DATA DE INÍCIO</td>
              <td>DATA DE TÉRMINO</td>
              <td>DESCONTO</td>
              <td>AÇÕES</td>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? sales.map((item, index) => {
              // const title = handleSize(item.name)
              return (
                <tr key={index} className=''>
                  <td><Images thumb={item.images[0]} images={item.images} /></td>
                  <td>{dateMask(item.start_date)}</td>
                  <td>{dateMask(item.end_date)}</td>
                  <td>{item.discount}%</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <IconButton color='secondary' onClick={() => history(`/profile/sale/edit/${item.id}`)}><MdEdit /></IconButton>
                    <IconButton color='error' onClick={() => renderAlert({ id: item.id, item: 'promoção', article: 'a', deleteFunction: handleDelete })}><MdDelete /></IconButton>
                  </td>
                </tr>
              )
            }) : <tr><td colSpan={5} className='text-center'>Sem dados encontrados!</td></tr>}
          </tbody>
        </table> : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>
      }

      {sales?.length > 0 && pagination.totalItems &&
        <div className='d-flex justify-content-end'>
          <Pagination color='primary' shape="rounded" count={Math.ceil(pagination.totalItems / pagination.perPage)}
            page={pagination.pageNumber + 1} onChange={(e, page) => {
              window.scrollTo(0, 0); setPagination({ ...pagination, pageNumber: page - 1 }); setAllow(true)
            }
            } />
        </div>}
    </div>
  );
}

export default ListSales;