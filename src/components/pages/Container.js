import React from 'react'
import Theme from '../routes/Theme/Theme'
import { ThemeProvider } from '@mui/material'
import Navbar from './Navbar'
import Footer from './Footer'

const Container = ({ children }) => {
  return (
    <ThemeProvider theme={Theme}>
      <div className='content'>
        <Navbar />
        <div className="m-auto bg-white mt-5 p-5 rounded" style={{ maxWidth: 1000 }}>
          {children}
        </div>
        <Footer />
      </div >
    </ThemeProvider >
  )
}

export default Container