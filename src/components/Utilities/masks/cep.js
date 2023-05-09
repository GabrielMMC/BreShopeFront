const cepMask = (value) => {
  if (value) return value.replace(/\D/g, "").replace(/(\d{5})(\d{3})/g, '$1-$2')
  else return '';
}

export default cepMask