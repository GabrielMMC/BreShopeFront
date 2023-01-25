import React from 'react'
import Theme from '../routes/Theme/Theme'
import { ThemeProvider } from '@mui/material'
import Navbar from './Navbar'
import Footer from './Footer'

const Container = ({ children }) => {
  return (
    <ThemeProvider theme={Theme}>
      <div className="bg-gray" style={{ overflowX: 'hidden', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ minHeight: 'calc(100vh - 459px)' }}>
          <div className="content m-auto my-5" style={{ maxWidth: 1000 }}>
            {children}
          </div>
        </div>
        <Footer />
      </div>
    </ThemeProvider >
  )
}

export default Container