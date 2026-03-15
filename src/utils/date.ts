const SOUTH_AFRICA_TIME_ZONE = 'Africa/Johannesburg';

const southAfricaDatePartsFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: SOUTH_AFRICA_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

export function getSouthAfricaDateKey(now = new Date()): string {
  return southAfricaDatePartsFormatter.format(now);
}

export function daysSinceEpoch(dateKey: string): number {
  const [year, month, day] = dateKey.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

export function formatSouthAfricaDateLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Intl.DateTimeFormat('en-ZA', {
    timeZone: SOUTH_AFRICA_TIME_ZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
