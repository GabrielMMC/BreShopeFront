import React, { useState } from "react"
import { MdClose } from 'react-icons/md'
import { RiArrowDropDownLine } from 'react-icons/ri'
import './styles.css'

const Accordion = ({ types, styles, materials, selectedStyles, setSelectedStyles, selectedTypes, setSelectedTypes, selectedMaterials, setSelectedMaterials }) => {
  const [activeItems, setActiveItems] = useState(['styles']);


  const toggleAccordion = (item) => {
    if (activeItems.includes(item)) setActiveItems(activeItems.filter(active => active !== item));
    else setActiveItems([...activeItems, item]);

    let filtredStyles = []
    styles.forEach(item => {
      selectedStyles.forEach(item2 => {
        if (item.id === item2) filtredStyles = [...filtredStyles, item]
      })
    })
  };

  const handleAddStyle = (style) => {
    if (!selectedStyles.filter(item => item.id === style.id)[0]) setSelectedStyles([...selectedStyles, style])
  }

  const handleAddType = (type) => {
    if (!selectedTypes.filter(item => item.id === type.id)[0]) setSelectedTypes([...selectedTypes, type])
  }

  const handleAddMaterial = (material) => {
    if (!selectedMaterials.filter(item => item.id === material.id)[0]) setSelectedMaterials([...selectedMaterials, material])
  }

  const handleDeleteStyle = (id) => {
    setSelectedStyles(styles => { return styles.filter(item => item.id !== id) })
  }

  const handleDeleteType = (id) => {
    setSelectedTypes(types => { return types.filter(item => item.id !== id) })
  }

  const handleDeleteMaterial = (id) => {
    setSelectedMaterials(materials => { return materials.filter(item => item.id !== id) })
  }

  return (
    <nav className="accordion navbar">
      <ul className="navbar-nav">
        {selectedStyles.length > 0 &&
          <div className='d-flex flex-column'>
            <span>Filtro de estilos: </span>
            {selectedStyles.map(item => (<span onClick={() => handleDeleteStyle(item.id)} className='error'>{item.name} <MdClose /></span>))}
          </div>
        }
        <li className="nav-item pointer" onClick={() => toggleAccordion('styles')} >
          <div className="d-flex justify-content-between">
            <span className={`${activeItems.includes('styles') && 'accordion-active'} nav-item-header`}>
              Estilos
            </span>
            <RiArrowDropDownLine size={35} className={activeItems.includes('styles') ? 'rotate-in' : 'rotate-out'} />
          </div>
          <ul className={`${activeItems.includes('styles') && 'show'} accordion-content nav-item-submenu`}>
            {styles && styles.map(item => (
              <li key={item.id}>
                <a href="#" onClick={(e) => { e.stopPropagation(); handleAddStyle(item) }}>{item.name}</a>
              </li>
            ))}
          </ul>
        </li>

        {selectedTypes.length > 0 &&
          <div className='mt-2 d-flex flex-column'>
            <span>Filtro de tipos: </span>
            {selectedTypes.map(item => (<span onClick={() => handleDeleteType(item.id)} className='error'>{item.name} <MdClose /></span>))}
          </div>
        }
        <li className="nav-item pointer" onClick={() => toggleAccordion('types')}>
          <div className="d-flex justify-content-between">
            <span className={`${activeItems.includes('types') && 'accordion-active'} nav-item-header`}>
              Tipos
            </span>
            <RiArrowDropDownLine size={35} className={activeItems.includes('types') ? 'rotate-in' : 'rotate-out'} />
          </div>
          <ul className={`${activeItems.includes('types') && 'show'} accordion-content nav-item-submenu`}>
            {types && types.map(item => (
              <li key={item.id}>
                <a href="#" onClick={(e) => { e.stopPropagation(); handleAddType(item) }}>{item.name}</a>
              </li>
            ))}
          </ul>
        </li>
        {/* <li className="nav-item">
     <span className="nav-item-header">Preços</span>
     <ul className="nav-item-submenu">
      <li><a href="#">Menor que R$ 50</a></li>
      <li><a href="#">R$ 50 - R$ 100</a></li>
      <li><a href="#">Maior que R$ 100</a></li>
     </ul>
    </li> */}

        {selectedMaterials.length > 0 &&
          <div className='mt-2 d-flex flex-column'>
            <span>Filtro de materiais: </span>
            {selectedMaterials.map(item => (<span onClick={() => handleDeleteMaterial(item.id)} className='error'>{item.name} <MdClose /></span>))}
          </div>
        }
        <li className="nav-item pointer" onClick={() => toggleAccordion('materials')}>
          <div className="d-flex justify-content-between">
            <span className={`${activeItems.includes('materials') && 'accordion-active'} nav-item-header`}>
              Materiais
            </span>
            <RiArrowDropDownLine size={35} className={activeItems.includes('materials') ? 'rotate-in' : 'rotate-out'} />
          </div>
          <ul className={`${activeItems.includes('materials') && 'show'} accordion-content nav-item-submenu`}>
            {materials && materials.map(item => (
              <li key={item.id}>
                <a href="#" onClick={(e) => { e.stopPropagation(); handleAddMaterial(item) }}>{item.name}</a>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Accordion;