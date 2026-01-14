import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import Timeline from '@/components/Timeline';
import ScrollIndicator from '@/components/ScrollIndicator';
import { caseStudies } from '@/data/caseStudies';
import { User, AlertTriangle, Stethoscope, TrendingUp, CheckCircle } from 'lucide-react';

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const caseId = parseInt(id || '1');
  const caseStudy = caseStudies.find(c => c.id === caseId);

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
      <div className="page-container max-w-4xl mx-auto">
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
