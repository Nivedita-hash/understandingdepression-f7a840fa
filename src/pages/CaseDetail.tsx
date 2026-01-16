import { useParams, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';
import Timeline from '@/components/Timeline';
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
      <PageWrapper backPath="/cases">
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
    <PageWrapper 
      backPath={prevCase}
      backLabel={prevLabel}
      nextPath={nextCase}
      nextLabel={nextLabel}
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

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 rounded-2xl overflow-hidden shadow-lg"
        >
          <img 
            src={caseStudy.image} 
            alt={caseStudy.imageAlt}
            className="w-full h-64 md:h-80 object-cover"
          />
        </motion.div>

        {/* Story Sections */}
        <div className="space-y-8 mb-16">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="section-card"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${section.color} flex items-center justify-center`}>
                  <section.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium mb-3">{section.title}</h3>
                  <p className="narrative-text text-muted-foreground">{section.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-card"
        >
          <h2 className="heading-section text-center mb-8">Journey Timeline</h2>
          <p className="text-center text-muted-foreground mb-8">
            Drag the slider or click events to explore the journey
          </p>
          <Timeline events={caseStudy.timeline} />
        </motion.section>

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
