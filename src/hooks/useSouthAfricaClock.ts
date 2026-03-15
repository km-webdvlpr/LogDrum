import { useEffect, useState } from 'react';
import { formatSouthAfricaDateLabel, getSouthAfricaDateKey } from '../utils/date';

export function useSouthAfricaClock() {
  const [dateKey, setDateKey] = useState(() => getSouthAfricaDateKey());

  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = getSouthAfricaDateKey();
      setDateKey((current) => (current === next ? current : next));
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  return {
    dateKey,
    dateLabel: formatSouthAfricaDateLabel(dateKey)
  };
}
