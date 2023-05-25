import React from 'react'
import Counter from './Counter'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Modal from '@mui/material/Modal'
import Backdrop from '@mui/material/Backdrop'
import { useNavigate } from 'react-router-dom'

// --------------------------------------------------------------------
//*********************************************************************
// -------------------------Styles-------------------------------------
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

//Props coming from the PaymentScreen
export default function ChargeModal({ charge, method }) {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const [open, setOpen] = React.useState(true)
  const history = useNavigate()

  const handleClose = () => {
    setOpen(false);
    history('/profile/orders')
  }

  return (
    <div>
      <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" open={open} onClose={handleClose}
        closeAfterTransitionBackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
        <Fade in={open}>
          {/* --------------------------Payment-Section-------------------------- */}
          <Box sx={style}>
            <div className="row text-center">
              <p className='display-6'>Pedido gerado com sucesso</p>
              <p className='lead'>Pague para prosseguir com o envio</p>
              {method === 'pix' &&
                <>
                  <div style={{ width: 250, height: 250, margin: 'auto' }}>
                    <img className='m-auto' src={charge.qr_code_url} alt='qr_code'></img>
                  </div>
                  <Counter handleClose={handleClose} />
                </>
              }
              {method === 'boleto' &&
                <div className='d-flex align-items-center h-100' style={{ minHeight: 500 }}>
                  <div className='w-100'>
                    <img style={{ width: '100%', height: 100 }} className='img-fluid m-auto' src={charge.barcode} alt='bill'></img>
                    <div className="d-flex justify-content-around mt-2">
                      <p>Banco: {charge.bank}</p>
                      <p>{charge.document_number}</p>
                      <p>Tipo: {charge.type}</p>
                    </div>
                  </div>
                </div>}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div >
  );
}