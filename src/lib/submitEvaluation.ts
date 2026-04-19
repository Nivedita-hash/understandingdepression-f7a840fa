// Submit all evaluation data to Google Sheets via Apps Script
import {
  preAssessmentQuestions,
  postAssessmentQuestions,
  LIKERT_LABELS,
  type AssessmentQuestion,
} from '@/data/assessmentQuestions';
import { getEnvironment, getSessionId, getStartTime } from './analytics';

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbynwNc7sovxUKMEx7Wc_WkCWlucqvs_tdqskRIcO97kIfTwSBBQMuoKLZOoddGKSfo/exec';

const SUBMITTED_KEY = 'evaluation_submitted';

export interface FinalEvaluationData {
  timestamp: string;
  environment: 'preview' | 'production';
  session_id: string;
  gender: string;
  total_time: number;
  video_time: number;
  dashboard_time: number;
  visited_dashboard: boolean;
  post_open_text: string;
  // Dynamic Q fields appended via index signature
  [key: string]: unknown;
}

function valueLabel(q: AssessmentQuestion, raw: string | number | undefined): { value: string | number | ''; label: string } {
  if (raw === undefined || raw === null || raw === '') return { value: '', label: '' };
  if (q.type === 'likert') {
    const num = typeof raw === 'number' ? raw : parseInt(String(raw), 10);
    return { value: num, label: LIKERT_LABELS[num - 1] ?? '' };
  }
  // multiple-choice or short-answer: store same string for both
  return { value: raw as string, label: String(raw) };
}

function loadResponses(key: string): Record<string, string | number> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed.responses || {};
  } catch {
    return {};
  }
}

export function buildFinalData(): FinalEvaluationData {
  const sessionId = getSessionId();
  const sessionStart = getStartTime();
  const pageTimes = JSON.parse(localStorage.getItem('page_times') || '{}');

  const preAnswers = loadResponses('pre_assessment_responses');
  const postAnswers = loadResponses('post_assessment_responses');

  // Resolve gender from pre-assessment (handles "Other:custom text")
  const rawGender = (preAnswers['pre_gender'] as string) || '';
  const gender = rawGender.startsWith('Other:') ? rawGender.slice(6).trim() || 'Other' : rawGender;

  const data: FinalEvaluationData = {
    timestamp: new Date().toISOString(),
    environment: getEnvironment(),
    session_id: sessionId,
    gender,
    total_time: Math.round((Date.now() - sessionStart) / 1000),
    video_time: Math.round(((pageTimes.video || pageTimes.case1) || 0) / 1000),
    dashboard_time: Math.round((pageTimes.dashboard || 0) / 1000),
    visited_dashboard: localStorage.getItem('visited_dashboard') === 'true',
    post_open_text: '',
  };

  // Pre Q1..Q11 (one row per session)
  preAssessmentQuestions.forEach((q, i) => {
    const idx = i + 1;
    const { value, label } = valueLabel(q, preAnswers[q.id]);
    data[`pre_Q${idx}_id`] = q.id;
    data[`pre_Q${idx}_text`] = q.text;
    data[`pre_Q${idx}_value`] = value;
    data[`pre_Q${idx}_label`] = label;
  });

  // Post Q1..QN
  let openText = '';
  postAssessmentQuestions.forEach((q, i) => {
    const idx = i + 1;
    const { value, label } = valueLabel(q, postAnswers[q.id]);
    data[`post_Q${idx}_id`] = q.id;
    data[`post_Q${idx}_text`] = q.text;
    data[`post_Q${idx}_value`] = value;
    data[`post_Q${idx}_label`] = label;
    if (q.id === 'post_feedback_suggestions' && typeof postAnswers[q.id] === 'string') {
      openText = postAnswers[q.id] as string;
    }
  });
  data.post_open_text = openText;

  return data;
}

export async function submitFinalData(data: FinalEvaluationData): Promise<boolean> {
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

// --- Backwards-compatible exports (older imports) -----------------------
export const buildEvaluationPayload = buildFinalData;
export const submitToGoogleSheet = submitFinalData;
