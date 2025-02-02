export const getLocalISODate = (date: Date) => {
  if (!date) return "";
  const offset = date.getTimezoneOffset() * 60000; // Compensar zona horaria
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString().split("T")[0];
};
