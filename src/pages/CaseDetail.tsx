import { useParams, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';

import ScrollIndicator from '@/components/ScrollIndicator';
import { caseStudies } from '@/data/caseStudies';
import { User, AlertTriangle, Stethoscope, TrendingUp, CheckCircle } from 'lucide-react';
import homepageBackground from '@/assets/homepage-background.jpg';

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const caseId = parseInt(id || '1');
  const caseStudy = caseStudies.find(c => c.id === caseId);

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

  if (!caseStudy) {
    return (
      <PageWrapper>
        <div className="page-container text-center">
          <h1 className="heading-display">Case not found</h1>
        </div>
      </PageWrapper>
    );
  }

  const prevCase = caseId > 1 ? `/case/${caseId - 1}` : '/cases';
  const nextCase = caseId < 4 ? `/case/${caseId + 1}` : '/transition';
  const prevLabel = caseId > 1 ? `Case ${caseId - 1}` : 'All Cases';
  const nextLabel = caseId < 4 ? `Case ${caseId + 1}` : 'Continue';

  const sections = [
    { icon: User, title: 'Context', content: caseStudy.context, color: 'bg-sage-light text-sage' },
    { icon: AlertTriangle, title: 'Trigger', content: caseStudy.triggerDetail, color: 'bg-clay-light text-clay' },
    { icon: Stethoscope, title: 'Treatment Path', content: caseStudy.treatmentPath, color: 'bg-medical-light text-medical' },
    { icon: TrendingUp, title: 'Changes Over Time', content: caseStudy.changes, color: 'bg-sage-light text-sage' },
    { icon: CheckCircle, title: 'Current Outcome', content: caseStudy.currentOutcome, color: 'bg-primary/20 text-primary' },
  ];

  return (
    <PageWrapper>
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

      <div className="page-container max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Case Study {caseId} of 4
          </span>
          <h1 className="heading-display mb-4">{caseStudy.title}</h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-sage-light text-sage text-sm font-medium">
              {caseStudy.outcome}
            </span>
            <span className="px-3 py-1 rounded-full bg-medical-light text-medical text-sm font-medium">
              {caseStudy.duration}
            </span>
            <span className="px-3 py-1 rounded-full bg-clay-light text-clay text-sm font-medium">
              {caseStudy.trigger}
            </span>
          </div>
        </motion.header>

        {/* Introduction Text (Case 1 only) */}
        {caseId === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-8"
          >
            <p className="narrative-text text-muted-foreground leading-relaxed mb-4">
              This case story is based on a clinical study examining ketamine infusion therapy for treatment-resistant depression. The patient had a long history of severe depressive symptoms and limited response to conventional treatments. Researchers explored whether ketamine could provide rapid symptom relief and measurable neurological changes.
            </p>
            <p className="narrative-text text-muted-foreground leading-relaxed">
              The case demonstrates how clinical assessments, symptom scales, and neurophysiological measurements can be combined to better understand treatment outcomes.
            </p>
          </motion.div>
        )}

        {/* Featured Media */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="rounded-2xl overflow-hidden shadow-lg">
            {caseId === 1 ? (
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/MvhCX1K5wpE?autoplay=1&mute=1&rel=0"
                  title="Ketamine Treatment Case Story"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <img 
                src={caseStudy.image} 
                alt={caseStudy.imageAlt}
                className="w-full h-64 md:h-80 object-cover"
              />
            )}
          </div>
          {caseId === 1 && (
            <p className="text-sm text-muted-foreground text-center mt-3 italic">
              Narrative visualization of a clinical case study illustrating the treatment process and outcomes of ketamine therapy in severe depression.
            </p>
          )}
        </motion.div>


        {/* Source Citation */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-border text-center"
        >
          <p className="text-sm text-muted-foreground">
            This case is adapted from research published in{' '}
            <a 
              href={caseStudy.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {caseStudy.source}
            </a>
          </p>
        </motion.footer>
      </div>
      <ScrollIndicator />
    </PageWrapper>
  );
};

export default CaseDetail;
