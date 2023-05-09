import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { URL } from '../../../variables'
import { Tooltip } from '@mui/material';
import { moneyMask } from '../../Utilities/masks/currency';
import { MdOutlineClose } from 'react-icons/md'

export default function PreviewCard({ product, discount, handleRemoveProduct }) {
  let name = Array.from(product.name)
  let tooltip = false
  if (name.length > 40) { name = name.splice(0, 40).toString().replace(/,/g, '') + '...'; tooltip = true }
  else { name = name.toString().replace(/,/g, ''); tooltip = false }

  return (
    <Card onClick={() => ''} sx={{ width: 280, boxShadow: 0 }} className='pointer m-2'>
      <div className='position-relative' style={{ height: '400px !important', width: '100%' }}>
        <button onClick={() => handleRemoveProduct(product.id)} type='button' className="close-sale">
          <MdOutlineClose color='#FFF' size={25} />
        </button>
        {discount &&
          <div className='sale'>
            <p className='h6'>{discount}%</p>
          </div>}
        <CardMedia
          component="img"
          height="400"
          image={`${URL}storage/${product.thumb}`}
          alt="Paella dish"
        />
        {/* <img className='img-fluid' src={`${URL}storage/${product.images[0].file}`} alt='product' /> */}
      </div>
      {/* <CardContent sx={{ padding: 0, margin: 0 }}> */}
      <div className="row align-items-end" style={{ height: 120 }}>
        <div className='mx-2 align-self-start' style={{ height: 40 }}>
          {tooltip
            ? <Tooltip placement='top' arrow title={product.name}><Typography variant="body2" color="text.secondary">{name}</Typography></Tooltip>
            : <Typography variant="body2" color="text.secondary">{name}</Typography>}
        </div>
        <div className='mx-2 align-self-start'>
          {discount ?
            <>
              <Typography className='me-2' variant="substring" color="text.secondary">
                <del>{moneyMask(product.price)}</del>
              </Typography>
              <Typography fontSize={25} variant="substring" sx={{ color: '#DC3545', fontWeight: 'bold' }}>
                {moneyMask(product.price - (product.price * (discount / 100)))}
              </Typography>
            </>
            : <Typography className='m-auto' fontSize={25} variant="substring" sx={{ color: '#262626' }}>
              {moneyMask(product.price)}
            </Typography>
          }
        </div>
        <div className="d-flex align-items-end">
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </div>
      </div>
    </Card>);
}