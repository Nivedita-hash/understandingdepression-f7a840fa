// Centralized tracking: single function for all Google Sheets event logging.

import { getEnvironment, getSessionId } from '@/lib/surveyData';

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbynwNc7sovxUKMEx7Wc_WkCWlucqvs_tdqskRIcO97kIfTwSBBQMuoKLZOoddGKSfo/exec';

/**
 * Send a single tracking event to Google Sheets.
 * Skips preview environments and unfocused tabs.
 */
export function sendTracking(data: Record<string, unknown>): void {
  if (getEnvironment() === 'preview') return;
  if (!document.hasFocus()) return;

  const payload = {
    session_id: getSessionId(),
    ...data,
  };

  const body = JSON.stringify(payload);

  // Prefer sendBeacon (works during navigation/unload)
  if (navigator?.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    if (navigator.sendBeacon(SCRIPT_URL, blob)) return;
  }

  // Fallback to fetch
  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body,
  }).catch((err) => console.error('[Tracking] Failed:', err));
}

// ── Convenience helpers ──────────────────────────────────────

let sessionStarted = false;

/** Call once when the user begins the experience. */
export function trackSessionStart(): void {
  if (sessionStarted) return;
  sessionStarted = true;
  sendTracking({ event_type: 'session_start' });
}

/** Call ONLY on deliberate user click to open the dashboard. */
export function trackDashboardClick(): void {
  sendTracking({ event_type: 'dashboard_click' });
}
