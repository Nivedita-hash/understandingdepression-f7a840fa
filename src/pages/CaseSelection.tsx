import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import CaseCard from '@/components/CaseCard';
import { caseStudies } from '@/data/caseStudies';

const CaseSelection = () => {
  return (
    <PageWrapper 
      backPath="/"
      backLabel="Home"
      nextPath="/case/1"
      nextLabel="First Case"
    >
      <div className="page-container max-w-5xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="heading-display mb-6">Four Real Journeys</h1>
          <p className="narrative-text mx-auto text-muted-foreground">
            Each of these stories comes from peer-reviewed case studies. 
            Select a journey to explore in depth.
          </p>
        </motion.header>

        <div className="grid md:grid-cols-2 gap-6">
          {caseStudies.map((study, index) => (
            <CaseCard
              key={study.id}
              id={study.id}
              title={study.title}
              hook={study.hook}
              outcome={study.outcome}
              duration={study.duration}
              trigger={study.trigger}
              index={index}
            />
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          All cases are based on real, peer-reviewed clinical studies. Names and identifying details have been changed.
        </motion.p>
      </div>
    </PageWrapper>
  );
};

export default CaseSelection;
