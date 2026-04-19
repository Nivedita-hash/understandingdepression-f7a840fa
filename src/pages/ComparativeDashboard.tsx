import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import TableauEmbed from '@/components/TableauEmbed';
import { usePageTimer } from '@/hooks/usePageTimer';
import { trackDashboardVisit, trackPageVisit } from '@/lib/analytics';

const ComparativeDashboard = () => {
  usePageTimer('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    trackPageVisit('dashboard');
    trackDashboardVisit();
    localStorage.setItem('visited_dashboard', 'true');
  }, []);

  const handleContinue = () => navigate('/post-assessment');

  return (
    <PageWrapper>
      <div className="page-container max-w-6xl mx-auto relative z-10">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
          aria-label="Tableau dashboard"
        >
          <div className="text-center mb-6">
            <h1 className="heading-display mb-3">
              Understanding Depression Through Real Stories
            </h1>
            <p className="narrative-text mx-auto text-muted-foreground max-w-2xl">
              Explore how symptoms, treatment response, and recovery patterns differ across real depression case stories.
            </p>
          </div>
          <TableauEmbed name="NarrativeProj_v1_2/Dashboard1" />
        </motion.section>

        <div className="text-center mt-10 mb-4">
          <button
            onClick={handleContinue}
            className="btn-primary inline-flex items-center gap-2"
          >
            Continue to reflection <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ComparativeDashboard;
