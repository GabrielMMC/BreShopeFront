import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Counter from './Counter';

const style = {
 position: 'absolute',
 top: '50%',
 left: '50%',
 transform: 'translate(-50%, -50%)',
 width: 600,
 bgcolor: 'background.paper',
 boxShadow: 24,
 p: 4,
 borderRadius: '.4rem',

 '@media(max-width: 1000px)': {
  width: '90%',
  transform: 'initial',
  top: '25%',
  left: '5%',
  p: 2,
 },
};

export default function ChargeModal({ charge, method }) {
 const [cards, setCards] = React.useState('')
 const [open, setOpen] = React.useState(true);
 const handleOpen = () => setOpen(true);
 const handleClose = () => setOpen(false);

 // **********Charge*Functions**********

 return (
  <div>
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
      <div className="row text-center">
       <p className='display-6'>Pedido gerado com sucesso</p>
       <p className='lead'>Pague para prosseguir com o envio</p>
       {method === 'pix' &&
        <div style={{ width: 250, height: 250, margin: 'auto' }}>
         <img className='m-auto' src={charge.qr_code_url} alt='qr_code'></img>
        </div>}
       <Counter handleClose={handleClose} />
      </div>
     </Box>
    </Fade>
   </Modal>
  </div >
 );
}