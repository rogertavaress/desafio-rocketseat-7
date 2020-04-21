const formatValue = (value: number): string => {
  return `${Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    currencyDisplay: 'symbol',
  }).format(value)}`;
};
export default formatValue;
