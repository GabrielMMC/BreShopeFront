import React from 'react'
import Card from './Card'
import Container from './Container'
import { URL } from '../../variables'
import { MdClose } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import dateMask from '../utilities/masks/date'
import ImagesModal from './Paymant/ImagesModal'
import { renderToast } from '../utilities/Alerts'
import { GET_PUBLIC_FETCH } from '../../variables'
import { CircularProgress, Rating, Pagination, Typography } from '@mui/material'
import { handleAddWishlist, handleDeleteWishlist } from '../utilities/Functions'
import { useDispatch, useSelector } from 'react-redux'
import CardSkeleton from './CardSkeleton'

const Breshop = () => {
  // -----------------------------------------------------------------
  // *****************************************************************
  // -------------------------States----------------------------------
  const [isCalled, setIsCalled] = React.useState(false);
  const [waitTime, setWaitTime] = React.useState(5000);
  // Booleans
  const [loading, setLoading] = React.useState(true)
  const [loadingRating, setLoadingRating] = React.useState(false)
  const [loadingProduct, setLoadingProduct] = React.useState(false)
  // Strings
  const [breshop, setBreshop] = React.useState('')
  const [filterRating, setFilterRating] = React.useState('')
  // Arrays
  const [ratings, setRatings] = React.useState([])
  const [breshopProducts, setBreshopProducts] = React.useState([])
  // Objects
  const [breshopPagination, setBreshopPagination] = React.useState({
    totalItems: '', pageNumber: 0, perPage: 12
  })
  const [ratingPagination, setRatingPagination] = React.useState({
    totalItems: '', pageNumber: 1, perPage: 1, lastPage: 1
  })
  const productRef = React.useRef()

  const params = useParams()
  const dispatch = useDispatch()
  const wishlist_products = useSelector(store => store.AppReducer.wishlist_items)


  // This code block is using React's useEffect hook to set up event listeners and fetch data.

  // The first useEffect hook sets up a scroll event listener that checks if the user has scrolled to the 80% mark of the page and if a certain condition is met
  // (isCalled is false and pageNumber is not equal to the last page), it updates the ratingPagination state and sets isCalled to true.
  //It also sets a timeout to reset isCalled to false after a certain amount of time. This hook runs whenever isCalled or waitTime changes.
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

  // The second useEffect hook runs whenever breshop changes and calls the getRatings function if loading is false.
  React.useEffect(() => {
    if (!loading) getRatings();
  }, [breshop]);

  // The third useEffect hook runs only once, on component mount, and calls the getData function.
  React.useEffect(() => {
    getData();
  }, []);


  // Runs when breshopPagination.pageNumber or breshop changes. Calls getBreshopProducts if pageNumber is 0, otherwise sets pageNumber to 0.
  React.useEffect(() => {
    if (!loading && breshop.id) {
      // breshopPagination.pageNumber === 0 ? getBreshopProducts() : setBreshopPagination({ ...breshopPagination, pageNumber: 0 })
      getBreshopProducts()
    }
  }, [breshopPagination.pageNumber, breshop])

  // Runs when ratingPagination.pageNumber changes. Calls getRatings to fetch ratings.
  React.useEffect(() => {
    if (!loading && breshop.id) getRatings()
  }, [ratingPagination.pageNumber])

  // Runs when filterRating changes. Sets loadingRating to true, resets ratings to an empty array, and calls getRatings.
  React.useEffect(() => {
    if (!loading && breshop.id) { setLoadingRating(true); setRatings([]); getRatings() }
  }, [filterRating])


  // -----------------------------------------------------------------
  // *****************************************************************
  // -------------------------Getting-data----------------------------
  // Fetches data for a single breshop and updates the breshop state if the response is successful.
  const getData = async () => {
    const response = await GET_PUBLIC_FETCH({ url: `${URL}api/public/breshops/${params.id}` })
    // console.log('response', response)

    if (response.status) {
      setBreshop(response.breshop)
    } else {
      renderToast({ type: 'error', error: response.message })
    }
    setLoading(false)
  }

  // Fetches ratings for the current breshop using the current filterRating and ratingPagination states. Updates ratings, ratingPagination, and loadingRating based on the response from the server.
  const getRatings = async () => {
    const response = await GET_PUBLIC_FETCH({ url: `${URL}api/public/breshops/${breshop.id}/ratings?page=${ratingPagination.pageNumber}&rating=${filterRating}` })
    setRatings([...ratings, ...response.ratings])
    setRatingPagination({ ...ratingPagination, lastPage: response.pagination.last_page })
    setLoadingRating(false)
  }

  // Fetches products for a breshop and updates the state with the response data.
  const getBreshopProducts = async () => {
    setLoadingProduct(true)
    const response = await GET_PUBLIC_FETCH({ url: `${URL}api/public/breshops/${breshop.id}/products?page=${breshopPagination.pageNumber}` })
    setBreshopProducts(response.breshop_products)
    setBreshopPagination({ ...breshopPagination, totalItems: response.pagination.total_pages })
    setLoadingProduct(false)
  }

  // Updates the filter rating state if the selected value is different from the current value, and clears the ratings state to trigger a new fetch.
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
            <div className="row my-5">
              <div className="d-flex justify-content-center">
                <div className="d-flex align-items-center">
                  <img className='m-auto rounded-50' style={{ width: 75, height: 75 }} src={`${URL}storage/${breshop.file ? breshop.file : 'photos/no_user.png'}`} alt="subject" />
                  <div className="d-flex flex-column ms-3">
                    <p>{breshop.name}</p>
                    <Rating name="read-only" value={breshop.average_rating} precision={0.1} readOnly />
                  </div>
                </div>
                <div>
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
            <div className="row my-5" ref={productRef}>
              <p className='dash-title'>Produtos da loja</p>

              {!loadingProduct ?
                <>
                  <div className="d-flex flex-wrap">
                    {breshopProducts.length > 0 ?
                      breshopProducts.map(item => (
                        <div key={item.id}>
                          <Card product={item} handleAddWishlist={handleAddWishlistWrapper} handleDeleteWishlist={handleDeleteWishlistWrapper} wishlistProducts={wishlist_products} />
                        </div>
                      ))
                      : <p>Sem produtos cadastrados</p>}
                  </div>

                  {breshopProducts.length > 0 && breshopPagination.totalItems &&
                    <div className='d-flex justify-content-center mt-3'>
                      <Pagination color='yellow' shape="rounded" count={Math.ceil(breshopPagination.totalItems / breshopPagination.perPage)}
                        page={breshopPagination.pageNumber + 1} onChange={(e, page) => {
                          productRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          setBreshopPagination({ ...breshopPagination, pageNumber: page - 1 })
                        }
                        } />
                    </div>}
                </>
                : <div className='d-flex flex-wrap justify-content-center'><CardSkeleton totalItems={12} /></div>}
            </div>
            <hr />
            {/* -------------------------Comments-section------------------------- */}
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

export default Breshop