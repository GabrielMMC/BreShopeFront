import React from 'react'
import Container from './Container'
import { GET_PUBLIC_FETCH } from '../../variables'
import { useParams } from 'react-router-dom'
import { renderToast } from '../utilities/Alerts'
import { URL } from '../../variables'

const Breshop = () => {
  const [shop, setShop] = React.useState('')
  const [ratings, setRatings] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const params = useParams()

  React.useEffect(() => {
    const getData = async () => {
      const response = await GET_PUBLIC_FETCH({ url: `${URL}api/public/breshops/${params.id}` })
      console.log('response', response)

      if (response.status) {
        setShop(response.breshop)
      } else {
        renderToast({ type: 'error', error: response.message })
      }
    }

    getData()
  }, [])

  return (
    <Container>
      <div className="bg-white mt-5 p-sm-5 rounded">
        <div className="d-flex">
          <div className='d-flex' style={{ width: 125, height: 125 }}>
            <img src={`${URL}storage/${shop.file}`} alt="shop" className='img-fluid rounded-50' />
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Breshop