// GA4 structured research tracking with session-linked events.
// GA script is loaded in index.html.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const SESSION_KEY = 'session_id';
const SESSION_START_KEY = 'start_time';

// ── Environment ──────────────────────────────────────────────

export function getEnvironment(): 'preview' | 'production' {
  if (typeof window === 'undefined') return 'production';
  return window.location.hostname.includes('lovable') ||
    window.location.hostname.includes('preview') ||
    window.location.hostname === 'localhost'
    ? 'preview'
    : 'production';
}

// ── Session ──────────────────────────────────────────────────

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  if (!localStorage.getItem(SESSION_START_KEY)) {
    localStorage.setItem(SESSION_START_KEY, Date.now().toString());
  }
  return id;
}

export function getStartTime(): number {
  return parseInt(localStorage.getItem(SESSION_START_KEY) || Date.now().toString(), 10);
}

export function bindGaUser(): void {
  const id = getSessionId();
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('set', { user_id: id });
    window.gtag('set', 'user_properties', { environment: getEnvironment() });
  }
}

// ── Low-level event helper ───────────────────────────────────

export function gaEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, {
    session_id: getSessionId(),
    environment: getEnvironment(),
    ...params,
  });
}

// ── Standardized page names ──────────────────────────────────

export type StandardPage =
  | 'home'
  | 'pre_assessment'
  | 'about'
  | 'pre_video'
  | 'video'
  | 'transition'
  | 'choice'
  | 'dashboard'
  | 'post_assessment'
  | 'learned'
  | 'bibliography';

// ── Structured research events ───────────────────────────────

/** Fire on every page mount */
export function trackPageEnter(page: StandardPage): void {
  gaEvent('page_enter', { page_name: page });
}

/** Fire on page unmount / beforeunload with time spent */
export function trackPageExit(page: StandardPage, timeSpentSec: number): void {
  gaEvent('page_exit', { page_name: page, time_spent: timeSpentSec });
}

/** Fire when video playback starts */
export function trackVideoStart(): void {
  gaEvent('video_start');
}

/** Fire when user watches ≥90% of the video */
export function trackVideoComplete(): void {
  gaEvent('video_complete');
}

/** Fire when dashboard page opens */
export function trackDashboardOpen(): void {
  gaEvent('dashboard_open');
}

/** Fire when pre or post assessment is submitted */
export function trackAssessmentSubmit(type: 'pre' | 'post', gender?: string): void {
  const params: Record<string, unknown> = { type };
  if (gender) params.gender = gender;
  gaEvent('assessment_submit', params);
}

// ── Backwards-compatible (kept for timeTracking.ts) ──────────

/** @deprecated Use trackPageEnter */
export function trackPageVisit(page: string): void {
  trackPageEnter(page as StandardPage);
}

/** @deprecated Use trackDashboardOpen */
export function trackDashboardVisit(): void {
  trackDashboardOpen();
}
