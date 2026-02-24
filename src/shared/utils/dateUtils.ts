const notificationDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  day: 'numeric',
  hour: 'numeric',
  hour12: true,
  minute: '2-digit',
  month: 'long',
});

export const formatNotificationDate = (value: string): string => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return notificationDateFormatter.format(parsedDate);
};
