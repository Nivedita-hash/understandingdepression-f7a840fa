// Submit all evaluation data to Google Sheets via Apps Script
const GOOGLE_SCRIPT_URL = 'REPLACE_WITH_YOUR_APPS_SCRIPT_URL';

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
  if (GOOGLE_SCRIPT_URL === 'REPLACE_WITH_YOUR_APPS_SCRIPT_URL') {
    console.warn('[Evaluation] Google Apps Script URL not configured. Data logged to console:', data);
    return false;
  }

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return true;
  } catch (err) {
    console.error('[Evaluation] Failed to submit:', err);
    return false;
  }
}
