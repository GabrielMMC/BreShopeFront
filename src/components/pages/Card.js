import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import img from '../../assets/ben10.jpg'

export default function RecipeReviewCard() {

  return (
    <Card className='m-3' sx={{ width: 200 }}>   
      <CardMedia
        component="img"
        height="150"
        image={img}
        alt="Paella dish"
      />
      <CardContent sx={{padding: 0, margin: 0}}>
        <Typography variant="body2" color="text.secondary">
          Nome do Produto
        </Typography>
        <Typography variant="substring" color="text.secondary">
          R$: 39,90
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{padding: 0, margin: 0}}>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
