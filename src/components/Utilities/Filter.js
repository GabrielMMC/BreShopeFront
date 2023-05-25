import React from 'react'
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';
import { Box, Fade, IconButton, Modal } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import dateMask from './masks/date';

const Filter = (props) => {
  const [open, setOpen] = React.useState(false)

  function renderOptions() {
    if (props.options) {
      const keys = Object.keys(props.options)
      return keys.map((item, index) => (
        <div key={index} className="form-check my-2 d-flex">
          <input className="form-check-input" type="checkbox" name="exampleRadios" id={item} value={props.options[item].value}
            onChange={() => handleChange(item)} checked={props.options[item].value} />
          <label className="form-check-label ms-1" htmlFor={item}>
            {props.options[item].label}
          </label>
        </div>
      )
      )
    }
  }

  const handleChange = (id) => {
    let options2 = { ...props.options }
    let keys = Object.keys(props.options)
    keys.forEach(item => {
      if (item === id) options2[item] = { ...options2[item], value: !options2[item].value }; else options2[item] = { ...options2[item], value: false }
    })
    props.setOptions(options2)
  }


  // <div className="form-check my-2 mx-3 d-flex align-items-center">
  //   <input className="form-check-input" type="radio" name="option" checked={Boolean(props.options[item].id === props.selectedGender)} id={item}
  //     onChange={() => props.setSelected(props.options[item].id)} />
  //   <label className="form-check-label lead ms-1" htmlFor={item}>
  //     {props.options[item].key}
  //   </label>
  // </div>

  const handleOpen = () => {
    props.setAllow(false); setOpen(true)
  }

  const handleClose = () => {
    props.setAllow(true); setOpen(false); props.setSearch(''); props.setPagination(oldPagination => { return { ...oldPagination, pageNumber: 0 } })
  }

  const handleClearDates = () => {
    props.setDateFor(''); props.setDateOf(''); props.setAllow(true); setOpen(false); props.setPagination(oldPagination => { return { ...oldPagination, pageNumber: 0 } })
  }

  const style = {
    position: 'absolute',
    height: '100%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    overflowY: 'auto',
    minWidth: 300
  };

  return (
    <div className='ms-2'>
      <IconButton sx={{ padding: 0 }} onClick={(e) => handleOpen(e)}>
        <FilterListIcon size={30} />
      </IconButton>
      <Modal
        disableScrollLock={false}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="d-flex">
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>

              <div className="ms-auto">
                <IconButton className='hvr-grow' onClick={handleClearDates}>
                  <EventBusyIcon size={22} />
                </IconButton>
                <IconButton className='hvr-grow' onClick={handleClose}>
                  <SearchIcon size={22} />
                </IconButton>
              </div>
            </div>

            <div className="mt-3 d-flex align-items-center">
              <label htmlFor='name'>De: </label>
              <input type="date" className="form-control ms-2" value={props.dateOf} onChange={({ target }) => props.setDateOf(target.value)} />
            </div>

            <div className="mt-3 d-flex align-items-center">
              <label htmlFor='name'>Até: </label>
              <input type="date" className="form-control ms-2" value={props.dateFor} onChange={({ target }) => props.setDateFor(target.value)} />
            </div>

            {props.options &&
              <div className="my-4 m-auto">
                <div className="d-flex align-items-center">
                  <span>Opções</span>
                  {/* <IconButton onClick={() => props.setSelected('')} color='error' sx={{ width: 15, height: 15 }} >
                    <CloseIcon sx={{ width: 15, height: 15 }} />
                  </IconButton> */}
                </div>
                {renderOptions()}
              </div>}
          </Box>
        </Fade>
      </Modal>
    </div >
  )
}

export default Filter