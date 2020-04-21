const formatMes = (mes: number): string => {
  const mesFormatted = mes < 10 ? `0${mes}` : mes.toString();
  return mesFormatted;
};

const formatDate = (date: Date): string => {
  const fullDate = new Date(date);
  const dia = fullDate.getDate();
  const mes = fullDate.getMonth() + 1;
  const ano = fullDate.getFullYear();

  const dateFormatted = `${dia}/${formatMes(mes)}/${ano}`;

  return dateFormatted;
};

export default formatDate;
