import { useEffect } from 'react';
import { createPageTimer } from '@/lib/timeTracking';

type TrackedPage = 'case1' | 'case2' | 'case3' | 'case4' | 'video' | 'dashboard';

/** Hook that tracks active time on a page. Automatically pauses on tab switch / blur. */
export function usePageTimer(page: TrackedPage): void {
  useEffect(() => {
    const cleanup = createPageTimer(page);
    return cleanup;
  }, [page]);
}
