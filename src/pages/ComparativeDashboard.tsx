import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Filter, RotateCcw, ExternalLink, ChevronRight } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import TableauEmbed from '@/components/TableauEmbed';
import { usePageTimer } from '@/hooks/usePageTimer';
import { gaEvent, trackDashboardVisit, trackPageVisit } from '@/lib/analytics';
import {
  caseStories,
  filterGroups,
  buildInsight,
  type CaseStory,
  type FilterGroupKey,
} from '@/data/caseStories';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type SelectedFilters = Record<FilterGroupKey, string[]>;

const emptyFilters = (): SelectedFilters =>
  filterGroups.reduce((acc, g) => {
    acc[g.key] = [];
    return acc;
  }, {} as SelectedFilters);

const learningCallouts = [
  'Depression is not always just sadness.',
  'Two people can both have depression but experience it very differently.',
  'Symptoms, timing, context, and treatment response can vary.',
  'Medical and hormonal factors can shape presentation.',
];

const ComparativeDashboard = () => {
  usePageTimer('dashboard');
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SelectedFilters>(emptyFilters);
  const [activeCase, setActiveCase] = useState<CaseStory | null>(null);

  useEffect(() => {
    trackPageVisit('dashboard');
    trackDashboardVisit();
    localStorage.setItem('visited_dashboard', 'true');
  }, []);

  const toggleFilter = (group: FilterGroupKey, value: string) => {
    setFilters((prev) => {
      const cur = prev[group];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      return { ...prev, [group]: next };
    });
    localStorage.setItem('dashboard_interacted', 'true');
    gaEvent('filter_select', { filter_group: group, filter_value: value });
  };

  const resetFilters = () => setFilters(emptyFilters());

  const matches = (story: CaseStory): boolean => {
    return filterGroups.every((g) => {
      const selected = filters[g.key];
      if (selected.length === 0) return true;
      const storyVals = story[g.key];
      const arr = Array.isArray(storyVals) ? storyVals : [storyVals as string];
      return selected.some((s) => arr.includes(s));
    });
  };

  const visibleCases = useMemo(() => caseStories.filter(matches), [filters]);
  const insight = useMemo(() => buildInsight(visibleCases.map((c) => c.id)), [visibleCases]);
  const activeFilterCount = Object.values(filters).reduce((sum, v) => sum + v.length, 0);

  const handleCaseOpen = (story: CaseStory) => {
    setActiveCase(story);
    gaEvent('case_open', { case_id: story.id });
    try {
      const k = 'dashboard_case_opens';
      const cur = JSON.parse(localStorage.getItem(k) || '{}');
      cur[story.id] = (cur[story.id] || 0) + 1;
      localStorage.setItem(k, JSON.stringify(cur));
      localStorage.setItem('dashboard_interacted', 'true');
    } catch {}
  };

  const handleContinue = () => navigate('/post-assessment');

  return (
    <PageWrapper>
      <div className="page-container max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
            Explore how symptoms, timing, context, and what helps can differ across depression journeys.
          </p>
          <h1 className="heading-display mb-4">Comparative Dashboard</h1>
          <p className="narrative-text mx-auto text-muted-foreground max-w-2xl">
            Three real case stories, side by side. Use the filters to find patterns — or differences — across journeys.
          </p>
        </motion.header>

        {/* What this shows */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="section-card mb-8"
          aria-label="What this shows"
        >
          <h2 className="font-serif text-lg font-medium mb-3">What this shows</h2>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-foreground/80">
            {learningCallouts.map((c) => (
              <li key={c} className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Tableau dashboard embed */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mb-8"
          aria-label="Tableau dashboard"
        >
          <div className="text-center mb-5">
            <h2 className="font-serif text-2xl md:text-3xl font-medium mb-2">
              Understanding Depression Through Real Stories
            </h2>
            <p className="narrative-text mx-auto text-muted-foreground max-w-2xl">
              Explore how symptoms, treatment response, and recovery patterns differ across real depression case stories.
            </p>
          </div>
          <TableauEmbed
            src="https://public.tableau.com/views/NarrativeProj_v1_2/Dashboard1?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"
            height="900px"
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="section-card mb-8"
          aria-label="Filters"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <h2 className="font-medium">
                Filter cases
                {activeFilterCount > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({activeFilterCount} selected)
                  </span>
                )}
              </h2>
            </div>
            <button
              onClick={resetFilters}
              disabled={activeFilterCount === 0}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset filters
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filterGroups.map((group) => (
              <div key={group.key}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.values.map((value) => {
                    const active = filters[group.key].includes(value);
                    return (
                      <button
                        key={value}
                        onClick={() => toggleFilter(group.key, value)}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs border transition-all',
                          active
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-background/60 text-foreground/70 border-border hover:border-primary/50 hover:text-foreground'
                        )}
                        aria-pressed={active}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Insight panel */}
        <motion.section
          key={insight}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 p-5 rounded-2xl bg-sage-light/40 border border-sage/30"
          aria-live="polite"
          aria-label="Insight"
        >
          <p className="text-sm font-medium text-sage mb-1">
            Insight · {visibleCases.length} of {caseStories.length} cases visible
          </p>
          <p className="text-foreground/85 leading-relaxed">{insight}</p>
        </motion.section>

        {/* Comparison cards */}
        {visibleCases.length === 0 ? (
          <div className="section-card text-center py-12">
            <p className="text-muted-foreground mb-4">No cases match the current filters.</p>
            <button onClick={resetFilters} className="btn-primary inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Reset filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            <AnimatePresence mode="popLayout">
              {visibleCases.map((story, i) => (
                <motion.article
                  layout
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="section-card !p-5 flex flex-col cursor-pointer hover:shadow-md transition-shadow group"
                  onClick={() => handleCaseOpen(story)}
                >
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {story.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {story.age ? `${story.age}` : 'age n/a'} · {story.gender}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-medium leading-snug mb-3 line-clamp-3 group-hover:text-primary transition-colors">
                    {story.title}
                  </h3>

                  <div className="space-y-3 text-xs text-foreground/80 flex-1">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        Main presentation
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {story.primaryPattern.map((p) => (
                          <Badge key={p} variant="secondary" className="text-[10px] font-normal">
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {story.comorbidities.length > 0 && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                          Comorbidities
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {story.comorbidities.map((c) => (
                            <span key={c} className="px-1.5 py-0.5 rounded bg-clay-light text-clay text-[10px]">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        Time pattern
                      </p>
                      <p className="text-foreground/75">{story.timePattern.join(' · ')}</p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        What helped
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {story.whatHelped.map((w) => (
                          <span key={w} className="px-1.5 py-0.5 rounded bg-sage-light text-sage text-[10px]">
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60">
                    <p className="text-xs italic text-foreground/70 line-clamp-2 mb-2">
                      “{story.keyTakeaway}”
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                      Read full case <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Continue */}
        <div className="text-center mt-10 mb-4">
          <button
            onClick={handleContinue}
            className="btn-primary inline-flex items-center gap-2"
          >
            Continue to reflection <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Case detail drawer */}
      <Sheet open={!!activeCase} onOpenChange={(o) => !o && setActiveCase(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          {activeCase && (
            <>
              <SheetHeader className="mb-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {activeCase.label} · {activeCase.age ? `age ${activeCase.age}` : 'age n/a'} · {activeCase.gender}
                </p>
                <SheetTitle className="font-serif text-xl leading-snug">
                  {activeCase.title}
                </SheetTitle>
                <SheetDescription className="text-foreground/80 leading-relaxed">
                  {activeCase.summary}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                <DetailSection title="Journey timeline">
                  <ol className="relative border-l-2 border-primary/30 pl-5 space-y-3">
                    {activeCase.timelineSteps.map((step, i) => (
                      <li key={i} className="relative">
                        <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                        <p className="text-sm text-foreground/85 leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </DetailSection>

                <DetailSection title="Symptoms">
                  <div className="flex flex-wrap gap-1.5">
                    {activeCase.symptomHighlights.map((s) => (
                      <span key={s} className="px-2 py-1 rounded-full bg-muted text-xs text-foreground/75">
                        {s}
                      </span>
                    ))}
                  </div>
                </DetailSection>

                <DetailSection title="Context & contributing factors">
                  <div className="flex flex-wrap gap-1.5">
                    {activeCase.contributingFactors.map((s) => (
                      <span key={s} className="px-2 py-1 rounded-full bg-clay-light text-clay text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </DetailSection>

                <DetailSection title="Treatment history">
                  <div className="flex flex-wrap gap-1.5">
                    {activeCase.treatmentHistory.map((s) => (
                      <span key={s} className="px-2 py-1 rounded-full bg-medical-light text-medical text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </DetailSection>

                <DetailSection title="What eventually helped">
                  <div className="flex flex-wrap gap-1.5">
                    {activeCase.whatHelped.map((s) => (
                      <span key={s} className="px-2 py-1 rounded-full bg-sage-light text-sage text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </DetailSection>

                <DetailSection title="Severity indicators">
                  <ul className="text-sm text-foreground/80 space-y-1 list-disc pl-5">
                    {activeCase.severityIndicators.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </DetailSection>

                <div className="rounded-xl bg-sage-light/40 border border-sage/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sage mb-1">
                    Key takeaway
                  </p>
                  <p className="text-sm text-foreground/85 italic">{activeCase.keyTakeaway}</p>
                </div>

                <a
                  href={activeCase.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Source: {activeCase.sourceLabel} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </PageWrapper>
  );
};

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
      {title}
    </h3>
    {children}
  </section>
);

export default ComparativeDashboard;
