import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { CircularProgress, IconButton } from "@mui/material";
import { API_URL, STORAGE_URL } from "utils/variables";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import './styles.css';
import { moneyMask } from "utils/masks/currency";
import { get } from "utils/requests";
import dateMask from "utils/masks/date";

const style = {
  position: "absolute",
  left: "50%",
  width: "50%",
  height: "100%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function MoreInfo(props) {
  const [open, setOpen] = React.useState(false);
  const [order, setOrder] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    const getData = async () => {
      const response = await get(`${API_URL}/orders/${props.id}`);
      setOrder(response.order);
    };

    if (open) getData();
  }, [open]);

  const handleStatus = (status) => {
    switch (status) {
      case "pending":
        return { style: { backgroundColor: "#FFFF66" }, status: 'PENDENTE' }

      case "paid":
        return { style: { backgroundColor: "#8AFF8A" }, status: 'PAGO' };

      case "failed":
        return { style: { backgroundColor: "#FF8A8A" }, status: 'FALHA' };

      case "canceled":
        return { style: { backgroundColor: "#FF8A8A" }, status: 'CANCELADO' };

      default:
        return null;
    }
  };

  const handleMethod = (method) => {
    switch (method) {
      case "credit_card":
        return "Crédito";
      default:
        return method;
    }
  };

  return (
    <div>
      <IconButton color='inherit' onClick={handleOpen}>
        <VisibilityIcon size={17} />
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
            <div className="d-flex">
              <div>
                <span className="lead">Detalhes do Pedido</span>
                <p className="text-muted">Saiba mais sobre o seu pedido!</p>
              </div>
              <div className="ms-auto">
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <hr />
            {order ?
              <div className="row">
                {order.charges.map((item, index) => {
                  const { style, status } = handleStatus(item.status)
                  return (
                    // <div key={index} className="row my-5 rounded" style={{ backgroundColor: "#DCDCDC" }}>
                    <div key={index} className={`${order.charges.length > 1 ? 'col-5' : 'col-12'} py-3 m-auto rounded`} style={{ whiteSpace: 'nowrap', backgroundColor: "#DCDCDC" }}>
                      <div className="d-flex">
                        <p>Pago em: </p>
                        <p className="ms-2">{item.paid_at ? dateMask(item.paid_at) : '- / - / -'}</p>
                      </div>

                      <div className="d-flex">
                        <LocalAtmIcon size={20} />
                        <p className="ms-1">{moneyMask(item.amount)}</p>
                      </div>

                      <div className="d-flex mt-2">
                        <CreditCardIcon size={20} />
                        <p className="ms-1">
                          {handleMethod(item.payment_method)}
                        </p>
                        {item.last_transaction.installments &&
                          <div className="d-flex ms-2">{item.last_transaction.installments}X</div>
                        }
                      </div>

                      <span style={style} className="m-1 text-center row status small">{status}</span>
                    </div>
                    // </div>
                  );
                })}

                {order.products.map((item, index) => (
                  <div key={index} className={`col-11 py-3 m-auto rounded mt-3`} style={{ backgroundColor: "#DCDCDC" }}>
                    <p className="lead">{item.product?.name}</p>
                    <div className="d-flex">
                      {item.images.map(img => (
                        <>
                          {img && <div key={img.path} style={{ width: 100, height: 100, marginRight: '1rem' }}>
                            <img style={{ width: '100%', height: '100%', borderRadius: '.4rem' }} src={`${STORAGE_URL}/${img?.path}`} />
                          </div>
                          }
                        </>
                      ))}
                    </div>
                    <p className="small mt-1">{item.product?.description}</p>
                    <span className="small">{moneyMask(10000)}</span>
                    <span className="text-center row" style={{ backgroundColor: '#FFF', height: '.1rem' }} />
                  </div>
                )
                )}
              </div>
              : <div className="d-flex justify-content-center p-5">
                <CircularProgress color='inherit' />
              </div>}
          </Box>
        </Fade>
      </Modal >
    </div >
  );
}
