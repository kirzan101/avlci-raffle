export function getFormattedDate(date) {
  return date.toISOString().slice(0, 10);
}

export function getDateTime(date) {
  return date.toLocaleString();
}

export function getTime(date) {
  return date.toLocaleTimeString();
}

export function getDateMinusDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}

export function convertToDate(date) {
  return new Date(date);
}
