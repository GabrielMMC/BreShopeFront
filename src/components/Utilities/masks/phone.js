export const phoneMask = (value) => {
  if (value) {
    value = value.replace(/\D/g, '')
    if (Array.from(value).length <= 11) { return { value, mask: value.substring(0, 11).replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2 - $3') } }
    else return { value, mask: value.substring(0, 11) }
  } else {
    return ''
  }
}

export const splitNumber = (value) => {
  const area = value.mask.match(/\([^)\d]*(\d+)[^)\d]*\)/g)[0].replace(/\D/g, '')
  const numb = value.mask.substring(value.mask.indexOf(")") + 1).replace(/\D/g, '')

  return { area, numb }
}

export const splitNumberv2 = (value) => {
  const area = value.substring(0, 2)
  const number = value.substring(2)

  return { area, number }
}
