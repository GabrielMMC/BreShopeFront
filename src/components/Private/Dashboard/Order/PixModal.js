import React from 'react'
import Box from "@mui/material/Box"
import Fade from "@mui/material/Fade"
import Modal from "@mui/material/Modal"
import { IconButton } from "@mui/material"
import Backdrop from "@mui/material/Backdrop"
import CloseIcon from "@mui/icons-material/Close"
import QrCode2Icon from '@mui/icons-material/QrCode2'
import Counter from '../../Paymant/Counter'

const PixModal = ({ style, img, createdAt, handleTimeoutPayment, totalTime }) => {
  const [timer, setTimer] = React.useState('');
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) setTimer(handleTimeoutPayment(createdAt).seconds)
  }, [open])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton onClick={handleOpen}><QrCode2Icon /></IconButton>

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
          {/* --------------------------Payment-Section-------------------------- */}
          <Box sx={{ ...style, left: '0%' }}>
            <div>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className="d-flex text-center align-items-center vh-100" style={{ marginTop: -100 }}>
              <div style={{ width: 250, height: 250, margin: 'auto' }}>
                <img className='m-auto' src={img} alt='qr_code' />
                {/* --------------------------Counter-------------------------- */}
                <Counter handleClose={handleClose} timer={totalTime} />
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}

export default PixModal