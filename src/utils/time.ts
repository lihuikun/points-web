export const formatDate = (isoDate: string) => {
  if (!isoDate) return '';
  // 加8小时
  const date = new Date(new Date(isoDate).getTime() + 8 * 60 * 60 * 1000);
  console.log("🚀 ~ formatDate ~ date:", date,isoDate)
  return date.toISOString().replace('T', ' ').substring(0, 19);
};