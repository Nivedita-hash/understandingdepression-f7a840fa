// Submit all evaluation data to Google Sheets via Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNPf0-nZIZ6sqMfWU8frBDIXutvROui08Ycw7Fo0DPK2Wc4c8L2caQFjKxq6JFGEzsQA/exec';

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
  const body = JSON.stringify(data);

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const payload = new Blob([body], { type: 'text/plain;charset=utf-8' });
      if (navigator.sendBeacon(GOOGLE_SCRIPT_URL, payload)) {
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

    return true;
  } catch (err) {
    console.error('[Evaluation] Failed to submit:', err);
    return false;
  }
}
