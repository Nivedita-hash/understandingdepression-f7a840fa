export interface LikertQuestion {
  id: string;
  text: string;
  type: 'likert';
  reverseCoded?: boolean;
}

export interface MultipleChoiceQuestion {
  id: string;
  text: string;
  type: 'multiple-choice';
  options: string[];
  allowOther?: boolean;
}

export interface ShortAnswerQuestion {
  id: string;
  text: string;
  type: 'short-answer';
  helpText?: string;
  minLength?: number;
  maxLength?: number;
}

export type AssessmentQuestion = LikertQuestion | MultipleChoiceQuestion | ShortAnswerQuestion;

export const LIKERT_LABELS = [
  'Strongly Disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly Agree',
] as const;

export const preAssessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'pre_learned_before',
    type: 'multiple-choice',
    text: 'Have you learned about depression before?',
    options: [
      'Yes, in a class',
      'Yes, from reading online/books',
      'Yes, from someone I know',
      'No / not much',
    ],
  },
  {
    id: 'pre_supported_someone',
    type: 'multiple-choice',
    text: 'Have you supported someone with depression (or someone who might have had it)?',
    options: ['Yes', 'No', 'Prefer not to say'],
  },
  { id: 'pre_change_over_time', type: 'likert', text: 'Depression can change over time.' },
  { id: 'pre_differs_between_people', type: 'likert', text: 'Two people can experience depression in very different ways.' },
  { id: 'pre_same_for_everyone', type: 'likert', text: 'Depression is mostly the same for everyone.', reverseCoded: true },
  { id: 'pre_only_sadness', type: 'likert', text: 'Depression is only about feeling sad.', reverseCoded: true },
  { id: 'pre_life_context_shapes_depression', type: 'likert', text: 'A person\'s life situation (stress, family, work, health) can affect how depression looks.' },
  { id: 'pre_imagine_living_with_depression', type: 'likert', text: 'I can imagine what it might feel like to live with depression.' },
  { id: 'pre_snap_out_if_tried_harder', type: 'likert', text: 'People with depression could "snap out of it" if they tried harder.', reverseCoded: true },
  {
    id: 'pre_gender',
    type: 'multiple-choice',
    text: 'What is your gender?',
    options: ['Male', 'Female', 'Prefer not to say', 'Other'],
    allowOther: true,
  },
  {
    id: 'pre_journey_differences',
    type: 'short-answer',
    text: 'What differences do you think might exist between two people\'s depression journeys?',
    helpText: 'Examples: triggers, how it changes over time, what support helps, how long it lasts. (minimum 10 characters)',
    minLength: 10,
  },
];

export const postAssessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'post_used_comparative_dashboard',
    type: 'multiple-choice',
    text: 'Did you use the Comparative Dashboard?',
    options: ['Yes', 'No'],
  },
  { id: 'post_understand_shift_over_time', type: 'likert', text: 'Now I understand that depression can shift over time (it can move through phases).' },
  { id: 'post_understand_differs_between_people', type: 'likert', text: 'Now I understand that depression can look different from person to person.' },
  { id: 'post_still_same_for_everyone', type: 'likert', text: 'I still think depression is mostly the same for everyone.', reverseCoded: true },
  { id: 'post_still_only_sadness', type: 'likert', text: 'I still think depression is only about feeling sad.', reverseCoded: true },
  { id: 'post_understand_life_context', type: 'likert', text: 'I understand better how life situations (stress, family, work, health) can shape depression.' },
  { id: 'post_more_able_to_imagine', type: 'likert', text: 'I feel more able to imagine what it\'s like to live with depression.' },
  { id: 'post_still_snap_out', type: 'likert', text: 'I still feel people could "snap out of depression" if they tried harder.', reverseCoded: true },
  {
    id: 'post_two_differences_noticed',
    type: 'short-answer',
    text: 'Name two differences you noticed between the case journeys.',
    helpText: 'Examples: triggers, phase changes, supports, treatment paths, duration. (minimum 10 characters)',
    minLength: 10,
  },
  { id: 'post_website_helped_notice_differences', type: 'likert', text: 'This website helped me notice differences across depression journeys.' },
  {
    id: 'post_feedback_suggestions',
    type: 'short-answer',
    text: 'Any feedback or suggestions for us?',
    helpText: 'Share what worked, what didn\'t, or what could improve (minimum 10, maximum 300 characters).',
    minLength: 10,
    maxLength: 300,
  },
];

export const transitionMessages = [
  { heading: 'Not all journeys follow the same path.', subtext: 'Each experience with depression is shaped by unique circumstances.' },
  { heading: 'Grief can reshape everything.', subtext: 'Sometimes the hardest battles begin with loss.' },
  { heading: 'Resilience takes many forms.', subtext: 'What works for one person may not work for another.' },
  { heading: 'Every story matters.', subtext: 'Now, take a moment to reflect on what you\'ve experienced.' },
];
