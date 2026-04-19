// Session-based time tracking for evaluation analytics
// Session ID & start time are owned by analytics.ts so GA user_id and
// the Sheets payload share the exact same session_id.

import { getSessionId as gaGetSessionId, getStartTime, bindGaUser, gaEvent } from './analytics';

const PAGE_TIMES_KEY = 'page_times';
const EVALUATION_KEY = 'evaluation_data';

// Tracked page keys
type TrackedPage = 'case1' | 'case2' | 'case3' | 'case4' | 'video' | 'dashboard';

/** Initialize session on Home page load */
export function initSession(): void {
  // Touch session_id + start_time so they exist
  gaGetSessionId();
  getStartTime();
  bindGaUser();
  if (!localStorage.getItem(PAGE_TIMES_KEY)) {
    localStorage.setItem(PAGE_TIMES_KEY, JSON.stringify({
      case1: 0, case2: 0, case3: 0, case4: 0, video: 0, dashboard: 0,
    }));
  }
}

export function getSessionId(): string {
  return gaGetSessionId();
}

/** Get stored page times */
function getPageTimes(): Record<TrackedPage, number> {
  try {
    return JSON.parse(localStorage.getItem(PAGE_TIMES_KEY) || '{}');
  } catch {
    return { case1: 0, case2: 0, case3: 0, case4: 0, video: 0, dashboard: 0 };
  }
}

/** Save accumulated time for a page */
function savePageTime(page: TrackedPage, ms: number): void {
  const times = getPageTimes();
  times[page] = (times[page] || 0) + ms;
  localStorage.setItem(PAGE_TIMES_KEY, JSON.stringify(times));
}

/**
 * Creates a page timer that handles visibility/focus changes.
 * Returns a cleanup function to call on unmount.
 */
export function createPageTimer(page: TrackedPage): () => void {
  let startTime = Date.now();
  let accumulated = 0;
  let isActive = true;

  const pause = () => {
    if (isActive) {
      accumulated += Date.now() - startTime;
      isActive = false;
    }
  };

  const resume = () => {
    if (!isActive) {
      startTime = Date.now();
      isActive = true;
    }
  };

  const handleVisibility = () => {
    if (document.hidden) pause();
    else resume();
  };

  const handleBlur = () => pause();
  const handleFocus = () => resume();

  document.addEventListener('visibilitychange', handleVisibility);
  window.addEventListener('blur', handleBlur);
  window.addEventListener('focus', handleFocus);

  // Cleanup: save time, fire GA page_time, remove listeners
  return () => {
    if (isActive) {
      accumulated += Date.now() - startTime;
    }
    if (accumulated > 3000) {
      savePageTime(page, accumulated);
    }
    // Always send page_time to GA (in seconds)
    gaEvent('page_time', {
      page_name: page,
      duration_sec: Math.round(accumulated / 1000),
    });
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('blur', handleBlur);
    window.removeEventListener('focus', handleFocus);
  };
}

/** Build and store final evaluation data. Returns the data object. */
export function finalizeEvaluationData(): Record<string, unknown> {
  const sessionId = getSessionId();
  const sessionStart = getStartTime();
  const sessionEnd = Date.now();
  const pageTimes = getPageTimes();

  const data = {
    session_id: sessionId,
    session_start: sessionStart,
    session_end: sessionEnd,
    total_time_ms: sessionEnd - sessionStart,
    case_times: {
      case1: pageTimes.case1 || 0,
      case2: pageTimes.case2 || 0,
      case3: pageTimes.case3 || 0,
      case4: pageTimes.case4 || 0,
    },
    dashboard_time: pageTimes.dashboard || 0,
    video_time: pageTimes.video || pageTimes.case1 || 0,
    cases_viewed: [1, 2, 3, 4].filter(
      (n) => (pageTimes[`case${n}` as TrackedPage] || 0) > 0
    ).length,
  };

  localStorage.setItem(EVALUATION_KEY, JSON.stringify(data));
  return data;
}

/** Build the post-assessment URL with session_id appended */
export function getPostAssessmentUrl(baseUrl: string): string {
  const sessionId = getSessionId();
  const sep = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${sep}entry.1234567890=${encodeURIComponent(sessionId)}`;
}

export function getPageTimeSec(page: TrackedPage): number {
  return Math.round((getPageTimes()[page] || 0) / 1000);
}
