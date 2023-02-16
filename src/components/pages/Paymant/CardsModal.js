import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { GET_FETCH, STORAGE_URL } from '../../../variables';
import { useSelector } from 'react-redux';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '.4rem',
};

export default function CardsModal({ setCard }) {
  const [cards, setCards] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const token = useSelector((state) => state.AppReducer.token);

  // **********Card*Functions**********
  React.useEffect(() => {
    if (open) getCards();
  }, [open]);

  const getCards = async () => {
    const response = await GET_FETCH({ url: 'list_cards', token });
    if (response.status) setCards(response.cards.data);
    console.log('cards', response);
  };

  return (
    <div>
      <a style={{ color: '#FFA235', cursor: 'pointer' }} onClick={handleOpen}>Selecione um cartão</a>
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
            {/* <Typography>Cartões</Typography> */}
            {cards ? (
              cards.map((item, index) => (
                <div key={index} className="row payment-card mb-5 m-auto">
                  <div className="col-12 mt-4 bg-dark" style={{ height: '2rem' }}></div>

                  <div className="d-flex">
                    <div style={{ width: '75px', marginTop: 5 }}>
                      <img className="img-fluid" src={`${STORAGE_URL}brands/${item.brand}.png`} alt="brand" />
                    </div>
                    <div className="ms-auto">
                      <input type="radio" name="card" onChange={() => setCard(card => { return { ...card, id: { value: item.id, hidden: true } } })} />
                    </div>
                  </div>

                  <div className="col-12">
                    <p>**** **** **** {item.last_four_digits}</p>
                    <p>{item.holder_name}</p>
                    <div className="d-flex" style={{ fontSize: '.8rem' }}>
                      <div className="d-flex">
                        <p className="me-2">Validade</p>
                        <p>
                          {item.exp_month}/{item.exp_year}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (<div className="d-flex justify-content-center p-5"><CircularProgress color="inherit" /></div>)}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
