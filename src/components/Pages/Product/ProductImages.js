import React from 'react'
import { Skeleton } from '@mui/material'
import { URL } from '../../../variables'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"

const ProductImages = (props) => {
  const [images, setImages] = React.useState([
    { path: props.thumb, loaded: false }, // adiciona a thumb
    ...props.images.map(item => ({ path: item.file, loaded: false })) // adiciona as outras imagens
  ]);

  return (
    <div className="col-12">
      <Carousel infiniteLoop={true}>
        {images.map((item, index) => {
          let newImages = [...images]
          return (
            <div style={{ width: '100%', height: '100%', maxWidth: 500, maxHeight: 500, margin: 'auto' }} key={index}>
              <img onLoad={() => { newImages[index].loaded = true; setImages(newImages) }} className={`${!item.loaded && 'd-none'} rounded w-100 h-100`} src={`${URL}storage/${item.path}`} />
              {!item.loaded && <Skeleton className='position-absolute' variant="rectangular" width={500} height={500} animation='wave' sx={{ borderRadius: '.4rem' }} />}
            </div>
          )
        }
        )}
      </Carousel>
    </div>
  )
}

export default ProductImages