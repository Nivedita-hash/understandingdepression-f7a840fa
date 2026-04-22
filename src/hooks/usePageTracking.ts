import { useEffect, useRef } from 'react';
import { type StandardPage, trackPageEnter, trackPageExit } from '@/lib/analytics';

/**
 * Fires page_enter on mount and page_exit (with time_spent) on
 * unmount + beforeunload. Drop-in replacement for manual tracking.
 */
export function usePageTracking(page: StandardPage): void {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    trackPageEnter(page);

    const fireExit = () => {
      const sec = Math.round((Date.now() - startRef.current) / 1000);
      trackPageExit(page, sec);
    };

    window.addEventListener('beforeunload', fireExit);

    return () => {
      fireExit();
      window.removeEventListener('beforeunload', fireExit);
    };
  }, [page]);
}
