const numberMask = (value) => {
  if (typeof value === 'string') return value.replace(/\D/g, "");
  else return value
}

export default numberMask