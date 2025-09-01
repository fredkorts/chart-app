export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('et-EE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const parseEstonianDate = (dateStr: string): Date | null => {
  const parts = dateStr.split('.');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // JS months are 0-indexed
  const year = parseInt(parts[2]);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  
  const date = new Date(year, month, day);
  return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year ? date : null;
};