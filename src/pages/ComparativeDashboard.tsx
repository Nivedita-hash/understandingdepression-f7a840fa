import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import { caseStudies } from '@/data/caseStudies';
import { ArrowRight } from 'lucide-react';
import { usePageTimer } from '@/hooks/usePageTimer';

const phaseColors: Record<string, string> = {
  onset: 'bg-clay',
  treatment: 'bg-[hsl(var(--medical-blue))]',
  changes: 'bg-primary',
  outcome: 'bg-secondary',
};

const phaseLabels = ['Onset', 'Treatment', 'Changes', 'Outcome'];

const ComparativeDashboard = () => {
  usePageTimer('dashboard');
  const navigate = useNavigate();

  return (
    <PageWrapper showNav={false}>
      <div className="page-container max-w-5xl mx-auto relative z-10">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="heading-display mb-4">Comparing Journeys</h1>
          <p className="narrative-text mx-auto text-muted-foreground">
            Each journey follows the same phases, but the duration and nature of each phase varies significantly.
          </p>
        </motion.header>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          {phaseLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-3 h-3 rounded-full ${Object.values(phaseColors)[i]}`} />
              {label}
            </div>
          ))}
        </motion.div>

        {/* Case Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="section-card"
            >
              <h3 className="font-serif text-lg font-medium mb-2 line-clamp-1">{study.title}</h3>

              <div className="flex flex-wrap gap-2 mb-5">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {study.outcome}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--medical-blue))]/10 text-[hsl(var(--medical-blue))] text-xs font-medium">
                  {study.duration}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-clay/10 text-clay text-xs font-medium">
                  {study.trigger}
                </span>
              </div>

              {/* Mini Timeline */}
              <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-3">
                {study.timeline.map((event, i) => (
                  <div
                    key={event.id}
                    className={`absolute h-full ${phaseColors[event.phase] || 'bg-muted-foreground'}`}
                    style={{
                      left: `${(i / study.timeline.length) * 100}%`,
                      width: `${100 / study.timeline.length}%`,
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                {phaseLabels.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>

              {/* Key events summary */}
              <div className="mt-4 space-y-1">
                {study.timeline.slice(0, 3).map((event) => (
                  <p key={event.id} className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground/70">{event.title}:</span>{' '}
                    {event.description.length > 80
                      ? event.description.substring(0, 80) + '…'
                      : event.description}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insight */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10"
        >
          <p className="text-center text-foreground/80">
            <strong className="text-primary">Notice:</strong> There is no single "correct" path through depression.
            Each person's timeline, treatment, and outcome look different.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 text-center pb-12"
        >
          <button
            onClick={() => navigate('/post-assessment')}
            className="nav-button-primary group text-lg px-8 py-3"
          >
            Continue to Assessment
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default ComparativeDashboard;
