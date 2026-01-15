import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import { caseStudies } from '@/data/caseStudies';
import { useNavigate } from 'react-router-dom';
import { Clock, Sparkles, AlertCircle } from 'lucide-react';

const StackingCard = ({ 
  study, 
  index, 
  totalCards,
  scrollYProgress 
}: { 
  study: typeof caseStudies[0]; 
  index: number; 
  totalCards: number;
  scrollYProgress: any;
}) => {
  const navigate = useNavigate();
  
  // Each card has its own scroll range
  const cardStart = index / totalCards;
  const cardEnd = (index + 1) / totalCards;
  
  // Transform values for stacking effect
  const y = useTransform(
    scrollYProgress,
    [cardStart, cardEnd],
    [index === 0 ? 0 : 100, 0]
  );
  
  const scale = useTransform(
    scrollYProgress,
    [cardStart, cardEnd, cardEnd + 0.1],
    [index === 0 ? 1 : 0.95, 1, 0.98]
  );
  
  const opacity = useTransform(
    scrollYProgress,
    [cardStart - 0.05, cardStart, cardEnd],
    [index === 0 ? 1 : 0, 1, 1]
  );

  const handleClick = () => {
    navigate(`/case/${study.id}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <motion.article
      style={{ 
        y, 
        scale, 
        opacity,
        zIndex: index + 1,
      }}
      onClick={handleClick}
      className="sticky top-32 w-full max-w-2xl mx-auto cursor-pointer"
    >
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)' }}
        className="bg-card rounded-2xl p-8 shadow-lg border border-border/50 transition-all duration-300"
        style={{
          boxShadow: `0 ${4 + index * 2}px ${20 + index * 5}px -${5 + index}px rgba(0,0,0,0.1)`,
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Case Study {study.id}
          </span>
          <span className="text-xs font-medium text-primary">
            Click to explore →
          </span>
        </div>
        
        <h3 className="font-serif text-2xl font-medium mb-4 group-hover:text-primary transition-colors">
          {study.title}
        </h3>
        
        <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
          {study.hook}
        </p>

        <div className="flex flex-wrap gap-3">
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
      </motion.div>
    </motion.article>
  );
};

const CaseSelection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <PageWrapper 
      backPath="/"
      backLabel="Home"
      nextPath="/case/1"
      nextLabel="First Case"
    >
      <div ref={containerRef} className="min-h-[400vh]">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-24 pb-12 px-6 sticky top-16 z-0 bg-background"
        >
          <h1 className="heading-display mb-6">Four Real Journeys</h1>
          <p className="narrative-text mx-auto text-muted-foreground">
            Scroll down to discover each story. Click a card to explore in depth.
          </p>
          
          <motion.div 
            className="mt-8 flex justify-center"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex flex-col items-center text-muted-foreground">
              <span className="text-xs mb-2">Scroll to reveal stories</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </div>
          </motion.div>
        </motion.header>

        <div className="px-6 pb-32">
          {caseStudies.map((study, index) => (
            <div 
              key={study.id} 
              className="h-[80vh] flex items-start pt-8"
            >
              <StackingCard
                study={study}
                index={index}
                totalCards={caseStudies.length}
                scrollYProgress={scrollYProgress}
              />
            </div>
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center text-sm text-muted-foreground pb-24 px-6"
        >
          All cases are based on real, peer-reviewed clinical studies. Names and identifying details have been changed.
        </motion.p>
      </div>
    </PageWrapper>
  );
};

export default CaseSelection;
