const Installments = (total) => {
 return [
  { value: 1, convert: total * (1 + 4.49 / 100) / 1 },
  { value: 2, convert: total * (1 + 6.47 / 100) / 2 },
  { value: 3, convert: total * (1 + 7.46 / 100) / 3 },
  { value: 4, convert: total * (1 + 8.45 / 100) / 4 },
  { value: 5, convert: total * (1 + 9.44 / 100) / 5 },
  { value: 6, convert: total * (1 + 10.43 / 100) / 6 },
  { value: 7, convert: total * (1 + 11.42 / 100) / 7 },
  { value: 8, convert: total * (1 + 12.41 / 100) / 8 },
  { value: 9, convert: total * (1 + 13.40 / 100) / 9 },
  { value: 10, convert: total * (1 + 14.39 / 100) / 10 },
  { value: 11, convert: total * (1 + 15.38 / 100) / 11 },
  { value: 12, convert: total * (1 + 16.37 / 100) / 12 },
 ]
}

export default Installments