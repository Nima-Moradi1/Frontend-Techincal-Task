   export const formatMsToDuration = (ms: number): string => {
  if (ms <= 0) return '00d:00:00';
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  return `${String(days).padStart(2, '0')}d:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};
   export const parseDate = (dateStr: string): Date => {
  const [d, m, y] = dateStr.split('/').map(Number);
  return new Date(y, m - 1, d);
};
export const getDurationStr = (fromStr: string, toStr: string): string | null => {
  if (!toStr) return null;
  const fromDate = parseDate(fromStr);
  const toDate = parseDate(toStr);
  const ms = fromDate.getTime() - toDate.getTime();
  if (ms <= 0) return '00d:00:00';
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  return `${String(days).padStart(2, '0')}d:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};
   export const formatDate = (date: Date) => {
      const d = String(date.getDate()).padStart(2, '0');
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const y = date.getFullYear();
      return `${d}/${m}/${y}`;
    };