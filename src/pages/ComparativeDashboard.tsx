import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown, Minus, Activity, Info } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import { usePageTimer } from '@/hooks/usePageTimer';
import {
  dashboardCases,
  phaseOrder,
  viewOptions,
  eegGlossary,
  type PhaseKey,
  type ViewKey,
} from '@/data/dashboardData';
import DashboardCharts from '@/components/DashboardCharts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type CompareMode = 'all' | 'beforeAfter';

const trendIcon = (t: 'up' | 'down' | 'stable' | 'mixed') => {
  switch (t) {
    case 'up':
      return <TrendingUp className="w-5 h-5 text-primary" aria-hidden />;
    case 'down':
      return <TrendingDown className="w-5 h-5 text-destructive" aria-hidden />;
    case 'stable':
      return <Minus className="w-5 h-5 text-muted-foreground" aria-hidden />;
    case 'mixed':
      return <Activity className="w-5 h-5 text-clay" aria-hidden />;
  }
};

/** Wrap glossary terms in a tooltip the first time they appear in the text. */
const withGlossary = (text: string) => {
  const terms = Object.keys(eegGlossary);
  const used = new Set<string>();
  // Build a regex matching any glossary term (case-insensitive, longest first)
  const sorted = [...terms].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'i');

  const parts: (string | { term: string; def: string })[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    const m = remaining.match(pattern);
    if (!m || m.index === undefined) {
      parts.push(remaining);
      break;
    }
    if (m.index > 0) parts.push(remaining.slice(0, m.index));
    const matched = m[0];
    const canonical = terms.find((t) => t.toLowerCase() === matched.toLowerCase()) || matched;
    if (used.has(canonical.toLowerCase())) {
      parts.push(matched);
    } else {
      used.add(canonical.toLowerCase());
      parts.push({ term: matched, def: eegGlossary[canonical] });
    }
    remaining = remaining.slice(m.index + matched.length);
  }

  return (
    <>
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <span key={i}>{p}</span>
        ) : (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <span className="underline decoration-dotted decoration-primary/60 underline-offset-2 cursor-help">
                {p.term}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">{p.def}</TooltipContent>
          </Tooltip>
        )
      )}
    </>
  );
};

const ComparativeDashboard = () => {
  usePageTimer('dashboard');
  const navigate = useNavigate();

  // Single case for now; structure ready for future expansion.
  const activeCase = dashboardCases[0];

  const [phase, setPhase] = useState<PhaseKey>('before');
  const [view, setView] = useState<ViewKey>('experience');
  const [compare, setCompare] = useState<CompareMode>('all');

  const phaseContent = activeCase.phases[phase];

  const beforeAfterPair = useMemo(
    () => ({
      before: activeCase.phases.before,
      after: activeCase.phases.after,
    }),
    [activeCase]
  );

  return (
    <TooltipProvider delayDuration={150}>
      <PageWrapper showNav={false}>
        <div className="page-container max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="heading-display mb-3">Case Dashboard</h1>
            <p className="narrative-text mx-auto text-muted-foreground">
              {activeCase.title}. Explore this journey by phase and perspective.
            </p>
          </motion.header>

          {/* Filters */}
          <section
            aria-label="Dashboard filters"
            className="grid gap-4 md:grid-cols-3 mb-8"
          >
            {/* View filter */}
            <div className="section-card !p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                View
              </p>
              <div className="flex flex-wrap gap-2">
                {viewOptions.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setView(v.key)}
                    aria-pressed={view === v.key}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm transition-colors border',
                      view === v.key
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground/70 border-border hover:bg-muted'
                    )}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Compare filter */}
            <div className="section-card !p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                Compare
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCompare('all')}
                  aria-pressed={compare === 'all'}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm transition-colors border',
                    compare === 'all'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground/70 border-border hover:bg-muted'
                  )}
                >
                  All phases
                </button>
                <button
                  onClick={() => setCompare('beforeAfter')}
                  aria-pressed={compare === 'beforeAfter'}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm transition-colors border',
                    compare === 'beforeAfter'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground/70 border-border hover:bg-muted'
                  )}
                >
                  Before vs After
                </button>
              </div>
            </div>

            {/* Helper hint */}
            <div className="section-card !p-4 flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" aria-hidden />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Click a phase below to update the content. Hover underlined terms for plain-language definitions.
              </p>
            </div>
          </section>

          {/* Phase timeline */}
          <section aria-label="Phase timeline" className="mb-8">
            <ol className="grid grid-cols-4 gap-2">
              {phaseOrder.map((p, i) => {
                const isActive = phase === p.key;
                return (
                  <li key={p.key}>
                    <button
                      onClick={() => setPhase(p.key)}
                      aria-current={isActive ? 'step' : undefined}
                      className={cn(
                        'w-full text-left rounded-xl border p-3 transition-all',
                        isActive
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border bg-background hover:bg-muted'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium">{p.short}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{p.label}</p>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Visual charts */}
          <DashboardCharts activeCase={activeCase} view={view} />

          {/* Main content card */}
          <AnimatePresence mode="wait">
            <motion.section
              key={`${phase}-${view}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              aria-label="Phase detail"
              className="section-card mb-8"
            >
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="font-serif text-xl font-medium">
                  {phaseOrder.find((p) => p.key === phase)?.label}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {viewOptions.find((v) => v.key === view)?.label} view
                </span>
              </div>

              {view === 'experience' && (
                <div className="space-y-4">
                  <p className="text-foreground/85 leading-relaxed">
                    {phaseContent.experience.summary}
                  </p>
                  <blockquote className="border-l-4 border-primary/40 pl-4 italic text-foreground/75">
                    {phaseContent.experience.quote}
                  </blockquote>
                </div>
              )}

              {view === 'clinical' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/80 mb-2">Key symptoms</h3>
                    <ul className="list-disc pl-5 space-y-1 text-foreground/85">
                      {phaseContent.clinical.symptoms.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/80 mb-2">Treatment step</h3>
                    <p className="text-foreground/85">{phaseContent.clinical.treatmentStep}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/80 mb-2">Observed response</h3>
                    <ul className="list-disc pl-5 space-y-1 text-foreground/85">
                      {phaseContent.clinical.response.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {view === 'eeg' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                    {trendIcon(phaseContent.eeg.trend)}
                    <div>
                      <p className="text-sm font-medium">{phaseContent.eeg.trendLabel}</p>
                      <p className="text-xs text-muted-foreground">Brain-activity trend indicator</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/80 mb-1">What it might mean</h3>
                    <p className="text-foreground/85 leading-relaxed">
                      {withGlossary(phaseContent.eeg.meaning)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-clay/30 bg-clay/5">
                    <h3 className="text-sm font-semibold text-clay mb-1">What it does NOT mean</h3>
                    <p className="text-foreground/80 leading-relaxed">
                      {withGlossary(phaseContent.eeg.notMeaning)}
                    </p>
                  </div>
                </div>
              )}
            </motion.section>
          </AnimatePresence>

          {/* Before vs After comparison */}
          {compare === 'beforeAfter' && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              aria-label="Key differences before vs after"
              className="section-card mb-8"
            >
              <h2 className="font-serif text-xl font-medium mb-4">Key differences: Before vs After</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/40 border border-border">
                  <h3 className="text-sm font-semibold mb-1">Symptoms</h3>
                  <p className="text-sm text-foreground/80">{activeCase.keyDifferences.symptoms}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/40 border border-border">
                  <h3 className="text-sm font-semibold mb-1">Daily life</h3>
                  <p className="text-sm text-foreground/80">{activeCase.keyDifferences.dailyLife}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/40 border border-border">
                  <h3 className="text-sm font-semibold mb-1">Treatment / EEG</h3>
                  <p className="text-sm text-foreground/80">
                    {withGlossary(activeCase.keyDifferences.treatmentEeg)}
                  </p>
                </div>
              </div>

              {/* Quick before/after snapshot for the active view */}
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                {(['before', 'after'] as const).map((k) => (
                  <div key={k} className="p-4 rounded-lg border border-border bg-background">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                      {k === 'before' ? 'Before treatment' : 'After / Follow-up'}
                    </p>
                    {view === 'experience' && (
                      <p className="text-sm text-foreground/85">
                        {beforeAfterPair[k].experience.summary}
                      </p>
                    )}
                    {view === 'clinical' && (
                      <ul className="list-disc pl-5 text-sm text-foreground/85 space-y-1">
                        {beforeAfterPair[k].clinical.symptoms.slice(0, 3).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    )}
                    {view === 'eeg' && (
                      <div className="flex items-start gap-2">
                        {trendIcon(beforeAfterPair[k].eeg.trend)}
                        <p className="text-sm text-foreground/85">
                          {withGlossary(beforeAfterPair[k].eeg.meaning)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* What this case shows */}
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-primary/5 border border-primary/15 p-5 mb-10"
            aria-label="What this case shows"
          >
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
              What this case shows
            </h2>
            <ul className="space-y-1.5 text-foreground/85">
              {activeCase.whatThisCaseShows.map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </motion.aside>

          {/* CTA */}
          <div className="text-center pb-12">
            <button
              onClick={() => navigate('/post-assessment')}
              className="nav-button-primary group text-lg px-8 py-3"
            >
              Continue to Assessment
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </PageWrapper>
    </TooltipProvider>
  );
};

export default ComparativeDashboard;
