import React from 'react'

const CategoryCard = (props) => {
  return (
    <div className="mx-5 my-3 hvr-grow align-items-center pointer" style={{ width: 175, height: 175 }}>
      <div className='category d-flex align-items-center m-auto'>
        <props.icon size={70} className='m-auto' />
      </div>
      <p className='subtitle text-center'>{props.title}</p>
    </div>
  )
}

export default CategoryCard