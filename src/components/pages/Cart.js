import * as React from "react";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, IconButton } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// -------------------------------------------------------------------
//********************************************************************
// -------------------------Styles------------------------------------
const style = {
 position: "absolute",
 left: "50%",
 width: "50%",
 height: "100%",
 bgcolor: "background.paper",
 boxShadow: 24,
 p: 4,
};

const Cart = ({ handleToggleCart, open }) => {
 return (
  <>
   <IconButton onClick={handleToggleCart}>
    <ShoppingCartIcon sx={{ color: 'white' }} />
   </IconButton>

   <Modal
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
    open={open}
    onClose={handleToggleCart}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{
     timeout: 500,
    }}
   >
    <Fade in={open}>
     <Box sx={style}>
      <div className="row">asdaszd</div>
     </Box>
    </Fade>
   </Modal >
  </ >
 )
}

export default Cart