import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import ScrollIndicator from '@/components/ScrollIndicator';
import { CloudRain, Eye, Stethoscope, Sunrise, ChevronDown } from 'lucide-react';
import { useRef, useState, useCallback, useEffect } from 'react';
import homepageBackground from '@/assets/homepage-background.jpg';
interface PhasePoint {
  title: string;
  explanation: string;
}

interface JourneyPhase {
  icon: React.ElementType;
  title: string;
  summary: string;
  color: string;
  bgColor: string;
  whyItMatters: string;
  dataRepresented: string;
  points: PhasePoint[];
}

const journeyPhases: JourneyPhase[] = [
  {
    icon: CloudRain,
    title: "Onset",
    summary: "Early changes in mood and behavior begin to appear, often triggered by life events or gradual shifts.",
    color: "text-clay",
    bgColor: "bg-clay-light",
    whyItMatters: "Recognizing early signs can lead to earlier intervention and better outcomes. Many people don't realize they're experiencing depression until symptoms worsen.",
    dataRepresented: "Initial symptom patterns, triggering events, early behavioral changes, and self-reported mood shifts.",
    points: [
      {
        title: "Emotional symptoms",
        explanation: "Persistent feelings of sadness, emptiness, or hopelessness that last most of the day, nearly every day. These feelings differ from normal sadness because they don't lift even when circumstances improve."
      },
      {
        title: "Behavioral changes",
        explanation: "Withdrawing from friends, losing interest in hobbies, or avoiding activities that once brought joy. This isn't laziness—it's a symptom of the brain's altered reward system."
      },
      {
        title: "Physical signals",
        explanation: "Changes in sleep (too much or too little), appetite shifts, unexplained fatigue, or difficulty concentrating. The body often shows signs before we consciously recognize the problem."
      }
    ]
  },
  {
    icon: Eye,
    title: "Recognition",
    summary: "The moment when a person or those around them realize something has changed and help may be needed.",
    color: "text-medical",
    bgColor: "bg-medical-light",
    whyItMatters: "Recognition is often the hardest step. Many people minimize symptoms or attribute them to other causes. External observations from loved ones frequently prompt this realization.",
    dataRepresented: "Duration of symptoms, impact on daily functioning, observations from others, and moments of self-awareness.",
    points: [
      {
        title: "Duration awareness",
        explanation: "Realizing symptoms have persisted for weeks rather than days. Depression is typically diagnosed when symptoms last at least two weeks and represent a change from previous functioning."
      },
      {
        title: "External feedback",
        explanation: "Friends, family, or colleagues noticing changes—'You seem different lately' or 'I'm worried about you.' These observations often provide the push toward seeking help."
      },
      {
        title: "Functional impact",
        explanation: "Work performance declining, relationships straining, or basic self-care becoming difficult. When depression starts affecting daily life, recognition often follows."
      }
    ]
  },
  {
    icon: Stethoscope,
    title: "Treatment",
    summary: "Exploring and finding approaches that help—a process that often involves trial, adjustment, and patience.",
    color: "text-sage",
    bgColor: "bg-sage-light",
    whyItMatters: "Treatment isn't one-size-fits-all. What works varies greatly between individuals. Finding the right approach often requires trying multiple options and giving each adequate time.",
    dataRepresented: "Treatment types tried, response patterns, medication adjustments, therapy modalities, and timeline of changes.",
    points: [
      {
        title: "Talk therapy",
        explanation: "Various forms of psychotherapy (like CBT or interpersonal therapy) help identify thought patterns and develop coping strategies. Therapy provides tools that last beyond the treatment period."
      },
      {
        title: "Medication",
        explanation: "Antidepressants can help correct chemical imbalances. Finding the right medication and dosage often takes time—typically 4-6 weeks to see full effects, and adjustments may be needed."
      },
      {
        title: "Lifestyle and support",
        explanation: "Exercise, sleep hygiene, nutrition, and social support complement formal treatment. Support groups provide connection with others who understand the experience firsthand."
      }
    ]
  },
  {
    icon: Sunrise,
    title: "Living With",
    summary: "Finding a sustainable path forward—whether that means full recovery, ongoing management, or learning to thrive alongside the condition.",
    color: "text-primary",
    bgColor: "bg-primary/20",
    whyItMatters: "Recovery looks different for everyone. Some people fully recover, others manage ongoing symptoms, and many develop resilience that serves them throughout life. All of these are valid outcomes.",
    dataRepresented: "Long-term outcomes, relapse patterns, maintenance strategies, quality of life measures, and personal growth indicators.",
    points: [
      {
        title: "Personal strategies",
        explanation: "Developing individualized coping tools—routines, stress management, early warning signs to watch for. These become second nature over time and help maintain stability."
      },
      {
        title: "Support systems",
        explanation: "Building and maintaining relationships that provide emotional support. This includes professional support (ongoing therapy or check-ins) and personal connections who understand."
      },
      {
        title: "Redefining wellness",
        explanation: "Embracing a new understanding of what 'feeling good' means. Many people find that their experience with depression leads to greater self-awareness and empathy."
      }
    ]
  }
];

interface StackingPhaseCardProps {
  phase: JourneyPhase;
  index: number;
  totalCards: number;
  scrollYProgress: any;
  isExpanded: boolean;
  onToggle: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
}

const StackingPhaseCard = ({ 
  phase, 
  index, 
  totalCards, 
  scrollYProgress,
  isExpanded,
  onToggle,
  cardRef
}: StackingPhaseCardProps) => {
  const cardStart = index / totalCards;
  const cardEnd = (index + 1) / totalCards;
  
  const y = useTransform(
    scrollYProgress,
    [cardStart, cardEnd],
    [100, 0]
  );
  
  const scale = useTransform(
    scrollYProgress,
    [cardStart, cardEnd, Math.min(cardEnd + 0.1, 1)],
    [0.95, 1, 0.98]
  );
  
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(cardStart - 0.05, 0), cardStart, cardEnd],
    [0, 1, 1]
  );

  const IconComponent = phase.icon;

  return (
    <motion.div
      ref={cardRef}
      style={{ y, scale, opacity, zIndex: index + 1 }}
      className="sticky top-32 mb-8"
    >
      <motion.div
        layout
        onClick={onToggle}
        className={`section-card cursor-pointer transition-all duration-300 ${
          isExpanded ? 'ring-2 ring-primary/30' : 'hover:shadow-lg'
        }`}
      >
        <div className="flex items-center gap-6">
          <div className={`flex-shrink-0 w-16 h-16 rounded-full ${phase.bgColor} flex items-center justify-center`}>
            <IconComponent className={`w-7 h-7 ${phase.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="heading-section mb-1">{phase.title}</h3>
            <p className="text-muted-foreground">{phase.summary}</p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <ChevronDown className={`w-6 h-6 ${phase.color}`} />
          </motion.div>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-6 border-t border-border space-y-6">
                {/* What happens in this phase */}
                <div>
                  <h4 className={`font-medium mb-3 ${phase.color} text-sm uppercase tracking-wide`}>What Happens</h4>
                  <ul className="space-y-4">
                    {phase.points.map((point, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="space-y-1"
                      >
                        <div className="flex items-start gap-3">
                          <span className={`w-2 h-2 rounded-full ${phase.bgColor} mt-1.5 flex-shrink-0`} />
                          <div>
                            <span className="font-medium text-foreground">{point.title}</span>
                            <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{point.explanation}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Why this phase matters */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`p-4 rounded-lg ${phase.bgColor}`}
                >
                  <h4 className={`font-medium mb-2 ${phase.color} text-sm uppercase tracking-wide`}>Why This Matters</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">{phase.whyItMatters}</p>
                </motion.div>

                {/* What data is represented */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xs text-muted-foreground border-t border-border pt-4"
                >
                  <span className="font-medium">Data represented: </span>
                  {phase.dataRepresented}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const AboutDepression = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Mouse position tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for natural movement
  const springConfig = { damping: 50, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  // Transform mouse position to subtle parallax offset
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
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scrollToCard = useCallback((index: number) => {
    const cardRef = cardRefs.current[index];
    if (cardRef) {
      cardRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        setExpandedIndex(index);
      }, 500);
    }
  }, []);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <PageWrapper 
      backPath="/"
      backLabel="Home"
      nextPath="/cases"
      nextLabel="Case Stories"
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
      
      {/* Decorative circles */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="fixed top-20 right-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none z-0"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="fixed bottom-20 left-20 w-80 h-80 rounded-full bg-medical/20 blur-3xl pointer-events-none z-0"
      />

      <div className="page-container max-w-4xl mx-auto relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="heading-display mb-6">Understanding Depression</h1>
          <p className="narrative-text mx-auto text-muted-foreground">
            Before we explore individual journeys, let's understand what depression 
            looks like as a process that unfolds over time.
          </p>
        </motion.header>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-4 mb-8"
        >
          {journeyPhases.map((phase, index) => {
            const IconComponent = phase.icon;
            return (
              <button
                key={phase.title}
                onClick={() => scrollToCard(index)}
                className={`w-12 h-12 rounded-full ${phase.bgColor} flex items-center justify-center transition-all hover:scale-110 hover:shadow-md`}
              >
                <IconComponent className={`w-5 h-5 ${phase.color}`} />
              </button>
            );
          })}
        </motion.div>

        {/* Journey Infographic - Stacking Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="heading-section text-center mb-4">Depression as a Journey</h2>
          <p className="text-center text-muted-foreground mb-8">
            Scroll to reveal each phase • Click to explore details
          </p>
          
          <div ref={containerRef} className="min-h-[250vh] relative">
            <div className="sticky top-24 pt-8">
              {journeyPhases.map((phase, index) => (
                <StackingPhaseCard
                  key={phase.title}
                  phase={phase}
                  index={index}
                  totalCards={journeyPhases.length}
                  scrollYProgress={scrollYProgress}
                  isExpanded={expandedIndex === index}
                  onToggle={() => handleToggle(index)}
                  cardRef={(el: HTMLDivElement | null) => { cardRefs.current[index] = el; }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16 py-8 border-t border-border"
        >
          <p className="text-muted-foreground italic">
            "Every person's experience with depression is unique. 
            The following stories illustrate the diversity of these journeys."
          </p>
        </motion.div>
      </div>
      <ScrollIndicator />
    </PageWrapper>
  );
};

export default AboutDepression;
