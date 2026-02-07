import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import { caseStudies } from '@/data/caseStudies';
import { useNavigate } from 'react-router-dom';
import { Clock, Sparkles, AlertCircle, ChevronLeft, ChevronRight, User, X } from 'lucide-react';
import homepageBackground from '@/assets/homepage-background.jpg';

// Case labels for quick reference
const caseLabels = [
  { ageRange: '32 years old', treatmentType: 'Therapy + Medication', duration: '18 months' },
  { ageRange: '45 years old', treatmentType: 'Grief Counseling', duration: '3 years' },
  { ageRange: '38 years old', treatmentType: 'TMS + Intensive Therapy', duration: '7 years' },
  { ageRange: '24 years old', treatmentType: 'Therapy + Lifestyle', duration: '5 years' },
];

const CaseCard = ({ 
  study,
  index, 
  isActive,
  onClick
}: { 
  study: typeof caseStudies[0]; 
  index: number;
  isActive: boolean;
  onClick: () => void;
}) => {
  const navigate = useNavigate();
  const label = caseLabels[index];

  const handleExplore = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/case/${study.id}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)' }}
        className={`bg-card rounded-2xl p-8 shadow-lg border transition-all duration-300 ${
          isActive ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border/50'
        }`}
      >
        {/* Case header with position indicator */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Case {study.id} of {caseStudies.length}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {label.ageRange}
            </span>
          </div>
        </div>
        
        <h3 className="font-serif text-2xl font-medium mb-4">
          {study.title}
        </h3>
        
        <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
          {study.hook}
        </p>

        {/* Quick info labels */}
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

        {/* Explore button */}
        <button
          onClick={handleExplore}
          className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          Explore This Journey
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.article>
  );
};

// Case Overview Panel
const CaseOverviewPanel = ({ 
  currentIndex, 
  onSelectCase, 
  isOpen, 
  onClose 
}: { 
  currentIndex: number; 
  onSelectCase: (index: number) => void; 
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60"
      />
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-2xl max-h-[85vh] flex flex-col">
          {/* Header with close button */}
          <div className="flex items-center justify-end p-4 pb-0 flex-shrink-0">
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Scrollable body */}
          <div className="overflow-y-auto p-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {caseStudies.map((study, index) => {
                const label = caseLabels[index];
                const isActive = index === currentIndex;
                return (
                  <button
                    key={study.id}
                    onClick={() => {
                      onSelectCase(index);
                      onClose();
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-medium ${
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {study.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{study.title.split(' ').slice(0, 4).join(' ')}...</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {label.ageRange} • {label.treatmentType}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {label.duration}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const CaseSelection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const navigate = useNavigate();

  // Mouse position tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 50, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const bgX = useTransform(smoothX, [0, 1], [-15, 15]);
  const bgY = useTransform(smoothY, [0, 1], [-10, 10]);
  const bgScale = useTransform(smoothY, [0, 1], [1.05, 1.1]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX / innerWidth);
      mouseY.set(clientY / innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : caseStudies.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < caseStudies.length - 1 ? prev + 1 : 0));
  };

  const currentCase = caseStudies[currentIndex];

  return (
    <PageWrapper 
      backPath="/about-depression"
      backLabel="About Depression"
      nextPath="/case/1"
      nextLabel="Start Exploring"
    >
      {/* Animated background image with parallax */}
      <motion.div 
        className="fixed inset-[-20px] pointer-events-none z-0"
        style={{
          backgroundImage: `url(${homepageBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
          x: bgX,
          y: bgY,
          scale: bgScale,
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-t from-background/90 via-background/60 to-background/40 pointer-events-none z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="fixed top-20 right-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none z-0"
      />

      <div className="min-h-screen relative z-10 flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-24 pb-8 px-6"
        >
          <h1 className="heading-display mb-4">Four Real Journeys</h1>
          <p className="narrative-text mx-auto text-muted-foreground max-w-xl">
            These are independent stories, each illustrating a different path through depression. 
            Explore any that resonate with you—comparison and selective exploration are encouraged.
          </p>
        </motion.header>

        {/* Case position indicator + Overview toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm">
            <span className="text-sm text-muted-foreground">Viewing</span>
            <span className="font-medium">Case {currentIndex + 1}</span>
            <span className="text-sm text-muted-foreground">of {caseStudies.length}</span>
          </div>
          <button
            onClick={() => setShowOverview(true)}
            className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm hover:border-primary/50 transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="text-sm">View All Cases</span>
          </button>
        </motion.div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {caseStudies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-primary w-8' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        {/* Main case card area */}
        <div className="flex-1 flex items-start justify-center px-6 pb-12">
          <div className="flex items-center gap-6 w-full max-w-3xl">
            {/* Previous button */}
            <button
              onClick={goToPrevious}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:border-primary/50 hover:bg-muted/50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Case card */}
            <div className="flex-1">
              <CaseCard
                key={currentCase.id}
                study={currentCase}
                index={currentIndex}
                isActive={true}
                onClick={() => {}}
              />
            </div>

            {/* Next button */}
            <button
              onClick={goToNext}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:border-primary/50 hover:bg-muted/50 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer note */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-sm text-muted-foreground pb-8 px-6"
        >
          All cases are based on real, peer-reviewed clinical studies. Names and identifying details have been changed.
        </motion.p>
      </div>

      {/* Overview Panel */}
      <CaseOverviewPanel
        currentIndex={currentIndex}
        onSelectCase={setCurrentIndex}
        isOpen={showOverview}
        onClose={() => setShowOverview(false)}
      />
    </PageWrapper>
  );
};

export default CaseSelection;
