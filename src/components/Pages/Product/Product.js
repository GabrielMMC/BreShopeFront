import React from 'react'
import Card from '../Card/Card'
import Container from '../../Utilities/Container'
import { MdClose } from 'react-icons/md'
import { LoadingButton } from '@mui/lab'
import ProductImages from './ProductImages'
import { useParams } from 'react-router-dom'
import dateMask from '../../Utilities/masks/date'
import PromotionCountdown from './PromotionCountdown'
import { useSelector, useDispatch } from 'react-redux'
import { moneyMask } from '../../Utilities/masks/currency'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { API_URL, GET_FETCH, POST_FETCH, URL } from '../../../variables'
import { CircularProgress, Rating, Pagination, Typography } from '@mui/material'
import { renderToast } from '../../Utilities/Alerts'
import { handleAddWishlist, handleDeleteWishlist } from '../../Utilities/Functions'
import ImagesModal from '../../Utilities/ImagesModal'

const Product = () => {
  const [isCalled, setIsCalled] = React.useState(false);
  const [errorTimer, setErrorTimer] = React.useState(false);
  const [waitTime, setWaitTime] = React.useState(5000);

  const [search, setsearch] = React.useState('')
  const [ratings, setRatings] = React.useState([])
  const [loadingRating, setLoadingRating] = React.useState(false)
  const [filterRating, setFilterRating] = React.useState('')
  const [product, setProduct] = React.useState('')
  const [breshop, setBreshop] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [loadingCart, setLoadingCart] = React.useState(false)
  const [breshopProducts, setBreshopProducts] = React.useState([])
  const [breshopPagination, setBreshopPagination] = React.useState({
    totalItems: '', pageNumber: 0, perPage: 12
  })
  const [ratingPagination, setRatingPagination] = React.useState({
    totalItems: '', pageNumber: 1, perPage: 1, lastPage: 1
  })

  const params = useParams()
  const dispatch = useDispatch()
  const token = useSelector(state => state.AppReducer.token)
  const wishlist_products = useSelector(store => store.AppReducer.wishlist_items)


  React.useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight * 0.8 && !isCalled && ratingPagination.pageNumber !== ratingPagination.lastPage) {
        setRatingPagination({ ...ratingPagination, pageNumber: ratingPagination.pageNumber + 1 });
        setIsCalled(true);
        setTimeout(() => {
          setIsCalled(false);
        }, waitTime);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isCalled, waitTime]);

  React.useEffect(() => {
    window.scrollTo(0, 0); setLoading(true); setRatings([]); getData()
  }, [params.id])

  React.useEffect(() => {
    if (!loading) getRatings()
  }, [breshop])

  React.useEffect(() => {
    if (!loading && product.breshop_id) {
      breshopPagination.pageNumber === 0 ? getBreshopProducts() : setBreshopPagination({ ...breshopPagination, pageNumber: 0 })
    }
  }, [breshopPagination.pageNumber, product])

  React.useEffect(() => {
    if (!loading && product.breshop_id) getRatings()
  }, [ratingPagination.pageNumber])

  React.useEffect(() => {
    if (!loading && product.breshop_id) { setLoadingRating(true); setRatings([]); getRatings() }
  }, [filterRating])

  const getData = async () => {
    const response = await GET_FETCH({ url: `get_public_product/${params.id}` })
    // console.log('product', response)
    setProduct(response.product)
    setBreshop(response.product.owner)
    setLoading(false)
  }

  // console.log('paginatiop', ratingPagination)
  const getRatings = async () => {
    const response = await GET_FETCH({ url: `public/breshops/${product.breshop_id}/ratings?page=${ratingPagination.pageNumber}&rating=${filterRating}` })
    // console.log('product', response)
    setRatings([...ratings, ...response.ratings])
    setRatingPagination({ ...ratingPagination, lastPage: response.pagination.last_page })
    setLoadingRating(false)
  }

  const getBreshopProducts = async () => {
    const response = await GET_FETCH({ url: `public/breshops/${product.breshop_id}/products?page=${breshopPagination.pageNumber}` })
    // console.log('breshops products', response)
    setBreshopProducts(response.breshop_products)
    setBreshopPagination({ ...breshopPagination, totalItems: response.pagination.total_pages })
  }

  const handleAddCart = async () => {
    if (token) {
      setLoadingCart(true)
      const response = await POST_FETCH({ url: `${URL}api/cart/create`, body: { product_id: product.id, quantity: 1 }, token })
      // console.log('resp', response)
      if (response?.status) {
        dispatch({ type: 'toggle_cart', toggled: true })
      }
      setLoadingCart(false)
    } else {
      if (!errorTimer) {
        setErrorTimer(true)
        renderToast({ type: 'error', error: 'Faça login para adicionar um produto ao carrinho!' })
        setTimeout(() => setErrorTimer(false), 3000)
      }
    }
  }

  const handleFilterChange = (value) => {
    if (value !== filterRating) {
      setRatings([])
      setFilterRating(value)
    }

  }
  const handleAddWishlistWrapper = (id, product, products, errorTimer, setErrorTimer) => {
    handleAddWishlist(id, product, products, errorTimer, setErrorTimer, (wishlistProducts) => {
      dispatch({ type: 'wishlist_items', payload: wishlistProducts })
    })
  }

  const handleDeleteWishlistWrapper = (id, products) => {
    handleDeleteWishlist(id, products, (wishlistProducts) => {
      dispatch({ type: 'wishlist_items', payload: wishlistProducts })
    })
  }

  return (
    <Container>
      <div className="bg-white mt-5 p-sm-5 rounded min-height">
        {!loading ?
          <>
            <div className="row">
              <div className="col-lg-6">
                <ProductImages thumb={product.thumb} images={product.images} />
              </div>
              <div className="col-lg-6">
                <div className="d-flex align-content-between flex-wrap h-100">
                  <div className="col-12">
                    <span className='product-title'>{product.name}</span>

                    {product?.sale?.discount ?
                      <div className='d-flex align-items-center'>
                        <p className='me-2 no-discount'>
                          <del>{moneyMask(product.price)}</del>
                        </p>
                        <p className='price' style={{ color: '#DC3545' }}>
                          {moneyMask(product.price - (product.price * (product.sale.discount / 100)))}
                        </p>
                        <PromotionCountdown expirationDate={product.sale.end_date} />
                      </div>
                      : <p className='price'>{moneyMask(product.price)}</p>
                    }
                    {console.log('teste price', product)}
                    <p>
                      <strong>{moneyMask(product?.sale?.discount ? product.price - (product.price * (product.sale.discount / 100)) : product.price)}</strong> em até 12x de <strong>{moneyMask(product.price * (16.37 / 100))}</strong> sem juros no cartão
                      Ou em 1x no cartão com até <strong>5% OFF</strong>
                    </p>
                    <p className='mt-2 bold'>Descrição: </p>
                    <p>{product.description}</p>
                    <p className='mt-2 bold'>Avaria: </p>
                    <p>{product.damage_description ? product.damage_description : 'Produto não possui desgastes'}</p>

                    <p className='mt-2 bold'>Tamanhos: </p>
                    <div className="d-flex">
                      <div className="me-2"><button className={`rounded-button ${product.size === 'PP' && 'rounded-active'}`}>PP</button></div>
                      <div className="me-2"><button className={`rounded-button ${product.size === 'P' && 'rounded-active'}`}>P</button></div>
                      <div className="me-2"><button className={`rounded-button ${product.size === 'M' && 'rounded-active'}`}>M</button></div>
                      <div className="me-2"><button className={`rounded-button ${product.size === 'G' && 'rounded-active'}`}>G</button></div>
                      <div className="me-2"><button className={`rounded-button ${product.size === 'GG' && 'rounded-active'}`}>GG</button></div>
                      <div className="me-2"><button className={`rounded-button ${product.size === 'XL' && 'rounded-active'}`}>XL</button></div>
                    </div>

                    <p className="mt-2 bold">Materiais:</p>
                    <div className="d-flex flex-wrap">
                      {product.materials.map(item => (<p className='me-2'>{item.name}</p>))}
                    </div>

                    <p className="mt-2 bold">Estilos:</p>
                    <div className="d-flex flex-wrap">
                      {product.styles.map(item => (<p className='me-2'>{item.name}</p>))}
                    </div>

                  </div>
                  <div className="col-12">
                    <div className="d-flex justify-content-end">
                      <LoadingButton variant='contained' onClick={handleAddCart} endIcon={<ShoppingCartIcon />} loading={loadingCart} loadingPosition="end">Adicionar ao carrinho</LoadingButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row my-5">
              <div className="d-flex justify-content-center">
                <div className="d-flex align-items-center">
                  <img className='m-auto rounded-50' style={{ width: 75, height: 75, borderRadius: '50%' }} src={`${URL}storage/${breshop.file ? breshop.file : 'photos/no_user.png'}`} alt="subject" />
                  <div className="d-flex flex-column ms-3">
                    <p>{breshop.name}</p>
                    <Rating name="read-only" value={breshop.average_rating} precision={0.1} readOnly />
                  </div>
                </div>
                <div>
                  {/* <div>
                      <Button variant='outlined' className='mx-2'>Chat</Button>
                      <Button variant='outlined'>Loja</Button>
                    </div> */}
                </div>
                <div className='ms-5'>
                  <p>Avaliações: <span className='bold'>{breshop.total_rating}</span></p>
                  <p>Produtos: <span className="bold">{breshop.products}</span></p>
                  <p>Criada em: <span className="bold">{dateMask(breshop.created_at)}</span></p>
                </div>
              </div>
            </div>
            <hr />

            {/* -------------------------Other-products-section------------------------- */}
            <div className="row my-5">
              <p className='dash-title'>Produtos da loja</p>

              {!loading ?
                <>
                  <div className="d-flex flex-wrap">
                    {breshopProducts.length > 0 ?
                      breshopProducts.map(item => (
                        <div key={item.id}>
                          <Card product={item} handleAddWishlist={handleAddWishlistWrapper} handleDeleteWishlist={handleDeleteWishlistWrapper} wishlistProducts={wishlist_products} />
                        </div>
                      ))
                      : <p className="ms-4 lead">{search ? `Sem registros de ${search}` : 'Sem produtos cadastrados'}</p>}
                  </div>

                  {breshopProducts.length > 0 && breshopPagination.totalItems &&
                    <div className='d-flex justify-content-center mt-3'>
                      <Pagination color='yellow' shape="rounded" count={Math.ceil(breshopPagination.totalItems / breshopPagination.perPage)}
                        page={breshopPagination.pageNumber + 1} onChange={(e, page) => {
                          window.scrollTo(0, 0); setBreshopPagination({ ...breshopPagination, pageNumber: page - 1 })
                        }
                        } />
                    </div>}
                </>
                : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
            </div>
            <hr />
            {/* -------------------------Comments-Section------------------------- */}
            <div className="row my-5">
              <p className='dash-title'>Comentários da Loja</p>
              <p className='mt-3'>Média de avaliações <span className='bold'>{breshop.average_rating}</span>({breshop.total_rating})</p>

              <div className="mb-5 d-flex flex-wrap">
                <p>Filtrar por:</p>
                <p onClick={() => handleFilterChange(1)} className="ms-2 pointer">Uma estrela ({breshop.total_rating_one}), </p>
                <p onClick={() => handleFilterChange(2)} className="ms-2 pointer">Duas estrelas ({breshop.total_rating_two}), </p>
                <p onClick={() => handleFilterChange(3)} className="ms-2 pointer">Três estrelas ({breshop.total_rating_three}), </p>
                <p onClick={() => handleFilterChange(4)} className="ms-2 pointer">Quatro estrelas ({breshop.total_rating_four}), </p>
                <p onClick={() => handleFilterChange(5)} className="ms-2 pointer">Cinco estrelas ({breshop.total_rating_five})</p>
                <div className="d-flex align-items-center">
                  <p onClick={() => handleFilterChange('')} className='ms-2 error pointer'>Eliminar filtro</p>
                  <MdClose color='#DC3545' />
                </div>
              </div>
              {!loadingRating ?
                <>
                  {ratings.length > 0 ? ratings.map(item => (
                    <div className="row my-3" key={item.id}>
                      <div className="d-flex justify-content-start">
                        <div>
                          <img className='m-auto rounded-50' style={{ width: 75, height: 75 }}
                            src={`${URL}storage/${item.user.file ? item.user.file : 'no_user.png'}`} alt="subject" />
                        </div>
                        <div className='ms-2'>
                          <Typography className='ms-1' color="text.secondary">{item.user.name}</Typography>
                          <div className="d-flex align-items-center">
                            <Rating value={item.rating} readOnly />
                            <ImagesModal images={item.images} />
                          </div>
                        </div>
                      </div>

                      <div className="col-12 mt-2">
                        <p>{item.comment}</p>
                      </div>
                    </div>
                  )
                  ) : <p>Loja sem nenhum comentário registrado</p>}
                </> : <div className="d-flex justify-content-center">
                  <CircularProgress />
                </div>}
            </div>
          </>
          :
          <div className="p-5 d-flex justify-content-center">
            <CircularProgress />
          </div>
        }
      </div>
    </Container>
  )
}

export default Product