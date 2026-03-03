import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Sparkles, AlertCircle, ChevronRight } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import { caseStudies } from '@/data/caseStudies';

const caseLabels = [
  { ageRange: '32 years old' },
  { ageRange: '45 years old' },
  { ageRange: '38 years old' },
  { ageRange: '24 years old' },
];

const CaseCard = ({ study, index }: { study: typeof caseStudies[0]; index: number }) => {
  const navigate = useNavigate();
  const label = caseLabels[index];

  const handleClick = () => {
    navigate(`/case/${study.id}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)' }}
      onClick={handleClick}
      className="bg-card rounded-2xl p-8 shadow-lg border border-border/50 cursor-pointer transition-colors duration-200 hover:border-primary/50 hover:ring-2 hover:ring-primary/20 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Case {study.id}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          {label.ageRange}
        </span>
      </div>

      <h3 className="font-serif text-2xl font-medium mb-4">{study.title}</h3>

      <p className="text-muted-foreground mb-6 leading-relaxed text-lg flex-1">
        {study.hook}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-3 mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage-light text-sage text-sm font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          {study.outcome}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-medical-light text-medical text-sm font-medium">
          <Clock className="w-3.5 h-3.5" />
          {study.duration}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-clay-light text-clay text-sm font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          {study.trigger}
        </span>
      </div>

      {/* Button */}
      <button
        onClick={(e) => { e.stopPropagation(); handleClick(); }}
        className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        Explore This Journey
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.article>
  );
};

const CaseSelection = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen relative z-10 flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-24 pb-12 px-6"
        >
          <h1 className="heading-display mb-4">Four Real Journeys</h1>
          <p className="narrative-text mx-auto text-muted-foreground max-w-xl">
            These are independent stories, each illustrating a different path through depression.
            Explore any that resonate with you.
          </p>
        </motion.header>

        {/* 2x2 Grid */}
        <div className="flex-1 px-6 pb-16 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <CaseCard key={study.id} study={study} index={index} />
            ))}
          </div>
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-sm text-muted-foreground pb-8 px-6"
        >
          All cases are based on real, peer-reviewed clinical studies. Names and identifying details have been changed.
        </motion.p>
      </div>
    </PageWrapper>
  );
};

export default CaseSelection;
