export const checkDateStatus = (dateString: string): string => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const threeMonthsFromNow = new Date(now);
  threeMonthsFromNow.setMonth(now.getMonth() + 3);
  threeMonthsFromNow.setHours(0, 0, 0, 0);

  if (date.getTime() <= now.getTime()) {
    return 'expired';
  } else if (date.getTime() <= threeMonthsFromNow.getTime()) {
    return 'near';
  }

  return 'normal';
};
