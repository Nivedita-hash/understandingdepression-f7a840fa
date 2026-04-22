import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { type StandardPage, trackPageEnter, trackPageExit } from '@/lib/analytics';

/**
 * Maps pathname → StandardPage. Returns null for unknown routes.
 */
function toStandardPage(pathname: string): StandardPage | null {
  const map: Record<string, StandardPage> = {
    '/': 'home',
    '/pre-assessment': 'pre_assessment',
    '/about-depression': 'about',
    '/pre-video': 'pre_video',
    '/video': 'video',
    '/video-transition': 'transition',
    '/choice': 'choice',
    '/compare': 'dashboard',
    '/post-assessment': 'post_assessment',
    '/learned': 'learned',
    '/bibliography': 'bibliography',
  };
  return map[pathname] ?? null;
}

/**
 * Centralized SPA route tracker.
 * Place once inside <BrowserRouter>.
 *
 * Fires page_enter on every route change and page_exit (with time_spent)
 * when navigating away OR on beforeunload.
 */
export default function RouteTracker() {
  const location = useLocation();
  const prevPageRef = useRef<StandardPage | null>(null);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    const currentPage = toStandardPage(location.pathname);

    // Fire exit for the previous page
    if (prevPageRef.current) {
      const sec = Math.round((Date.now() - startRef.current) / 1000);
      trackPageExit(prevPageRef.current, sec);
    }

    // Fire enter for the new page
    if (currentPage) {
      startRef.current = Date.now();
      trackPageEnter(currentPage);
    }

    prevPageRef.current = currentPage;
  }, [location.pathname]);

  // Handle tab close / browser navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (prevPageRef.current) {
        const sec = Math.round((Date.now() - startRef.current) / 1000);
        trackPageExit(prevPageRef.current, sec);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return null;
}
