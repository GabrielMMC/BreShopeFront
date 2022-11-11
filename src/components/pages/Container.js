import React from 'react'
import Theme from '../routes/Theme/Theme'
import { ThemeProvider } from '@mui/material'
import Navbar from './Navbar'

const Container = ({ children }) => {
  return (
    <ThemeProvider theme={Theme}>
      <div className='bg-light' style={{ minHeight: '100vh' }}>
        <Navbar />
        <div className="m-auto bg-white mt-5 p-5 rounded" style={{ maxWidth: 1000 }}>
          {children}
        </div>
      </div >
    </ThemeProvider >
  )
}

export default Container