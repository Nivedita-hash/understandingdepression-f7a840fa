import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import {
  postAssessmentQuestions,
  LIKERT_LABELS,
  type AssessmentQuestion,
} from '@/data/assessmentQuestions';
import { ArrowRight } from 'lucide-react';
import { getSessionId, finalizeEvaluationData } from '@/lib/timeTracking';
import { buildEvaluationPayload, submitToGoogleSheet } from '@/lib/submitEvaluation';

const PostAssessment = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Record<string, string | number>>({});

  const allAnswered = postAssessmentQuestions.every((q) => responses[q.id] !== undefined);

  const handleLikertSelect = (questionId: string, value: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleMCSelect = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;
    finalizeEvaluationData();
    const data = {
      session_id: getSessionId(),
      timestamp: Date.now(),
      responses,
    };
    localStorage.setItem('post_assessment_responses', JSON.stringify(data));

    // Submit all evaluation data to Google Sheet
    const payload = buildEvaluationPayload();
    await submitToGoogleSheet(payload);

    navigate('/learned');
  };

  const renderQuestion = (question: AssessmentQuestion, index: number) => {
    if (question.type === 'likert') {
      return (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.04 }}
          className="section-card"
        >
          <p className="font-medium text-foreground mb-4 text-sm md:text-base">
            {index + 1}. {question.text}
          </p>
          <div className="flex flex-wrap gap-2">
            {LIKERT_LABELS.map((label, value) => (
              <button
                key={value}
                onClick={() => handleLikertSelect(question.id, value + 1)}
                className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 border ${
                  responses[question.id] === value + 1
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      );
    }

    // Multiple choice
    return (
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.04 }}
        className="section-card"
      >
        <p className="font-medium text-foreground mb-4 text-sm md:text-base">
          {index + 1}. {question.text}
        </p>
        <div className="grid gap-2">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleMCSelect(question.id, option)}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                responses[question.id] === option
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <PageWrapper showNav={false}>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-10">
            <h1 className="heading-display text-3xl md:text-4xl mb-3">One Final Reflection</h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
              You've explored four journeys through depression. Share your thoughts now.
            </p>
          </div>

          <div className="space-y-6">
            {postAssessmentQuestions.map((question, index) => renderQuestion(question, index))}
          </div>

          <AnimatePresence>
            {allAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="mt-10 text-center"
              >
                <button
                  onClick={handleSubmit}
                  className="nav-button-primary group text-lg px-8 py-3"
                >
                  Submit & Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!allAnswered && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Please answer all questions to submit.
            </p>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default PostAssessment;
