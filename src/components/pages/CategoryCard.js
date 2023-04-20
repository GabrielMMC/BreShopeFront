import React from 'react'

const CategoryCard = (props) => {
  const handleTypeChange = () => {
    const style = props.styles.filter(item => item.name === props.title)[0]
    if (!props.selectedStyles.filter(item => item.id === style.id)[0]) props.setSelectedStyles([...props.selectedStyles, style])
    window.scrollTo(0, 0)
  }

  return (
    <div className="mx-5 my-3 hvr-grow align-items-center pointer" style={{ width: 175, height: 175 }} onClick={handleTypeChange}>
      <div className='category d-flex align-items-center m-auto'>
        <props.icon size={70} className='m-auto' />
      </div>
      <p className='subtitle text-center'>{props.title}</p>
    </div>
  )
}

export default CategoryCard