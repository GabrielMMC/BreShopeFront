import React from 'react'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Modal from '@mui/material/Modal'
import { URL } from '../../variables'
import { Skeleton, IconButton } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { ImImages } from 'react-icons/im'

// -------------------------------------------------------------------
//********************************************************************
// -------------------------Styles------------------------------------
const style = {
  position: "absolute",
  top: '25%',
  left: "25%",
  width: "50%",
  height: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  margin: 0,
  p: 0,

  '@media(max-width: 1000px)': {
    width: '90%',
    transform: 'initial',
    left: '5%',
  },
};

const ImagesModal = (props) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [images, setImages] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      setImages([
        ...props.images.map(item => { return { file: item?.file, url: item?.url, loaded: false } }) // adiciona as outras imagens
      ])
    }
  }, [open])

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <ImImages />
      </IconButton>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            {images.length > 0 ?
              <Carousel infiniteLoop={true}>
                {images.map((item, index) => {
                  let newImages = [...images]
                  return (
                    <div className='m-auto' style={{ width: 500, height: 500 }} key={index}>
                      <img onLoad={() => { newImages[index].loaded = true; setImages(newImages) }} className={`${!item.loaded && 'd-none'} rounded w-100 h-100`} src={item.file ? `${URL}storage/${item.file}` : item.url} />
                      {!item.loaded && <Skeleton className='position-absolute' variant="rectangular" width={500} height={500} animation='wave' sx={{ borderRadius: '.4rem' }} />}
                    </div>
                  )
                }
                )}
              </Carousel>
              :
              <p className='lead'>Sem imagens adicionadas</p>}
          </Box>
        </Fade>
      </Modal>
    </div >
  )
}

export default ImagesModal