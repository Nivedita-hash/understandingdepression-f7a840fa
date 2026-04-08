import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import { preAssessmentQuestions, LIKERT_LABELS } from '@/data/assessmentQuestions';
import { ArrowRight } from 'lucide-react';
import { getSessionId } from '@/lib/timeTracking';

const PreAssessment = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Record<string, number>>({});

  const allAnswered = preAssessmentQuestions.every((q) => responses[q.id] !== undefined);

  const handleSelect = (questionId: string, value: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    const data = {
      session_id: getSessionId(),
      timestamp: Date.now(),
      responses,
    };
    localStorage.setItem('pre_assessment_responses', JSON.stringify(data));
    navigate('/case/1');
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
            <h1 className="heading-display text-3xl md:text-4xl mb-3">Before We Begin</h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
              Please share your current thoughts about depression. There are no right or wrong answers.
            </p>
          </div>

          <div className="space-y-6">
            {preAssessmentQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="section-card"
              >
                <p className="font-medium text-foreground mb-4 text-sm md:text-base">
                  {index + 1}. {question.text}
                </p>
                <div className="flex flex-wrap gap-2">
                  {LIKERT_LABELS.map((label, value) => (
                    <button
                      key={value}
                      onClick={() => handleSelect(question.id, value + 1)}
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
            ))}
          </div>

          {/* Submit button */}
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
                  Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!allAnswered && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Please answer all questions to continue.
            </p>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default PreAssessment;
