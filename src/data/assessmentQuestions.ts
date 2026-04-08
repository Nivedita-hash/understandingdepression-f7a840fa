export interface LikertQuestion {
  id: string;
  text: string;
  type: 'likert';
}

export interface MultipleChoiceQuestion {
  id: string;
  text: string;
  type: 'multiple-choice';
  options: string[];
}

export type AssessmentQuestion = LikertQuestion | MultipleChoiceQuestion;

export const LIKERT_LABELS = [
  'Strongly Disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly Agree',
] as const;

export const preAssessmentQuestions: LikertQuestion[] = [
  { id: 'pre-1', type: 'likert', text: 'I have a good understanding of what depression is.' },
  { id: 'pre-2', type: 'likert', text: 'Depression is a sign of personal weakness.' },
  { id: 'pre-3', type: 'likert', text: 'People with depression can simply "snap out of it" if they try hard enough.' },
  { id: 'pre-4', type: 'likert', text: 'Depression affects people from all walks of life.' },
  { id: 'pre-5', type: 'likert', text: 'I would feel comfortable talking to someone who has depression.' },
  { id: 'pre-6', type: 'likert', text: 'Treatment for depression is usually effective.' },
  { id: 'pre-7', type: 'likert', text: 'I can recognize common symptoms of depression.' },
  { id: 'pre-8', type: 'likert', text: 'Depression is a medical condition, not a choice.' },
];

export const postAssessmentQuestions: AssessmentQuestion[] = [
  { id: 'post-1', type: 'likert', text: 'I now have a better understanding of what depression is.' },
  { id: 'post-2', type: 'likert', text: 'Depression is a sign of personal weakness.' },
  { id: 'post-3', type: 'likert', text: 'People with depression can simply "snap out of it" if they try hard enough.' },
  { id: 'post-4', type: 'likert', text: 'Depression affects people from all walks of life.' },
  { id: 'post-5', type: 'likert', text: 'I would feel comfortable talking to someone who has depression.' },
  { id: 'post-6', type: 'likert', text: 'Treatment for depression is usually effective.' },
  { id: 'post-7', type: 'likert', text: 'I can recognize common symptoms of depression.' },
  { id: 'post-8', type: 'likert', text: 'Depression is a medical condition, not a choice.' },
  { id: 'post-9', type: 'likert', text: 'The case stories helped me understand depression better.' },
  { id: 'post-10', type: 'likert', text: 'I feel more empathy toward people experiencing depression.' },
  {
    id: 'post-mc-1',
    type: 'multiple-choice',
    text: 'Which case story resonated with you the most?',
    options: ['Case 1 – Ketamine Treatment', 'Case 2 – Marcus and Grief', 'Case 3 – Elena\'s Battle', 'Case 4 – James\'s Path'],
  },
  {
    id: 'post-mc-2',
    type: 'multiple-choice',
    text: 'What is the most important thing you learned?',
    options: [
      'Depression manifests differently for everyone',
      'Treatment can take many forms',
      'Recovery is not always linear',
      'Support systems matter greatly',
    ],
  },
];

export const transitionMessages = [
  { heading: 'Not all journeys follow the same path.', subtext: 'Each experience with depression is shaped by unique circumstances.' },
  { heading: 'Grief can reshape everything.', subtext: 'Sometimes the hardest battles begin with loss.' },
  { heading: 'Resilience takes many forms.', subtext: 'What works for one person may not work for another.' },
  { heading: 'Every story matters.', subtext: 'Now, take a moment to reflect on what you\'ve experienced.' },
];
