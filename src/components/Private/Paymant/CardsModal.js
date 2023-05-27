import * as React from 'react'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Modal from '@mui/material/Modal'
import { useSelector } from 'react-redux'
import Backdrop from '@mui/material/Backdrop'
import { GET_FETCH, STORAGE_URL, URL } from '../../../variables'
import CircularProgress from '@mui/material/CircularProgress'

// -------------------------------------------------------------------
//********************************************************************
// -------------------------Styles------------------------------------
const style = {
  position: "absolute",
  left: 0,
  width: 500,
  minHeight: "100%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,

  '@media(max-width: 1000px)': {
    width: '90%',
    transform: 'initial',
    left: '5%',
  },
};
//Props coming from the CardPayment and MultiPayment screens
export default function CardsModal({ card, setCard, indexCard }) {
  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------States------------------------------------
  const [cards, setCards] = React.useState('')
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const token = useSelector(state => state.AppReducer.token)

  React.useEffect(() => {
    if (open) getCards()
  }, [open])

  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------Getting-data------------------------------
  const getCards = async () => {
    const response = await GET_FETCH({ url: 'cards', token })
    if (response.status) setCards(response.cards.data)
  }

  // -------------------------------------------------------------------
  //********************************************************************
  // -------------------------Other-functions---------------------------
  const handleChange = (item) => {
    //If the card is an array, the id and the card object will be mounted in array structure
    if (Array.isArray(card)) {
      const newCard = [...card]
      //Accessing array according to the index and passing the data
      newCard[indexCard] = { ...card[indexCard], id: { value: item.id }, cardObj: { ...item } }

      setCard(newCard)
    } else {
      //If the card is an object, the id and the card object will be mounted in object structure
      setCard({ ...card, id: { value: item.id }, cardObj: { ...item } })
    }
  }

  const isChecked = (item) => {
    let checked
    //If the card is an array, it will be compared if the card.id is equal to the rendered card id 
    if (Array.isArray(card)) {
      checked = card[indexCard]?.id?.value === item.id ? true : false
    } else {
      //Comparing the id key from card state with rendered id card
      checked = card?.id?.value === item.id ? true : false
    }

    return checked
  }

  return (
    <div>
      <span className='link-p' onClick={handleOpen}>Selecione um cartão</span>
      <Modal sx={{ overflowY: 'auto' }} aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" open={open} onClose={handleClose} closeAfterTransition
        BackdropComponent={Backdrop} BackdropProps={{ timeout: 500, }}>
        <Fade in={open}>
          <Box sx={style}>
            {Array.isArray(cards)
              ?
              <>
                {/* --------------------------Cards-Section-------------------------- */}
                {cards.length > 0
                  ?
                  cards.map((item, index) => (
                    <div key={index} className="row payment-card my-3 m-auto pointer" onClick={() => handleChange(item)}>
                      <div className="col-12 mt-4 bg-dark" style={{ height: '2rem' }}></div>

                      <div className="d-flex">
                        <div style={{ width: '75px', marginTop: 5 }}>
                          <img className='img-fluid' src={`${URL}/brands/${item.brand.toLowerCase()}.png`} alt='brand' />
                        </div>
                        <div className="ms-auto">
                          <input className='form-check-input' type='radio' name='card' checked={isChecked(item)} onChange={() => ''} />
                        </div>
                      </div>

                      <div className="col-md-12 my-2">
                        <p>{item.holder_name}</p>
                        <p>**** **** **** {item.last_four_digits}</p>
                        <div className="d-flex" style={{ fontSize: '.8rem' }}>
                          <div className='d-flex'>
                            <p className='me-2'>Validade</p>
                            <p>{item.exp_month}/{item.exp_year}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                  )
                  : <p>Sem cartões cadastrados</p>}
              </>
              : <div className="d-flex vh-100 align-items-center justify-content-center p-5" style={{ marginTop: -32 }}><CircularProgress /></div>}
          </Box>
        </Fade>
      </Modal>
    </div >
  );
}