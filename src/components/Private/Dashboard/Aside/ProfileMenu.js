import React from 'react'
import Aside from './Aside'
import { AiOutlineMenu } from 'react-icons/ai'
import CloseIcon from "@mui/icons-material/Close"
import { Modal, IconButton, Backdrop } from "@mui/material"

const ProfileMenu = (props) => {
  return (
    <>
      <div className="d-md-none d-flex position-fixed dash-menu">
        <span className="shadow rounded p-2 bg-yellow" onClick={() => props.setOpen(true)}><AiOutlineMenu /></span>
      </div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.open}
        onClose={() => props.setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <div className='modal-dashboard-content slide-in-right m-0 p-0'>
          <div className="row h-100">
            <div className="d-flex align-content-between flex-wrap">
              <div className="w-100">
                <div className="d-flex align-items-center">
                  <div className="ms-auto my-3">
                    <IconButton aria-label="Fechar" onClick={() => props.setOpen(false)}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                </div>
                <Aside breshop={props.breshop} setOpen={props.setOpen} />
              </div>
            </div>
          </div>
        </div>
      </Modal >
    </>
  )
}

export default ProfileMenu