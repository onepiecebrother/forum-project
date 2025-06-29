/**
 * Format a date to a relative time string (e.g., "2 hours ago", "Yesterday")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffInHours < 48) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

/**
 * Format a number with commas for thousands separator
 */
export function formatNumber(value: string | number): string {
  const numericValue = typeof value === 'string' ? value.replace(/\D/g, '') : value.toString();
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Parse a formatted number back to plain number string
 */
export function parseNumber(value: string): string {
  return value.replace(/,/g, '');
}

/**
 * Get member since date string
 */
export function getMemberSince(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString([], { month: 'long', year: 'numeric' });
}

/**
 * Format timestamp for notifications and posts
 */
export function formatTimestamp(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}