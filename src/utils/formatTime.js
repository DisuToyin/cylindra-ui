import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export function formatTimeAgo(timestamp) {
  const currentDate = new Date();
  const providedDate = new Date(timestamp);

  const timeDifferenceInSeconds = Math.floor((currentDate - providedDate) / 1000);

  let result = '';

  if (timeDifferenceInSeconds < 60) {
    result = `${timeDifferenceInSeconds} second${timeDifferenceInSeconds !== 1 ? 's' : ''} ago`;
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    result = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    result = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (timeDifferenceInSeconds < 604800) {
    const days = Math.floor(timeDifferenceInSeconds / 86400);
    result = `${days} day${days !== 1 ? 's' : ''} ago`;
  } else {
    const weeks = Math.floor(timeDifferenceInSeconds / 604800);
    result = `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }

  return result;
}
