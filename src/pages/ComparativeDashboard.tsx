import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import TableauEmbed from '@/components/TableauEmbed';
import { startPageTimer, endPageTimer } from '@/lib/analytics';


const ComparativeDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    startPageTimer('dashboard_page');
    return () => endPageTimer('dashboard_page');
  }, []);

  const handleContinue = () => {
    endPageTimer('dashboard_page');
    navigate('/post-assessment');
  };

  return (
    <PageWrapper>
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 pt-4 relative z-10">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
          aria-label="Tableau dashboard"
        >
          <div className="text-center mb-3">
            <h1 className="heading-display">
              Compare Stories
            </h1>
          </div>
          <TableauEmbed
            name="NarrativeProj_v1_3/Dashboard1"
            staticImage="https://public.tableau.com/static/images/Na/NarrativeProj_v1_3/Dashboard1/1.png"
            staticImageRss="https://public.tableau.com/static/images/Na/NarrativeProj_v1_3/Dashboard1/1_rss.png"
          />
        </motion.section>

        <div className="text-center mt-6 mb-4">
          <button
            onClick={handleContinue}
            className="btn-primary inline-flex items-center gap-2"
          >
            To Post-Assessment <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ComparativeDashboard;
