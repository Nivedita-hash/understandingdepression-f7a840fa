// Structured survey data collection for research-grade dataset submission.
// Single global object matching the exact column structure for Google Sheets.

import {
  preAssessmentQuestions,
  postAssessmentQuestions,
  LIKERT_LABELS,
  type AssessmentQuestion,
} from '@/data/assessmentQuestions';

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbynwNc7sovxUKMEx7Wc_WkCWlucqvs_tdqskRIcO97kIfTwSBBQMuoKLZOoddGKSfo/exec';

const SUBMITTED_KEY = 'evaluation_submitted';
const VISITED_PAGES_KEY = 'visited_pages';
const DASHBOARD_VISITED_KEY = 'dashboard_visited';
const VIDEO_COMPLETED_KEY = 'video_completed';
const START_TIME_KEY = 'start_time';

// ── Helpers ──────────────────────────────────────────────────

export function getEnvironment(): 'preview' | 'production' {
  if (typeof window === 'undefined') return 'production';
  const h = window.location.hostname;
  return h.includes('lovable') || h.includes('preview') || h === 'localhost'
    ? 'preview'
    : 'production';
}

function getSessionId(): string {
  let id = localStorage.getItem('session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('session_id', id);
  }
  return id;
}

function likertValue(raw: string | number | undefined): { label: string; value: number | '' } {
  if (raw === undefined || raw === null || raw === '') return { label: '', value: '' };
  const num = typeof raw === 'number' ? raw : parseInt(String(raw), 10);
  return { label: LIKERT_LABELS[num - 1] ?? '', value: num };
}

function yesNoValue(raw: string | undefined): { label: string; value: number | '' } {
  if (!raw) return { label: '', value: '' };
  if (raw === 'Yes') return { label: 'Yes', value: 1 };
  if (raw === 'No') return { label: 'No', value: 0 };
  return { label: raw, value: '' };
}

function loadResponses(key: string): Record<string, string | number> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    return JSON.parse(raw).responses || {};
  } catch {
    return {};
  }
}

function formatReadableTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

// ── Page tracking ────────────────────────────────────────────

export function trackPageVisit(pathname: string): void {
  const existing = localStorage.getItem(VISITED_PAGES_KEY) || '';
  const pages = existing ? existing.split(',') : [];
  if (!pages.includes(pathname)) {
    pages.push(pathname);
    localStorage.setItem(VISITED_PAGES_KEY, pages.join(','));
  }
}

export function markDashboardVisited(): void {
  localStorage.setItem(DASHBOARD_VISITED_KEY, 'true');
}

export function markVideoCompleted(): void {
  localStorage.setItem(VIDEO_COMPLETED_KEY, 'true');
}

export function recordStartTime(): void {
  if (!localStorage.getItem(START_TIME_KEY)) {
    localStorage.setItem(START_TIME_KEY, Date.now().toString());
  }
}

// ── Build final payload ──────────────────────────────────────

export interface SurveyPayload {
  [key: string]: unknown;
}

export function buildSurveyData(): SurveyPayload {
  const sessionId = getSessionId();
  const startTime = parseInt(localStorage.getItem(START_TIME_KEY) || '0', 10);
  const endTime = Date.now();
  const totalSec = startTime ? Math.round((endTime - startTime) / 1000) : 0;

  const preAnswers = loadResponses('pre_assessment_responses');
  const postAnswers = loadResponses('post_assessment_responses');

  // Gender from pre Q10
  const rawGender = (preAnswers['pre_gender'] as string) || '';
  const gender = rawGender.startsWith('Other:')
    ? rawGender.slice(6).trim() || 'Other'
    : rawGender;

  const data: SurveyPayload = {
    session_id: sessionId,
    date: new Date().toISOString(),
    start_time: startTime ? new Date(startTime).toISOString() : '',
    end_time: new Date(endTime).toISOString(),
    total_time_seconds: totalSec,
    total_time_readable: formatReadableTime(totalSec),
    environment: getEnvironment(),
    gender,
  };

  // ── Pre-assessment Q1–Q11 ──
  // Q1: pre_learned_before (multiple-choice, label only)
  data.pre_Q1_label = (preAnswers['pre_learned_before'] as string) || '';
  data.pre_Q1_value = (preAnswers['pre_learned_before'] as string) || '';

  // Q2: pre_supported_someone (Yes/No → 1/0)
  const q2 = yesNoValue(preAnswers['pre_supported_someone'] as string);
  data.pre_Q2_label = q2.label;
  data.pre_Q2_value = q2.value;

  // Q3–Q9: likert questions (indices 2–8 in preAssessmentQuestions)
  const preLikertIds = [
    'pre_change_over_time',       // Q3
    'pre_differs_between_people', // Q4
    'pre_same_for_everyone',      // Q5
    'pre_only_sadness',           // Q6
    'pre_life_context_shapes_depression', // Q7
    'pre_imagine_living_with_depression', // Q8
    'pre_snap_out_if_tried_harder',       // Q9
  ];
  preLikertIds.forEach((id, i) => {
    const qNum = i + 3;
    const { label, value } = likertValue(preAnswers[id]);
    data[`pre_Q${qNum}_label`] = label;
    data[`pre_Q${qNum}_value`] = value;
  });

  // Q10: gender — already stored in `gender` field above, skip dedicated Q
  // Q11: short-answer text
  data.pre_Q11_text = (preAnswers['pre_journey_differences'] as string) || '';

  // ── Post-assessment Q1–Q11 ──
  // Q1: post_used_comparative_dashboard (Yes/No → 1/0)
  const postQ1 = yesNoValue(postAnswers['post_used_comparative_dashboard'] as string);
  data.post_Q1_label = postQ1.label;
  data.post_Q1_value = postQ1.value;

  // Q2–Q8: likert (indices 1–7 in postAssessmentQuestions)
  const postLikertIds = [
    'post_understand_shift_over_time',       // Q2
    'post_understand_differs_between_people', // Q3
    'post_still_same_for_everyone',          // Q4
    'post_still_only_sadness',               // Q5
    'post_understand_life_context',          // Q6
    'post_more_able_to_imagine',             // Q7
    'post_still_snap_out',                   // Q8
  ];
  postLikertIds.forEach((id, i) => {
    const qNum = i + 2;
    const { label, value } = likertValue(postAnswers[id]);
    data[`post_Q${qNum}_label`] = label;
    data[`post_Q${qNum}_value`] = value;
  });

  // Q9: short-answer text
  data.post_Q9_text = (postAnswers['post_two_differences_noticed'] as string) || '';

  // Q10: likert
  const postQ10 = likertValue(postAnswers['post_website_helped_notice_differences']);
  data.post_Q10_label = postQ10.label;
  data.post_Q10_value = postQ10.value;

  // Q11: short-answer (feedback)
  data.post_Q11_text = (postAnswers['post_feedback_suggestions'] as string) || '';

  // ── Behavioral tracking ──
  data.visited_pages = localStorage.getItem(VISITED_PAGES_KEY) || '';
  data.dashboard_visited = localStorage.getItem(DASHBOARD_VISITED_KEY) === 'true';
  data.video_completed = localStorage.getItem(VIDEO_COMPLETED_KEY) === 'true';

  return data;
}

// ── Submit once ──────────────────────────────────────────────

export async function submitSurveyData(data: SurveyPayload): Promise<boolean> {
  const sessionId = data.session_id as string;
  if (localStorage.getItem(SUBMITTED_KEY) === sessionId) {
    console.log('[Survey] Already submitted for session', sessionId);
    return true;
  }

  // Ensure no undefined values
  for (const key of Object.keys(data)) {
    if (data[key] === undefined || data[key] === null) {
      data[key] = '';
    }
  }

  const body = JSON.stringify(data);
  console.log('[Survey] Submitting:', data);

  try {
    // Try sendBeacon first (works on page unload)
    if (navigator?.sendBeacon) {
      const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
      if (navigator.sendBeacon(GOOGLE_SCRIPT_URL, blob)) {
        localStorage.setItem(SUBMITTED_KEY, sessionId);
        return true;
      }
    }

    // Fallback to fetch
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
    });

    localStorage.setItem(SUBMITTED_KEY, sessionId);
    return true;
  } catch (err) {
    console.error('[Survey] Failed to submit:', err);
    return false;
  }
}
