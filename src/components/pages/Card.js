import * as React from 'react';
import MuiCard from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { THIS_URL, URL } from '../../variables'
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { moneyMask } from '../utilities/masks/currency';
import { copyLink } from '../utilities/Functions';

export default function Card({ product, handleAddWishlist, handleDeleteWishlist, wishlistProducts }) {
  const history = useNavigate()

  const [errorTimer, setErrorTimer] = React.useState(false)
  const [isWished, setIsWished] = React.useState(false)

  React.useEffect(() => {
    if (wishlistProducts) setIsWished(wishlistProducts.filter(item => item.id === product.id)[0])
  }, [wishlistProducts])

  let name = Array.from(product.name)
  let tooltip = false
  if (name.length > 40) { name = name.splice(0, 40).toString().replace(/,/g, '') + '...'; tooltip = true }
  else { name = name.toString().replace(/,/g, ''); tooltip = false }

  return (
    <>
      {!product.sold &&
        <MuiCard onClick={() => ''} sx={{ width: 280, boxShadow: 0 }} className='m-2 pointer'>
          <div className='position-relative' style={{ height: '400px !important', width: '100%' }}>
            {product.discount &&
              <div className='sale'>
                <p className='h6'>{product.discount}%</p>
              </div>}
            <CardMedia
              component="img"
              height="400"
              image={`${URL}storage/${product.thumb}`}
              alt="Paella dish"
              onClick={() => history(`/product/${product.id}`)}
            />
            {/* <img className='img-fluid' src={`${URL}storage/${product.images[0].file}`} alt='product' /> */}
          </div>
          {/* <CardContent sx={{ padding: 0, margin: 0 }}> */}
          <div className="row align-items-end" style={{ height: 120 }}>
            <div className='mx-2 align-self-start' style={{ height: 40 }}>
              {tooltip ?
                <Tooltip placement='top' arrow title={product.name}><Typography variant="body2" color="text.secondary">{name}</Typography></Tooltip> : <Typography variant="body2" color="text.secondary">{name}</Typography>}
            </div>
            <div className='mx-2 align-self-start'>
              {product.discount ?
                <>
                  <Typography className='me-2' variant="substring" color="text.secondary">
                    <del>{moneyMask(product.price)}</del>
                  </Typography>
                  <Typography fontSize={25} variant="substring" sx={{ color: '#DC3545', fontWeight: 'bold' }}>
                    {moneyMask(product.price - (product.price * (product.discount / 100)))}
                  </Typography>
                </>
                : <Typography className='m-auto' fontSize={25} variant="substring" sx={{ color: '#262626' }}>
                  {moneyMask(product.price)}
                </Typography>
              }
            </div>
            <div className="d-flex align-items-end">
              <IconButton aria-label="add to favorites" onClick={() => isWished ? handleDeleteWishlist(product.id, wishlistProducts) : handleAddWishlist(product.id, product, wishlistProducts, errorTimer, setErrorTimer)}>
                <FavoriteIcon sx={{ color: isWished && '#DC3545' }} />
              </IconButton>
              <IconButton aria-label="share" onClick={() => copyLink(`${THIS_URL}product/${product.id}`)}>
                <ShareIcon />
              </IconButton>
            </div>
          </div>
        </MuiCard>}
    </>
  );
}
