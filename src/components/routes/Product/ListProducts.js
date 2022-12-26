import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { Button, IconButton, Input, ThemeProvider, Pagination } from '@mui/material';
import { URL } from '../../../variables';
import Theme from '../Theme/Theme';
import swal from 'sweetalert';

const ListProducts = () => {
  const [state, setState] = React.useState({
    products: [],
    pagination: { current_page: '', total_pages: '', per_page: '' },
    pageNumber: 1,
    loading: true,
    reload: false,
    search: '',
  })
  const history = useNavigate();
  const token = useSelector(state => state.AppReducer.token);

  React.useEffect(() => {
    fetch(`${URL}api/get_products?page=${state.pageNumber}&search=${state.search}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Authorization': `Bearer ${token}`,
        // 'Content-Type': 'application/json',
      }
    })
      .then(async (response) => {
        const resp = await response.json();
        return resp;
      })
      .then((resp) => {
        console.log('json', resp)
        console.log('token', token)
        setState({
          ...state,
          products: resp.products,
          pagination: resp.pagination,
          loading: false,
          already: true,
        })
      });

  }, [state.pageNumber, state.search, state.reload]);


  const debounce = (func, wait) => {
    console.log('caiu debounce')

    let timeout;

    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  function search({ value }, time) {
    let timer = setTimeout(() => {
      console.log('ativou dentro')
      setState({ ...state, search: value })
    }, time)
    clearTimeout(timer)
    console.log('ativou')
  }

  function renderAlert(id) {
    return (
      swal({
        title: "Deletar produto selecionado?",
        text: "Uma vez deletado, não dará para recuperá-lo!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          swal("Produto deletado com sucesso!", {
            icon: "success",
          });
          Delete(id)
          setState({ ...state, pageNumber: 0, reload: !state.reload })
        }
      })
    )
  }

  function Delete(id) {
    fetch(`${URL}api/product/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Authorization': `Bearer ${token}`,
        // 'Content-Type': 'application/json',
      }
    });
    // setState({...state, })
  }

  function EditSubject(id) {
    history('/profile/product/' + id);
  }

  // function ShowInfo(id) {
  //   history('/home/subjects/subject/' + id);
  // }

  function pagination() {
    const { total_pages, per_page } = state.pagination;
    return (
      <div className='d-flex justify-content-center mb-3'>
        <Pagination color='primary' shape="rounded" count={Math.ceil(total_pages / per_page)} page={state.pageNumber} onChange={(e, page) => setState({ ...state, pageNumber: page })} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={Theme}>
      <div className="card m-auto" style={{ maxWidth: 1000 }}>
        <div className='card-body' style={{ minHeight: "75vh" }}>
          <div className="d-flex m-3">
            <div className="flex-column">
              <h1 className='header-title'>Seus Produtos</h1>
              <Input fullWidth placeholder='Buscar...' endAdornment={<SearchIcon />} onChange={debounce(() => {
                console.log('ativou')
              }, 500)}></Input>
            </div>
            <div className="align-self-end ms-auto">
              <Button classes={{ contained: 'bg-primary-bm' }} variant="contained" size='large' endIcon={<AutoStoriesIcon />} onClick={() => history('/profile/product/add')}>Adicionar</Button>
            </div>
          </div>
          <table className="table table-striped table-hover text-center mt-5">
            <thead className='text-center'>
              <tr>
                <th scope="col">Imagem</th>
                <th scope="col">Nome</th>
                <th scope="col">Preço</th>
                <th scope="col">Descrição</th>
                <th scope="col">Avaria</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            {state.products && !state.loading && <tbody>
              {state.products.map(item => (
                <tr key={item.id}>
                  <td><img className='m-auto' style={{ width: 75, height: 75, borderRadius: '50%' }} src={item.images ? `${URL}storage/${item.images[0].file}` : `${URL}storage/fotos/user_not_found.png`} alt="subject" /></td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.description}</td>
                  <td>{item.damage}</td>
                  <td>
                    <IconButton size='small'>
                      <EditIcon color='secondary' size='large' onClick={() => EditSubject(item.id)} />
                    </IconButton>

                    {/* <IconButton size='small'>
                      <VisibilityIcon color='success' onClick={() => ShowInfo(item.id)} />
                    </IconButton> */}

                    <IconButton size='small'>
                      <DeleteIcon color='error' onClick={() => renderAlert(item.id)} />
                    </IconButton>
                  </td>
                </tr>
              )
              )}
            </tbody>}
          </table>
        </div>
        {state.loading && <div className="row"> <div className="col-12 p-5 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary" role="status"  ></div></div></div>}
        {state.products && pagination()}
      </div>
    </ThemeProvider>
  )
}

export default ListProducts