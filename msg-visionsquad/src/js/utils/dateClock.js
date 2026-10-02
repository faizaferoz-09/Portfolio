/**
 * Real-time clock and counter functions for FandomVerse
 */

export function getFormattedClock(date = new Date()) {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = String(hours % 12 || 12).padStart(2, '0');

  const timeString = `${displayHours}:${minutes}:${seconds} ${ampm}`;
  
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  const dateString = date.toLocaleDateString('en-US', options);
  
  // Simulated Fandom Standard Timezone indicator
  const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  return {
    hours: displayHours,
    minutes,
    seconds,
    ampm,
    timeString,
    dateString,
    fullString: `${dateString} • ${timeString} (${tzName})`,
    raw: date
  };
}

export function formatVisitorDigits(count) {
  const str = String(count).padStart(7, '0');
  return str.split(''); // ['0', '1', '4', '2', '8', '5', '0']
}

export function formatRelativeTime(dateStr) {
  try {
    const past = new Date(dateStr);
    const now = new Date();
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 30) return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return 'Just now';
  } catch {
    return dateStr;
  }
}
