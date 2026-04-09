// Submit all evaluation data to Google Sheets via Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyO1nDbPFpT0z_2U7ULtpohzAQp_tvaIeI5r3znrSalHlcw-teNWNEfuxMLlebWmgcF/exec';

const SUBMITTED_KEY = 'evaluation_submitted';

export interface EvaluationPayload {
  session_id: string;
  pre_answers: Record<string, string | number>;
  post_answers: Record<string, string | number>;
  case_times: Record<string, number>;
  total_time_ms: number;
  visited_dashboard: boolean;
  dashboard_time_ms: number;
  path: 'direct' | 'dashboard';
}

export function buildEvaluationPayload(): EvaluationPayload {
  const sessionId = localStorage.getItem('session_id') || '';
  const sessionStart = parseInt(localStorage.getItem('session_start') || '0', 10);
  const pageTimes = JSON.parse(localStorage.getItem('page_times') || '{}');

  const preRaw = localStorage.getItem('pre_assessment_responses');
  const postRaw = localStorage.getItem('post_assessment_responses');

  return {
    session_id: sessionId,
    pre_answers: preRaw ? JSON.parse(preRaw).responses || {} : {},
    post_answers: postRaw ? JSON.parse(postRaw).responses || {} : {},
    case_times: {
      video: pageTimes.video || pageTimes.case1 || 0,
    },
    total_time_ms: Date.now() - sessionStart,
    visited_dashboard: localStorage.getItem('visited_dashboard') === 'true',
    dashboard_time_ms: pageTimes.dashboard || 0,
    path: (localStorage.getItem('user_path') as 'direct' | 'dashboard') || 'direct',
  };
}

export async function submitToGoogleSheet(data: EvaluationPayload): Promise<boolean> {
  // Prevent duplicate submissions per session
  const submittedSession = localStorage.getItem(SUBMITTED_KEY);
  if (submittedSession === data.session_id) {
    console.log('[Evaluation] Already submitted for session', data.session_id);
    return true;
  }

  const body = JSON.stringify(data);
  console.log('[Evaluation] Submitting:', data);

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const payload = new Blob([body], { type: 'text/plain;charset=utf-8' });
      if (navigator.sendBeacon(GOOGLE_SCRIPT_URL, payload)) {
        localStorage.setItem(SUBMITTED_KEY, data.session_id);
        return true;
      }
    }

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
    });

    localStorage.setItem(SUBMITTED_KEY, data.session_id);
    return true;
  } catch (err) {
    console.error('[Evaluation] Failed to submit:', err);
    return false;
  }
}
