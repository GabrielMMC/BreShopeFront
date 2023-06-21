import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip, Rating } from '@mui/material';
import dateMask from '../../Utilities/masks/date';
import characterLimitMask from '../../Utilities/masks/characterLimit';
import { URL } from '../../../variables';

const BreshopCard = ({ shop }) => {
  const shopImageUrl = React.useMemo(() => `${URL}storage/${shop.file}`, [shop.file]);
  const history = useNavigate()
  let name = Array.from(shop.name)
  let tooltip = false
  if (name.length > 15) { name = name.splice(0, 15).toString().replace(/,/g, '') + '...'; tooltip = true }
  else { name = name.toString().replace(/,/g, ''); tooltip = false }

  return (
    <div className="d-flex flex-wrap justify-content-center" style={{ maxWidth: 450 }} onClick={() => history(`/breshop/${shop.id}`)}>
      <div className="d-flex" style={{ height: 125, minWidth: 125, maxWidth: 125 }}>
        <img style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '50%' }} src={shopImageUrl} alt="shop" />
      </div>
      <div className="row mx-3">
        <div className="d-flex justify-content-center">
          {tooltip ?
            <Tooltip placement='top' arrow title={shop.name}><p className='product-subtitle me-2'>{name}</p></Tooltip> : <p className='product-subtitle me-2'>{name}</p>
          }
          <Rating value={shop.average_rating} precision={0.1} readOnly />
        </div>
        <div className="d-flex flex-wrap align-content-between">
          <div className="w-100">
            <p className='product-subtitle'>{characterLimitMask(shop.description, 70)}</p>
          </div>
          <div className="w-100">
            <p className="product-subtitle">Criada em: {dateMask(shop.created_at)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BreshopCard