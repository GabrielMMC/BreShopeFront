import React from 'react';
import { URL } from '../../variables'
import { useNavigate } from 'react-router-dom';
import { Tooltip, Rating } from '@mui/material';
import characterLimitMask from '../utilities/masks/characterLimit';
import dateMask from '../utilities/masks/date';

const BreshopCard = ({ shop }) => {
  const history = useNavigate()
  let name = Array.from(shop.name)
  let tooltip = false
  if (name.length > 20) { name = name.splice(0, 20).toString().replace(/,/g, '') + '...'; tooltip = true }
  else { name = name.toString().replace(/,/g, ''); tooltip = false }

  return (
    <div className="d-flex align-items-center" style={{ maxWidth: 400 }} onClick={() => history(`/breshop/${shop.id}`)}>
      <div className='d-flex' style={{ height: 125 }}>
        <img className='w-100 h-100 rounded-50' src={`${URL}storage/${shop.file}`} alt="shop" />
      </div>
      <div className="row mx-3">
        <div className="d-flex">
          {tooltip ?
            <Tooltip placement='top' arrow title={shop.name}><p className='product-subtitle me-2'>{name}</p></Tooltip> : <p className='product-subtitle me-2'>{name}</p>
          }
          <Rating value={shop.average_rating} precision={0.1} readOnly />
        </div>
        <div className="d-flex flex-column flex-wrap">
          <p className='product-subtitle'>{characterLimitMask(shop.description, 80)}</p>
          <p className="product-subtitle">Criada em: {dateMask(shop.created_at)}</p>
        </div>
      </div>
    </div>
  )
}

export default BreshopCard