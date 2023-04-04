import React from 'react'
import logo from '../../assets/logo.png'
import MailIcon from '@mui/icons-material/Mail'
import { IconButton, Typography } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import InstagramIcon from '@mui/icons-material/Instagram'

const Footer = () => {
  return (
    <footer className='container-fluid bg-ligth py-5 w-principal' style={{ position: 'relative', bottom: 0 }}>
      <div className="row">
        {/* <div className="col-md-3 col-sm-6">
          <div className="d-flex flex-column justify-content-center">
            <div style={{ maxHeight: 150, maxWidth: 150 }}>
              <img className='img-fluid' src={logo} alt='logo' />
            </div>
            <span className='small'>Copiraiti Breshop</span>
          </div>
        </div> */}

        <div className="col-md-3 col-sm-6">
          <h6>ATENDIMENTO AO CLIENTE</h6>
          <div className="d-flex flex-column">
            <span className='small'>Como comprar</span>
            <span className='small'>Ajuda</span>
            <span className='small'>Entre em contato</span>
            <span className='small'>Começando como revendedor</span>
            <span className='small'>Ouvidoria</span>
            <span className='small'>Suporte</span>
            <span className='small'>Devolução e reembolso</span>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <h6>SOBRE A BRESHOP</h6>
          <div className="d-flex flex-column">
            <span className='small'>Sobre nós</span>
            <span className='small'>Imprensa</span>
            <span className='small'>Política Breshop</span>
            <span className='small'>Política de devolução</span>
            <span className='small'>Política de Privacidade</span>
            <span className='small'>Termos de uso</span>
            <span className='small'>Blog Breshop</span>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <h6>NOS SIGA</h6>
          <div className="d-flex align-items-start flex-column">
            <div>
              <IconButton><FacebookIcon sx={{ color: '#333' }} /></IconButton>
              <span className='small'>Facebook</span>
            </div>
            <div>
              <IconButton><WhatsAppIcon sx={{ color: '#333' }} /></IconButton>
              <span className='small'>WhatsApp</span>
            </div>
            <div>
              <IconButton><InstagramIcon sx={{ color: '#333' }} /></IconButton>
              <span className='small'>Instagram</span>
            </div>
            <div>
              <IconButton><MailIcon sx={{ color: '#333' }} /></IconButton>
              <span className='small'>Email</span>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <h6>SOBRE A BRESHOP</h6>
          <div className="d-flex flex-column">
            <span className='small'>Sobre nós</span>
            <span className='small'>Imprensa</span>
            <span className='small'>Política Breshop</span>
            <span className='small'>Política de devolução</span>
            <span className='small'>Política de Privacidade</span>
            <span className='small'>Termos de uso</span>
            <span className='small'>Blog Breshop</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer