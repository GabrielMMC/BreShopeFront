import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const Container = ({ children }) => {
  return (
    <div style={{ overflowX: 'hidden', minHeight: '100vh', backgroundColor: '#F0F0F0' }}>
      <Navbar />
      <div className="my-5 m-auto" style={{ maxWidth: 1400 }}>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Container