import React from 'react'
import { useParams } from 'react-router-dom'
import { GET_FETCH, URL } from '../../../variables'
import { CircularProgress, Typography } from '@mui/material'

const Confirm = (props) => {
  const [product, setProduct] = React.useState('')
  const [quantity, setQuantity] = React.useState(1)
  const params = useParams()

  React.useEffect(() => {
    getData()
  }, [])

  async function getData() {
    const resp = await GET_FETCH({ url: `${URL}api/get_public_product/${params.id}` })
    props.setForm({ amount: { value: resp.product.price }, description: { value: resp.product.description }, quantity: { value: quantity }, code: { value: resp.product.id } })
    setProduct(resp.product)
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body rounded">
            {product ? <div className="d-flex" style={{ maxHeight: '100px' }}>
              <div className='d-flex'>
                <img src={`${URL}storage/${product.images[0].file}`} style={{ width: 100, height: 100, borderRadius: 10 }} alt="product_image" />
                <div className='m-2'>
                  <Typography>{product.name}</Typography>
                  <Typography>{product.owner.name}</Typography>
                  <Typography>{product.material}</Typography>
                </div>
                <div className='m-2'>
                  <Typography>{product.description}</Typography>
                </div>
                {product.damage_description && <div className='m-2'>
                  <Typography>{product.damage_description}</Typography>
                </div>}
              </div>
              <div className="ms-auto">
                <div>
                  <Typography>{product.price}</Typography>
                  <Typography>{quantity}</Typography>
                </div>
              </div>
            </div> : <CircularProgress />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Confirm