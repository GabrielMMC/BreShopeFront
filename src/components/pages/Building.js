import React from 'react'
import Container from './Container'
import building from '../../assets/building.png'

const Building = () => {
  return (
    <Container>
      <div >
        <h6 className='main-title'>Página em construção...</h6>
        <div className='d-flex justify-content-center'>
          <div style={{ width: '70%', marginTop: -125 }}>
            <img src={building} alt="building" className='img-fluid' />
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Building