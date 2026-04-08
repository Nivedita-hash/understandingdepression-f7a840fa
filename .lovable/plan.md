## Plan: Full In-Website Sequential Flow Redesign

### New Flow
`Home → Pre-Assessment → Case 1 → Transition → Case 2 → Transition → Case 3 → Transition → Case 4 → Post-Assessment → What We Learned → References`

### Changes

**1. New: Pre-Assessment Page (`/pre-assessment`)**
- Likert-scale questions (1-5) about depression knowledge/attitudes
- Next button disabled until all questions answered
- Stores responses in localStorage tied to session_id
- Navigates directly to `/case/1`

**2. Redesigned Case Pages (`/case/1-4`)**
- Case 1 (has YouTube video): Use YouTube IFrame API to track progress; Next button fades in at last 10 seconds
- Cases 2-4 (no videos, text/image content): Use a minimum engagement timer (~45s) before Next appears
- No visible navigation initially; no back button
- Disable forward seeking on video (YouTube API)

**3. New: Case Transition Pages (`/case-transition/:fromCase`)**
- Short reflective message (varies per case)
- Continue button appears after 3-4 second delay
- Navigates to next case (or post-assessment after case 4)

**4. New: Post-Assessment Page (`/post-assessment`)**
- Embedded Likert + multiple choice questions
- All required; Submit enabled only when complete
- Stores responses in localStorage
- Redirects to `/learned`

**5. Updated Navigation**
- Remove About Depression, Case Selection, Comparative Dashboard, old Transition pages from flow
- Strict linear flow only — no back buttons, no skipping
- Home page button: "Begin the Experience" → `/pre-assessment`

**6. Updated Routes (App.tsx)**
- Add `/pre-assessment`, `/case-transition/:fromCase`, update `/post-assessment`
- Remove `/about-depression`, `/cases`, `/compare`, `/transition` from main flow (keep pages but remove from nav)

**7. Data Handling**
- All assessment data stored in localStorage under session_id
- Pre and post responses saved as JSON

### Files to Create
- `src/pages/PreAssessment.tsx`
- `src/pages/CaseTransition.tsx`
- `src/data/assessmentQuestions.ts`

### Files to Modify
- `src/App.tsx` (routes)
- `src/pages/Index.tsx` (simplify CTA)
- `src/pages/CaseDetail.tsx` (video gating, no nav)
- `src/pages/PostAssessmentTransition.tsx` → convert to embedded post-assessment
- `src/components/Navigation.tsx` (strict flow)

### Note
- Only Case 1 has a YouTube video. For Cases 2-4 (text/image only), a minimum reading timer will gate the Next button.
- YouTube seeking prevention uses the IFrame Player API's `onStateChange` event to detect and revert seek-ahead attempts.
