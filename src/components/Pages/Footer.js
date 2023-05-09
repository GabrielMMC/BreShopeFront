import React from 'react'
import elo from '../../assets/elo.png'
import pix from '../../assets/pix.png'
import amex from '../../assets/amex.png'
import aura from '../../assets/aura.png'
import visa from '../../assets/visa.png'
import jcb from '../../assets/jcb_15.png'
import { IconButton } from '@mui/material'
import diners from '../../assets/diners.png'
import boleto from '../../assets/boleto.png'
import { useNavigate } from 'react-router-dom'
import maestro from '../../assets/maestro.png'
import MailIcon from '@mui/icons-material/Mail'
import discover from '../../assets/discover.png'
import hipercard from '../../assets/hipercard.png'
import mastercard from '../../assets/mastercard.png'
import FacebookIcon from '@mui/icons-material/Facebook'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import InstagramIcon from '@mui/icons-material/Instagram'

const Footer = () => {
  const history = useNavigate()

  return (
    <footer className='container-fluid bg-gray py-4' style={{ position: 'relative', bottom: 0 }}>
      <div className="row w-principal m-auto">

        <div className="col-md-3 col-sm-6">
          <span className='bold'>ATENDIMENTO AO CLIENTE</span>
          <div className="d-flex flex-column small" onClick={() => history('/building')}>
            <span>Como comprar</span>
            <span>Ajuda</span>
            <span>Entre em contato</span>
            <span>Começando como revendedor</span>
            <span>Ouvidoria</span>
            <span>Suporte</span>
            <span>Devolução e reembolso</span>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <span className='bold'>SOBRE A BRESHOP</span>
          <div className="d-flex flex-column small" onClick={() => history('/building')}>
            <span>Sobre nós</span>
            <span>Imprensa</span>
            <span>Política Breshop</span>
            <span>Política de devolução</span>
            <span>Política de Privacidade</span>
            <span>Termos de uso</span>
            <span>Blog Breshop</span>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <span className='bold'>NOS SIGA</span>
          <div className="d-flex align-items-start flex-column">
            <div>
              <IconButton aria-label='Facebook'><FacebookIcon sx={{ color: '#333' }} /></IconButton>
              <span className='small'>Facebook</span>
            </div>
            <div>
              <IconButton aria-label='Whatsapp'><WhatsAppIcon sx={{ color: '#333' }} /></IconButton>
              <span className='small'>WhatsApp</span>
            </div>
            <div>
              <IconButton aria-label='Instagram'><InstagramIcon sx={{ color: '#333' }} /></IconButton>
              <span className='small'>Instagram</span>
            </div>
            <div>
              <IconButton aria-label='Email'><MailIcon sx={{ color: '#333' }} /></IconButton>
              <span className='small'>Email</span>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <span>FORMAS DE PAGAMENTO</span>
          <div className="d-flex flex-wrap align-items-center">
            <img width="50" height="30" src={mastercard} alt="mastercard" className='footer-img' />
            <img width="50" height="30" src={maestro} alt="maestro" className='footer-img' />
            <img width="50" height="30" src={visa} alt="visa" className='footer-img' />
            <img width="50" height="30" src={discover} alt="discover" className='footer-img' />
            <img width="50" height="30" src={amex} alt="amex" className='footer-img' />
            <img width="50" height="30" src={aura} alt="aura" className='footer-img' />
            <img width="50" height="30" src={jcb} alt="amex" className='footer-img' />
            <img width="50" height="30" src={hipercard} alt="hipercard" className='footer-img' />
            <img width="50" height="30" src={diners} alt="diners" className='footer-img' />
            <img width="50" height="30" src={elo} alt="elo" className='footer-img' />
            <img width="50" height="30" src={boleto} alt="boleto" className='footer-img' />
            <img width="50" height="30" src={pix} alt="pix" className='footer-img' />
          </div>
        </div>
      </div>
    </footer >
  )
}

export default Footer