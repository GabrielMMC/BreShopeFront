const phoneMask = (value) => {
 value = value.replace(/\D/g, '')
 if (Array.from(value).length <= 10) { return { value, mask: value.replace(/(\d{2})(\d{4})(\d{4})/g, '($1) $2 - $3') } }
 if (Array.from(value).length === 11) { return { value, mask: value.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2 - $3') } }
}

export default phoneMask