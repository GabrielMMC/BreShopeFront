export const moneyMask = (value) => {
    try {
        value = value.replace('.', '').replace(',', '').replace(/\D/g, '')
    } catch { value = value }

    const options = { minimumFractionDigits: 2 };
    const result = new Intl.NumberFormat('pt-BR', options).format(parseFloat(value) / 100);

    return 'R$ ' + result;
}

export const moneyMaskToFloat = (value) => parseFloat(value.replaceAll(",", ".").replaceAll(/[^0-9.]/g, ""));