import { Box, Container, ThemeProvider } from '@mui/material'
import React from 'react'
import logo from '../../assets/ben10.jpg'
import Theme from '../routes/Theme/Theme'

const Footer = () => {
  return (
    <ThemeProvider theme={Theme}>
      <footer className='row bg-purple' style={{position: 'relative', bottom: 0}}>
        <div className="col-4">
          <p>logo</p>
        </div>
        <div className="col-4">
          <p>links</p>
        </div>
        <div className="col-4">
          <p>tags</p>
        </div>
      </footer>
    </ThemeProvider>
  )
}

export default Footer