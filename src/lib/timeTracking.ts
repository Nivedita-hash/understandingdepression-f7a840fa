// Session-based time tracking for evaluation analytics

const SESSION_KEY = 'session_id';
const SESSION_START_KEY = 'session_start';
const PAGE_TIMES_KEY = 'page_times';
const EVALUATION_KEY = 'evaluation_data';

// Tracked page keys
type TrackedPage = 'case1' | 'case2' | 'case3' | 'case4' | 'dashboard';

function generateSessionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'session_';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/** Initialize session on Home page load */
export function initSession(): void {
  if (!localStorage.getItem(SESSION_KEY)) {
    localStorage.setItem(SESSION_KEY, generateSessionId());
  }
  if (!localStorage.getItem(SESSION_START_KEY)) {
    localStorage.setItem(SESSION_START_KEY, Date.now().toString());
  }
  // Initialize page times if not present
  if (!localStorage.getItem(PAGE_TIMES_KEY)) {
    localStorage.setItem(PAGE_TIMES_KEY, JSON.stringify({
      case1: 0, case2: 0, case3: 0, case4: 0, dashboard: 0,
    }));
  }
}

export function getSessionId(): string {
  return localStorage.getItem(SESSION_KEY) || '';
}

/** Get stored page times */
function getPageTimes(): Record<TrackedPage, number> {
  try {
    return JSON.parse(localStorage.getItem(PAGE_TIMES_KEY) || '{}');
  } catch {
    return { case1: 0, case2: 0, case3: 0, case4: 0, dashboard: 0 };
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

  // Cleanup: save time and remove listeners
  return () => {
    if (isActive) {
      accumulated += Date.now() - startTime;
    }
    // Only save if > 3 seconds (ignore accidental visits)
    if (accumulated > 3000) {
      savePageTime(page, accumulated);
    }
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('blur', handleBlur);
    window.removeEventListener('focus', handleFocus);
  };
}

/** Build and store final evaluation data. Returns the data object. */
export function finalizeEvaluationData(): Record<string, unknown> {
  const sessionId = getSessionId();
  const sessionStart = parseInt(localStorage.getItem(SESSION_START_KEY) || '0', 10);
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
