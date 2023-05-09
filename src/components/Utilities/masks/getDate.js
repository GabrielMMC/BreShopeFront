export const getDate = (pattern) => {
  const actualDate = new Date();
  const day = actualDate.getDate().toString().padStart(2, "0");
  const month = (actualDate.getMonth() + 1).toString().padStart(2, "0");
  const year = actualDate.getFullYear();

  let formatedDate = '';

  switch (pattern) {
    case 'yyyy-mm-dd':
      formatedDate = `${year}-${month}-${day}`;
      break;
    case 'dd-mm-yyyy':
      formatedDate = `${day}-${month}-${year}`;
      break;
    default:
      console.error(`Formato de data '${pattern}' inválido`);
      return null;
  }

  return formatedDate;
}