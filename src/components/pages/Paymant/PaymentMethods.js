import React from 'react'
import cardMask from 'utils/masks/card'

const PaymentMethods = ({ payment }) => {
 return (
  <form className='anime-left mt-3' onSubmit={(e) => { handleSave(e) }}>
   <div className="row align-items-end">
    <div className="col-6">
     <div className="form-floating">
      <input className="form-control" id="name" type="text" value={payment?.holder_name} onChange={({ target }) => setPayment({ ...payment, holder_name: target.value })} required />
      <label htmlFor="name">Nome do Títular*</label>
     </div>
    </div>

    <div className="col-6">
     <div className='input-group'>
      <div className="form-floating">
       <input className="form-control" id="card" type="text" value={payment?.card?.mask} onChange={({ target }) => { { brand, mask, length, cvv, value } = maskCard(target.value) }} required />
       <label htmlFor="card">Cartão*</label>
      </div>
      <div className='brand'><img src={`${STORAGE_URL}brands/${card.brand ? card.brand : 'nocard'}.png`} alt='brand'></img></div>
     </div>
    </div>
   </div>

   <div className='col-12 mt-4'>
    <div className="form-floating">
     <input className="form-control" id="document" type="text" value={document?.mask} onChange={({ target }) => setDocument(() => cpfMask(target.value))} required />
     <label htmlFor="document">CPF do Títular*</label>
    </div>
   </div>

   <div className="row mt-4">
    <div className="col-3">
     <div className="form-floating">
      <select className="form-control" id="month" type="text" value={month} onChange={({ target }) => setMonth(target.value)} required>
       {fillMonth.map(item => (
        <option key={item} value={item}>{item}</option>
       ))}
      </select>
      <label htmlFor="month">Mês*</label>
     </div>
    </div>

    <div className="col-6">
     <div className="form-floating">
      <select className="form-control" id="year" type="text" value={year} onChange={({ target }) => setYear(target.value)} required>
       {fillYear.map(item => (
        <option key={item} value={item}>{item}</option>
       ))}
      </select>
      <label htmlFor="year">Ano*</label>
     </div>
    </div>

    <div className="col-3">
     <div className="form-floating">
      <input className="form-control" id="cvv" type="number" value={cvv} onChange={({ target }) => handleCvvChange(target.value)} />
      <label htmlFor="cvv">CVV*</label>
     </div>
    </div>
   </div>

   <div className="d-flex mt-5">
    <button style={{ cursor: "pointer", padding: "1rem 2rem", flexGrow: "0", flexBasis: "1rem", }} className="normal-archor special" onClick={() => history("/")}>
     Voltar
    </button>
    <button style={{ cursor: "pointer", padding: "1rem 2rem", flexGrow: "0", flexBasis: "1rem", }} className="normal-archor special ms-auto" type="submit" disabled={loadingSave}>
     {loadingSave ? <CircularProgress size={20} color='inherit' /> : 'Enviar'}
    </button>
   </div>
  </form>
 )
}

export default PaymentMethods