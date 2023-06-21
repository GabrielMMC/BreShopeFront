import React from "react";
import { useNavigate } from 'react-router-dom'
import { FiUser } from 'react-icons/fi'
import { BsCreditCard } from 'react-icons/bs'
import { BiHomeSmile } from 'react-icons/bi'
import { TbShirt } from 'react-icons/tb'
import { RiBillLine } from 'react-icons/ri'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { MdOutlineLocalShipping, MdOutlineLocalOffer } from 'react-icons/md'
import { AiOutlineLineChart } from 'react-icons/ai'
// import { useSelector, useDispatch } from 'react-redux';

const Aside = ({ breshop, setOpen }) => {
  const history = useNavigate()
  // let user = useSelector(store => store.AppReducer.user);
  const handleNavigate = (url) => {
    history(url)
    if (setOpen) setOpen(false)
  }

  return (
    <nav className="user-dash h-100">
      <ul>
        <li className='hvr-grow pointer' onClick={() => handleNavigate('/profile')}>
          <FiUser />
          <p className='small' style={{ color: 'black' }}>Dados Gerais</p>
        </li>
        <li className='hvr-grow pointer' onClick={() => handleNavigate('/profile/address')}>
          <MdOutlineLocalShipping />
          <p className='small' style={{ color: 'black' }}>Endereços</p>
        </li>
        <li className='hvr-grow pointer' onClick={() => handleNavigate('/profile/payment')}>
          <BsCreditCard />
          <p className='small' style={{ color: 'black' }}>Cartões</p>
        </li>
        <li className='hvr-grow pointer' onClick={() => handleNavigate('/profile/orders')}>
          <RiBillLine />
          <p className='small' style={{ color: 'black' }}>Pedidos</p>
        </li>
        <li className='hvr-grow pointer' onClick={() => handleNavigate('/profile/breshop')}>
          <BiHomeSmile />
          <p className='small' style={{ color: 'black' }}>Minha loja</p>
        </li>
        {breshop &&
          <>
            <li className='hvr-grow pointer' onClick={() => handleNavigate('/profile/products')}>
              <TbShirt />
              <p className='small' style={{ color: 'black' }}>Meus produtos</p>
            </li>
            <li className='hvr-grow pointer' onClick={() => handleNavigate('/profile/sales')}>
              <MdOutlineLocalOffer />
              <p className='small' style={{ color: 'black' }}>Minhas promoções</p>
            </li>
            <li className='hvr-grow pointer' onClick={() => handleNavigate('/profile/withdrawals')}>
              <FaRegMoneyBillAlt />
              <p className='small' style={{ color: 'black' }}>Meus saques</p>
            </li>
            {/* <li className='hvr-grow pointer' onClick={() => handleNavigate('/profile/recipient-orders')}>
                      <AiOutlineLineChart />
                      <p className='small' style={{ color: 'black' }}>Meus pedidos</p>
                    </li> */}
          </>}
      </ul>
    </nav>
  );
};

export default Aside;
