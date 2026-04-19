// GA4 + session helpers. GA script is loaded in index.html.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const SESSION_KEY = 'session_id';
const SESSION_START_KEY = 'start_time';

export function getEnvironment(): 'preview' | 'production' {
  if (typeof window === 'undefined') return 'production';
  return window.location.hostname.includes('lovable') ||
    window.location.hostname.includes('preview') ||
    window.location.hostname === 'localhost'
    ? 'preview'
    : 'production';
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = Date.now().toString();
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

export function gaEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, { session_id: getSessionId(), ...params });
}

export function trackPageVisit(page: string): void {
  gaEvent('page_visit', { page });
}

export function trackDashboardVisit(): void {
  gaEvent('dashboard_visit');
}
