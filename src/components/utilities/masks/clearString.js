const numberMask = (value) => {
  if (typeof value === 'string') value.replace(/\D/g, "");
  return value
}

export default numberMask