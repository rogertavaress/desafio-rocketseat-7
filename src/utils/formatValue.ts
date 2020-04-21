export const formatValue = (value: number, type: string): string => {
  let valueFormatted;
  if (type === 'outcome') {
    valueFormatted = `- ${Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      currencyDisplay: 'symbol',
    }).format(value)}`;
  } else {
    valueFormatted = `${Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      currencyDisplay: 'symbol',
    }).format(value)}`;
  }

  return valueFormatted;
};

export const formatValueStatus = (value: number): string => {
  return `${Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    currencyDisplay: 'symbol',
  }).format(value)}`;
};
