const parseDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
};

export { parseDate };
