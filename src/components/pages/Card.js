import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { URL } from '../../variables'
import { useNavigate } from 'react-router-dom';
import { Button, ThemeProvider, Tooltip } from '@mui/material';
import Theme from '../routes/Theme/Theme'

export default function RecipeReviewCard({ product, sales }) {
  const history = useNavigate()
  let name = Array.from(product.name)
  let tooltip = false
  if (name.length > 40) { name = name.splice(0, 40).toString().replace(/,/g, '') + '...'; tooltip = true }
  else { name = name.toString().replace(/,/g, ''); tooltip = false }

  console.log('teste', name)

  return (
    <ThemeProvider theme={Theme}>
      {product && <Card onClick={() => ''} sx={{ width: 175 }} className='m-2 hvr'>
        <CardMedia
          component="img"
          height="150"
          image={`${URL}storage/${product.images[0].file}`}
          alt="Paella dish"
          onClick={() => history(`/product/${product.id}`)}
        />
        {/* <CardContent sx={{ padding: 0, margin: 0 }}> */}
        <div className="row align-items-end" style={{ height: 120 }}>
          <div className='mx-2 align-self-start' style={{ height: 40 }}>
            {tooltip ?
              <Tooltip placement='top' arrow title={product.name}><Typography variant="body2" color="text.secondary">{name}</Typography></Tooltip> : <Typography variant="body2" color="text.secondary">{name}</Typography>}
          </div>
          <div className='mx-2 align-self-start'>
            {sales ? <>
              <Typography className='me-2' variant="substring" color="text.secondary">
                <del>R$: {product.price}</del>
              </Typography>
              <Typography fontSize={25} variant="substring" sx={{ color: '#ff4c4c', fontWeight: 'bold' }}>
                R$: {product.price}
              </Typography> </>
              : <Typography className='m-auto' fontSize={25} variant="substring" sx={{ color: '#262626' }}>
                R$: {product.price}
              </Typography>}
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
        {/* <div className="m-2 text-wrap">
            {tooltip ?
              <Tooltip placement='top' arrow title={product.name}><Typography variant="body2" color="text.secondary">{name}</Typography></Tooltip> : <Typography variant="body2" color="text.secondary">{name}</Typography>}
          </div>
          <div className="d-flex">
            {sales ? <>
              <Typography className='me-2' variant="substring" color="text.secondary">
                <del>R$: {product.price}</del>
              </Typography>
              <Typography fontSize={25} variant="substring" sx={{ color: '#ff4c4c', fontWeight: 'bold' }}>
                R$: {product.price}
              </Typography> </>
              : <Typography className='m-auto' fontSize={25} variant="substring" sx={{ color: '#262626' }}>
                R$: {product.price}
              </Typography>}
          </div> */}
        {/* </CardContent> */}
        {/* <CardActions className='d-flex' disableSpacing sx={{ padding: 0, margin: 0 }}>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions> */}
      </Card>}
    </ThemeProvider>
  );
}
